<script lang="ts">
	import ChatNavBar from "$lib/ChatNavBar.svelte";
  import { page } from "$app/stores";
	import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<div class="tw-pt-[60px]">
  {#if data.currentUser}
    <ChatNavBar currentPath={$page.url.pathname} />
  {/if}
  <slot />
</div>