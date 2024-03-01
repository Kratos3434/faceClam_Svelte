<script lang="ts">
	import VerifyEmail from "$lib/VerifyEmail.svelte";
import type { PageServerData } from "./$types";


  export let data: PageServerData;
</script>


<svelte:head>
  <title>Verify Email - faceClam</title>
  <meta name="description" content="Verify your email to complete signup" />
</svelte:head>

<VerifyEmail {data} />