// auth.ts  (root)
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";          // absolute import still works

export const {
  auth,                       // <- the function you use in Server Components
  signIn,
  signOut,
  handlers,                   // { GET, POST }
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GoogleProvider],
  session: { strategy: "jwt" },
});
