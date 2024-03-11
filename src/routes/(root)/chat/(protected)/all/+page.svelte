<script lang="ts">
	import type { LayoutData } from "../../$types";
	import ChatStatus from "$lib/ChatStatus.svelte";
  import { onlineUsers } from "$lib";

  console.log("Online users: ", $onlineUsers);

  export let data: LayoutData;
</script>

<div class="tw-px-[16px]">
  <div class="tw-text-[15px] tw-py-2">ALL FRIENDS - {data.friends?.length}</div>
  <hr class="tw-border-black" />
  <!-- Array of all friends -->
  <div class="tw-flex tw-flex-col tw-gap-2 tw-py-2">
    {#if data.friends?.length === 0}
      <p>No friends to show here</p>
    {:else if data.friends}
      {#each data.friends as friend }
        {#if friend.user.id === data.currentUser.id}
          <ChatStatus user={friend.friend} isActive={$onlineUsers.get(friend.friend.email) ? true : false} />
        {:else}
          <ChatStatus user={friend.user} isActive={$onlineUsers.get(friend.user.email) ? true : false} />
        {/if}
      {/each}
    {/if}
  </div>
</div>