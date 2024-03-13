<script lang="ts">
  import type { PostProps, UserProps } from "../types";
  import { createQuery } from "@tanstack/svelte-query";
  import Loading from "./Loading.svelte";
  import PostCard from "./PostCard.svelte";
	import { publicBaseURL } from "../env";
	import OtherHomeProfileSideNav from "./OtherHomeProfileSideNav.svelte";

  export let user: UserProps;
  export let token: string | undefined;
  export let currentUser: UserProps;
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
    <OtherHomeProfileSideNav {user} {posts} />
    <!-- Left side end-->
    <!-- Right side-->
    <div class="tw-flex tw-flex-col tw-gap-4 tw-max-w-[680px] tw-w-full">
      <div class="tw-rounded-md tw-bg-white tw-shadow-md tw-w-full tw-flex tw-justify-center tw-px-[16px] tw-py-[20px]">
        <span class="tw-font-bold tw-text-[20px]">
          Posts
        </span>
      </div>
      {#if $query.isLoading}
        <div class="tw-flex tw-justify-center">
          <Loading width={70} height={70} />
        </div>
      {:else if $query.isError}
        <p>Something went wrong :{"("}</p>
      {:else if $query.isSuccess}
        {#each $query.data as post}
          <PostCard {post} {currentUser} {token} />
        {/each}
        <hr />
        <div class="tw-py-2 tw-text-center">
          <small>
            &copy; faceClam &#8226; Copyright 2024 &#8226; All rights reserved
          </small>
        </div>
      {/if}
    </div>
    <!-- Right side end-->
  </div>
</div>