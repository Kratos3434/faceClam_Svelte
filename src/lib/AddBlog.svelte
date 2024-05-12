<script lang="ts">
	import { openAddBlog } from "$lib";
	import { useQueryClient } from "@tanstack/svelte-query";
	import { userBaseURL } from "../env";
	import Loading from "./Loading.svelte";
	import Modal from "./Modal.svelte";
    import Close from 'svelte-material-icons/Close.svelte';

    let featureImage: File | null = null;
    let divEl: any;
    export let token: string | undefined;
    export let currentUserId: number;
    // let description = "";
    let title = "";
    let subtitle = "";
    let content = "";
    let error = "";
    let loading = false;
    const queryClient = useQueryClient();

    const handleFile = (e: any) => {
        featureImage = e.target.files[0];
    }

    const handleDescription = () => {
        content = divEl.innerText;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!title) {
            error = "Title is required";
            return false;
        }
        if (!subtitle) {
            error = "Subtitle is required";
            return false;
        }
        if (!featureImage) {
            error = "Feature image is required";
            return false;
        }
        if (!content) {
            error = "Content is required";
            return false;
        }

        loading = true;
        let formdata: any = new FormData();

        formdata.append('featureImage', featureImage);
        formdata.append('title', title);
        formdata.append('subtitle', subtitle);
        formdata.append('content', content);

        const res = await fetch(`${userBaseURL}/add/blog`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formdata
        });

        const data = await res.json();
        console.log(data);

        if (data.status) {
            await queryClient.invalidateQueries({
                queryKey: ['blogs', `${currentUserId}`],
                exact: true
            });
            $openAddBlog = false;
        } else {
            error = "Something went wrong :(";
            loading = false;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<Modal>
    <div class="tw-max-w-[600px] tw-w-full tw-bg-white tw-shadow-md tw-rounded-md tw-h-[900px] tw-overflow-y-auto">
        <!-- <div class="tw-flex tw-justify-center tw-items-center tw-sticky tw-top-0">
            <span class="tw-text-[20px] tw-font-bold tw-p-3">
                Add Blog
            </span>
        </div> -->
        <div class="tw-w-full">
            <div class="tw-sticky tw-top-0">
                <div class="tw-flex tw-justify-center tw-items-center tw-relative tw-bg-white tw-shadow-md">
                    <span class="tw-text-[20px] tw-font-bold tw-p-3">
                        Add Blog
                    </span>
                    <span class="tw-absolute tw-right-[16px] tw-cursor-pointer" on:click={() => $openAddBlog = false}>
                        <Close width={30} height={30} />
                    </span>
                </div>
            </div>
            <form class="tw-my-5 tw-flex tw-flex-col tw-gap-5 tw-px-[16px]" on:submit={handleSubmit}>
                <div class="tw-flex tw-flex-col tw-gap-1">
                    <span class="tw-font-bold">Title</span>
                    <input type="text" class="tw-w-full tw-outline-none tw-border-[1px] tw-rounded-md tw-border-gray-200 tw-p-3" placeholder="e.g. My First Blog" 
                    bind:value={title} />
                </div>
                <div class="tw-flex tw-flex-col tw-gap-1">
                    <span class="tw-font-bold">Subtitle</span>
                    <input type="text" class="tw-w-full tw-outline-none tw-border-[1px] tw-rounded-md tw-border-gray-200 tw-p-3" placeholder="Add a short description" 
                    bind:value={subtitle} />
                </div>
                <div class="tw-flex tw-flex-col tw-gap-1">
                    <span class="tw-font-bold">Feature Image</span>
                    {#if !featureImage}
                        <label class="tw-max-w-[300px] tw-w-full tw-rounded-md tw-border-[1px] tw-border-gray-400 tw-p-2 tw-items-center">
                            <div class="tw-max-w-[300px] tw-w-full tw-bg-gray-100 tw-rounded-md tw-flex tw-flex-col tw-justify-center tw-text-center tw-cursor-pointer hover:tw-bg-gray-200 tw-transition-all">
                                <input type="file" class="tw-w-full tw-hidden" on:change={handleFile} />
                                <span class="tw-text-[17px] tw-text-black tw-font-bold">
                                    Click here to Add Image
                                </span>
                            </div>
                        </label>
                    {:else}
                        <span class="tw-border-[1px] tw-rounded-md tw-border-gray-200 tw-p-3 tw-flex tw-justify-between tw-items-center">
                            <span>
                                {featureImage.name}
                            </span>
                            <span class="tw-cursor-pointer" on:click={() => featureImage = null}>
                                <Close width={20} height={20} color="red" />
                            </span>
                        </span>
                    {/if}
                </div>
                <div class="tw-flex tw-flex-col tw-gap-1">
                    <span class="tw-font-bold">Content</span>
                    <!-- <div class="tw-border-[1px] tw-p-3 tw-border-gray-200 tw-rounded-md tw-h-[40px] tw-overflow-y-auto">
                        <div contenteditable={true} spellcheck="false" class="tw-w-full tw-outline-none tw-resize-none tw-relative statusBox tw-cursor-text tw-border-[1px] tw-p-3 tw-border-gray-200 tw-rounded-md tw-h-[40px] tw-overflow-y-auto" aria-label={`What's on your mind?`} tabindex={0} role="textbox" placeholder={`What's on your mind?`} bind:this={divEl} on:input={handleDescription}>
                        </div>
                    </div> -->
                    <div contenteditable={true} spellcheck="false" class="tw-w-full tw-outline-none tw-resize-none tw-relative statusBox tw-cursor-text tw-border-[1px] tw-p-3 tw-border-gray-200 tw-rounded-md tw-h-[350px] tw-overflow-y-auto" aria-label={`What's on your mind?`} tabindex={0} role="textbox" placeholder={`What's on your mind?`} bind:this={divEl} on:input={handleDescription}>
                    </div>
                </div>
                {#if error}
                    <small class="tw-text-center tw-text-red-500 tw-font-bold">*{error}</small>
                {/if}
                <div class="tw-flex tw-justify-center tw-items-center">
                    <button class="tw-text-[20px] tw-text-white tw-font-bold tw-bg-[#0866FF] tw-rounded-md tw-p-3 hover:tw-brightness-95">
                        Add blog
                    </button>
                </div>
            </form>
        </div>
    </div>
    {#if loading}
        <Modal>
            <Loading width={70} height={70} />
        </Modal>
    {/if}
</Modal>