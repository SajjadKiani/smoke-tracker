// src/app/(auth)/google-sign-in.ts
"use server";

import { signIn } from "@/auth";        // v5 helper

export async function googleSignIn() {
  // no await: signIn returns a redirect Response
  return signIn("google");
}
