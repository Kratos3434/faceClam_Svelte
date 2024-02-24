<script lang="ts">
  import HomeSideNav from "$lib/HomeSideNav.svelte";
	import SigninPopUpModal from "$lib/SigninPopUpModal.svelte";
	import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import { openPopup, openAddPost, openAddStatus, viewLikes, viewPost } from "$lib";
	import { publicBaseURL } from "../../env";
	import PostCard from "$lib/PostCard.svelte";
	import type { PostProps } from "../../types";
	import Loading from "$lib/Loading.svelte";
  import { createQuery } from "@tanstack/svelte-query";
	import WhatsOnYourMind from "$lib/WhatsOnYourMind.svelte";
  import AddPost from '$lib/AddPost.svelte';
	import AddStatus from "$lib/AddStatus.svelte";
	import ViewLikes from "$lib/ViewLikes.svelte";
	import ViewPost from "$lib/ViewPost.svelte";

  let posts: PostProps[] | null;

  const getPosts = async () => {
    const res = await fetch(`${publicBaseURL}/post/list`);
    const data = await res.json();
    return data.data;
  }

  const query = createQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts()
  })

  onMount(() => {
    const timeout = setTimeout(() => {
      if (!data.loggedIn) {
        $openPopup = true;
      }
    }, 5000);

    return () => clearTimeout(timeout);
  })

  export let data: LayoutData;
</script>

<svelte:head>
  <title>faceClam</title>
</svelte:head>

{#if !data.loggedIn && $openPopup}
  <SigninPopUpModal />
{/if}

<div class="tw-flex tw-justify-center tw-gap-[32px] tw-pt-[70px]">
  <HomeSideNav user={data.user} />
  <div class="tw-flex tw-flex-col tw-w-[680px] tw-gap-4 home-lg:tw-pl-0 tw-pl-5 home-xxl:tw-pl-0">
    {#if $query.isLoading}
      <div class="tw-w-full tw-flex tw-justify-center">
        <Loading width={25} height={25} />
      </div>
    {:else if $query.isError}
      <p>Something went wrong :{"("}</p>
    {:else if $query.isSuccess}
      {#if data.user}
        <WhatsOnYourMind user={data.user} />
      {/if}
      {#each $query.data as post }
        <PostCard post={post} currentUser={data.user} token={data.token} />
      {/each}
    {/if}
  </div>
  <div class="home-xl:tw-flex tw-flex-col tw-hidden tw-w-[260px]">
    <span class="tw-text-[17px] tw-text-[#65676B]">Friends</span>
  </div>
  {#if $openAddPost}
    <AddPost user={data.user} token={data.token} />
  {/if}
  
  {#if $openAddStatus}
    <AddStatus user={data.user} token={data.token} />
  {/if}

  {#if $viewLikes.status}
    <ViewLikes currentUser={data.user} />
  {/if}

  {#if $viewPost.status}
    <ViewPost token={data.token} currentUser={data.user}  />
  {/if}
</div>


