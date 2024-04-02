<script lang="ts">
	import { browser } from "$app/environment";
	import { openAddPost, openAddStatus, openMenu, openMore, openPopup, openShare, viewLikes, viewPost, viewShares } from "$lib";
	import ViewLikes from "$lib/ViewLikes.svelte";
  import "../app.css";
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import type { LayoutData } from "./$types";
	import ViewPost from "$lib/ViewPost.svelte";
	import AddStatus from "$lib/AddStatus.svelte";
	import AddPost from "$lib/AddPost.svelte";
	import SigninPopUpModal from "$lib/SigninPopUpModal.svelte";
	import { onMount } from "svelte";
	import { socket } from "../socket";
  import { invalidate } from "$app/navigation";
  import { onlineUsers } from "$lib";
	import MoreModal from "$lib/MoreModal.svelte";
	import ShareModal from "$lib/ShareModal.svelte";
	import ViewShares from "$lib/ViewShares.svelte";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });

  onMount(() => {
    //This triggers if client disconnects (i.e. reload)
    if (socket.disconnected && data.currentUser) {
      socket.connect();

      socket.emit('join', {
        email: data.currentUser.email
      });
    }
    //////////////////////////////////////////
    //All friend request listeners
    const friendRequestHandler = async () => {
      queryClient.invalidateQueries({
        queryKey: ['friendRequests'],
        refetchType: 'active'
      });
      invalidate('app:name');
    }

    socket.on('friendRequestEmmision', friendRequestHandler);
    //Get all online users
    const getOnlineUsers = (data: {email: string}[]) => {
        $onlineUsers = new Map<string, string>();
        data.forEach((e) => {
          $onlineUsers.set(e.email, e.email);
        })
      }
    socket.on('onlineUsers', getOnlineUsers);
    //////////////////////////////////////////////////////////
    //Notifications handler
    const notificationsHandler = async () => {
      queryClient.invalidateQueries({
        queryKey: ['likeNotif'],
        refetchType: 'active'
      });
    }

    socket.on('notificationEmission', notificationsHandler);
    ////////////////////////////////////////////////////////
    return () => {
      socket.off('friendRequestEmmision', friendRequestHandler);
      socket.off('notificationEmission', notificationsHandler);
    }
  })
  export let data: LayoutData;
</script>

<QueryClientProvider client={queryClient}>
  <slot />
  {#if $viewLikes.status}
    <ViewLikes currentUser={data.currentUser} />
  {/if}

  {#if $viewPost.status}
    <ViewPost currentUser={data.currentUser} token={data.token} />
  {/if}

  {#if $openAddStatus}
    <AddStatus user={data.currentUser} token={data.token} />
  {/if}

  {#if $openAddPost}
    <AddPost user={data.currentUser} token={data.token} />
  {/if}

  {#if !data.loggedIn && $openPopup}
    <SigninPopUpModal />
  {/if}

  {#if $openMore.status}
    <MoreModal currentUser={data.currentUser} token={data.token} />
  {/if}

  {#if $openShare.status}
    <ShareModal currentUser={data.currentUser} token={data.token} />
  {/if}

  {#if $viewShares.status}
    <ViewShares />
  {/if}
</QueryClientProvider>

{#if $viewLikes.status || $openPopup || $viewPost.status || $openAddPost || $openAddStatus || $openMenu || $openMore.status || $openShare.status || $viewShares.status} 
  <style>
    body {
      overflow: hidden;
    }
  </style>
{/if}
