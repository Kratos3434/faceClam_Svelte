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
  import emblaCarouselSvelte from 'embla-carousel-svelte';

  interface ImagesProps {
    img: string,
    width: number,
    height: number,
    alt: string,
    type: string,
    name: string
  }


  export let token: string | undefined;
  export let user: UserProps;

  let emblaApi: any;
  let description = "";
  const photos: File[] = [];
  $: photo = photos;
  let error = "";
  let loading = false;
  let spanEl: any;
  let displayedImages: ImagesProps[] = [];
  let selectedIndex = 0;
  const queryClient = useQueryClient();

  const handleDescription = () => {
    description = spanEl.innerText;
  }

  const handleFile = (e: any) => {
    photo.push(e.target.files[0]);
    photo = photo;
    displayedImages.unshift({
      img: URL.createObjectURL(e.target.files[0]),
      width: 450,
      height: 450,
      alt: 'Chosen Photo',
      type: e.target.files[0].type,
      name: e.target.files[0].name
    });
    displayedImages = displayedImages;
    console.log(photo)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (photo) {
      // const fileType = photo[0].type;
      photo.map(e => {
        if (!checkValidFileType(e.type)) {
          error = `Invalid image or video, the file type is: ${e.type}`;
          loading = false;
          return false;
        } 
      })
    }
    loading = true;
    
    const formdata: any = new FormData();
    formdata.append("description", description);
    // formdata.append("featureImage", photo);
    photo.map(e => formdata.append('featureImage', e));
    console.log('featureImage:', formdata.description);
    // `${userBaseURL}/add/post`
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

  function onInit(event: any) {
    emblaApi = event.detail
    emblaApi.on('scroll', () => {
      selectedIndex = emblaApi.selectedScrollSnap();
    })
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
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
          {#if photo.length === 0}
            <label class="tw-w-full tw-rounded-md tw-border-[1px] tw-border-gray-400 tw-p-2 tw-relative tw-items-center">
              <div class="tw-w-full tw-bg-gray-100 tw-rounded-md tw-h-[221px] tw-flex tw-flex-col tw-justify-center tw-text-center tw-cursor-pointer hover:tw-bg-gray-200 tw-transition-all">
                <input type="file" class="tw-w-full tw-hidden" on:change={handleFile} multiple/>
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
                <!-- {#if photo.type === "video/mp4"}
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
                </div> -->
                <!-- Swiping image -->
                {#if displayedImages.length === 1}
                  {#if photo[0].type === "video/mp4"}
                    <video width="450" height="450" controls loop class="tw-w-[450px] tw-h-[450px]">
                      <source src={displayedImages[0].img} type="video/mp4" />
                      <track kind="captions" />
                    </video>
                  {:else}
                    <img  src={displayedImages[0].img} width="450" height="450" alt="Chosen pic" class="tw-w-[450px] tw-h-[221px] tw-bg-gray-100 tw-rounded" />
                  {/if}
                  <div class="tw-absolute tw-top-0 tw-right-0  tw-flex tw-justify-center tw-items-center">
                    <span class="tw-rounded-[1234px] tw-bg-gray-200 tw-p-1 tw-px-2 tw-cursor-pointer hover:tw-brightness-75" on:click={() => {
                      displayedImages = displayedImages.filter(e => e.name != photo[0].name);
                      photo = photo.filter(e => e.name != photo[0].name);
                    }}>
                      <Close width={16} height={16} />
                    </span>
                  </div> 
                {:else}
                  <div class="embla" use:emblaCarouselSvelte on:emblaInit="{onInit}">
                    <div class="embla__container">
                      {#each displayedImages as image }
                        <div class="embla__slide tw-relative">
                          {#if image.type === 'video/mp4'}
                            <video width={image.width} height={image.height} controls style={`width: ${image.width}px;height: ${image.height}px;object-fit: fill;`}>
                              <source src={image.img} type="video/mp4" />
                              <track kind="captions" />
                            </video>
                          {:else}
                            <img src={image.img} width={image.width} height={image.height} alt={image.alt} style={`width: ${image.width}px;height: ${image.height}px`} />
                          {/if}
                          <div class="tw-absolute tw-top-0 tw-right-0  tw-flex tw-justify-center tw-items-center">
                            <span class="tw-rounded-[1234px] tw-bg-gray-200 tw-p-2 tw-cursor-pointer hover:tw-brightness-75" on:click={() => {
                              photo = photo.filter(e => e.name != image.name);
                              displayedImages = displayedImages.filter(e => e.name != image.name);
                            }}>
                              <Close width={16} height={16} />
                            </span>
                          </div> 
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
                <!-- Swiping Image end -->
                <!-- <div class="tw-absolute tw-top-0 tw-right-0  tw-flex tw-justify-center tw-items-center tw-p-3">
                  <button class="tw-rounded-[1234px] tw-bg-gray-200 tw-p-1 tw-px-2 tw-cursor-pointer hover:tw-brightness-75" on:click={() => photo = []}>
                    <Close width={16} height={16} />
                  </button>
                </div>  -->
                {#if displayedImages.length > 1}
                  <div class="tw-absolute tw-flex tw-justify-center tw-w-full tw-bottom-3 tw-gap-2">
                    {#each displayedImages as _, idx }
                      <div class={`tw-p-1 tw-rounded-[1000px] ${selectedIndex === idx ? "tw-bg-blue-600" : "tw-bg-gray-400"} tw-w-[15px] tw-h-[15px]`}></div>
                    {/each}
                  </div>
                {/if}
                <div class="tw-absolute tw-top-0 tw-left-0 tw-p-3">
                  <label class="tw-w-full tw-rounded-md tw-relative tw-items-center">
                    <div class="tw-w-full tw-bg-gray-100 tw-rounded-md tw-flex tw-flex-col tw-justify-center tw-text-center tw-cursor-pointer hover:tw-bg-gray-200 tw-transition-all">
                      <input type="file" class="tw-w-full tw-hidden" on:change={handleFile} multiple/>
                      <!-- <div class="tw-flex tw-w-full tw-justify-center tw-items-center">
                        <div class="tw-rounded-[1000px] tw-bg-gray-300 tw-p-2">
                          <AddPhoto width={20} height={20} />
                        </div>
                      </div> -->
                      <span class="tw-text-[17px] tw-text-black tw-font-semibold tw-p-1">
                        Click here to Add Photos/Video
                      </span>
                    </div>
                  </label>
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

<style>
  .embla {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  .embla__container {
    display: flex;
    width: 100%;
    height: 100%;
  }
  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  }
 </style>
