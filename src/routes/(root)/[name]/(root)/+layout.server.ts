import { error } from "@sveltejs/kit";
import { publicBaseURL, userBaseURL } from "../../../../env";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({cookies, params, fetch}) => {
  const token = cookies.get('token');

  const res = await fetch(`${publicBaseURL}/user/${params.name}`);
  const data = await res.json();

  if (!data.status) {
    error(404, {
      message: 'Not found'
    })
  }

  const verify = await fetch(`${userBaseURL}/validate/current/${params.name}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const verifyData = await verify.json();

  return {
    token: token,
    param: params.name,
    verified: verifyData.status,
    user: data.data
  }
}) satisfies LayoutServerLoad;