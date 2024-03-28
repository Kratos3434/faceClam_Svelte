<script lang="ts">
	import type { CommentProps, UserProps } from "../types";
  import { openPopup, viewPost } from "$lib";
  import Close from 'svelte-material-icons/Close.svelte';
  import placeholder from '$lib/assets/placeholder.png';
	import { generateDate } from "../helpers";
  import More from 'svelte-material-icons/DotsHorizontal.svelte';
  import Like from 'svelte-material-icons/ThumbUpOutline.svelte';
  import Chat from 'svelte-material-icons/ChatOutline.svelte';
  import Reply from 'svelte-material-icons/ReplyOutline.svelte';
  import MenuDown from 'svelte-material-icons/MenuDown.svelte';
  import Forum from 'svelte-material-icons/Forum.svelte';
  import Send from 'svelte-material-icons/Send.svelte';
  import { createQuery, useQueryClient } from "@tanstack/svelte-query";
  import Loading from "./Loading.svelte";
	import Comment from "./Comment.svelte";
	import { publicBaseURL, userBaseURL } from "../env";
	import { onMount } from "svelte";
  import { viewLikes } from "$lib";

  export let token: string | undefined;
  export let currentUser: UserProps | null;
  
  let divEl: any;
  let comment = "";
  let loading = false;
  const queryClient = useQueryClient();
  
  const handleComment = () => {
    comment = divEl.innerText;
  }
  
  let post = $viewPost.post;
  
  let isLiked = post?.likes.some(e => e.userId === currentUser?.id);
  let likes = post?.likes.length;
  let handlingLike = false;
  let commentBoxEl: any;

  const getCommentByPostId = async (): Promise<CommentProps[]> => {
    const res = await fetch(`${publicBaseURL}/comment/post/${post?.id}`);
    const data = await res.json();
    return data.data;
  }

  const query = createQuery({
    queryKey: ['comments', post?.id],
    queryFn: () => getCommentByPostId()
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!currentUser) {
      $openPopup = true;
      comment = "";
      divEl.innerText = "";
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
        postId: post?.id
      })
    });

    const data = await res.json();

    if (data.status) {
      comment = "";
      divEl.innerText = "";
      await queryClient.invalidateQueries({
        queryKey: ['posts'],
        refetchType: 'active'
      });

      await queryClient.invalidateQueries({
        queryKey: ['comments', post?.id],
        refetchType: 'active',
        exact: true
      });

      await queryClient.invalidateQueries({
        queryKey: ['userPosts', post?.author.id],
        refetchType: 'active',
        exact: true
      });
      post = data.data.post;
      loading = false;
    }
  }

  const likePost = async () => {
    handlingLike = true;
    await fetch(`${userBaseURL}/like/post/${post?.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  }

  const handleLike = async () => {
    if (likes) {
      if (!handlingLike) {
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
      handlingLike = false;
    }
    }
  }

  const scrollToBottom = (event: any) => {
    const { currentTarget: target } = event;
		target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
  }
  onMount(() => {
    if (commentBoxEl) {
			commentBoxEl.addEventListener('DOMNodeInserted', scrollToBottom)
		}

    return () => removeEventListener('DOMNodeInserted', scrollToBottom);
  })
</script> 

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-fixed tw-top-0 tw-w-full tw-left-0 tw-bg-[rgb(0,0,0)] tw-bg-[rgba(0,0,0,0.4)] tw-py-5 tw-px-[16px] tw-z-[1000] tw-h-full tw-overflow-hidden" 
on:click={() => $viewPost.status = false}>
  <div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-max-h-[100vh] tw-h-full">
    <div class="tw-fixed tw-w-full tw-top-[20px] tw-flex tw-justify-center tw-px-[16px]" on:click={(e) => e.stopPropagation()}>
      <div class="tw-text-center tw-p-2 tw-bg-white tw-max-w-[700px] tw-w-full tw-rounded-t-md tw-border-b-[1px] tw-relative tw-z-[1000]">
        <span class="tw-font-bold tw-text-[20px] tw-rounded-md">
          {post?.author.firstName} {post?.author.lastName}'s Post
        </span>
        <div class="tw-absolute tw-right-0 tw-top-0 tw-px-[16px] tw-py-2 tw-font-bold">
          <span class="tw-cursor-pointer" on:click={() => $viewPost.status = false}>
            <Close width={25} height={25} />
          </span>
        </div>
      </div>
    </div>
    <div class="tw-rounded-md tw-shadow-2xl tw-bg-white tw-max-w-[700px] tw-w-full tw-h-full tw-overflow-auto viewpost" on:click={(e) => e.stopPropagation()} bind:this={commentBoxEl}>
      <div class="tw-rounded-md tw-mb-[82px] tw-mt-[48px]">
        <div class="tw-px-[16px] tw-flex tw-flex-col tw-py-2 tw-gap-2">
          <div class="tw-flex tw-justify-between tw-items-center">
            <div class="tw-flex tw-gap-2">
              <a href={`/${post?.author.firstName}.${post?.author.lastName}.${post?.author.id}`}>
                <img src={post?.author.profilePicture ? post?.author.profilePicture : placeholder} width={40} height={40} alt={`${post?.author.firstName} ${post?.author.lastName}`} class="tw-rounded-[1000px] tw-w-[40px] tw-h-[40px]" />
              </a>
              <div class="tw-flex tw-flex-col">
                <a class="tw-text-[15px] tw-font-bold hover:tw-underline" href={`/${post?.author.firstName}.${post?.author.lastName}.${post?.author.id}`}>
                  {post?.author.firstName} {post?.author.lastName}
                </a>
                <span class="tw-text-[13px] tw-text-[#65676B]">
                  {post && generateDate(post.createdAt)}
                </span>
              </div>
            </div>
            <More width={36} height={36} />
          </div>
          <span>
            {post?.description}
          </span>
        </div>
        {#if post?.featureImage}
          {#if post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4'}
            <video width={700} height={700} controls loop>
              <source src={`https${post.featureImage.substring(post.featureImage.lastIndexOf(':'))}`} type="video/mp4" />
              <track kind="captions" />
            </video>
          {:else}
            <img src={post.featureImage} width={700} height={700} alt={`${post.author.firstName} ${post.author.lastName}`} />
          {/if}
        {/if}
        <div class="tw-px-[16px] tw-flex tw-justify-between tw-text-[#65676B] tw-text-[15px] tw-items-center">
          <span class="hover:tw-underline tw-cursor-pointer" on:click={() => {
            if (post) {
              $viewLikes.postId = post.id;
              $viewLikes.status = true
            }
          }}>
            {likes} likes
          </span>
          <div class="tw-flex">
            <span class="tw-p-[6px]">
              {post?.comments.length} comments
            </span>
            <span class="tw-p-[6px]">
              {0} shares
            </span>
          </div>
        </div>
        <div class="tw-px-[16px] tw-flex tw-flex-col tw-gap-2">
          <hr />
          <div class="tw-flex tw-justify-evenly tw-text-[#65676B] tw-text-[15px] tw-items-center">
            <div class={`tw-flex tw-gap-2 tw-py-[6px] hover:tw-rounded-md tw-w-full tw-justify-center tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer ${isLiked && " tw-text-blue-600"}`} on:click={handleLike}>
              <Like width={20} height={20} />
              <span>Like</span>
            </div>
            <div class="tw-flex tw-gap-2 tw-py-[6px] hover:tw-rounded-md tw-w-full tw-justify-center tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer">
              <Chat width={20} height={20} />
              <span>Comment</span>
            </div>
            <div class="tw-flex tw-gap-2 tw-py-[6px] hover:tw-rounded-md tw-w-full tw-justify-center tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer">
              <Reply width={20} height={20} />
              <span>Share</span>
            </div>
          </div>
          <hr />
        </div>
        <div class="tw-flex tw-justify-end tw-text-[#65676B] tw-text-[15px] tw-px-[16px] tw-items-end tw-font-bold">
          <span>Most relevant</span>
          <MenuDown width={20} height={20} class="tw-font-bold" />
        </div>
        <!-- Array of comments -->
        <div class="tw-px-[16px] tw-flex tw-flex-col tw-py-[16px] tw-gap-3">
          {#if $query.isLoading}
            <div class="tw-flex tw-justify-center">
              <Loading width={70} height={70} />
            </div>
          {:else if $query.isError}
            <p>Something went wrong :{"("}</p>
          {:else if $query.isSuccess}
            {#if $query.data.length === 0}
              <div class="tw-text-center tw-p-[16px] tw-flex tw-flex-col tw-gap-1 tw-items-center tw-font-bold tw-text-[#65676B]">
                <Forum width={50} height={50} />
                <p>No comments yet, be the first person to comment :{")"}</p>
              </div>
            {:else}
              {#each $query.data as comment }
                <Comment {comment} />
              {/each}
            {/if}
          {/if}
        </div>
        <!-- Array of comments end -->
      </div>
    </div>
    <div class="tw-fixed tw-w-full tw-bottom-[20px] tw-flex tw-justify-center tw-px-[16px]" on:click={(e) => e.stopPropagation()}>
      <div class="tw-flex tw-px-[16px] tw-py-[9px] tw-max-w-[700px] tw-w-full tw-bg-white tw-rounded-b-md tw-gap-[4px] tw-shadow-2xl tw-border-t-[1px]">
        <img src={currentUser?.profilePicture ? currentUser.profilePicture : placeholder} width={32} height={32} alt={`${currentUser?.firstName} ${currentUser?.lastName}`} 
        class="tw-rounded-[1000px] tw-w-[32px] tw-h-[32px]" />
        <form class="tw-w-full tw-rounded-md tw-bg-gray-200 tw-break-words tw-flex tw-flex-col tw-px-[12px] tw-py-[8px]" on:submit={handleSubmit}>
          <div contenteditable={true} role="textbox" tabindex={0} placeholder="Write a comment..." bind:this={divEl} on:input={handleComment} class="tw-outline-none tw-whitespace-pre-wrap commentBox tw-cursor-text tw-break-all">

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
    </div>
  </div>
</div>