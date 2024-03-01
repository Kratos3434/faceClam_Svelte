<script lang="ts">
  import Post from "$lib/Post.svelte";
  import type { PageServerData } from "./$types";
  import { page } from "$app/stores";

  export let data: PageServerData;
</script>

<svelte:head>
  <title>{data.post.author.firstName} {data.post.author.lastName} - {data.post.description} | faceClam</title>
  <meta name="description" content={data.post.description} />
</svelte:head>

<div class="tw-pt-[52px]">
  <Post post={data.post} currentUser={$page.data.currentUser} token={$page.data.token} />
</div>