<script lang="ts">
	import type { UserProps } from "../types";
  import placeholder from '$lib/assets/placeholder.png';
  import Photo from 'svelte-material-icons/ImageMultiple.svelte';
  import Emoticon from 'svelte-material-icons/EmoticonOutline.svelte';
  import { openAddPost, openAddStatus } from "$lib";

  export let user: UserProps;

  const postType = [
    {
      icon: Photo,
      type: "Photo/video",
      color: "tw-text-green-600"
    },
    {
      icon: Emoticon,
      type: "Feeling/activity",
      color: "tw-text-yellow-300"
    }
  ]
</script>

<div class="tw-rounded-md tw-bg-white tw-shadow-md tw-flex tw-flex-col tw-px-[16px] tw-pt-[12px] tw-pb-[10px] tw-gap-3">
  <div class="tw-flex tw-gap-2 tw-items-center tw-shrink-0">
    <a href={`/${user.firstName}.${user.lastName}.${user.id}`}>
      <img src={user.profilePicture ? user.profilePicture : placeholder} width={40} height={40} alt={`${user.firstName} ${user.lastName}`} class="tw-rounded-[1000px] tw-w-[40px] tw-h-[40px]" />
    </a>
    <button class="tw-text-start tw-rounded-[20px] tw-py-[8px] tw-px-[12px] tw-w-full tw-cursor-pointer tw-bg-[#F0F2F5] hover:tw-bg-gray-300" on:click={() => $openAddStatus = true}>
      <span class="tw-text-[17px] tw-text-[#65676B]">
        What's on your mind, {user.firstName}?
      </span>
    </button>
  </div>
  <hr />
  <div class="tw-flex tw-justify-center">
    {#each postType as e, idx (idx) }
      <button class="tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-1 hover:tw-rounded-md hover:tw-bg-gray-200 tw-p-[8px] tw-transition-all tw-cursor-pointer" 
      on:click={() => {
        if (idx === 0) $openAddPost = true;
      }}>
        <svelte:component this={e.icon} class={`tw-w-[24px] tw-h-[24px] ${e.color}`} />
        <span class="tw-text-[15px] tw-text-[#65676B]">
          {e.type}
        </span>
      </button>
    {/each}
  </div>
</div>