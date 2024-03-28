<script lang="ts">
	import { openMore } from "$lib";
  import Saved from 'svelte-material-icons/Bookmark.svelte';
  import Trash from 'svelte-material-icons/DeleteEmpty.svelte';
  import Close from 'svelte-material-icons/Close.svelte';
  import type { UserProps } from "../types";
	import Modal from "./Modal.svelte";
	import { userBaseURL } from "../env";
	import { invalidate } from "$app/navigation";
  import { createQuery, useQueryClient } from "@tanstack/svelte-query";
	import Loading from "./Loading.svelte";

  export let currentUser: UserProps;
  export let token: string | undefined;

  const queryClient = useQueryClient();

  const checkIfSaved = async () => {
    const res = await fetch(`${userBaseURL}/saved/${$openMore.post?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    return data.data;
  }

  const query = createQuery({
    queryKey: ['saved', $openMore.post?.id],
    queryFn: checkIfSaved,
    staleTime: Infinity
  });

  let openConfModal = false;
  let isLoading = false;
  let saveLoader = false;
  
  const handleDelete = async () => {
    isLoading = true;
    const res = await fetch(`${userBaseURL}/delete/post/${$openMore.post?.id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['posts'],
        refetchType: 'active'
      });

      await queryClient.invalidateQueries({
        queryKey: ['userPosts', currentUser.id],
        exact: true
      });
      
      await invalidate('app:name');

      $openMore.status = false;
    } else {
      isLoading = false;
    }
  }

  const handleSave = async () => {
    saveLoader = true;
    const res = await fetch(`${userBaseURL}/saved/${$openMore.post?.id}`, {
      method: 'POST',
      headers: {
        "Content-Type": `application/json`,
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['saved', $openMore.post?.id], exact: true
      })
      saveLoader = false;
    } else {
      saveLoader = false;
    }
  }

  const handleUnsave = async () => {
    saveLoader = true;
    const res = await fetch(`${userBaseURL}/saved/${$query.data.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['saved', $openMore.post?.id], exact: true
      })
      saveLoader = false;
    } else {
      saveLoader = false;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-[100vh] tw-py-5 tw-px-[16px] tw-bg-[rgb(0,0,0)] tw-bg-[rgba(0,0,0,0.4)] tw-z-[1000]" on:click={() => {
  $openMore.status = false
}}>
  <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full">
    <div class="tw-max-w-[500px] tw-w-full tw-px-[16px] tw-py-[12px] tw-rounded-md tw-bg-white tw-shadow-lg tw-flex tw-flex-col tw-items-center tw-gap-3 tw-font-bold tw-relative" on:click={(e) => e.stopPropagation()}>
      <span class="tw-absolute tw-right-[16px] tw-font-bold tw-text-[20px] tw-cursor-pointer" on:click={() => $openMore.status = false}>
        <Close />
      </span>
      <span class="tw-text-[20px] tw-border-b-[1px] tw-border-black tw-w-full tw-p-2 tw-text-center">
        More Options
      </span>
      <!--Saved-->
      {#if $query.status === 'success'}
        {#if !$query.data}
          <div class={`tw-flex tw-gap-3 tw-justify-center tw-w-full tw-items-center tw-text-[20px] tw-rounded-md tw-cursor-pointer tw-p-2 ${saveLoader ? "tw-bg-gray-500 tw-animate-pulse" : "hover:tw-bg-gray-200"}`} 
          on:click={() => !saveLoader && handleSave()}>
            <svelte:component this={Saved} color={"#BE45C5"} />
            <span>Save</span>
          </div>
        {:else}
          <div class={`tw-flex tw-gap-3 tw-justify-center tw-w-full tw-items-center tw-text-[20px] tw-rounded-md tw-cursor-pointer tw-p-2 ${saveLoader ? "tw-bg-gray-500 tw-animate-pulse" : "hover:tw-bg-gray-200"}`} 
          on:click={() => !saveLoader && handleUnsave()}>
            <svelte:component this={Saved} color={"#BE45C5"} />
            <span>Unsave</span>
          </div>
        {/if}
        <!----------------------------------------------------------------------------------------------------------------------------------------------------->
        <!--Delete-->
        {#if $openMore.post?.author.id === currentUser.id}
          <div class="tw-flex tw-gap-3 tw-justify-center tw-w-full tw-items-center tw-text-[20px] tw-rounded-md hover:tw-bg-gray-200 tw-cursor-pointer tw-p-2" 
          on:click={() => openConfModal = true}>
            <svelte:component this={Trash} color={"#FF0000"} />
            <span>Delete</span>
          </div>
        {/if}
        <!--Delete end-->
      {:else}
          <Loading width={25} height={25} />
      {/if}
      <!--Saved END-->
      {#if openConfModal}
        <Modal>
          <div class="tw-max-w-[400px] tw-w-full tw-p-3 tw-rounded-md tw-shadow-md tw-bg-white">
            <div class="tw-text-[18px] tw-font-bold tw-text-center tw-w-full tw-mb-4">Are you sure?</div>
            <div class="tw-flex tw-justify-center tw-gap-5 tw-items-center tw-text-white">
              <span class="tw-cursor-pointer tw-px-3 tw-py-1 tw-bg-[#D92428] tw-rounded-md hover:tw-brightness-90 tw-transition-all" on:click={handleDelete}>
                Delete
              </span>
              <span class="tw-cursor-pointer tw-px-3 tw-py-1 tw-bg-[#0866FF] tw-rounded-md hover:tw-brightness-90 tw-transition-all" on:click={() => openConfModal = false}>
                Cancel
              </span>
            </div>
          </div>
        </Modal>
      {/if}
      {#if isLoading}
        <Modal>
          <Loading width={70} height={70} />
        </Modal>
      {/if}
    </div>
  </div>
</div>