<script lang="ts">
	import { changeProfilePic } from "$lib";
	import ChangeProfilePhoto from "$lib/ChangeProfilePhoto.svelte";
  import NavBar from "$lib/NavBar.svelte";
	import OtherProfile from "$lib/OtherProfile.svelte";
	import Profile from "$lib/Profile.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<svelte:head>
  <title>{data.user.firstName} {data.user.lastName}</title>
  <meta name="description" content={data.user.bio} />
</svelte:head>

<!-- <NavBar token={data.token} user={data.currentUser} /> -->
<main class="tw-pt-[52px]">
 {#if data.verified}
  <Profile user={data.user} token={data.token} />
 {:else}
  <OtherProfile user={data.user} token={data.token} currentUser={data.currentUser} />
 {/if}
 <slot />
 {#if $changeProfilePic}
  <ChangeProfilePhoto token={data.token} />
 {/if}
</main>