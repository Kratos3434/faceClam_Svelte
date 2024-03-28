<script lang="ts">
	import type { PostProps, UserProps } from "../types";
  import More from 'svelte-material-icons/DotsHorizontal.svelte';
  import Like from 'svelte-material-icons/ThumbUpOutline.svelte';
  import Chat from 'svelte-material-icons/ChatOutline.svelte';
  import Reply from 'svelte-material-icons/ReplyOutline.svelte';
  import MenuDown from 'svelte-material-icons/MenuDown.svelte';
  import Forum from 'svelte-material-icons/Forum.svelte';
  import Send from 'svelte-material-icons/Send.svelte';
  import placeholder from '$lib/assets/placeholder.png';
	import { generateDate, linkifyDescrip } from "../helpers";
	import Comment from "./Comment.svelte";
	import { openPopup, viewLikes } from "$lib";
  import { userBaseURL } from "../env";
	import { invalidate } from "$app/navigation";

  export let post: PostProps;
  export let token: string | undefined;
  export let currentUser: UserProps | undefined;

  let isLiked = post.likes.some(e => e.userId === currentUser?.id);
  let likes = post.likes.length;
  let divEl: any;
  let loading = false;
  let comment = "";

  const handleComment = () => {
    comment = divEl.innerText;
  } 

  const likePost = async () => {
    await fetch(`${userBaseURL}/like/post/${post.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  }

  const handleLike = async () => {
    switch (isLiked) {
      case true:
        likes--;
        isLiked = false;
        break;
      case false:
        likes++;
        isLiked = true;
        break;
    }

    await likePost();
  }

  const handleCommentPost = async (e: any) => {
    e.preventDefault();

    if (!currentUser) {
      comment = "";
      divEl.innerText = "";
      $openPopup = true;
      return false;
    }

    loading = true;

    const res = await fetch(`${userBaseURL}/add/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        comment,
        postId: post.id
      })
    });

    const data = await res.json();

    if (data.status) {
      comment = "";
      divEl.innerText = "";
      invalidate('app:comment').then(() => {
        comment = "";
        divEl.innerText = "";
        loading = false;
      })
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-flex tw-w-full tw-justify-center tw-px-[16px] tw-py-2 tw-pt-5 tw-pb-5">
  <div class="tw-rounded-md tw-bg-white tw-shadow-lg tw-max-w-[500px] tw-w-full tw-h-full">
    <div class="tw-flex tw-items-center tw-px-[16px] tw-pt-[12px] tw-mb-[12px] tw-gap-2">
      <a href={`/${post.author.firstName}.${post.author.lastName}.${post.author.id}`}>
        <img src={post.author.profilePicture ? post.author.profilePicture : placeholder} width={40} height={40} alt={`${post.author.firstName} ${post.author.lastName}`} 
        class="tw-w-[40px] tw-h-[40px] tw-rounded-[1000px]" />
      </a>
      <div class="tw-flex tw-justify-between tw-items-center tw-flex-1">
        <div class="tw-flex tw-flex-col">
          <a class="tw-text-[15px] tw-font-bold hover:tw-underline" href={`/${post.author.firstName}.${post.author.lastName}.${post.author.id}`}>
            {post.author.firstName} {post.author.lastName}
          </a>
          <span class="tw-text-[13px] tw-text-[#65676B]">
            {generateDate(post.createdAt)}
          </span>
        </div>
        <More width={20} height={20} />
      </div>
    </div>
    <div class="tw-px-[16px] tw-pb-[16px]">{@html linkifyDescrip(post.description).__html}</div>
    {#if post.featureImage}
      {#if post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4'}
        <video width={680} height={680} controls loop>
          <source src={`https${post.featureImage.substring(post.featureImage.indexOf(':'))}`} type="video/mp4" />
          <track kind="captions" />
        </video>
      {:else}
        <img src={post.featureImage} width={680} height={680} alt={post.description} class="tw-max-w-[680px] tw-max-h-[680px] tw-w-full tw-h-full" />
      {/if}
    {/if}
    <div class="tw-flex tw-justify-between tw-px-5 tw-text-[#65676B] tw-text-[15px] tw-py-2">
      <span class="tw-cursor-pointer hover:tw-underline" on:click={() => {
        $viewLikes.postId = post.id;
        $viewLikes.status = true;
      }}>
        {likes} likes
      </span>
      <div class="tw-flex tw-gap-3">
        <span class="tw-cursor-pointer hover:tw-underline">
          {post.comments.length} comments
        </span>
        <span>
          {post.shares.length} shares
        </span>
      </div>
    </div>
    <div class="tw-px-5">
      <hr />
    </div>
    <div class="tw-flex tw-justify-evenly tw-text-[#65676B] tw-text-[15px] tw-font-bold tw-items-center tw-px-[20px] tw-py-1">
      <div class={`tw-flex tw-gap-2 tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer hover:tw-rounded-md tw-w-full tw-justify-center tw-py-3 ${isLiked && "tw-text-blue-600"}`} on:click={handleLike}>
        <Like width={20} height={20} />
        Like
      </div>
      
      <div class="tw-flex tw-gap-2 tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer hover:tw-rounded-md tw-w-full tw-justify-center tw-py-3">
        <Chat width={20} height={20} />
        Comment
      </div>

      <div class="tw-flex tw-gap-2 tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer hover:tw-rounded-md tw-w-full tw-justify-center tw-py-3">
        <Reply width={20} height={20} />
        Share
      </div>
    </div>
    <div class="tw-px-5">
      <hr />
    </div>
    <div class="tw-px-5">
      <div class="tw-flex tw-justify-end tw-text-[#65676B] tw-text-[15px] tw-font-bold">
        <div class="tw-flex tw-items-center">
          <span>Most relevant</span>
          <MenuDown width={16} height={16} />
        </div>
      </div>
      <div class="tw-flex tw-gap-1 tw-py-[8px]">
        <a href={currentUser ? `/${currentUser.firstName}.${currentUser.lastName}.${currentUser.id}` : "/"}>
          <img src={currentUser?.profilePicture ? currentUser.profilePicture : placeholder} width={32} height={32} alt={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Unknown User"} class="tw-w-[32px] tw-h-[32px] tw-rounded-[1000px]" />
        </a>
        <form class="tw-rounded-xl tw-bg-gray-200 tw-w-full tw-px-[12px] tw-py-[8px] tw-flex tw-flex-col" on:submit={handleCommentPost}>
          <div contenteditable={true} class="tw-outline-none tw-whitespace-pre-wrap commentBox tw-cursor-text tw-break-all" role="textbox" tabindex={0} placeholder="Write a comment..." bind:this={divEl} on:input={handleComment} >

          </div>
          <div class="tw-flex tw-justify-end">
            {#if comment && !loading}
              <button>
                <Send class="tw-w-[16px] tw-h-[16px] tw-text-[#0866FF]" />
              </button>
            {:else}
              <span>
                <Send class="tw-w-[16px] tw-h-[16px] tw-text-gray-400" />
              </span>
            {/if}
          </div>
        </form>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-3 tw-pb-[16px]">
        {#if post.comments.length === 0}
          <div class="tw-text-center tw-p-[16px] tw-flex tw-flex-col tw-gap-1 tw-items-center tw-font-bold tw-text-[#65676B]">
            <Forum width={50} height={50} />
            <p>No comments yet, be the first person to comment :{")"}</p>
          </div>
        {:else}
          {#each post.comments as comment }
            <Comment {comment} />
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>
