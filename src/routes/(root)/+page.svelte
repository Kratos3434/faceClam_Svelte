<script lang="ts">
  import HomeSideNav from "$lib/HomeSideNav.svelte";
	import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import { likes, openPopup, posts, postsArray } from "$lib";
	import { publicBaseURL } from "../../env";
	import PostCard from "$lib/PostCard.svelte";
	import Loading from "$lib/Loading.svelte";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
	import WhatsOnYourMind from "$lib/WhatsOnYourMind.svelte";
	import FriendRequests from "$lib/FriendRequests.svelte";
  import { lastCreated } from "$lib";
	import type { PostProps } from "../../types";
  import { inview } from 'svelte-inview';

  export let data: LayoutData;

  let limit = 4;
  
  const getPosts = async ({ pageParam }: { pageParam: string }): Promise<{
    data: PostProps[];
    currentPage: string;
    nextPage: string | null
  }> => {
    let fetchSum = "";
    if (!pageParam) {
      fetchSum = `${publicBaseURL}/post/limit?limit=${limit}`;
    } else {
      fetchSum = `${publicBaseURL}/post/limit?limit=${limit}&lastCreatedAt=${$lastCreated}`;
    }

    const res = await fetch(fetchSum);
    const data = await res.json();
    if (data.data.length === limit) {
      $lastCreated = data.data[data.data.length-1].createdAt;
    } else {
      $lastCreated = null;
    }
    // console.log(`Last created: ${$lastCreated}`)

    data.data.map((e: PostProps) => {
      $likes.set(e.id, e.likes);
      $posts.set(e.id, e);
      if (e.content) {
        $likes.set(e.content.id, e.content.likes);
      }
    });
    
    $postsArray.push(data.data);
    $postsArray = $postsArray;

    return {
      data: data.data,
      currentPage: pageParam,
      nextPage: $lastCreated
    }
  }

  const query = createInfiniteQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false
  })

  
  onMount(() => {
    const timeout = setTimeout(() => {
      if (!data.loggedIn) {
        $openPopup = true;
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
    }
  })

  const loadMore = () => {
    if ($query.hasNextPage && !$query.isFetchingNextPage) {
      $query.fetchNextPage();
    }
  }
</script>

<svelte:head>
  <title>faceClam</title>
  <meta name="description" content="Connect with friends and the world around you on faceClam" />
</svelte:head>

<!-- <svelte:window bind:scrollY={$scrollPosition} /> -->
<div class="tw-flex tw-justify-center tw-gap-[32px] tw-pt-[70px]">
  {#if data.currentUser}
    <HomeSideNav bind:user={data.currentUser} />
  {:else}
    <HomeSideNav />
  {/if}
  <div class="tw-flex tw-flex-col tw-w-[680px] tw-gap-2 home-lg:tw-pl-0 tw-pl-5 home-xxl:tw-pl-0">
    {#if $query.isPending}
      <div class="tw-w-full tw-flex tw-justify-center">
        <Loading width={25} height={25} />
      </div>
    {:else if $query.isError}
      <p>Something went wrong :{"("}</p>
    {:else if $query.isSuccess}
      {#if data.currentUser}
        <WhatsOnYourMind bind:user={data.currentUser} />
      {/if}
      <!-- {#each $query.data.pages as pos }
        {#each pos.data as post }
          <PostCard post={$posts.get(post.id)} currentUser={data.currentUser} token={data.token} />
        {/each}
      {/each} -->
      {#each $postsArray as pos }
        {#each pos as post }
          {#if $posts.get(post.id)}
            <PostCard post={$posts.get(post.id)} currentUser={data.currentUser} token={data.token} />
          {/if}
        {/each}
      {/each}
      <div class="tw-py-5" use:inview on:inview_enter={loadMore}>
        {#if $query.isFetchingNextPage}
          <div class="tw-flex tw-justify-center">
            <Loading width={50} height={50} />
          </div>
        {:else if !$query.hasNextPage}
          <hr />
          <div class="tw-py-5 tw-flex tw-justify-center">
            <span>You are updated :{")"}</span>
          </div>
        {/if}
      </div>
    {/if}
  </div>
  <div class="home-xl:tw-flex tw-flex-col tw-hidden tw-w-[300px] tw-sticky tw-top-[70px] tw-h-full tw-z-0 tw-gap-3">
    <!-- Sponsors -->
    <span class="tw-text-[17px] tw-text-[#65676B] tw-font-bold tw-px-[16px]">Sponsored</span>
    <div class="tw-w-full tw-px-[16px] tw-py-2 tw-flex tw-gap-2 tw-h-full hover:tw-bg-gray-300 tw-cursor-pointer tw-rounded-md">
      <img src="https://d3d0lqu00lnqvz.cloudfront.net/media/Twitter_Cards/Raptors.jpg" width={99} height={99} alt="Wild Wings" class="tw-w-[99px] tw-h-[99px] tw-rounded-md"/>
      <span class="tw-text-[15px] tw-font-bold">Proud sponsor of the Toronto Raptors</span>
    </div>
    <!-- Sponsors End -->
    <!-- Friend Requests -->
    {#if data.currentUser}
      <FriendRequests token={data.token} />
    {/if}
    <!-- Friend Requests end -->
  </div>
</div>


