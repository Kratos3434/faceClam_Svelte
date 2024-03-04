// place files you want to import through the `$lib` alias in this folder.
import { writable } from "svelte/store";
import type { PostProps } from "../types";

//testing
export const counter = writable(0);

export const openSignup = writable(false);

export const openPopup = writable(false);

export const openAddPost = writable(false);

export const openAddStatus = writable(false);

export const viewLikes = writable({ status: false, postId: 0 });

export const viewPost = writable<{status: boolean, post?: PostProps}>({ status: false, post: undefined });

export const changeProfilePic = writable(false);

export const changeCoverPic = writable(false);