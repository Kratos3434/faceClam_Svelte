<script lang="ts">
  import type { UserProps } from "../types";
  import { page } from "$app/stores";
  import placeholder from '$lib/assets/placeholder.png';
  import AddFriendIcon from 'svelte-material-icons/AccountPlus.svelte';
  import FollowIcon from 'svelte-material-icons/PlusBoxMultiple.svelte';
  import CancelAddFriendIcon from 'svelte-material-icons/AccountMinusOutline.svelte';
	import Loading from "./Loading.svelte";
	import { userBaseURL } from "../env";
	import { invalidate } from "$app/navigation";
  import Check from 'svelte-material-icons/Check.svelte';
  import Decline from 'svelte-material-icons/Cancel.svelte';
  import { useQueryClient } from "@tanstack/svelte-query";
  import { socket } from "../socket";

  export let user: UserProps;
  export let token: string | undefined;
  export let currentUser: UserProps | undefined;

  const { name } = $page.params;
  const queryClient = useQueryClient();
  let loading = false;
  let loadingRequest = false;

  const links = [
    {
      path: `/${encodeURI(name)}`,
      name: "Posts"
    },
    {
      path: `/${name}/about`,
      name: "About"
    },
    {
      path: `/${name}/friends`,
      name: "Friends"
    }
  ];
  // `${userBaseURL}/send/request/${user.id}`
  const sendFriendRequest = async () => {
    loading = true;
    const res = await fetch(`${userBaseURL}/send/request/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status) {
      invalidate('app:name').then(() => {
        socket.emit("friendRequest", {
          to: user.email
        });
        
        loading = false;
      });
    } else {
      loading = false;
    }
  }

  const cancelRequest = async () => {
    const res = await fetch(`${userBaseURL}/cancel/request/${user.id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status) {
      invalidate('app:name').then(() => {
        socket.emit('friendRequest', {
          to: user.email
        })
      })
    }
  }

  const acceptFriendRequest = async (id: number) => {
    loadingRequest = true;
    const res = await fetch(`${userBaseURL}/friend/accept/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.status) {
      queryClient.invalidateQueries({
        queryKey: ['friendRequests'],
        refetchType: 'active'
      })
      invalidate('app:name').then(() => {
        socket.emit('friendRequest', {
          to: user.email
        });
        loadingRequest = false;
      });
    } else {
      loadingRequest = false;
    }
  }

  const declineFriendRequest = async (id: number) => {
    loadingRequest = true;
    const res = await fetch(`${userBaseURL}/friend/decline/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.status) {
      queryClient.invalidateQueries({
        queryKey: ['friendRequests'],
        refetchType: 'active'
      })
      invalidate('app:name').then(() => {
        socket.emit('friendRequest', {
          to: user.email
        });
        loadingRequest = false;
      });
    } else {
      loadingRequest = false;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-w-full tw-h-full">
  <div class="tw-shadow-md tw-w-full tw-bg-white">
    <div class="tw-flex tw-justify-center tw-w-full">
      <div class="tw-relative tw-flex tw-flex-col tw-h-full">
        <img src={user.coverPicture ? user.coverPicture : placeholder} width={1250} height={462.95} alt="Cover" class="tw-h-[462.95px]  tw-rounded-t-[0px] tw-rounded-b-md" />
        <div class="tw-absolute tw-top-[390px] tw-pl-5">
          <div class="tw-relative">
            <img src={user.profilePicture ? user.profilePicture : placeholder} width={168} height={168} class="tw-rounded-[1000px] tw-border-white tw-border-[5px] tw-w-[168px] tw-h-[168px] hover:tw-brightness-9" alt={`${user.firstName} ${user.lastName}`} />
          </div>
        </div>
        <div class="tw-flex tw-justify-between tw-items-center tw-pb-[16px] tw-flex-wrap tw-px-5 tw-gap-5">
          <div class="tw-flex tw-items-center tw-h-full tw-flex-wrap">
            <div class="tw-w-[168px] tw-mr-[16px] tw-h-[84px]">

            </div>
            <div class="tw-flex tw-flex-col tw-mtt-[32px] tw-mb-[16px]">
              <span class="tw-text-[32px] tw-font-bold">
                {user.firstName} {user.lastName}
              </span>
              <span class="tw-text-[15px] tw-text-[#65676B] tw-font-bold">
                {user.friends.length} friends
              </span>
            </div>
          </div>
          <div class="tw-flex tw-gap-2">
            {#if currentUser}
              {#if loading}
                <div class="tw-rounded-md tw-text-white tw-flex tw-items-center tw-font-bold tw-bg-[#0866FF] tw-px-[12px] tw-py-[10px] tw-gap-2 hover:tw-brightness-95 tw-cursor-pointer">
                  <Loading width={16} height={16} />
                  <span class="tw-text-[15px]">Cancel request</span>
                </div>
              {:else}
                {#if user.friendRequest && user.friendRequest.friendId !== currentUser.id}
                  <div class="tw-flex tw-gap-1">
                    <div class={`tw-rounded-md tw-text-white tw-flex tw-items-center tw-font-bold tw-bg-[#00A400] tw-px-[12px] tw-py-[10px] tw-gap-2 ${loadingRequest ? "tw-brightness-75" : "hover:tw-brightness-95"} tw-cursor-pointer`} on:click={() => !loadingRequest && acceptFriendRequest(user.id)}>
                      <Check width={16} height={16} />
                      <span class="tw-text-[15px]">Accept</span>
                    </div>

                    <div class={`tw-rounded-md tw-text-white tw-flex tw-items-center tw-font-bold tw-bg-rose-500 tw-px-[12px] tw-py-[10px] tw-gap-2 ${loadingRequest ? "tw-brightness-75" : "hover:tw-brightness-95"} tw-cursor-pointer`} on:click={() => !loadingRequest && declineFriendRequest(user.id)}>
                      <Decline width={16} height={16} />
                      <span class="tw-text-[15px]">Decline</span>
                    </div>
                  </div>
                {:else}
                  {#if user.areFriends}
                    <div class="tw-rounded-md tw-text-white tw-flex tw-items-center tw-font-bold tw-bg-[#0866FF] tw-px-[12px] tw-py-[10px] tw-gap-2 hover:tw-brightness-95 tw-cursor-pointer">
                      <Check width={16} height={16} />
                      <span class="tw-text-[15px]">Friends</span>
                    </div>
                  {:else}
                    {#if !user.friendRequest}
                      <div class="tw-rounded-md tw-text-white tw-flex tw-items-center tw-font-bold tw-bg-[#0866FF] tw-px-[12px] tw-py-[10px] tw-gap-2 hover:tw-brightness-95 tw-cursor-pointer" on:click={sendFriendRequest}>
                        <AddFriendIcon width={16} height={16} />
                        <span class="tw-text-[15px]">Add friend</span>
                      </div>
                    {:else}
                      <div class="tw-rounded-md tw-text-white tw-flex tw-items-center tw-font-bold tw-bg-[#0866FF] tw-px-[12px] tw-py-[10px] tw-gap-2 hover:tw-brightness-95 tw-cursor-pointer" on:click={cancelRequest}>
                        <CancelAddFriendIcon width={16} height={16} />
                        <span class="tw-text-[15px]">Cancel request</span>
                      </div>
                    {/if}
                  {/if}
                {/if}
              {/if}
            {/if}
            <div class="tw-rounded-md tw-text-white tw-flex tw-items-center tw-font-bold tw-bg-[#0866FF] tw-px-[12px] tw-py-[10px] tw-gap-2 hover:tw-brightness-95 tw-cursor-pointer">
              <FollowIcon width={16} height={16} />
              <span class="tw-text-[15px]">Follow</span>
            </div>
          </div>
        </div>
        <div class="tw-max-w-[1210px] tw-w-full tw-px-[20px] tw-gap-1 tw-flex tw-flex-col">
          <hr />
          <div class="tw-flex tw-gap-1">
            {#each links as link }
              <a class={`tw-flex tw-justify-center tw-items-center tw-h-full tw-px-[16px] tw-py-5 hover:tw-bg-gray-200 tw-border-bb-[4px] tw-border-white hover:tw-rounded-md tw-border-b-[4px] ${$page.url.pathname === link.path ? "tw-border-b-[#0866FF]" : "tw-border-b-white"}`} href={link.path}>
                <span class="tw-text-[15px] tw-font-bold">
                  {link.name}
                </span>
              </a>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>