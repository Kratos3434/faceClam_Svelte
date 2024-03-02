<script lang="ts">
	import Reset from "$lib/Reset.svelte";
import type { PageServerData } from "./$types";


  export let data: PageServerData;
</script>

<svelte:head>
  <title>Reset Password - faceClam</title>
  <meta name="description" content="Reset your password" />
</svelte:head>

<Reset token={data.token} valid={data.status} code={data.code} />