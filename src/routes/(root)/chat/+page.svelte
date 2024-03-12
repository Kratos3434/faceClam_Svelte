<script lang="ts">
	import Chat from "$lib/Chat.svelte";
	import type { LayoutData } from "./$types";
  import ChatIcon from 'svelte-material-icons/Chat.svelte';

  export let data: LayoutData;
</script>

<svelte:head>
  <title>Chat - faceClam</title>
  <meta name="description" content="Chat with friends around the world with faceClam" />
</svelte:head>

<div class={`tw-w-full`}>
  {#if !data.currentUser}
    <div class="tw-fixed tw-top-[60px] tw-left-0 tw-w-full tw-h-full">
      <div class="tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-bg-[#2EC4B6] tw-text-center">
        <div class="tw-flex tw-flex-col tw-gap-16">
          <span class="tw-text-[#0866FF] sm:tw-text-[90px] tw-text-[50px] tw-font-bold tw-text-center">
            faceClam<br />
            <div class="tw-flex tw-gap-2 tw-justify-center">
              <span>Chat</span>
              <ChatIcon width={80} height={80} />
            </div>
          </span>
          <div class="tw-flex tw-flex-col">
            <span class="tw-text-[20px] tw-font-bold">
              Please login to chat with your friends
            </span>
            <span class="tw-text-[18px] tw-font-bold">
              Click the button below to chat now
            </span>
          </div>
          <a class="tw-px-[16px] tw-py-[12px] tw-rounded-md tw-text-white tw-font-bold tw-text-[20px] tw-bg-[#0866FF] hover:tw-brightness-95 tw-shadow-xl sm:hover:tw-scale-[1.5] tw-transition-all" href="/login">
            Log in
          </a>
        </div>
      </div>
    </div>
  {:else}
    {#if data.otherUser}
      <Chat otherUser={data.otherUser} />
    {/if}
  {/if}
</div>