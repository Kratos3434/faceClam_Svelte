<script lang="ts">
	import type { PostProps, UserProps } from "../types";
  import Edit from 'svelte-material-icons/Pencil.svelte';
  import Clock from 'svelte-material-icons/Clock.svelte';
	import { monthToString } from "../helpers";
	import WhatsOnYourMind from "./WhatsOnYourMind.svelte";
	import { openAddPost, openAddStatus } from "$lib";
	import AddPost from "./AddPost.svelte";
	import AddStatus from "./AddStatus.svelte";
  import { createQuery } from "@tanstack/svelte-query";
	import Loading from "./Loading.svelte";
	import PostCard from "./PostCard.svelte";
	import { publicBaseURL } from "../env";
	import HomeProfileSideNav from "./HomeProfileSideNav.svelte";

  export let user: UserProps;
  export let token: string | undefined;
  export let posts: PostProps[];

  const getPostsByUserId = async () => {
    const res = await fetch(`${publicBaseURL}/post/user/${user.id}`);
    const data = await res.json();
    return data.data;
  }

  const query = createQuery({
    queryKey: ['userPosts', user.id],
    queryFn: () => getPostsByUserId()
  });

</script>

<div class="tw-flex tw-flex-col tw-items-center tw-mt-5 tw-w-full">
  <div class="tw-flex homeprof-md:tw-gap-7 tw-gap-4 homeprof-md:tw-items-start tw-w-full tw-px-[16px] homeprof-md:tw-flex-row tw-flex-col tw-items-center tw-justify-center">
    <!-- Left side -->
    <HomeProfileSideNav {user} {token} {posts} />
    <!-- Left side end-->

    <!-- Right side -->
    <div class="tw-flex tw-flex-col tw-gap-4 tw-max-w-[680px] tw-w-full">
      {#if $query.isLoading}
        <div class="tw-flex tw-justify-center">
          <Loading width={70} height={70} />
        </div>
      {:else if $query.isError}
        <p>Something went wrong :{"("}</p>
      {:else if $query.isSuccess}
        <WhatsOnYourMind user={user} />
        {#each $query.data as post}
          <PostCard {post} currentUser={user} {token} />
        {/each}
        <hr class="tw-my-1" />
        <div class="tw-pb-2 tw-text-center">
          <small>
            &copy; faceClam &#8226; Copyright 2024 &#8226; All rights reserved
          </small>
        </div>
      {/if}
    </div>
    <!-- Right side end-->
  </div>
</div>

{#if $openAddPost}
  <AddPost {user} {token} />
{/if}

{#if $openAddStatus}
  <AddStatus {user} {token} />
{/if}