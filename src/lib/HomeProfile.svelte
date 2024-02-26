<script lang="ts">
	import type { UserProps } from "../types";
  import Edit from 'svelte-material-icons/Pencil.svelte';
  import Clock from 'svelte-material-icons/Clock.svelte';
	import { monthToString } from "../helpers";
	import WhatsOnYourMind from "./WhatsOnYourMind.svelte";
	import { openAddPost, openAddStatus } from "$lib";
	import AddPost from "./AddPost.svelte";
	import AddStatus from "./AddStatus.svelte";
  import { createQuery } from "@tanstack/svelte-query";
	import Loading from "./Loading.svelte";
	import PostCard from "./PostCard.svelte";
	import { publicBaseURL } from "../env";

  export let user: UserProps;
  export let token: string | undefined;

  let editBio = false;
  let bio = "";
  let bioCharacters = 101;

  const handleBio = (e: any) => {
    bio = e.target.value;
  }

  const getPostsByUserId = async () => {
    const res = await fetch(`${publicBaseURL}/post/user/${user.id}`);
    const data = await res.json();
    return data.data;
  }

  const query = createQuery({
    queryKey: ['userPosts', user.id],
    queryFn: () => getPostsByUserId()
  });

</script>

<div class="tw-flex tw-flex-col tw-items-center tw-mt-5 tw-w-full">
  <div class="tw-flex tw-gap-7 homeprof-md:tw-items-start tw-w-full tw-px-[16px] homeprof-md:tw-flex-row tw-flex-col tw-items-center tw-justify-center">
    <!-- Left side -->
    <div class="tw-flex tw-flex-col tw-px-[16px] tw-py-[20px] tw-rounded-md tw-bg-white tw-shadow-md tw-gap-5 homeprof-md:tw-max-w-[490px] tw-max-w-[680px] tw-w-full">
      <span class="tw-text-[20px] tw-font-bold">
        Intro
      </span>
      {#if editBio}
        <form>
          <div class="tw-flex tw-flex-col tw-w-full tw-gap-1">
            <textarea rows={3} class="tw-w-full tw-rounded-md tw-bg-gray-200 tw-resize-none tw-border-[1px] tw-border-black focus:tw-border-[#0866FF] focus:tw-bg-white tw-items-center tw-text-center tw-px-[12px] tw-py-[8px] tw-outline-none tw-font-bold" maxlength={101} placeholder="Describe who you are" tabindex={0} 
            on:input={handleBio} on:keydown={(e) => {
              switch (e.key) {
                case "Backspace":
                  bioCharacters < 101 && bioCharacters++;
                  break;
                default: 
                  bioCharacters > 0 && bioCharacters--;
                  break;
              }
            }}></textarea>
            <div class="tw-flex tw-justify-end">
              <span class="tw-text-[13px] tw-text-gray-500">
                {bioCharacters} characters remaining
              </span>
            </div>
            <div class="tw-flex tw-justify-end tw-gap-1">
              <button class="tw-rounded-md tw-bg-gray-200 tw-px-[12px] tw-py-2 tw-text-[15px] tw-font-bold tw-cursor-pointer hover:tw-brightness-95" on:click={() => {
                editBio = false;
                bioCharacters = 101;
                bio = "";
              }}>
                Cancel
              </button>
              {#if bio.length === 0}
                <span class="tw-rounded-md tw-bg-gray-200 tw-px-[12px] tw-py-2 tw-text-[15px] tw-font-bold tw-text-gray-400 tw-cursor-not-allowed">
                  Save
                </span>
              {:else}
                <button class="tw-rounded-md tw-bg-gray-200 tw-px-[12px] tw-py-2 tw-text-[15px] tw-font-bold tw-cursor-pointer hover:tw-brightness-95 tw-text-black">
                  Save
                </button>
              {/if}
            </div>
          </div>
        </form>
      {:else}
        {#if !user.bio}
          <button class="tw-w-full tw-rounded-md tw-text-center tw-bg-gray-200 hover:tw-brightness-95 tw-px-[12px] tw-py-2 tw-cursor-pointer" on:click={() => editBio = true}>
            <span class="tw-text-[15px] tw-text-[#050505] tw-font-[600]">
              Add bio
            </span>
          </button>
        {:else}
          <div class="tw-text-center tw-text-[15px]">
            <div class="tw-flex tw-flex-col tw-gap-1 tw-py-2">
              <div class="tw-py-2 tw-break-words">
                {user.bio}
              </div>
              <div class="tw-flex tw-justify-end">
                <button class="tw-rounded-md tw-bg-gray-200 tw-px-[12px] tw-py-2 tw-text-[12px] tw-font-bold tw-cursor-pointer hover:tw-brightness-95 tw-flex tw-items-center tw-gap-1" on:click={() => editBio = true}>
                  <Edit width={12} height={12} />
                  <span>
                    Edit Bio
                  </span>
                </button>
              </div>
            </div>
          </div>
        {/if}
      {/if}
      <div class="tw-w-full tw-rounded-md tw-text-center tw-bg-gray-200 hover:tw-brightness-95 tw-px-[12px] tw-py-2 tw-cursor-pointer">
        <span class="tw-text-[15px] tw-text-[#050505] tw-font-[600]">
          Add current city
        </span>
      </div>

      <div class="tw-w-full tw-rounded-md tw-text-center tw-bg-gray-200 hover:tw-brightness-95 tw-px-[12px] tw-py-2 tw-cursor-pointer">
        <span class="tw-text-[15px] tw-text-[#050505] tw-font-[600]">
          Add where you from
        </span>
      </div>

      <div class="tw-flex tw-gap-2 tw-items-center">
        <Clock class="tw-text-gray-400" />
        <span class="tw-text-[15px] tw-text-[#050505]">
          Joined {monthToString(new Date(user.createdAt).getMonth())} {new Date(user.createdAt).getFullYear()}
        </span>
      </div>
    </div>
    <!-- Left side end-->

    <!-- Right side -->
    <div class="tw-flex tw-flex-col tw-gap-4 tw-max-w-[680px] tw-w-full">
      {#if $query.isLoading}
        <div class="tw-flex tw-justify-center">
          <Loading width={70} height={70} />
        </div>
      {:else if $query.isError}
        <p>Something went wrong :{"("}</p>
      {:else if $query.isSuccess}
        <WhatsOnYourMind user={user} />
        {#each $query.data as post}
          <PostCard {post} currentUser={user} {token} />
        {/each}
        <hr class="tw-my-1" />
        <div class="tw-py-2">
          <small>You are updated :{")"}</small>
        </div>
      {/if}
    </div>
    <!-- Right side end-->
  </div>
</div>

{#if $openAddPost}
  <AddPost {user} {token} />
{/if}

{#if $openAddStatus}
  <AddStatus {user} {token} />
{/if}