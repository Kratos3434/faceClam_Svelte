<script lang="ts">
  import NavBar from "$lib/NavBar.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<NavBar user={data.currentUser} token={data.token} />
<main class="">
  <slot />
</main>