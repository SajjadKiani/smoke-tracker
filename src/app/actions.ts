"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function recordSmokingEvent() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  await prisma.smokingEvent.create({
    data: { userId: session.user.id },
  });
}
