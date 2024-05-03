<script lang="ts">
	import type { PostProps } from "../types";
  import { generateDate, linkifyDescrip } from "../helpers";
  import { viewPost } from "$lib";
  import placeholder from '$lib/assets/placeholder.png';
	import Swiper from "./Swiper.svelte";

  export let post: PostProps;

  const images = post.featureImages.map(e => {
    return {
      img: e,
      width: 680,
      height: 680,
      alt: e
    }
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if !post.content}
  {#if post.featureImage}
    {#if post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4'}
      <video width="680" height="680" controls loop on:click={() => {
        $viewPost.post = post;
        $viewPost.status = true;
      }}>
        <source src={`https${post.featureImage.substring(post.featureImage.indexOf(':'))}`} type="video/mp4" />
        <track kind="captions" />
      </video>
    {:else}
      <img src={post.featureImage} width="680" height="680" alt="Featured" on:click={() => {
      $viewPost.post = post;
      $viewPost.status = true;
      }} class="tw-cursor-pointer" />
    {/if}
  {:else if post.featureImages.length > 0}
      <Swiper {images} />
  {/if}
{:else}
  {#if post.content.featureImage}
    <a class="tw-rounded-xl tw-mx-[16px] tw-flex tw-flex-col tw-items-center tw-my-2 tw-border-[1px]" 
    href={`/${post.content.author.firstName}.${post.content.author.lastName}.${post.content.author.id}/posts/${post.content.id}`}>
      {#if post.content.featureImage}
        <div class="tw-flex tw-justify-center tw-w-full tw-bg-black tw-rounded-t-xl">
          <!-- <img src={post.content?.featureImage} width="500" height="700" alt={post.content?.description} class="nav-sm:tw-rounded-t-[0px] tw-rounded-t-xl" />
          -->
          {#if post.content.featureImage.substring(post.content.featureImage.lastIndexOf('.')) === '.mp4'}
            <video width={500} height={700} controls loop class="nav-sm:tw-rounded-t-[0px] tw-rounded-t-xl">
              <source src={`https${post.content.featureImage.substring(post.content.featureImage.indexOf(':'))}`} type="video/mp4" />
              <track kind="captions" />
            </video>
          {:else}
            <img src={post.content.featureImage} width={500} height={700} alt={post.content.description} class="nav-sm:tw-rounded-t-[0px] tw-rounded-t-xl" />
          {/if}
        </div>
      {/if}
      {#if post.content.featureImage}
        <div class={`tw-w-full tw-bg-white tw-p-[16px] tw-rounded-b-xl ${!post.content.featureImage && "tw-rounded-t-xl"}`}>
          <div class="tw-flex tw-gap-2 tw-items-center">
            <a href={`/${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}`}>
              <img src={post.content?.author.profilePicture ? post.content.author.profilePicture : placeholder} width="32" height="32" alt={`${post.content?.author.firstName} ${post.content?.author.lastName}`} class="tw-w-[32px] tw-h-[32px] tw-rounded-[50%] tw-shrink-0" />
            </a>
            <div class="tw-flex tw-flex-col">
              <a href={`/${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}`} class="hover:tw-underline">
                <span class="tw-text-[15px] tw-font-semibold">{post.content?.author.firstName} {post.content?.author.lastName}</span>
              </a>
              <span class="tw-text-[13px] tw-text-[#65676B]">
                {generateDate(post.content?.createdAt)}
              </span>
            </div>
          </div>
          <div class="tw-text-[15px] tw-mt-2 descrip">
            {@html linkifyDescrip(post.content.description).__html}
          </div>
        </div>
      {:else}
        <a class={`tw-w-full tw-bg-white tw-p-[16px] tw-rounded-b-xl ${!post.content.featureImage && "tw-rounded-t-xl"}`} 
        href={`/${post.content.author.firstName}.${post.content.author.lastName}.${post.content.author.id}/posts/${post.content.id}`}>
          <div class="tw-flex tw-gap-2 tw-items-center">
            <a href={`/${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}`}>
              <img src={post.content?.author.profilePicture ? post.content.author.profilePicture : placeholder} width="32" height="32" alt={`${post.content?.author.firstName} ${post.content?.author.lastName}`} class="tw-w-[32px] tw-h-[32px] tw-rounded-[50%] tw-shrink-0" />
            </a>
            <div class="tw-flex tw-flex-col">
              <a href={`/${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}`} class="hover:tw-underline">
                <span class="tw-text-[15px] tw-font-semibold">{post.content?.author.firstName} {post.content?.author.lastName}</span>
              </a>
              <span class="tw-text-[13px] tw-text-[#65676B]">
                {generateDate(post.content?.createdAt)}
              </span>
            </div>
          </div>
          <div class="tw-text-[15px] tw-mt-2">
            {post.content.description}
          </div>
        </a>
      {/if}
    </a>
  {:else}
    <div class="tw-rounded-xl tw-mx-[16px] tw-flex tw-flex-col tw-items-center tw-my-2 tw-border-[1px]">
      {#if post.content.featureImage}
        <div class="tw-flex tw-justify-center tw-w-full tw-bg-black tw-rounded-t-xl">
          <img src={post.content?.featureImage} width="500" height="700" alt={post.content?.description} />
        </div>
      {/if}
      {#if post.content.featureImage}
        <div class={`tw-w-full tw-bg-white tw-p-[16px] tw-rounded-b-xl ${!post.content.featureImage && "tw-rounded-t-xl"}`}>
          <div class="tw-flex tw-gap-2 tw-items-center">
            <a href={`/${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}`}>
              <img src={post.content?.author.profilePicture ? post.content.author.profilePicture : placeholder} width="32" height="32" alt={`${post.content?.author.firstName} ${post.content?.author.lastName}`} class="tw-w-[32px] tw-h-[32px] tw-rounded-[50%] tw-shrink-0" />
            </a>
            <div class="tw-flex tw-flex-col">
              <a href={`/${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}`} class="hover:tw-underline">
                <span class="tw-text-[15px] tw-font-semibold">{post.content?.author.firstName} {post.content?.author.lastName}</span>
              </a>
              <span class="tw-text-[13px] tw-text-[#65676B]">
                {generateDate(post.content?.createdAt)}
              </span>
            </div>
          </div>
          <div class="tw-text-[15px] tw-mt-2">
            {post.content.description}
          </div>
        </div>
      {:else}
        <a class={`tw-w-full tw-bg-white tw-p-[16px] tw-rounded-b-xl ${!post.content.featureImage && "tw-rounded-t-xl"}`} 
        href={`/${post.content.author.firstName}.${post.content.author.lastName}.${post.content.author.id}/posts/${post.content.id}`}>
          <div class="tw-flex tw-gap-2 tw-items-center">
            <a href={`/${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}`}>
              <img src={post.content?.author.profilePicture ? post.content.author.profilePicture : placeholder} width="32" height="32" alt={`${post.content?.author.firstName} ${post.content?.author.lastName}`} class="tw-w-[32px] tw-h-[32px] tw-rounded-[50%] tw-shrink-0" />
            </a>
            <div class="tw-flex tw-flex-col">
              <a href={`/${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}`} class="hover:tw-underline">
                <span class="tw-text-[15px] tw-font-semibold">{post.content?.author.firstName} {post.content?.author.lastName}</span>
              </a>
              <span class="tw-text-[13px] tw-text-[#65676B]">
                {generateDate(post.content?.createdAt)}
              </span>
            </div>
          </div>
          <div class="tw-text-[15px] tw-mt-2">
            {post.content.description}
          </div>
        </a>
      {/if}
    </div>
  {/if}
{/if}
