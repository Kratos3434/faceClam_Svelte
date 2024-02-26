import { error } from "@sveltejs/kit";
import { publicBaseURL } from "../../../../../env";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch, depends }) => {
  const userId = params.name.split('.')[2];
  const postId = params.id;

  const res = await fetch(`${publicBaseURL}/post?authorId=${userId}&postId=${postId}`);
  const data = await res.json();

  if (!data.status) {
    error(404, {
      message: 'Not Found'
    });
  }

  depends('app:comment');

  return {
    post: data.data
  }
}) satisfies PageServerLoad;