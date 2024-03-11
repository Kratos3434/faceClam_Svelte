import type { LayoutServerLoad } from "./$types";
import { publicBaseURL } from "../../../env";
import type { FriendProps } from "../../../types";
import { error, redirect } from "@sveltejs/kit";

export const load = (async ({ fetch, parent, url }) => {
  const { currentUser } = await parent();
  const userId = url.searchParams.get('userId');
  const path = url.pathname;
  let friends = null;
  let otherUser = currentUser;

  const getFriends = async (): Promise<FriendProps[]> => {
    const res = await fetch(`${publicBaseURL}/friends/${currentUser.id}`);
    const data = await res.json();
    return data.data
  }
  
  if (currentUser) {
    friends = await getFriends();
  }

  if (path === "/chat" && currentUser && friends) {
    if (!userId) {
      redirect(307, "/chat/all");
    }
    friends.map((e) => {
      if (e.friend.id == currentUser.id) {
        if (e.user.id == +userId) {
          otherUser = e.user;
        }
      } else {
        if (e.friend.id == +userId) {
          otherUser = e.friend;
        }
      }
    });
    if (otherUser == currentUser) otherUser = null;
    if (!otherUser) error(404);
  } 

  return {
    friends: friends,
    currentUser: currentUser,
    otherUser: otherUser
  }
}) satisfies LayoutServerLoad;