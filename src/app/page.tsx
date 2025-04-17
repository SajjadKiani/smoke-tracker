// src/app/page.tsx   ← keep this file *without* “use client”
import { auth } from "@/auth";
import { googleSignIn } from "./(auth)/google-sign-in";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold">Smoke‑Tracker</h1>

        {/* form will POST to /_actions/googleSignIn, works offline via SW */}
        <form action={googleSignIn}>
          <button className="rounded bg-green-600 px-4 py-2 text-white">
            Sign in with Google
          </button>
        </form>
      </main>
    );
  }

  /* …dashboard… */
}
