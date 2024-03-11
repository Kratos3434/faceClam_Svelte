import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ parent }) => {
  const { currentUser } = await parent();

  if (!currentUser) {
    redirect(307, "/chat");
  }
}) satisfies LayoutServerLoad;