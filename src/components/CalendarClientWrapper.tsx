"use client";

import dynamic from "next/dynamic";
import type { SmokingEvent } from "@prisma/client";

const ContributionCalendar = dynamic(
  () => import("./ContributionCalendar"),
  {
    ssr: false,
    loading: () => <p className="text-center py-4">Loading calendar…</p>,
  }
);

export default function CalendarClientWrapper({
  events,
  userMap,
}: {
  events: SmokingEvent[];
  userMap: Record<string, string[]>;
}) {
  return <ContributionCalendar events={events} userMap={userMap} />;
}