<script lang="ts">
  import HomeSideNav from "$lib/HomeSideNav.svelte";
	import { onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import { openPopup } from "$lib";
	import { publicBaseURL } from "../../env";
	import PostCard from "$lib/PostCard.svelte";
	import Loading from "$lib/Loading.svelte";
  import { createQuery } from "@tanstack/svelte-query";
	import WhatsOnYourMind from "$lib/WhatsOnYourMind.svelte";
	import FriendRequests from "$lib/FriendRequests.svelte";

  export let data: LayoutData;

  const getPosts = async () => {
    const res = await fetch(`${publicBaseURL}/post/list`);
    const data = await res.json();
    return data.data;
  }

  const query = createQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
    staleTime: 240000
  });

  onMount(() => {
    const timeout = setTimeout(() => {
      if (!data.loggedIn) {
        $openPopup = true;
      }
    }, 5000);

    return () => clearTimeout(timeout);
  })


</script>

<svelte:head>
  <title>faceClam</title>
</svelte:head>

<div class="tw-flex tw-justify-center tw-gap-[32px] tw-pt-[70px]">
  {#if data.currentUser}
    <HomeSideNav user={data.currentUser} />
  {:else}
    <HomeSideNav />
  {/if}
  <div class="tw-flex tw-flex-col tw-w-[680px] tw-gap-4 home-lg:tw-pl-0 tw-pl-5 home-xxl:tw-pl-0">
    {#if $query.isLoading}
      <div class="tw-w-full tw-flex tw-justify-center">
        <Loading width={25} height={25} />
      </div>
    {:else if $query.isError}
      <p>Something went wrong :{"("}</p>
    {:else if $query.isSuccess}
      {#if data.currentUser}
        <WhatsOnYourMind user={data.currentUser} />
      {/if}
      {#each $query.data as post }
        <PostCard post={post} currentUser={data.currentUser} token={data.token} />
      {/each}
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


