<script lang="ts">
	import ChatNavBar from "$lib/ChatNavBar.svelte";
  import { page } from "$app/stores";

</script>

<div class="tw-pt-[60px]">
  <ChatNavBar currentPath={$page.url.pathname} />
  <slot />
</div>