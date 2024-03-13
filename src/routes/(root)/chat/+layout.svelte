<script lang="ts">
	import ChatNavBar from "$lib/ChatNavBar.svelte";
  import { page } from "$app/stores";
	import type { LayoutData } from "./$types";
  import { navigating } from "$app/stores";
	import Loading from "$lib/Loading.svelte";

  export let data: LayoutData;
</script>

<div class="tw-pt-[60px]">
  {#if data.currentUser}
    <ChatNavBar currentPath={$page.url.pathname} />
  {/if}
  {#if $navigating}
    <Loading width={70} height={70} />
  {:else}
    <slot />
  {/if}
</div>