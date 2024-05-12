<script lang="ts">
	import type { LayoutData } from "../$types";
	import Blog from "$lib/Blog.svelte";

    export let data: LayoutData;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- <div class="tw-w-full tw-flex tw-justify-center">
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
            {#if $query.status === 'pending'}
                <Loading width={30} height={30} />
            {:else}
                {#if $query.data}
                    {#if $query.data.length === 0}
                        <span>No blogs yet</span>
                    {:else}
                        {#each $query.data as blog }
                            <BlogCard {blog} token={data.token} />
                        {/each}
                    {/if}
                {/if}
            {/if}
        </div>
    </div>
</div> -->
<Blog {data} />