<script lang="ts">
	import { useQueryClient } from "@tanstack/svelte-query";
	import { generateDate } from "../helpers";
	import type { BlogProps } from "../types";
    import Trash from 'svelte-material-icons/TrashCanOutline.svelte';
    import Check from 'svelte-material-icons/Check.svelte';
    import Close from 'svelte-material-icons/Close.svelte';
	import Loading from "./Loading.svelte";
	import { userBaseURL } from "../env";

    export let blog: BlogProps;
    export let token: string | undefined;
    export let verified: boolean;

    let confirm = false;
    let loading = false;
    const queryClient = useQueryClient();

    const deleteById = async () => {
        loading = true;
        const res = await fetch(`${userBaseURL}/blog/${blog.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (data.status) {
            await queryClient.invalidateQueries({
                queryKey: ['blogs', `${blog.author.id}`],
                exact: true
            })
            loading = false;
        } else {
            loading = false;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={`tw-flex tw-bg-white tw-shadow-md tw-rounded-md tw-w-full hover:tw-scale-[1.01] tw-cursor-pointer tw-transition-all tw-relative ${loading && 'tw-animate-pulse'}`}>
    {#if verified}
        <div class="tw-absolute tw-top-[16px] tw-right-[16px]">
            {#if !loading}
                {#if !confirm}
                    <span on:click={() => confirm = true}>
                        <Trash width={30} height={30} color="red" />
                    </span>
                {:else}
                    <div>
                        <span>are you sure?</span>
                        <div class="tw-flex tw-gap-1">
                            <span on:click={deleteById}>
                                <Check width={25} height={25} color="green" />
                            </span>
                            <span on:click={() => confirm = false}>
                                <Close width={25} height={25} color="red" />
                            </span>
                        </div>
                    </div>
                {/if}
            {:else}
                <span>
                    <Loading width={20} height={20} />
                </span>
            {/if}
        </div>
    {/if}
    <img src={blog.featureImage} width="300" height="200" alt={blog.title} class="tw-w-[300px] tw-h-[200px] tw-rounded-tl-md tw-rounded-bl-md" />
    <div class="tw-flex tw-flex-col tw-p-5 tw-justify-between">
        <div>
            <span class="tw-text-[25px] tw-font-bold">{blog.title}</span>
            <p>{blog.subtitle}</p>
        </div>
        <span>
            Created on: <b>{generateDate(blog.createdAt)}</b>
        </span>
    </div>
</div>