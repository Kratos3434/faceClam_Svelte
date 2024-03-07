<script lang="ts">
	import type { PostProps, UserProps } from "../types";
  import { monthToString } from "../helpers";
  import Edit from 'svelte-material-icons/Pencil.svelte';
  import Clock from 'svelte-material-icons/Clock.svelte';

  export let user: UserProps;
  export let posts: PostProps[];
</script>

<div class="tw-flex tw-flex-col tw-gap-5 homeprof-md:tw-max-w-[490px] tw-max-w-[680px] tw-w-full homeprof-md:tw-sticky homeprof-md:tw-top-[-70px]">
  <!-- Intro -->
  <div class="tw-flex tw-flex-col tw-px-[16px] tw-py-[20px] tw-rounded-md tw-bg-white tw-shadow-md tw-gap-5 homeprof-md:tw-max-w-[490px] tw-max-w-[680px] tw-w-full">
    <span class="tw-text-[20px] tw-font-bold">
      Intro
    </span>
    {#if !user.bio}
      <div class="tw-text-center tw-text-[15px]">
        <div class="tw-flex tw-flex-col tw-gap-1 tw-py-2">
          <div class="tw-py-2 tw-break-words">
            No Bio
          </div>
        </div>
      </div>
    {:else}
      <div class="tw-text-center tw-text-[15px]">
        <div class="tw-flex tw-flex-col tw-gap-1 tw-py-2">
          <div class="tw-py-2 tw-break-words">
            {user.bio}
          </div>
        </div>
        <hr />
      </div>
    {/if}
    <div class="tw-flex tw-gap-2 tw-items-center">
      <Clock class="tw-text-gray-400" />
      <span>
        Joined {monthToString(new Date(user.createdAt).getMonth())} {new Date(user.createdAt).getFullYear()}
      </span>
    </div>
  </div>
  <!-- !Intro -->

  <!-- Photos (top 9) -->
  <div class="tw-flex tw-flex-col tw-px-[16px] tw-py-[20px] tw-rounded-md tw-bg-white tw-shadow-md tw-gap-5 homeprof-md:tw-max-w-[490px] tw-max-w-[680px] tw-w-full">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-text-[20px] tw-font-bold">
        Photos
      </span>
      <span class="tw-text-[17px] tw-cursor-pointer tw-text-[rgb(0,100,209)] tw-rounded-md hover:tw-bg-gray-200 tw-px-2">
        See all photos
      </span>
    </div>

    <!-- 149.98 img w*h-->
    <div class="tw-grid tw-grid-cols-3 tw-gap-1">
      {#each posts as post }
        <img src={post.featureImage} width={149} height={149} alt={post.description} class="homeprof-md:tw-w-[149px] homeprof-md:tw-h-[149px] tw-rounded-md tw-w-[213px] tw-h-[213px]"/>
      {/each}
    </div>
  </div>
  <!-- !Photos (top 9) -->

  <small class="homeprof-md:tw-block tw-hidden">
    &copy; faceClam &#8226; Copyright 2024 &#8226; All rights reserved
  </small>
</div>