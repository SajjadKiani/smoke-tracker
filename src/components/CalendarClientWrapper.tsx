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

type Props = { events: SmokingEvent[] };
export default function CalendarClientWrapper({ events }: Props) {
  return <ContributionCalendar events={events} />;
}
