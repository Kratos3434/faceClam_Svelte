<script lang="ts">
	import { viewShares } from "$lib";
	import { createQuery } from "@tanstack/svelte-query";
  import Close from 'svelte-material-icons/Close.svelte';
	import Loading from "./Loading.svelte";
	import type { ShareProps } from "../types";
  import placeholder from '$lib/assets/placeholder.png';
	import { generateDate } from "../helpers";
	import { publicBaseURL } from "../env";

  const getShares = async (): Promise<ShareProps[]> => {
    const res = await fetch(`${publicBaseURL}/share/post/${$viewShares.postId}`);
    const data = await res.json();
    return data.data;
  }

  const query = createQuery({
    queryKey: ['shares', $viewShares.postId],
    queryFn: getShares
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-max-h-[100vh] tw-h-full tw-py-5 tw-px-[16px] tw-bg-[rgb(0,0,0)] tw-bg-[rgba(0,0,0,0.4)] tw-z-[1000]" 
on:click={() => $viewShares.status = false}>
  <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full">
    <div class="tw-rounded-md tw-max-w-[550px] tw-w-full tw-shadow-md tw-bg-white tw-px-[16px] tw-py-[12px]" on:click={(e) => e.stopPropagation()}>
      <div class="tw-flex tw-justify-between tw-items-center">
        <span class="tw-px-[16px] hover:tw-rounded-md hover:tw-bg-gray-200 tw-cursor-pointer tw-h-full tw-flex tw-items-center tw-font-bold tw-text-[20px]">
          People who shared This
        </span>
        <span class="tw-cursor-pointer" on:click={() => $viewShares.status = false}>
          <Close width={20} height={20} />
        </span>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-5 tw-py-5">
        {#if $query.status !== 'success'}
          <Loading width={70} height={70} />
        {:else}
          {#if $query.data.length === 0}
            <span>Nobody has shared this post yet</span>
          {:else}
            {#each $query.data as share }
              <div class="tw-w-full tw-rounded-md tw-shadow-xl tw-border-[1px] tw-px-[16px] tw-py-[12px]">
                <div class="tw-flex tw-gap-2 tw-items-center">
                  <a href={`/${share.originalPost.author.firstName}.${share.originalPost.author.lastName}.${share.originalPost.author.id}`} class="tw-rounded-[50%] tw-shrink-0">
                    <img src={share.originalPost.author.profilePicture ? share.originalPost.author.profilePicture : placeholder} width="40" height="40" alt={`${share.originalPost.author.firstName} ${share.originalPost.author.lastName}`} class="tw-rounded-[50%] tw-shrink-0 tw-w-[40px] tw-h-[40px]" />
                  </a>
                  <div class="tw-flex tw-flex-col tw-justify-between">
                    <a href={`/${share.originalPost.author.firstName}.${share.originalPost.author.lastName}.${share.originalPost.author.id}`}>
                      <span class="tw-text-[15px] tw-font-bold hover:tw-underline">{share.originalPost.author.firstName} {share.originalPost.author.lastName}</span>
                    </a>
                    <span class="tw-text-[13px] tw-text-[#65676B]">{generateDate(share.originalPost.createdAt)}</span>
                  </div>
                </div>
                <div class="tw-py-2">{share.originalPost.description}</div>
                <!-- <div class="tw-flex tw-justify-center tw-rounded-md hover:tw-bg-gray-200 tw-cursor-pointer tw-py-2 active:tw-scale-[.99] active:tw-bg-blue-200">
                  <span class="tw-text-[#0064D1] tw-font-semibold">Show Attachment</span>
                </div> -->
              </div>
            {/each}
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>