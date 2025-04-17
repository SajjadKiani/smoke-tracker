// auth.ts   (🟢 repo root, not under /src)
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { auth, signIn, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
});
