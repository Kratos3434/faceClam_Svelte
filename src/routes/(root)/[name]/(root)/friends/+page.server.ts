import { publicBaseURL } from "../../../../../env";
import type { PageServerLoad } from "./$types";

export const load = (async ({fetch, params}) => {
  const id = params.name.split('.')[2];

  const res = await fetch(`${publicBaseURL}/friends/${id}`);
  const data = await res.json();

  return {
    friends: data.data,
    currentId: +id
  }
}) satisfies PageServerLoad;