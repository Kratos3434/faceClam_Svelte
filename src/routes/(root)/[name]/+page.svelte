<script lang="ts">
	import HomeProfile from "$lib/HomeProfile.svelte";
	import OtherHomeProfile from "$lib/OtherHomeProfile.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

{#if data.verified}
  <HomeProfile user={data.user} token={data.token} />
{:else}
  <OtherHomeProfile user={data.user} token={data.token} currentUser={data.currentUser} />
{/if}