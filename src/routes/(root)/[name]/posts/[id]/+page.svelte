<script lang="ts">
  import Post from "$lib/Post.svelte";
  import type { PageServerData } from "./$types";
  import { page } from "$app/stores";

  export let data: PageServerData;
</script>

<div class="tw-pt-[52px]">
  <Post post={data.post} currentUser={$page.data.currentUser} token={$page.data.token} />
</div>