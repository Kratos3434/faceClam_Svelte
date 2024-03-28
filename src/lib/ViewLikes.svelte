<script lang="ts">
  import { viewLikes } from "$lib";
	import type { LikeProps, UserProps } from "../types";
  import Loading from "./Loading.svelte";
  import placeholder from '$lib/assets/placeholder.png';
  import AddFriendIcon from 'svelte-material-icons/AccountPlus.svelte';
  import Close from 'svelte-material-icons/Close.svelte';
	import { publicBaseURL } from "../env";
  import { createQuery } from "@tanstack/svelte-query";

  export let currentUser: UserProps | null;

  const closeModal = () => {
    $viewLikes.postId = 0;
    $viewLikes.status = false;
  }

  const getLikesByPostId = async (): Promise<LikeProps[]> => {
    const res = await fetch(`${publicBaseURL}/like/post/${$viewLikes.postId}`);
    const data = await res.json();
    return data.data;
  }

  const query = createQuery({
    queryKey: ['likes', $viewLikes.postId],
    queryFn: () => getLikesByPostId(),
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-max-h-[100vh] tw-h-full tw-px-[16px] tw-py-5 tw-bg-[rgb(0,0,0)] tw-bg-[rgba(0,0,0,0.4)] tw-z-[2000] tw-overflow-hidden" on:click={closeModal}>
  <div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-full tw-overflow-hidden">
    <div class="tw-rounded-md tw-bg-white tw-shadow-md tw-flex tw-flex-col tw-gap-2 tw-max-w-[550px] tw-w-full tw-relative tw-h-[370px] tw-overflow-auto" on:click={(e) => e.stopPropagation()}>
      <div class="tw-flex tw-w-full tw-sticky tw-top-0 tw-h-[60px] tw-text-[#65676B] tw-font-bold tw-z-[100] tw-py-1 tw-bg-white">
        <div class="tw-px-[16px] tw-flex tw-w-full tw-items-center tw-relative">
          <span class="tw-px-[16px] hover:tw-rounded-md hover:tw-bg-gray-200 tw-cursor-pointer tw-h-full tw-flex tw-items-center">
            All
          </span>
          <button class="tw-absolute tw-right-0 tw-pr-[16px] tw-pb-[16px] tw-text-black tw-font-bold" on:click={closeModal}>
            <Close width={25} height={25} />
          </button>
        </div>
      </div>
      <div class="tw-h-[370px] tw-overflow-y-auto tw-flex tw-flex-col tw-gap-2 tw-absolute tw-w-full tw-pb-2 tw-pt-[60px]">
        {#if $query.isLoading}
          <div class="tw-flex tw-justify-center">
            <Loading width={70} height={70} />
          </div>
        {:else if $query.isError}
          <p>Something went wrong :{"("}</p>
        {:else if $query.isSuccess}
          {#if $query.data.length === 0}
            <div class="tw-flex tw-justify-center">
              <span class="tw-text-[15px] tw-font-bold tw-text-center">No Likes Yet...</span>
            </div>
          {:else}
            {#each $query.data as like }
              <div class="tw-flex tw-text-[15px] tw-font-bold tw-px-[8px] tw-items-center tw-gap-3">
                <a href={`/${like.user.firstName}.${like.user.lastName}.${like.user.id}`}>
                  <img src={like.user.profilePicture ? like.user.profilePicture : placeholder} width={40} height={40} alt={`${like.user.firstName} ${like.user.lastName}`} 
                  class="tw-rounded-[1000px] tw-h-[40px] tw-w-[40px]" />
                </a>
              <div class="tw-flex tw-flex-1 tw-justify-between tw-h-full">
                <div class="tw-flex tw-items-center">
                  <a href={`/${like.user.firstName}.${like.user.lastName}.${like.user.id}`} class="hover:tw-underline">
                    {#if currentUser?.id == like.user.id}
                      You
                    {:else}
                      {like.user.firstName} {like.user.lastName}
                    {/if}
                  </a>
                </div>
                {#if currentUser}
                  {#if currentUser?.id != like.user.id}
                    <div class="tw-rounded-md tw-bg-gray-200 tw-flex tw-px-[12px] tw-items-center tw-cursor-pointer hover:tw-brightness-95 tw-gap-1">
                      <AddFriendIcon width={16} height={16} />
                      <span>
                        Add friend
                      </span>
                    </div>
                  {/if}
                {/if}
                </div>
              </div>
            {/each}
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>