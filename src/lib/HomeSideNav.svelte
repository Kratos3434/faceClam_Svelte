<script lang="ts">
	import type { UserProps } from "../types";
  import placeholder from '$lib/assets/placeholder.png';
  import Friend from 'svelte-material-icons/AccountMultiple.svelte';
  import Saved from 'svelte-material-icons/Bookmark.svelte';
  import Memory from 'svelte-material-icons/History.svelte';
  import Groups from 'svelte-material-icons/AccountGroup.svelte';
  import Video from 'svelte-material-icons/YoutubeTv.svelte';
  import { openPopup } from "$lib";

  export let user: UserProps | null = null;

  const sideBar = [
    {
      image: {
        source: user?.profilePicture ? user.profilePicture : placeholder,
        width: 36,
        height: 36 
      },
      path: user ? `${user.firstName}.${user.lastName}.${user.id}` : "/",
      name: user ? `${user.firstName} ${user.lastName}` : "Unknown User"
    },
    {
      icon: Friend,
      path: "/friends",
      name: "Friends",
      color: "#1C89F6"
    },
    {
      icon: Saved,
      path: "/saved",
      name: "Saved",
      color: "#BE45C5"
    },
    {
      icon: Memory,
      path: "/memories",
      name: "Memories",
      color: "#31B5FD"
    },
    {
      icon: Groups,
      path: "/groups",
      name: "Groups",
      color: "#24B2FE"
    }
  ]
</script>

<div class="tw-sticky tw-top-[70px] tw-h-full tw-z-0 tw-overflow-x-hidden tw-overflow-y-hidden tw-hidden home-lg:tw-block tw-w-[344px]">
  <div class="tw-flex">
    <div class="tw-flex tw-flex-col tw-max-w-[360px] tw-w-full tw-text-[15px] tw-font-bold tw-gapp-3">
      {#each sideBar as e, i (i)}
        {#if !user}
          <button class="tw-flex tw-items-center tw-gap-2 tw-rounded-md hover:tw-bg-gray-200 tw-px-[8px] tw-py-3" on:click={() => $openPopup = true}>
            {#if e.image}
              <img src={e.image.source} width={e.image.width} height={e.image.height} alt={e.name} class="tw-rounded-[50%] tw-w-[36px] tw-h-[36px]" />
            {:else}
              <svelte:component this={e.icon} width={36} height={36} color={e.color} />
            {/if}
            <span>{e.name}</span>
          </button>
        {:else}
          <a class="tw-flex tw-items-center tw-gap-2 tw-rounded-md hover:tw-bg-gray-200 tw-px-[8px] tw-py-3" href={e.path}>
            {#if e.image}
              <img src={e.image.source} width={e.image.width} height={e.image.height} alt={e.name} class="tw-rounded-[50%] tw-shrink-0 tw-w-[36px] tw-h-[36px]" />
            {:else}
              <svelte:component this={e.icon} width={36} height={36} color={e.color} />
            {/if}
            <span>{e.name}</span>
          </a>
        {/if}
      {/each}
    </div>
  </div>
</div>