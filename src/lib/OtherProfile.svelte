<script lang="ts">
  import type { UserProps } from "../types";
  import { page } from "$app/stores";
  import placeholder from '$lib/assets/placeholder.png';
  import AddFriendIcon from 'svelte-material-icons/AccountPlus.svelte';
  import FollowIcon from 'svelte-material-icons/PlusBoxMultiple.svelte';

  export let user: UserProps;
  export let token: string | undefined;
  const { name } = $page.params;

  const links = [
    {
      path: `/${encodeURI(name)}`,
      name: "Posts"
    },
    {
      path: `/${name}/about`,
      name: "About"
    },
    {
      path: `/${name}/friends`,
      name: "Friends"
    }
  ];
</script>

<div class="tw-w-full tw-h-full">
  <div class="tw-shadow-md tw-w-full tw-bg-white">
    <div class="tw-flex tw-justify-center tw-w-full">
      <div class="tw-relative tw-flex tw-flex-col tw-h-full">
        <img src={user.coverPicture ? user.coverPicture : placeholder} width={1250} height={462.95} alt="Cover" class="tw-h-[462.95px]  tw-rounded-t-[0px] tw-rounded-b-md" />
        <div class="tw-absolute tw-top-[390px] tw-pl-5">
          <div class="tw-relative">
            <img src={user.profilePicture ? user.profilePicture : placeholder} width="168" height="168" class="tw-rounded-[1000px] tw-border-white tw-border-[5px] tw-w-[168px] tw-h-[168px] hover:tw-brightness-9" alt={`${user.firstName} ${user.lastName}`} />
          </div>
        </div>
        <div class="tw-flex tw-justify-between tw-items-center tw-pb-[16px] tw-flex-wrap tw-px-5 tw-gap-5">
          <div class="tw-flex tw-items-center tw-h-full tw-flex-wrap">
            <div class="tw-w-[168px] tw-mr-[16px] tw-h-[84px]">

            </div>
            <div class="tw-flex tw-flex-col tw-mtt-[32px] tw-mb-[16px]">
              <span class="tw-text-[32px] tw-font-bold">
                {user.firstName} {user.lastName}
              </span>
              <span class="tw-text-[15px] tw-text-[#65676B] tw-font-bold">
                0 friends
              </span>
            </div>
          </div>
          <div class="tw-flex tw-gap-2">
            <div class="tw-rounded-md tw-text-white tw-flex tw-items-center tw-font-bold tw-bg-[#0866FF] tw-px-[12px] tw-py-[10px] tw-gap-2 hover:tw-brightness-95 tw-cursor-pointer">
              <AddFriendIcon width={16} height={16} />
              <span class="tw-text-[15px]">Add friend</span>
            </div>
            <div class="tw-rounded-md tw-text-white tw-flex tw-items-center tw-font-bold tw-bg-[#0866FF] tw-px-[12px] tw-py-[10px] tw-gap-2 hover:tw-brightness-95 tw-cursor-pointer">
              <FollowIcon width={16} height={16} />
              <span class="tw-text-[15px]">Follow</span>
            </div>
          </div>
        </div>
        <div class="tw-max-w-[1210px] tw-w-full tw-px-[20px] tw-gap-1 tw-flex tw-flex-col">
          <hr />
          <div class="tw-flex tw-gap-1">
            {#each links as link }
              <a class={`tw-flex tw-justify-center tw-items-center tw-h-full tw-px-[16px] tw-py-5 hover:tw-bg-gray-200 tw-border-bb-[4px] tw-border-white hover:tw-rounded-md tw-border-b-[4px] ${$page.url.pathname === link.path ? "tw-border-b-[#0866FF]" : "tw-border-b-white"}`} href={link.path}>
                <span class="tw-text-[15px] tw-font-bold">
                  {link.name}
                </span>
              </a>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>