<script lang="ts">
  // export let token: string | undefined;

  import { page } from '$app/stores';
  import logo from '$lib/assets/clam.png';
  import Magnify from 'svelte-material-icons/Magnify.svelte';
  import Menu from 'svelte-material-icons/Menu.svelte';
  import Apps from 'svelte-material-icons/Apps.svelte';
  import Chat from 'svelte-material-icons/Chat.svelte';
  import Bell from 'svelte-material-icons/Bell.svelte';
	import placeholder from '$lib/assets/placeholder.png';
  import MenuDown from 'svelte-material-icons/MenuDown.svelte';
  import Home from 'svelte-material-icons/Home.svelte';
  import Television from 'svelte-material-icons/Television.svelte';
  import Store from 'svelte-material-icons/Store.svelte';
  import Close from 'svelte-material-icons/Close.svelte';
  import Logout from 'svelte-material-icons/Logout.svelte';
  import Login from 'svelte-material-icons/Login.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { UserProps } from '../types';
	import { socket } from '../socket';
  import { openMenu } from '$lib';
  
  export let user: UserProps | null = null;
  let showModal = false;

  const links = [
    {
      path: '/',
      icon: Home,
      name: 'Home'
    },
    {
      path: '/watch',
      icon: Television,
      name: 'Watch'
    },
    {
      path: '/marketplace',
      icon: Store,
      name: 'Marketplace'
    }
  ]

  const logout = async () => {
    const res = await fetch('/apv2/logout');

    const data = await res.json();

    if (data.status) {
      // invalidateAll().then(() => goto("/login"));
      goto("/login").then(() => {
        socket.disconnect();
        invalidateAll();
      });
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<nav class="tw-fixed tw-top-0 tw-w-full tw-px-[16px] tw-bg-white tw-pt-[6px] tw-shadow-md tw-z-[1000]">
  <div class="tw-flex tw-justify-between tw-relative tw-h-[52px]">
    <div class="tw-flex tw-gap-[8px] tw-items-center tw-absolute tw-left-0">
      <a href="/" class="tw-w-[40px] tw-h-[40px]">
        <img src={logo} width="40" height="40" alt="faceClam logo" />
      </a>
      <form>
        <div class="tw-flex tw-items-center tw-rounded-[1000px] tw-bg-[#F0F2F5] nav-ssm:tw-pl-2 nav-ssm:tw-w-full nav-ssm:tw-h-full tw-w-[40px] tw-py-[7px] tw-justify-center nav-ssm:tw-py-0">
          <Magnify width={16} height={16} />
          <input type="text" placeholder="Search faceClam" class="tw-max-w-[212px] tw-w-full tw-px-[8px] tw-pt-[7px] tw-pb-[9px] tw-bg-[#F0F2F5] tw-rounded-[1000px] tw-outline-none nav-ssm:tw-block tw-hidden" />
        </div>
      </form>
      <button class="tw-flex tw-flex-col tw-justify-center nav-xl:tw-hidden tw-cursor-pointer" on:click={() => $openMenu = true}>
        <Menu width={24} height={24} />
      </button>
    </div>
    <div class="tw-flex tw-justify-center tw-w-full tw-hh-[52px]">
      <div class="nav-xl:tw-flex tw-items-center tw-hidden tw-h-full tw-gap-2">
        {#each links as link}
          <a href={link.path} class={`tw-flex tw-justify-center tw-w-[111.59px] tw-h-full tw-items-center hover:tw-rounded-md hover:tw-bg-gray-200 tw-transition-all tw-border-b-[4px] ${$page.url.pathname === link.path ? "tw-border-[#0866FF]" : "tw-border-white"}`} title={link.name}>
            <svelte:component this={link.icon} class={`tw-w-[22px] tw-h-[22px] ${$page.url.pathname === link.path ? "tw-text-[#0866FF]" : "tw-text-[#65676B]"}`} />
          </a>
        {/each}
      </div>
    </div>
    <div class="tw-flex tw-items-center tw-gap-2 tw-absolute tw-right-0">
      <div class="tw-rounded-[1000px] tw-bg-[#F0F2F5] tw-p-2 tw-cursor-pointer hover:tw-bg-gray-200 active:tw-scale-[.9] tw-overflow-hidden tw-transition-all nav-sm:tw-block tw-hidden">
        <Apps width={20} height={20} />
      </div>
      <div class="tw-rounded-[1000px] tw-bg-[#F0F2F5] tw-p-2 tw-cursor-pointer hover:tw-bg-gray-200 active:tw-scale-[.9] tw-overflow-hidden tw-transition-all nav-sm:tw-block tw-hidden">
        <Chat width={20} height={20} />
      </div>
      <div class="tw-rounded-[1000px] tw-bg-[#F0F2F5] tw-p-2 tw-cursor-pointer hover:tw-bg-gray-200 active:tw-scale-[.9] tw-overflow-hidden tw-transition-all nav-sm:tw-block tw-hidden">
        <Bell width={20} height={20} />
      </div>
      <button class="tw-relative" on:click={() => showModal = !showModal}>
        <img src={user && user.profilePicture ? user.profilePicture : placeholder} width="36" height="40" alt="profile pic" class="tw-rounded-[50%] tw-bg-[#F0F2F5] tw-cursor-pointer hover:tw-bg-gray-200 active:tw-scale-[.9] tw-overflow-hidden tw-transition-all tw-h-[40px]" />
        <MenuDown class="tw-w-[14px] tw-h-[14px] tw-absolute tw-bottom-0 tw-right-0 tw-rounded-[1000px] tw-bg-gray-300 tw-cursor-pointer" />
      </button>
    </div>
  </div>
  <div class={`tw-fixed  tw-left-0 tw-top-0 tw-w-full tw-h-full tw-overflow-auto tw-bg-[rgb(0,0,0)] tw-bg-[rgba(0,0,0,0.4)] ${$openMenu ? 'tw-hidden nav-xxl:tw-block ' : 'tw-hidden '} tw-cursor-default`} on:click={() => $openMenu = false}>
    <div class="tw-bg-white tw-shadow-2xl tw-h-full tw-p-5 tw-pr-0 tw-flex tw-flex-col tw-ease-out tw-duration-[0.5s] tw-gap-10 tw-max-w-[300px] tw-w-full tw-cursor-default" on:click={(e) => e.stopPropagation()}>
      <div class="tw-flex tw-justify-end tw-p-5">
        <button on:click={() => $openMenu = false}>
          <Close width={30} height={30} class="tw-cursor-pointer" />
        </button>
      </div>
      {#each links as link}
        <a href={link.path} class={`tw-text-[20px] tw-font-bold tw-border-r-[4px] ${$page.url.pathname === link.path ? "tw-border-[#0866FF]" : "tw-border-white"} tw-w-full tw-text-start`}>
          {link.name}
        </a>
      {/each}
    </div>
  </div>
  {#if showModal}
    <button class="tw-fixed  tw-left-0 tw-top-[58px] tw-w-full tw-h-full tw-overflow-auto tw-px-3 tw-cursor-default" on:click={() => showModal = false}>
      <div class="tw-absolute tw-right-0 tw-top-[5px] tw-pr-2">
        <div class="tw-rounded-md tw-bg-white tw-w-[360px] tw-shadow-md tw-flex tw-flex-col tw-text-[15px] tw-text-black tw-font-bold tw-px-[8px] tw-py-[12px] tw-gap-3">
          {#if user}
            <div class="tw-rounded-md tw-shadow-xl tw-p-1">
              <a class="tw-flex tw-gap-2 tw-py-[12px] tw-px-[8px] tw-items-center hover:tw-bg-gray-200 tw-rounded-md" href={`/${user.firstName}.${user.lastName}.${user.id}`}>
                <img src={user.profilePicture ? user.profilePicture : placeholder} width={36} height={36} alt={`${user.firstName} ${user.lastName}`} class="tw-rounded-[1000px] tw-w-[36px] tw-h-[36px]" />
                <span class="tw-text-[17px] tw-font-bold">
                  {user.firstName} {user.lastName}
                </span>
              </a>
            </div>

            <div class="tw-px-[8px] tw-flex tw-py-[12px] tw-items-center tw-gap-2 hover:tw-rounded-md hover:tw-bg-gray-200 tw-cursor-pointer" on:click={logout}>
              <div class="tw-rounded-[1000px] tw-bg-[#F0F2F5] tw-p-1">
                <Logout width={20} height={20} />
              </div>
              <span>Log Out</span>
            </div>
          {:else}
            <a href="/login" class="tw-px-[8px] tw-flex tw-py-[12px] tw-items-center tw-gap-2 hover:tw-rounded-md hover:tw-bg-gray-200 tw-cursor-pointer">
              <div class="tw-rounded-[1000px] tw-bg-[#F0F2F5] tw-p-1">
                <Login width={20} height={20} />
              </div>
              <span>Log In</span>
            </a>
          {/if}
        </div>
      </div>
    </button>
  {/if}
</nav>