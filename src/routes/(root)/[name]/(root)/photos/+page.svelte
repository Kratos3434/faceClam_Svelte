<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';

  const url = $page.params;

  export let data: PageData;

</script>

<div class="tw-px-[16px] tw-py-[12px] tw-w-full tw-flex tw-justify-center">
  <div class="tw-bg-white tw-shadow-md tw-px-[16px] tw-py-[8px] tw-rounded-md tw-max-w-[1186px] tw-w-full">
    <span class="tw-text-[20px] tw-font-bold tw-mb-3">Photos</span>
    <!-- All photos -->
    <div class="tw-flex tw-flex-wrap  tw-gap-2 tw-items-center tw-justify-center">
      <!-- 185*185 -->
      {#each data.posts as post }
        <a href={`/${url.name}/posts/${post.id}`}>
          <img src={post.featureImage} width={185} height={185} alt={post.description} class="tw-rounded-md tw-w-[185px] tw-h-[185px] tw-max-w-auto tw-max-h-auto" />
        </a>
      {/each}
    </div>
    <!-- All photos end-->
  </div>
</div>