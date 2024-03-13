<script lang="ts">
	import type { PostProps, UserProps } from "../types";
  import placeholder from '$lib/assets/placeholder.png';
	import { generateDate, linkifyDescrip } from "../helpers";
  import More from 'svelte-material-icons/DotsHorizontal.svelte';
  import Close from 'svelte-material-icons/Close.svelte';
  import Like from 'svelte-material-icons/ThumbUpOutline.svelte';
  import Chat from 'svelte-material-icons/ChatOutline.svelte';
  import Reply from 'svelte-material-icons/ReplyOutline.svelte';
  import { openPopup, viewLikes, viewPost } from "$lib";
	import { userBaseURL } from "../env";
	import { socket } from "../socket";
  import { openMore } from "$lib";

  export let post: PostProps;
  export let currentUser: UserProps | null = null;
  export let token: string | undefined;
  let isHidden = false;

  $: isLiked = post.likes.some(e => e.userId === currentUser?.id);
  $: likes = post.likes.length;
  let handlingLike = false;

  const openThePopup = () => {
    $openPopup = true;
  }

  const likePost = async () => {
    handlingLike = true;
    const res = await fetch(`${userBaseURL}/like/post/${post.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.status) {
      //create a notification
      if (post.author.email != currentUser?.email) {
        const notif =  await fetch(`${userBaseURL}/notification/create`, {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: post.author.id,
          postId: post.id,
          type: "LIKE"
        })
      })

      if (notif.status === 200) {
        socket.emit("notification", {
          to: post.author.email
        })
      }
      }

    }
  }

  const handleLike = async () => {
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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={`tw-rounded-md sm:tw-shadow-md tw-max-w-[680px] tw-w-full tw-bg-white ${isHidden ? "tw-hidden" : "tw-flex"} tw-flex-col`}>
  <div class={`tw-flex tw-flex-col tw-px-[16px] tw-pt-[12px] ${post.featureImage && "tw-pb-[16px]"}`}>
    <div class="tw-flex tw-gap-2 tw-items-center">
      <a href={`${post.author.firstName}.${post.author.lastName}.${post.author.id}`} class="tw-max-w-[40px] tw-max-h-[40px] tw-w-full tw-h-full tw-rounded-[1000px]">
        <img src={`${post.author.profilePicture ? post.author.profilePicture : placeholder}`} width="40" height="40" alt={`${post.author.firstName} ${post.author.lastName}`} class="tw-rounded-[1000px] tw-w-[40px] tw-h-[40px]" />
      </a>
      <div class="tw-flex tw-justify-between tw-flex-1">
        <div class="tw-flex tw-flex-col">
          <a href={`${post.author.firstName}.${post.author.lastName}.${post.author.id}`} class="tw-text-[15px] tw-font-bold tw-whitespace-nowrapp hover:tw-underline">
            {`${post.author.firstName} ${post.author.lastName}`}
          </a>
          <span class="tw-text-[13px] tw-text-[#65676B]">
            {generateDate(post.createdAt)}
          </span>
        </div>
        <div class="tw-flex tw-gap-4 tw-relative">
          <span on:click={() => {
            $openMore.status = true;
            $openMore.post = post;
          }}>
            <More width={20} height={20} class="tw-cursor-pointer" />
          </span>
          <span on:click={() => isHidden = true}>
            <Close width={20} height={20} class="tw-cursor-pointer" />
          </span>
        </div>
      </div>
    </div>
    <span class={`tw-text-[15px] tw-pt-2 descrip`}>{@html linkifyDescrip(post.description).__html}</span>
  </div>
  {#if post.featureImage}
    {#if post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4'}
      <video width="680" height="680" controls loop>
        <source src={`https${post.featureImage.substring(post.featureImage.indexOf(':'))}`} type="video/mp4" />
        <track kind="captions" />
      </video>
      {:else}
      <img src={post.featureImage} width="680" height="680" alt="Featured" />
    {/if}
  {/if}
  <div class="tw-flex tw-justify-between tw-px-5 tw-text-[#65676B] tw-text-[15px] tw-py-2">
    <button class="tw-cursor-pointer hover:tw-underline" on:click={() => {
      $viewLikes.postId = post.id;
      $viewLikes.status = true
    }}>
      {likes} likes
    </button>
    <div>
      <button class="tw-cursor-pointer hover:tw-underline" on:click={() => {
        $viewPost.post = post;
        $viewPost.status = true;
      }}>
        {post.comments.length} comments
      </button>
      <span>
        {post.shares} shares
      </span>
    </div>
  </div>
  <div class="tw-px-5">
    <hr />
  </div>
  <div class="tw-flex tw-justify-evenly tw-text-[#65676B] tw-text-[15px] tw-font-bold tw-items-center tw-px-[20px] tw-py-1">
    <button class={`tw-flex tw-gap-2 tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer hover:tw-rounded-md tw-w-full tw-justify-center tw-py-3 ${isLiked && "tw-text-blue-600"}`} on:click={() => {
      if (!currentUser) openThePopup();
      else {
        handleLike();
      }
    }}>
      <Like width={20} height={20} />
      Like
    </button>
    <button class="tw-flex tw-gap-2 tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer hover:tw-rounded-md tw-w-full tw-justify-center tw-py-3" on:click={() => {
      $viewPost.post = post;
      $viewPost.status = true;
    }}>
      <Chat width={20} height={20} />
      Comment
    </button>
    <button class="tw-flex tw-gap-2 tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer hover:tw-rounded-md tw-w-full tw-justify-center tw-py-3" on:click={() => {
      if (!currentUser) openThePopup();
    }}>
      <Reply width={20} height={20} />
      Share
    </button>
  </div>
</div>