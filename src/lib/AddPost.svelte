<script lang="ts">
	import type { UserProps } from "../types";
	import Modal from "./Modal.svelte";
  import Close from 'svelte-material-icons/Close.svelte';
  import placeholder from '$lib/assets/placeholder.png';
  import Public from 'svelte-material-icons/Earth.svelte';
  import AddPhoto from 'svelte-material-icons/PlusBoxMultiple.svelte';
	import Loading from "./Loading.svelte";
	import { likes, openAddPost, postsArray, posts } from "$lib";
	import { checkValidFileType } from "../helpers";
	import { userBaseURL } from "../env";
  import { useQueryClient } from "@tanstack/svelte-query";

  export let token: string | undefined;
  export let user: UserProps;

  let description = "";
  let photo: File | null;
  let error = "";
  let loading = false;
  let spanEl: any;
  const queryClient = useQueryClient();

  const handleDescription = () => {
    description = spanEl.innerText;
  }

  const handleFile = (e: any) => {
    photo = e.target.files[0];
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    loading = true;
    if (photo) {
      const fileType = photo.type;
      if (!checkValidFileType(fileType)) {
        error = `Invalid image or video, the file type is: ${fileType}`;
        loading = false;
        return false;
      } 
    }
    
    const formdata: any = new FormData();
    formdata.append("description", description);
    formdata.append("featureImage", photo);
    const res = await fetch(`${userBaseURL}/add/post`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formdata
    });
    const data = await res.json();
    
    if (!data.status) {
      error = data.error;
      loading = false;
    } else {
      // await queryClient.invalidateQueries({
      //   queryKey: ['posts'],
      //   refetchType: 'active'
      // });
      // console.log(data.data);

      $postsArray[0].unshift(data.data);
      $likes.set(data.data.id, data.data.likes);
      $postsArray = $postsArray;
      
      $posts.set(data.data.id, data.data);
      $posts = $posts;

      await queryClient.invalidateQueries({
        queryKey: ['userPosts', user.id],
        refetchType: 'active',
        exact: true
      })
      $openAddPost = false;
    }
  }
</script>

<Modal>
  <div class="tw-flex tw-flex-col tw-rounded-md tw-bg-white tw-max-w-[500px] tw-w-full">
    <div class="tw-flex tw-justify-center tw-items-center tw-relative">
      <span class="tw-text-[20px] tw-text-black tw-font-bold tw-p-3">
        Create post
      </span>
      <button class="tw-absolute tw-right-0 tw-pr-[16px] tw-cursor-pointer" on:click={() => $openAddPost = false}>
        <Close width={24} height={24} />
      </button>
    </div>
    <hr />
    <div class="tw-flex tw-flex-col tw-p-4 tw-gap-3">
      <div class="tw-flex tw-justify-start tw-gap-2 tw-items-center">
        <a href={`${user.firstName}.${user.lastName}.${user.id}`}>
          <img src={user.profilePicture ? user.profilePicture : placeholder} width="40" height="40" alt={`${user.firstName} ${user.lastName}`} class="tw-w-[40px] tw-h-[40px] tw-rounded-[1234px]" />
        </a>
        <div class="tw-flex tw-flex-col">
          <a href={`${user.firstName}.${user.lastName}.${user.id}`} class="tw-text-[15px] tw-text-black tw-font-[500] hover:tw-underline">
            {user.firstName} {user.lastName}
          </a>
          <div class="tw-flex tw-px-[8px] tw-py-[4px] tw-items-center tw-rounded-md tw-bg-gray-200 tw-gap-1">
            <Public width={12} height={12} />
            <span class="tw-text-[13px]">Public</span>
          </div>
        </div>
      </div>
      <form on:submit={handleSubmit}>
        <div class="tw-flex tw-flex-col tw-gap-5">
          <span contenteditable={true} spellcheck={false} class="tw-w-full tw-outline-none tw-resize-none tw-relative statusBox tw-cursor-text" aria-label={`What's on your mind ${user.firstName}`} tabindex={0} role="textbox" placeholder={`What's on your mind, ${user.firstName}?`} on:input={handleDescription} bind:this={spanEl}>

          </span>
          {#if !photo}
            <label class="tw-w-full tw-rounded-md tw-border-[1px] tw-border-gray-400 tw-p-2 tw-relative tw-items-center">
              <div class="tw-w-full tw-bg-gray-100 tw-rounded-md tw-h-[221px] tw-flex tw-flex-col tw-justify-center tw-text-center tw-cursor-pointer hover:tw-bg-gray-200 tw-transition-all">
                <input type="file" class="tw-w-full tw-hidden" on:change={handleFile}/>
                <div class="tw-flex tw-w-full tw-justify-center tw-items-center">
                  <div class="tw-rounded-[1000px] tw-bg-gray-300 tw-p-2">
                    <AddPhoto width={20} height={20} />
                  </div>
                </div>
                <span class="tw-text-[17px] tw-text-black tw-font-bold">
                  Click here to Add Photos/Video
                </span>
              </div>
            </label>
            {:else}
              <div class="tw-w-full tw-rounded-md tw-border-[1px] tw-border-gray-400 tw-p-2 tw-relative tw-items-center">
                {#if photo.type === "video/mp4"}
                  <video width="450" height="450" controls loop class="tw-w-[450px] tw-h-[450px]">
                    <source src={URL.createObjectURL(photo)} type="video/mp4" />
                    <track kind="captions" />
                  </video>
                {:else}
                  <img  src={URL.createObjectURL(photo)} width="450" height="450" alt="Chosen pic" class="tw-w-[450px] tw-h-[221px] tw-bg-gray-100 tw-rounded" />
                {/if}
                <div class="tw-absolute tw-top-0 tw-right-0  tw-flex tw-justify-center tw-items-center tw-p-3">
                  <button class="tw-rounded-[1234px] tw-bg-gray-200 tw-p-1 tw-px-2 tw-cursor-pointer hover:tw-brightness-75" on:click={() => photo = null}>
                    <Close width={16} height={16} />
                  </button>
                </div>
              </div>
          {/if}
          {#if error}
            <small class="tw-font-bold tw-text-red-600">
              *{error}
            </small>
          {/if}
          {#if !photo || !description}
            <span class="tw-text-center tw-rounded-md tw-bg-gray-200 tw-text-[15px] tw-text-gray-400 tw-font-bold tw-py-2">
              Post
            </span>
          {:else}
            <button class="tw-text-center tw-rounded-md tw-bg-[#0866FF] tw-text-[15px] tw-text-black tw-font-bold tw-py-2">
              Post
            </button>
          {/if}
        </div>
      </form>
    </div>
  </div>
</Modal>

{#if loading}
  <Modal>
    <Loading width={70} height={70} />
    <span class="tw-text-white tw-font-bold tw-text-[18px] tw-pt-3">
      This may take a while, please wait...
    </span>
  </Modal>
{/if}
