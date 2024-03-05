<script lang="ts">
	import HomeProfile from "$lib/HomeProfile.svelte";
	import OtherHomeProfile from "$lib/OtherHomeProfile.svelte";
  import type { LayoutData } from "./$types";
  import { page } from '$app/stores';

  export let data: LayoutData;
</script>

{#if data.verified}
  <HomeProfile user={data.user} token={data.token} posts={data.posts} />
{:else}
  <OtherHomeProfile user={data.user} token={data.token} currentUser={$page.data.currentUser} posts={data.posts} />
{/if}