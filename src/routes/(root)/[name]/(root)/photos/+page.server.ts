import { publicBaseURL } from "../../../../../env";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
  const id = params.name.split('.')[2];

  const res = await fetch(`${publicBaseURL}/photos/${id}`);
  const data = await res.json();

  return {
    posts: data.data
  }
}) satisfies PageServerLoad;