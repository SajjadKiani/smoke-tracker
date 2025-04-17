import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/auth";
import ContributionCalendar from "@/components/ContributionCalendar";
import StatsCard from "@/components/StatsCard";
import Image from "next/image";
import {
  differenceInCalendarDays,
  isSameDay,
  subDays,
} from "date-fns";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-4">
        <h1 className="text-2xl font-bold">Smoke‑Tracker</h1>
        <form action={async () => signIn("google")}>
          <button className="rounded-md bg-green-600 px-5 py-2 text-white shadow hover:bg-green-700">
            Sign in with Google
          </button>
        </form>
      </main>
    );
  }

  const { user } = session!;  

  const events = await prisma.smokingEvent.findMany({
    where: { userId: user?.id },
    select: { id: true, userId: true, smokedAt: true },  // ✅ add the two fields
  });

  const now = new Date();
  const today     = events.filter(e => isSameDay(e.smokedAt, now)).length;
  const last7     = events.filter(e => differenceInCalendarDays(now, e.smokedAt) < 7).length;
  const last30    = events.filter(e => differenceInCalendarDays(now, e.smokedAt) < 30).length;
  const lifetime  = events.length;

  return (
    <main className="mx-auto max-w-md space-y-6 p-4">
      {/* header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user?.image && (
            <Image
              src={user?.image}
              alt={user?.name ?? "avatar"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
          )}
          <h2 className="text-lg font-semibold">
            Hi&nbsp;{user?.name?.split(" ")[0] ?? "there"} 👋
          </h2>
        </div>
        {/* <form action={logout}>
          <button
            className="text-sm text-gray-500 underline-offset-2 hover:underline"
            type="submit"
          >
            Sign out
          </button>
        </form> */}
      </header>

      {/* stats grid */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard label="Today"   value={today} />
        <StatsCard label="7 days"  value={last7} />
        <StatsCard label="30 days" value={last30} />
        <StatsCard label="Total"   value={lifetime} />
      </section>

      {/* contribution calendar */}
      <ContributionCalendar events={events} />
    </main>
  );
}
