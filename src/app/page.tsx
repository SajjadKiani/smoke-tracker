// src/app/page.tsx
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/auth";
import ContributionCalendar from "@/components/ContributionCalendar";
import StatsCard from "@/components/StatsCard";
import Image from "next/image";
import {
  differenceInCalendarDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";
import { googleSignIn } from "./(auth)/google-sign-in";
import { logout } from "./(auth)/sign-out";

export default async function Page() {
  const session = await auth();

  const totalUsers = await prisma.user.count()
  if (!session) {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-6 p-4">
        <h1 className="text-2xl font-bold">Smoke‑Tracker</h1>
        <Image
          src={'/banner.png'}
          height={300}
          width={270}
          alt="banner"
        />
        <div className="space-y-2 text-center">
          <p className="text-5xl font-bold">{totalUsers}+</p>
          <p className="text-sm font-ligh">Total Users</p>
        </div>
        <form action={googleSignIn}>
          <button className="rounded-full bg-green-600  px-5 py-2 text-white shadow hover:bg-green-700">
            Sign in with Google
          </button>
        </form>
      </main>
    );
  }

  const userId = session.user!.id;

  // Fetch current user's events for stats and calendar
  const events = await prisma.smokingEvent.findMany({
    where: { userId },
    select: { id: true, userId: true, smokedAt: true },
  });

  // Compute stats
  const now = new Date();
  const todayCount = events.filter((e) => isSameDay(e.smokedAt, now)).length;
  const last7Count = events.filter(
    (e) => differenceInCalendarDays(now, e.smokedAt) < 7
  ).length;
  const last30Count = events.filter(
    (e) => differenceInCalendarDays(now, e.smokedAt) < 30
  ).length;
  const lifetimeCount = events.length;

  // Build userMap: date string -> list of user names who smoked that day
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const allEvents = await prisma.smokingEvent.findMany({
    where: {
      smokedAt: { gte: monthStart, lte: monthEnd },
    },
    include: { user: { select: { name: true } } },
  });
  const userMap: Record<string, string[]> = allEvents.reduce(
    (acc, e) => {
      const key = format(e.smokedAt, "yyyy-MM-dd");
      acc[key] = acc[key] ?? [];
      acc[key].push(e.user.name ?? "Unknown");
      return acc;
    },
    {} as Record<string, string[]>
  );

  return (
    <main className="mx-auto max-w-md space-y-6 p-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "avatar"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
          )}
          <h2 className="text-lg font-semibold">
            Hi {session?.user?.name?.split(" ")[0] ?? "there"} 👋
          </h2>
        </div>
        <form action={logout}>
          <button
            className="text-sm text-gray-500 underline-offset-2 hover:underline"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard label="Today" value={todayCount} />
        <StatsCard label="7 days" value={last7Count} />
        <StatsCard label="30 days" value={last30Count} />
        <StatsCard label="Total" value={lifetimeCount} />
      </section>

      {/* Calendar */}
      <ContributionCalendar events={events} userMap={userMap} />

      {/* Leaderboard */}
      <section>
        <h3 className="text-lg font-semibold mt-6">Today's Leaderboard</h3>
        <ul className="mt-3 space-y-2">
          {allEvents
            .filter((e) => isSameDay(e.smokedAt, now))
            .reduce<Record<string, number>>((cnt, e) => {
              const name = e.user.name ?? "Unknown";
              cnt[name] = (cnt[name] || 0) + 1;
              return cnt;
            }, {}) &&
          (() => {
            const counts = Object.entries(
              allEvents.reduce<Record<string, number>>((cnt, e) => {
                if (isSameDay(e.smokedAt, now)) {
                  const name = e.user.name ?? "Unknown";
                  cnt[name] = (cnt[name] || 0) + 1;
                }
                return cnt;
              }, {})
            ).sort((a, b) => b[1] - a[1]);
            

            return counts.length > 0 ? (
              counts.reverse().map(([name, c]) => (
                <li
                  key={name}
                  className="flex items-center justify-between rounded-lg bg-white/10 p-2 shadow-sm"
                >
                  <span className="text-sm font-light">{name}</span>
                  <span className="text-green-600 font-bold">{c}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No records today.</li>
            );
          })()}
        </ul>
      </section>
    </main>
  );
}
