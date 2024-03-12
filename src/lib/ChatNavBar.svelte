<script lang="ts">
	import { openChatMenu } from '$lib';
  import Person from 'svelte-material-icons/AccountOutline.svelte';
  import Menu from 'svelte-material-icons/Menu.svelte';
  import Close from 'svelte-material-icons/Close.svelte';

  export let currentPath: string;

  const navOptions = [
    {
      name: "Online",
      path: '/chat/online'
    },
    {
      name: "All",
      path: '/chat/all'
    },
    // {
    //   name: "Pending",
    //   path: '/chat/pending'
    // },
    // {
    //   name: "Blocked",
    //   path: '/chat/blocked'
    // }
  ]
</script>

<!-- NavBar -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<nav class="tw-flex tw-py-[12px] tw-text-white tw-bg-[#65676B]">
  <div class="tw-text-[18px] tw-font-bold tw-flex tw-gap-1 tw-px-3 tw-border-r-[1px] tw-border-black tw-items-center">
    <Person width={20} height={20} />
    <span>Friends</span>
  </div>
  <div class="tw-hidden tw-gap-2 tw-px-[8px] chat-nav:tw-flex">
    {#each navOptions as opt }
      <a href={opt.path} class={`tw-text-[18px] tw-text-gray-300 tw-font-bold tw-px-3 tw-rounded-md ${opt.path == currentPath ? "tw-bg-gray-400" : "hover:tw-bg-gray-400"}`}>
        {opt.name}
      </a>
    {/each}
  </div>
  <div class="chat-nav:tw-hidden tw-flex tw-flex-1 tw-justify-end tw-px-[8px] tw-items-center">
    <span on:click={() => $openChatMenu = true}>
      <Menu width={20} height={20} />
    </span>
  </div>

  <!-- When chat menu is open-->
  <div class={`tw-fixed tw-top-[60px] tw-right-0 tw-h-[100vh] tw-bg-[rgb(0,0,0)] tw-bg-[rgba(0,0,0,0.4)] tw-z-[1000] tw-w-full ${$openChatMenu ? "chat-nav:tw-hidden tw-flex" : "tw-hidden"} tw-transition-all tw-justify-end`} on:click={() => $openChatMenu = false}>
    <div class="tw-h-full tw-bg-white tw-max-w-[300px] tw-w-full tw-shadow-lg tw-px-[16px] tw-py-[12px] tw-transition-all tw-relative" on:click={(e) => e.stopPropagation()}>
      <span on:click={() => $openChatMenu = false}>
        <Close width={30} height={30} class="tw-absolute tw-top-[10px] tw-right-0 tw-text-black" />
      </span>
      <div class="tw-text-[#0867ffe3] sm:tw-text-[60px] tw-text-[50px] tw-font-bold tw-flex tw-flex-col tw-border-b-[1px] tw-border-black">
        <span>faceClam</span>
        <span class="tw-text-[40px]" >Chat</span>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-5 tw-mt-10">
        {#each navOptions as opt }
          <a href={opt.path} class="tw-text-[30px] tw-text-black tw-font-bold tw-px-3 tw-rounded-md hover:tw-bg-gray-400">
            {opt.name}
          </a>
        {/each}
      </div>
    </div>
  </div>
</nav>