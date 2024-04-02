<script lang="ts">
	import type { LayoutData } from '../$types';
	import Saved from '$lib/Saved.svelte';

  export let data: LayoutData;

</script>

<svelte:head>
  <title>Saved | faceClam</title>
  <meta name="description" content="Check out your saved posts for later" />
</svelte:head>

<Saved token={data.token} />