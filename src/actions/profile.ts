"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema, ProfileInput } from "@/lib/validations";

export async function updateProfile(input: ProfileInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = profileSchema.parse(input);

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      image: data.image || null,
      currency: data.currency,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return user;
}
