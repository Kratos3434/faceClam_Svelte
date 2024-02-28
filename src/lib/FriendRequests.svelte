<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import Loading from "./Loading.svelte";
	import type { FriendRequestProps } from "../types";
	import { userBaseURL } from "../env";

  export let token: string | undefined;

  const getFriendRequests = async (): Promise<FriendRequestProps[]> => {
    const res = await fetch(`${userBaseURL}/current/friendrequests`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const d = await res.json();
    return d.data;
  }

  const query = createQuery({
    queryKey: ['friendRequests'],
    queryFn: () => getFriendRequests(),
    staleTime: Infinity
  });
</script>

<span class="tw-text-[17px] tw-text-[#65676B] tw-font-bold tw-px-[16px]">Friend requests</span>
{#if $query.isLoading}
  <div class="tw-w-full tw-flex tw-justify-center">
    <Loading width={25} height={25} />
  </div>
{:else if $query.isError}
  <p>Something went wrong :{"("}</p>
{:else if $query.isSuccess}
  {#if $query.data.length === 0}
    <p>something went wrong :{"("}</p>
  {:else}
    {#each $query.data as e }
      <div class="tw-flex tw-gap-2">
        <a href={`/${e.requester.firstName}.${e.requester.lastName}.${e.requester.id}`}>
          <img src={e.requester.profilePicture ? e.requester.profilePicture : ""} width={46} height={46} alt={`${e.requester.firstName} ${e.requester.lastName}`} class="tw-rounded-[1000px]" />
        </a>
      </div>
    {/each}
  {/if}
{/if}