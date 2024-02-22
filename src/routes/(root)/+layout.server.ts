import { userBaseURL } from "../../env";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ cookies, fetch}) => {
  const token = cookies.get('token');
  let userData = null;
  const res = await fetch(`${userBaseURL}/authenticate`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (data.status) {
    const userRes = await fetch(`${userBaseURL}/current`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const uData = await userRes.json();
    if (uData.status) {
      userData = uData.data;
    }
  }
  return {
    token: token,
    loggedIn: data.status,
    user: userData
  }
}) satisfies LayoutServerLoad;