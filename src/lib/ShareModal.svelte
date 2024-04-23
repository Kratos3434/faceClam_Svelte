<script lang="ts">
	import { openShare, postsArray, posts, likes } from '$lib';
  import Close from 'svelte-material-icons/Close.svelte';
	import type { UserProps } from '../types';
  import placeholder from '$lib/assets/placeholder.png';
  import Earth from 'svelte-material-icons/Earth.svelte';
	import { userBaseURL } from '../env';
  import Modal from './Modal.svelte';
  import Loading from './Loading.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';

  export let currentUser: UserProps;
  export let token: string | undefined;
  let divEl: any;
  let description = "";
  let error = "";
  let loading = false;
  const queryClient = useQueryClient();

  const handleDescription = () => {
    description = divEl.innerText;
  }

  const handleShare = async () => {
    // console.log('Shared description:', description);
    if (!description) {
      error = "description is required";
      return false;
    } else {
      error = "";
    }
    console.log($openShare.postId)
    try {
      loading = true;
      const res = await fetch(`${userBaseURL}/share/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        description,
        postId: $openShare.postId
      })
      });

      const data = await res.json();

      if (data.status) {
        // await queryClient.invalidateQueries({
        //   queryKey: ['posts'],
        //   refetchType: 'active'
        // });

        $postsArray[0].unshift(data.data);
        $likes.set(data.data.id, data.data.likes);
        $postsArray = $postsArray;
      
        $posts.set(data.data.id, data.data);
        $posts = $posts;

        $openShare.postId = -1;
        $openShare.status = false;
      } else {
        error = data.error;
        loading = false;
      }
    } catch (err) {
      error = "Something went wrong :(";
      loading = false;
    }
  }
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
      <div class="tw-flex tw-gap-3 tw-items-center tw-p-[16px]">
        <img src={currentUser.profilePicture ? currentUser.profilePicture : placeholder} width="40" height="40" alt={`${currentUser.firstName} ${currentUser.lastName}`} 
        class="tw-rounded-[50%]" />
        <div class="tw-flex tw-flex-col">
          <span class="tw-text-[15px] tw-font-bold">{currentUser.firstName} {currentUser.lastName}</span>
          <div class="tw-flex tw-items-center tw-gap-1 tw-rounded-md tw-bg-gray-200 tw-px-1">
            <Earth width={12} height={12} />
            <span class="tw-text-[13px]">Public</span>
          </div>
        </div>
      </div>
      <div class="tw-px-[16px]">
        <div contenteditable={true} spellcheck="false" class="tw-w-full tw-outline-none tw-resize-none tw-relative statusBox tw-cursor-text" aria-label={`Say something about this...`} tabindex={0} role="textbox" placeholder={`Say something about this...`} bind:this={divEl} on:input={handleDescription}>
        </div>
      </div>
      {#if error}
        <small class="tw-px-[16px] tw-text-red-500">*{error}</small>
      {/if}
      <div class="tw-flex tw-justify-end tw-p-[16px]">
        <button class="tw-flex tw-justify-center tw-items-center tw-text-white tw-font-bold tw-bg-[rgb(8,102,255)] tw-px-[40px] tw-rounded-md tw-text-[15px] tw-h-full tw-py-2" on:click={handleShare}>
          Share now
        </button>
      </div>
    </div>
  </div>
</div>

{#if loading}
  <Modal>
    <Loading width={70} height={70} />
    <span class="tw-text-white tw-font-bold tw-text-[18px] tw-pt-3">
      This may take a while, please wait...
    </span>
  </Modal>
{/if}