// place files you want to import through the `$lib` alias in this folder.
import { writable } from "svelte/store";

//testing
export const counter = writable(0);

export const openSignup = writable(false);

export const openPopup = writable(false);

export const openAddPost = writable(false);

export const openAddStatus = writable(false);