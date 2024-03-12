<script lang="ts">
  import Modal from '$lib/Modal.svelte';
  import Close from 'svelte-material-icons/Close.svelte';
	import type { UserProps } from '../types';
  import placeholder from '$lib/assets/placeholder.png';
  import Public from 'svelte-material-icons/Earth.svelte';
	import Loading from './Loading.svelte';
	import { openAddStatus } from '$lib';
	import { userBaseURL } from '../env';
  import { useQueryClient } from '@tanstack/svelte-query';

  export let user: UserProps;
  export let token: string | undefined;

  let divEl: any;
  let description = "";
  let loading = false;
  let error = "";
  const queryClient = useQueryClient();

  const handleDescription = () => {
    description = divEl.innerText;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    loading = true;
    if (!description) {
      error = "Description is required";
      loading = false;
      return false;
    }

    const formdata: any = new FormData();
    formdata.append("description", description);

    const res = await fetch(`${userBaseURL}/add/post`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formdata
    });

    const data = await res.json();

    if (!data.status) {
      error = data.error;
      loading = false;
    } else {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
        refetchType: 'active'
      });
      
      queryClient.invalidateQueries({
        queryKey: ['userPosts', user.id],
        refetchType: 'active',
        exact: true
      })
      $openAddStatus = false;
    }
  }
</script>

<Modal>
  <div class="tw-rounded-md tw-bg-white tw-shadow-lg tw-max-w-[500px] tw-w-full tw-pb-2">
    <div class="tw-relative tw-p-2 tw-text-[20px] tw-font-bold tw-text-center">
      <span>Create post</span>
      <button class="tw-absolute tw-top-0 tw-right-0 tw-px-[16px] tw-pt-2 tw-cursor-pointer" on:click={() => $openAddStatus = false}>
        <Close width={24} height={24} />
      </button>
    </div>
    <hr />
    <div class="tw-flex tw-flex-col tw-px-[16px]">
      <div class="tw-flex tw-justify-start tw-gap-2 tw-items-center tw-py-[16px]">
        <a href={`${user.firstName}.${user.lastName}.${user.id}`}>
          <img src={user.profilePicture ? user.profilePicture : placeholder} width="40" height="40" class="tw-w-[40px] tw-h-[40px] tw-rounded-[1234px]" alt={`${user.firstName} ${user.lastName}`} />
        </a>
        <div class="tw-flex tw-flex-col">
          <a href={`${user.firstName}.${user.lastName}.${user.id}`} class="tw-text-[15px] tw-text-black tw-font-[500] hover:tw-underline">
            {user.firstName} {user.lastName}
          </a>
          <div class="tw-flex tw-px-[8px] tw-py-[4px] tw-items-center tw-rounded-md tw-bg-gray-200 tw-gap-1">
            <Public width={12} height={12} />
            <span class="tw-text-[13px]">Public</span>
          </div>
        </div>
      </div>
      <form class="tw-flex tw-flex-col tw-gap-5" on:submit={handleSubmit}>
        <div contenteditable={true} spellcheck="false" class="tw-w-full tw-outline-none tw-resize-none tw-relative statusBox tw-cursor-text" aria-label={`What's on your mind ${user.firstName}`} tabindex={0} role="textbox" placeholder={`What's on your mind, ${user.firstName}`} bind:this={divEl} on:input={handleDescription}>

        </div>
        {#if description && !loading}
          <button class="tw-text-center tw-rounded-md tw-bg-[#0866FF] tw-text-[15px] tw-text-black tw-font-bold tw-py-2">
            Post
          </button>
        {:else}
          <span class="tw-text-center tw-rounded-md tw-bg-gray-200 tw-text-[15px] tw-text-gray-400 tw-font-bold tw-py-2 tw-cursor-not-allowed">
            Post
          </span>
        {/if}
      </form>
    </div>
  </div>
</Modal>

{#if loading}
  <Modal>
    <Loading width={70} height={70} />
    <span class="tw-text-white tw-font-bold tw-text-[18px] tw-pt-3">
      This may take a while, please wait...
    </span>
  </Modal>
{/if}