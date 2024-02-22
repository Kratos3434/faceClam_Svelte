<script lang="ts">
  import NavBar from "$lib/NavBar.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<NavBar token={data.token} user={data.user} />
<main class="">
  <slot />
</main>