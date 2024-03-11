<script lang="ts">
	import { openNotifModal } from "$lib";
	import { createQuery } from "@tanstack/svelte-query";
	import Loading from "./Loading.svelte";
	import type { NotificationProps } from "../types";
	import { userBaseURL } from "../env";

    export let token: string | undefined;

    const getNotificationByType = async (type: string): Promise<NotificationProps[]> => {
        const res = await fetch(`${userBaseURL}/notification/list/${type}`, {
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
                    {#if $likeNotifications.data?.length === 0}
                        <p>Nothing to show here</p>
                    {:else}
                        {#each $likeNotifications.data as e }
                            <span class="tw-text-[15px]"><b>{e.sender.firstName} {e.sender.lastName}</b> has liked your post</span>
                        {/each}
                    {/if}
                {/if}
            </div>
            <!-- Like notifications end -->
        </div>
    </div>
</div>