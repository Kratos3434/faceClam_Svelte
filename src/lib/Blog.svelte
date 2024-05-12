<script lang="ts">
    import { openAddBlog } from "$lib";
	import { createQuery } from "@tanstack/svelte-query";
	import Loading from "$lib/Loading.svelte";
	import type { BlogProps } from "../types";
    import { page } from "$app/stores";
	import BlogCard from "$lib/BlogCard.svelte";
	import { publicBaseURL } from "../env";

    export let data: any;

    const getBlogByAuthorId = async (): Promise<BlogProps[]> => {
        console.log($page.params.name.split('.')[2])
        const res = await fetch(`${publicBaseURL}/blog/${$page.params.name.split('.')[2]}`);
        const d = await res.json();
        return d.data;
    }

    const query = createQuery({
        queryKey: ['blogs', $page.params.name.split('.')[2]],
        queryFn: getBlogByAuthorId,
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-w-full tw-flex tw-justify-center">
    <div class="tw-max-w-[1186px] tw-w-full tw-mt-5">
        <div class="tw-flex tw-justify-between tw-items-center">
            <div class="tw-flex tw-gap-5 tw-items-end">
                <span class="tw-font-bold tw-text-[20px]">
                    Blogs
                </span>
                {#if data.verified}
                    <span class="tw-p-[8px] tw-bg-[#42B72A] tw-rounded-md tw-text-white tw-cursor-pointer hover:tw-brightness-95 tw-font-bold" on:click={() => $openAddBlog = true}>
                        Add a new blog
                    </span>
                {/if}
            </div>
            <span>
                Sorted by: <b>Latest</b>
            </span>
        </div>
        <div class="tw-flex tw-flex-col tw-gap-5 tw-my-5">
            {#if $query.isPending}
                <Loading width={30} height={30} />
            {:else}
                {#if $query.data}
                    {#if $query.data.length === 0}
                        <span>No blogs yet</span>
                    {:else}
                        {#each $query.data as blog }
                            <BlogCard {blog} token={data.token} verified={data.verified} />
                        {/each}
                    {/if}
                {/if}
            {/if}
        </div>
    </div>
</div>