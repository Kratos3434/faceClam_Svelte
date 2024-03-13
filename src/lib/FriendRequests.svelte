<script lang="ts">
  import { createQuery, useQueryClient } from "@tanstack/svelte-query";
  import Loading from "./Loading.svelte";
	import type { FriendProps } from "../types";
	import { userBaseURL } from "../env";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { socket } from "../socket";
  import placeholder from '$lib/assets/placeholder.png';

  export let token: string | undefined;
  const queryClient = useQueryClient();
  // `${userBaseURL}/current/friendrequests`
  const getFriendRequests = async (): Promise<FriendProps[]> => {
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

  const acceptFriendRequest = async (id: number, email: string) => {
    const res = await fetch(`${userBaseURL}/friend/accept/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['friendRequests'],
        refetchType: 'active'
      })
      invalidate('app:name').then(() => {
        socket.emit('friendRequest', {
          to: email
        });
      })
    }
  }

  const declineFriendRequest = async (id: number, email: string) => {
    const res = await fetch(`${userBaseURL}/friend/decline/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['friendRequests'],
        refetchType: 'active'
      })
      invalidate('app:name').then(() => {
        socket.emit('friendRequest', {
          to: email
        });
      })
    }
  }
</script>

<span class="tw-text-[17px] tw-text-[#65676B] tw-font-bold tw-px-[16px]">Friend requests</span>
<div class="tw-px-[16px]">
  {#if $query.isLoading}
    <div class="tw-w-full tw-flex tw-justify-center">
      <Loading width={25} height={25} />
    </div>
  {:else if $query.isError}
    <p>Something went wrong :{"("}</p>
  {:else if $query.isSuccess}
    {#if $query.data.length === 0}
      <p>Nothing to show here</p>
    {:else}
      {#each $query.data as e }
        <div class="tw-flex tw-gap-2 tw-text-[15px] tw-rounded-md hover:tw-bg-gray-200 tw-p-3 tw-flex-wrap">
          <a href={`/${e.friend.firstName}.${e.friend.lastName}.${e.friend.id}`} class="tw-shrink-0">
            <img src={e.friend.profilePicture ? e.friend.profilePicture : placeholder} width={46} height={46} alt={`${e.friend.firstName} ${e.friend.lastName}`} class="tw-rounded-[1000px] tw-w-[46px] tw-h-[46px]" />
          </a>
          <div class="tw-flex tw-flex-col">
            <a class="tw-font-bold hover:tw-underline" href={`/${e.friend.firstName}.${e.friend.lastName}.${e.friend.id}`}>{e.friend.firstName} {e.friend.lastName}</a>
            <div class="tw-flex tw-justify-end tw-gap-2">
              <button class="tw-text-white tw-font-bold tw-rounded-md tw-bg-[#0866FF] tw-px-[15px] tw-py-2 hover:tw-brightness-95" 
              on:click={() => acceptFriendRequest(e.friend.id, e.friend.email)}>
                Confirm
              </button>
              <button class="tw-text-black tw-font-bold tw-rounded-md tw-bg-gray-300 tw-px-[15px] tw-py-2 hover:tw-bg-gray-400" 
              on:click={() => declineFriendRequest(e.friend.id, e.friend.email)}>
                Decline
              </button>
            </div>
          </div>
          
        </div>
      {/each}
    {/if}
  {/if}
</div>
<!-- <div class="tw-flex tw-justify-end tw-gap-2">
  <button class="tw-text-white tw-font-bold tw-rounded-md tw-bg-[#0866FF] tw-px-[15px] tw-py-2">
    Confirm
  </button>
  <button class="tw-text-black tw-font-bold tw-rounded-md tw-bg-gray-300 tw-px-[15px] tw-py-2 hover:tw-bg-gray-400">
    Cancel
  </button>
</div> -->