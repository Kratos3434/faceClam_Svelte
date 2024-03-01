import { redirect } from "@sveltejs/kit";
import { publicBaseURL } from "../../env";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies, fetch }) => {
  const retrieveToken = cookies.get('retrieveToken');
  if (!retrieveToken) {
    redirect(307, "/login");
  }

  const res = await fetch(`${publicBaseURL}/validating/${retrieveToken}`);
  if (res.status == 401) {
    redirect(307, "/login");
  }

  const data = await res.json();
  if (!data.status) {
    redirect(307, "/login");
  }

  return {
    email: data.data.email,
    retrieveToken: retrieveToken
  };
}) satisfies PageServerLoad