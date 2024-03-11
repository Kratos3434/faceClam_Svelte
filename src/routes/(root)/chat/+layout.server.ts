import type { LayoutServerLoad } from "./$types";
import { publicBaseURL } from "../../../env";
import type { FriendProps } from "../../../types";

export const load = (async ({ fetch, parent }) => {
  const { currentUser } = await parent();

  const getFriends = async (): Promise<FriendProps[]> => {
    const res = await fetch(`${publicBaseURL}/friends/${currentUser.id}`);
    const data = await res.json();
    return data.data
  }

  return {
    friends: await getFriends()
  }
}) satisfies LayoutServerLoad;