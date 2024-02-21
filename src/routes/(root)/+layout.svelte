<script lang="ts">
  import NavBar from "$lib/NavBar.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<NavBar token={data.token} isLoggedIn={data.loggedIn} user={data.user} />
<main class="tw-pt-[70px]">
  <slot />
</main>