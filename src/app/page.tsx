import { prisma } from "@/lib/prisma";
import { auth, signIn } from "@/auth";   // not from "@/lib/auth"
import ContributionCalendar from "@/components/ContributionCalendar";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold">Smoke‑Tracker</h1>
        <form action={async () => signIn("google")}>
          <button className="rounded bg-green-600 px-4 py-2 text-white">
            Sign in with Google
          </button>
        </form>
      </main>
    );
  }

  const events = await prisma.smokingEvent.findMany({
    where: { userId: session.user.id },
  });

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-lg font-bold">Hi {session.user.name}</h1>
      <ContributionCalendar events={events} />
    </main>
  );
}
