<script lang="ts">
  import NavBar from "$lib/NavBar.svelte";
	import OtherProfile from "$lib/OtherProfile.svelte";
	import Profile from "$lib/Profile.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<!-- <NavBar token={data.token} user={data.currentUser} /> -->
<main class="tw-pt-[52px]">
 {#if data.verified}
  <Profile user={data.user} token={data.token} />
 {:else}
  <OtherProfile user={data.user} token={data.token} />
 {/if}
 <slot />
</main>