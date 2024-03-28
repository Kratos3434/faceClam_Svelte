<script lang="ts">
	import type { PostProps } from "../types";
  import placeholder from '$lib/assets/placeholder.png';

  export let post: PostProps;
  const postLink = `/${post.author.firstName}.${post.author.lastName}.${post.author.id}/posts/${post.id}`
</script>

<div class="saved-sm:tw-max-h-[176px] tw-h-full tw-flex tw-p-[16px] tw-bg-white tw-rounded-md tw-shadow-md tw-gap-3 tw-w-full saved-sm:tw-flex-row tw-flex-col">
  <a href={postLink} class="tw-shrink-0">
    <img src={post.featureImage ? post.featureImage : (post.author.profilePicture ? post.author.profilePicture : placeholder)} width="144" height="144" alt={post.description} class="tw-w-[144px] tw-h-[144px] tw-rounded-md" />
  </a>
  <div class="tw-flex tw-flex-col tw-justify-between">
    <div class="tw-flex tw-flex-col tw-gap-2">
      <a class="sm:tw-text-[20px] tw-text-[17px] tw-font-bold tw-break-all tw-whitespace-normal hover:tw-underline" href={postLink}>
        {post.description}
      </a>
      <div class="tw-flex tw-gap-2">
        <a href={postLink}>
          <img src={post.author.profilePicture ? post.author.profilePicture : placeholder} width="24" height="24" alt={`${post.author.firstName} ${post.author.lastName}`} class="tw-rounded-[50%] tw-w-[24px] tw-h-[24px] tw-shrink-0" />
        </a>
        <span class="tw-text-[13px] tw-text-gray-400">
          Saved from
        </span>
        <a class="tw-text-black tw-font-bold hover:tw-underline tw-text-[13px]" href={postLink}>{post.author.firstName} {post.author.lastName}'s post<span/>
      </div>
    </div>
  </div>
</div>