<script lang="ts">
	import { monthToString } from "../helpers";
	import type { UserProps } from "../types";
  import Clock from 'svelte-material-icons/Clock.svelte';
  import { createQuery } from "@tanstack/svelte-query";
  import Loading from "./Loading.svelte";
  import PostCard from "./PostCard.svelte";
	import { publicBaseURL } from "../env";

  export let user: UserProps;
  export let token: string | undefined;
  export let currentUser: UserProps;

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
  <div class="tw-flex tw-gap-7 homeprof-md:tw-items-start tw-w-full tw-px-[16px] homeprof-md:tw-flex-row tw-flex-col tw-items-center tw-justify-center">
    <!-- Left side -->
    <div class="tw-flex tw-flex-col tw-px-[16px] tw-py-[20px] tw-rounded-md tw-bg-white tw-shadow-md tw-gap-5 homeprof-md:tw-max-w-[490px] tw-max-w-[680px] tw-w-full">
      <span class="tw-text-[20px] tw-font-bold">
        Intro
      </span>
      {#if !user.bio}
        <div class="tw-text-center tw-text-[15px]">
          <div class="tw-flex tw-flex-col tw-gap-1 tw-py-2">
            <div class="tw-py-2 tw-break-words">
              No Bio
            </div>
          </div>
        </div>
      {:else}
        <div class="tw-text-center tw-text-[15px]">
          <div class="tw-flex tw-flex-col tw-gap-1 tw-py-2">
            <div class="tw-py-2 tw-break-words">
              {user.bio}
            </div>
          </div>
          <hr />
        </div>
      {/if}
      <div class="tw-flex tw-gap-2 tw-items-center">
        <Clock class="tw-text-gray-400" />
        <span>
          Joined {monthToString(new Date(user.createdAt).getMonth())} {new Date(user.createdAt).getFullYear()}
        </span>
      </div>
    </div>
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
        <div class="tw-py-2 tw-text-center tw-font-bold">
          <p>You are updated :{")"}</p>
        </div>
      {/if}
    </div>
    <!-- Right side end-->
  </div>
</div>