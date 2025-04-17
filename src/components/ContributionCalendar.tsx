// src/components/ContributionCalendar.tsx
"use client";

import { useMemo, useState } from "react";
import type { SmokingEvent } from "@prisma/client";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  differenceInCalendarDays,
  isSameMonth,
  format,
} from "date-fns";

const COLOR_SCALE = [
  "#f5f5f5",   // 0
  "#d1fae5",   // 1
  "#86efac",   // 2
  "#4ade80",   // 3
  "#16a34a",   // 4+
];
const WEEK_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const;

/**
 * events: current user's events for calendar
 * userMap: optional map from "yyyy-MM-dd" to array of user names who smoked that day
 */
export default function ContributionCalendar({
  events,
  userMap = {},
}: {
  events: SmokingEvent[];
  userMap?: Record<string, string[]>;
}) {
  const [selected, setSelected] = useState<{
    week: number;
    dow: number;
    count: number;
    date: Date;
  } | null>(null);

  const { grid, weeks, viewStart } = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const viewStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const viewEnd   = endOfWeek(monthEnd,   { weekStartsOn: 0 });

    const totalDays = differenceInCalendarDays(viewEnd, viewStart) + 1;
    const weekCount = Math.ceil(totalDays / 7);

    // initialize weekCount × 7 grid
    const grid: (number | null)[][] = Array.from({ length: weekCount }, () =>
      Array(7).fill(null)
    );

    // count events by date
    const countByDate = events.reduce<Record<string, number>>((acc, e) => {
      const key = format(e.smokedAt, "yyyy-MM-dd");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // fill grid cells
    for (let i = 0; i < weekCount * 7; i++) {
      const date = addDays(viewStart, i);
      const week = Math.floor(i / 7);
      const dow  = date.getDay();

      if (isSameMonth(date, monthStart)) {
        const key = format(date, "yyyy-MM-dd");
        const count = Math.min(countByDate[key] || 0, COLOR_SCALE.length - 1);
        grid[week][dow] = count;
      }
    }

    return { grid, weeks: weekCount, viewStart };
  }, [events]);

  // build leaderboard for selected day
  const selectedDateKey = selected ? format(selected.date, "yyyy-MM-dd") : "";
  const leaderboard = useMemo(() => {
    return userMap?.[selectedDateKey] ?? [];
  }, [selectedDateKey, userMap]);

  return (
    <div className="overflow-x-auto">
      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-gray-600 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(7, minmax(0, 1fr))`,     
          gridTemplateRows:   `repeat(${weeks}, minmax(0, 1fr))`,
          width: "100%",
        }}
      >
        {grid.flatMap((row, week) =>
          row.map((val, dow) => {
            const date = addDays(viewStart, week * 7 + dow);
            const hasData = val !== null;
            const count   = val ?? 0;
            const bg      = hasData ? COLOR_SCALE[count] : "#e5e7eb";

            const isSelected =
              selected?.week === week && selected?.dow === dow;

            return (
              <div
                key={`${week}-${dow}`}
                className="relative aspect-square rounded-sm cursor-pointer"
                style={{ backgroundColor: bg }}
                onClick={() => {
                  if (hasData) setSelected({ week, dow, count, date });
                }}
              >
                {/* Tooltip */}
                {isSelected && (
                  <div className="absolute z-10 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white">
                    {count} {count === 1 ? "cigarette" : "cigarettes"} on {format(date, "MMM d")}
                  </div>
                )}
              </div>
            );
          })
        )}

      </div>

      {/* Leaderboard for selected day */}
      {selected && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">
            Who smoked on {format(selected.date, "MMM d, yyyy")}?
          </h4>
          {leaderboard.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {leaderboard.map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No one logged a smoke.</p>
          )}
        </div>
      )}
    </div>
  );
}