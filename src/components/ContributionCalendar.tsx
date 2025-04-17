"use client";
import { HeatMapGrid } from "react-heatmap-grid";
import { differenceInCalendarDays, subMonths, format } from "date-fns";
import type { SmokingEvent } from "@prisma/client";

export default function ContributionCalendar({
  events,
}: {
  events: SmokingEvent[];
}) {
  const today = new Date();
  const start = subMonths(today, 11);

  // 365‑element array, index 0 = oldest.
  const counts = Array.from({ length: 365 }, (_, i) => {
    const day = new Date(start);
    day.setDate(day.getDate() + i);
    return events.filter(
      (e) => differenceInCalendarDays(e.smokedAt, day) === 0,
    ).length;
  });

  const xLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const yLabels = Array.from({ length: 52 }, (_, w) =>
    format(new Date(start.getTime() + w * 7 * 864e5), "MMM"),
  );

  // Shape = 7 rows × 52 cols
  const matrix = xLabels.map((_, r) =>
    Array.from({ length: 52 }, (_, c) => counts[c * 7 + r]),
  );

  return (
    <HeatMapGrid
      data={matrix}
      horizontalLabels={yLabels}
      xLabelsLocation="bottom"
      yLabels={xLabels}
      cellHeight="1rem"
      cellWidth="1rem"
      squares
      background={(v) =>
        v === 0 ? "#f5f5f5" : `rgba(34,197,94,${Math.min(1, v / 4)})`
      }
      cellStyle={() => ({ borderRadius: 2 })}
    />
  );
}
