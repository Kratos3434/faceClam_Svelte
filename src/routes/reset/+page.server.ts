import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { publicBaseURL } from "../../env";

export const load = (async ({ url, fetch }) => {
  const token = url.searchParams.get('token');
  let status = false;
  let code = 401;
  if (!token) {
    redirect(307, "/login");
  }

  const res = await fetch(`${publicBaseURL}/token/verify/${token}`);

  if (res.status === 401) {
    status = false;
    code = 401;
  }
  else if (res.status === 400) {
    redirect(307, "/");
  }  else {
    status = true;
    code = 200;
  }

  return {
    status: status,
    code: code,
    token: token
  }
}) satisfies PageServerLoad;