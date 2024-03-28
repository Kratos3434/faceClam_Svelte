<script lang="ts">
  import Multimedia from 'svelte-material-icons/Multimedia.svelte';
	import type { LayoutData } from '../$types';
	import { createQuery } from '@tanstack/svelte-query';
	import Loading from '$lib/Loading.svelte';
  import SavedCard from '$lib/SavedCard.svelte';
  import Menu from 'svelte-material-icons/Menu.svelte';
  import Close from 'svelte-material-icons/Close.svelte';
	import { userBaseURL } from '../../../env';

  export let data: LayoutData;
  let openMenu = false;
  const getSaved = async () => {
    const res = await fetch(`${userBaseURL}/list/saved`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`
      }
    });

    const d = await res.json();

    return d.data;
  }

  const query = createQuery({
    queryKey: ['saved'],
    queryFn: getSaved,
    staleTime: Infinity
  });

</script>

<svelte:head>
  <title>Saved | faceClam</title>
  <meta name="description" content="Check out your saved posts for later" />
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="">
  <div class="tw-flex">
    <!-- Side nav -->
    <div class="tw-sticky tw-h-[100dvh] tw-top-0 tw-z-0 tw-bg-white tw-shadow-lg saved-lg:tw-max-w-[360px] tw-max-w-[60px] tw-w-full tw-pt-[70px] tw-px-[16px]">
      <div class="saved-lg:tw-block tw-hidden">
        <span class="tw-text-[24px] tw-font-bold">Saved</span>
        <div class="tw-flex tw-rounded-md tw-gap-3 tw-bg-gray-200 tw-items-center tw-p-[8px] tw-my-2 tw-cursor-pointer hover:tw-brightness-95">
          <div class="tw-rounded-[50%] tw-bg-[#1877F2] tw-w-[36px] tw-h-[36px] tw-flex tw-justify-center tw-items-center">
            <Multimedia width={20} height={20} color="white" />
          </div>
          <span class="tw-text-[15px] tw-font-semibold">Saved Items</span>
        </div>
      </div>
      <div class="saved-lg:tw-hidden tw-block" on:click={() => openMenu = true}>
        <Menu width={25} height={25} />
      </div>
    </div>
    <!-- Side nav end-->
    <div class="tw-flex tw-flex-1 tw-w-full tw-flex-col tw-px-[16px] tw-pt-[70px]">
      <div class="tw-flex tw-justify-center">
        <div class="tw-max-w-[1080px] tw-w-full">
          <div class="tw-flex tw-justify-between">
            <span class="tw-text-[20px] tw-font-bold">ALL</span>
          </div>
          <div class="tw-flex tw-flex-col tw-gap-5 tw-py-5">
            {#if $query.status !== 'success'}
              <div class="tw-flex tw-justify-center">
                <Loading width={50} height={50} />
              </div>
            {:else}
              {#each $query.data as saved }
                <SavedCard post={saved.content} />
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
  {#if openMenu}
    <div class="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-[100dvh] saved-lg:tw-hidden tw-block" on:click={() => openMenu = false}>
      <div class="tw-shadow-lg tw-bg-white tw-px-[16px] tw-py-[12px] tw-max-w-[360px] tw-w-full tw-h-full tw-pt-[70px]" on:click={(e) => e.stopPropagation()}>
        <div class="">
          <div class="tw-flex tw-justify-between tw-items-center">
            <span class="tw-text-[24px] tw-font-bold">Saved</span>
            <span on:click={() => openMenu = false}>
              <Close width={20} height={20} />
            </span>
          </div>
          <div class="tw-flex tw-rounded-md tw-gap-3 tw-bg-gray-200 tw-items-center tw-p-[8px] tw-my-2 tw-cursor-pointer hover:tw-brightness-95">
            <div class="tw-rounded-[50%] tw-bg-[#1877F2] tw-w-[36px] tw-h-[36px] tw-flex tw-justify-center tw-items-center">
              <Multimedia width={20} height={20} color="white" />
            </div>
            <span class="tw-text-[15px] tw-font-semibold">Saved Items</span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>