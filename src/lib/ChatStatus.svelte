<script lang="ts">
	import type { UserProps } from "../types";
  import placeholder from '$lib/assets/placeholder.png';
  import Dot from 'svelte-material-icons/Circle.svelte';
  export let user: UserProps;
  export let isActive: boolean;
</script>

<a class="tw-flex tw-items-center tw-gap-2 hover:tw-rounded-md hover:tw-bg-[#65676B] tw-cursor-pointer tw-p-2 hover:tw-text-white" href={`/chat?userId=${user.id}`}>
  <img src={user.profilePicture ? user.profilePicture : placeholder} alt={`${user.firstName} ${user.lastName}`} width={40} height={40} class="tw-rounded-[1000px] tw-w-[40px] tw-h-[40px]" />
  <div class="tw-flex tw-items-center tw-gap-2">
    <span>{user.firstName} {user.lastName}</span> 
    {#if isActive}
      <span> - Online</span>
    {:else}
      <span> - Offline</span>
    {/if}
    <Dot class={`${isActive ? "tw-text-green-600" : "tw-text-red-600"}`} />
  </div>
</a>