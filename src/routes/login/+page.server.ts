import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
  const token = cookies.get('token');
  const retireveToken = cookies.get('retrieveToken');

  if (token) {
    redirect(307, "/");
  } else if (retireveToken) {
    redirect(307, "/verifyemail");
  }
}) satisfies PageServerLoad;