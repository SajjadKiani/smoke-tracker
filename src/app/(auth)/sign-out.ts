// src/app/(auth)/sign-out.ts
"use server"

import { signOut } from "@/auth";

export async function logout() {
  return signOut(); // you can also redirect afterwards if you want
}