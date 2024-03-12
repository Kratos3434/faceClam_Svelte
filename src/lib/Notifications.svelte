<script lang="ts">
	import { openNotifModal } from "$lib";
	import { createQuery } from "@tanstack/svelte-query";
	import Loading from "./Loading.svelte";
	import type { PostProps, UserProps } from "../types";
	import { userBaseURL } from "../env";

    export let token: string | undefined;
    export let currentUser: UserProps;
    const getNotificationByType = async (type: string): Promise<PostProps[]> => {
        const res = await fetch(`${userBaseURL}/post/notifications/${type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json();
        return data.data;
    }

    const likeNotifications = createQuery({
        queryKey: ['likeNotif'],
        queryFn: () => getNotificationByType('LIKE'),
        staleTime: Infinity
    });

</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-fixed tw-left-0 tw-top-[58px] tw-w-full tw-h-full tw-px-3" on:click={() => $openNotifModal = false}>
    <div class="tw-absolute tw-right-0 tw-px-3 tw-max-w-[360px] tw-w-full" on:click={(e) => e.stopPropagation()}>
        <div class="tw-max-w-[360px] tw-w-full tw-shadow-md tw-rounded-md tw-bg-white tw-flex tw-flex-col tw-px-[16px] tw-py-[12px]">
            <span class="tw-text-[24px] tw-font-bold tw-py-[12px]">Notifications</span>
            <!-- Like notifications -->
            <div class="tw-flex tw-flex-col">
                <div class="tw-flex tw-justify-between tw-py-[8px]">
                    <span class="tw-text-[17px] tw-font-bold">Likes</span>
                    <span class="tw-text-[15px] tw-text-blue-600">See all</span>
                </div>
                <!-- Likes Notifications array -->
                {#if $likeNotifications.isLoading}
                    <Loading width={25} height={25} />
                {:else if $likeNotifications.isError}
                    <p>Something went wrong :{"("}</p>
                {:else if $likeNotifications.isSuccess}
                    {#if $likeNotifications.data.length === 0}
                        <p>Nothing to show here</p>
                    {:else}
                        {#each $likeNotifications.data as e }
                            {#if e.notifications.length === 0}
                                <p>Nothing to show here</p>
                            {:else if e.notifications.length === 1}
                                <a class="tw-text-[15px] hover:tw-rounded-md hover:tw-bg-gray-200 tw-p-1" href={`/${currentUser.firstName}.${currentUser.lastName}.${currentUser.id}/posts/${e.id}`}>
                                    <b>{e.notifications[0].sender.firstName} {e.notifications[0].sender.lastName}</b> has liked your post
                                </a>
                            {:else if e.notifications.length > 1}
                                <a class="tw-text-[15px] hover:tw-rounded-md hover:tw-bg-gray-200 tw-p-1" href={`/${currentUser.firstName}.${currentUser.lastName}.${currentUser.id}/posts/${e.id}`}>
                                    <b>{e.notifications[0].sender.firstName} {e.notifications[0].sender.lastName}</b> and <b>{e.notifications.length-1}</b> others liked your post
                                </a>
                            {/if}
                        {/each}
                    {/if}
                {/if}
            </div>
            <!-- Like notifications end -->
        </div>
    </div>
</div>

<!-- <span class="tw-text-[15px]"><b>{""} {""}</b> has liked your post</span> -->