<script lang="ts">
	import type { PostProps } from "../types";
  import placeholder from '$lib/assets/placeholder.png';
  import Unsave from 'svelte-material-icons/BookmarkOffOutline.svelte';
	import { useQueryClient } from "@tanstack/svelte-query";
  import { userBaseURL } from "../env";
  import Play from 'svelte-material-icons/PlayCircleOutline.svelte';

  export let post: PostProps;
  export let token: string | undefined;
  export let savedId: number;

  const postLink = `/${post.author.firstName}.${post.author.lastName}.${post.author.id}/posts/${post.id}`
  let loading = false;
  const queryClient = useQueryClient();

  const handleUnsave = async () => {
    loading = true;
    const res = await fetch(`${userBaseURL}/saved/${savedId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['saved', post.id], exact: true
      });
      
      await queryClient.invalidateQueries({
        queryKey: ['saved'],
        exact: true
      });

      loading = false;
    } else {
      loading = false;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="saved-sm:tw-max-h-[176px] tw-h-full tw-flex tw-p-[16px] tw-bg-white tw-rounded-md tw-shadow-md tw-gap-3 tw-w-full saved-sm:tw-flex-row tw-flex-col">
  <a href={postLink} class="tw-shrink-0">
    {#if post.featureImage}
      {#if post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4'}
        <div class="tw-relative tw-bg-black tw-w-[144px] tw-h-[144px] tw-rounded-md tw-flex tw-justify-center tw-items-center">
          <Play width={55} height={55} color="white" class="" />
        </div>
      {:else}
        <img src={post.featureImage} width={144} height={144} alt={post.description} class="tw-w-[144px] tw-h-[144px] tw-rounded-md" />
      {/if}
    {:else}
      <img src={post.author.profilePicture ? post.author.profilePicture : placeholder} width="144" height="144" alt={post.description} class="tw-w-[144px] tw-h-[144px] tw-rounded-md" />
    {/if}
  </a>
  <div class="tw-flex tw-flex-col tw-justify-between">
    <div class="tw-flex tw-flex-col tw-gap-2">
      <a class="sm:tw-text-[20px] tw-text-[17px] tw-font-bold tw-break-all tw-whitespace-normal hover:tw-underline" href={postLink}>
        {post.description}
      </a>
      <div class="tw-flex tw-gap-2">
        <a href={postLink}>
          <img src={post.author.profilePicture ? post.author.profilePicture : placeholder} width="24" height="24" alt={`${post.author.firstName} ${post.author.lastName}`} class="tw-rounded-[50%] tw-w-[24px] tw-h-[24px] tw-shrink-0" />
        </a>
        <span class="tw-text-[13px] tw-text-gray-400">
          Saved from
        </span>
        <a class="tw-text-black tw-font-bold hover:tw-underline tw-text-[13px]" href={postLink}>{post.author.firstName} {post.author.lastName}'s post<span/>
      </div>
    </div>
    <div class="tw-flex tw-px-[16px]">
      <div class={`tw-flex tw-justify-center tw-items-center tw-px-[16px] tw-rounded-md tw-bg-gray-200 tw-py-[8px] tw-cursor-pointer hover:tw-brightness-95 tw-gap-1 ${loading && "tw-animate-pulse"}`} on:click={() => !loading && handleUnsave()}>
        <Unsave width={16} height={16} />
        <span>Unsave</span>
      </div>
    </div>
  </div>
</div>