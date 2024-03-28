<script lang="ts">
	import { openShare } from '$lib';
  import Close from 'svelte-material-icons/Close.svelte';
	import type { UserProps } from '../types';
  import placeholder from '$lib/assets/placeholder.png';
  import Earth from 'svelte-material-icons/Earth.svelte';

  export let currentUser: UserProps;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-max-h-[100vh] tw-h-full tw-py-5 tw-px-[16px] tw-bg-[rgb(0,0,0)] tw-bg-[rgba(0,0,0,0.4)] tw-z-[1000]" 
on:click={() => $openShare.status = false}>
  <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full">
    <div class="tw-max-w-[548px] tw-w-full tw-bg-white tw-rounded-md tw-shadow-md" on:click={(e) => e.stopPropagation()}>
      <div class="tw-flex tw-justify-between tw-items-center tw-p-[16px]">
        <div></div>
        <span class="tw-text-[20px] tw-font-bold">Share</span>
        <span class="tw-cursor-pointer" on:click={() => $openShare.status = false}>
          <Close width={30} height={30} />
        </span>
      </div>
      <hr />
      <div class="tw-flex tw-gap-3 tw-items-center">
        <img src={currentUser.profilePicture ? currentUser.profilePicture : placeholder} width="40" height="40" alt={`${currentUser.firstName} ${currentUser.lastName}`} />
        <div class="tw-flex tw-flex-col">
          <span>{currentUser.firstName} {currentUser.lastName}</span>
          <div class="tw-flex">
            <Earth width={12} height={12} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>