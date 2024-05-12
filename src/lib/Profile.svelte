<script lang="ts">
	import type { UserProps } from "../types";
  import { page } from "$app/stores";
  import placeholder from '$lib/assets/placeholder.png';
  import Camera from 'svelte-material-icons/Camera.svelte';
  import Add from 'svelte-material-icons/Plus.svelte';
  import Edit from 'svelte-material-icons/Pencil.svelte';
  import MenuDown from 'svelte-material-icons/MenuDown.svelte';
	import { changeCoverPic, changeProfilePic } from "$lib";

  const { name } = $page.params;

  export let user: UserProps;
  // export let token: string | undefined;

  const links = [
    {
      path: `/${encodeURI(name)}`,
      name: "Posts"
    },
    // {
    //   path: `/${encodeURI(name)}/about`,
    //   name: "About"
    // },
    {
      path: `/${encodeURI(name)}/friends`,
      name: "Friends"
    },
    {
      path: `/${encodeURI(name)}/photos`,
      name: 'Photos'
    },
    {
      path: `/${encodeURI(name)}/blogs`,
      name: 'Blogs'
    },
  ];

</script>

<div class="tw-w-full tw-h-full">
  <div class="tw-shadow-md tw-w-full tw-bg-white">
    <div class="tw-flex tw-justify-center tw-w-full">
      <div class="tw-relative tw-flex tw-flex-col tw-h-full">
        <img src={user.coverPicture ? user.coverPicture : placeholder} width={1250} height={462.95} alt="Cover" class="sm:tw-h-[462.95px] tw-h-[300px]  tw-rounded-t-[0px] tw-rounded-b-md" />
        <div class="tw-absolute tw-flex tw-justify-end sm:tw-top-[400px] tw-top-[250px] tw-w-full tw-px-[20px] tw-pb-5">
          <button class="tw-flex tw-rounded-md tw-h-full tw-items-center tw-text-white tw-bg-[rgba(0,0,0,0.5)] tw-px-[12px] tw-gap-1 tw-py-2 tw-cursor-pointer hover:tw-brightness-95" on:click={() => $changeCoverPic = true}>
            <Camera width={16} height={16} />
            <span class="tw-text-[15px] tw-font-bold">
              Edit cover photo
            </span>
          </button>
        </div>
        <div class="tw-absolute sm:tw-top-[390px] tw-top-[220px] tw-pl-5">
          <div class="tw-relative">
            <img src={user.profilePicture ? user.profilePicture : placeholder} width="168" height="168" class="tw-rounded-[1000px] tw-border-white tw-border-[5px] tw-w-[168px] tw-h-[168px] hover:tw-brightness-9" alt={`${user.firstName} ${user.lastName}`} />
            <button class="tw-flex tw-items-center tw-justify-center tw-absolute tw-right-[5px] tw-bottom-[15px] tw-rounded-[1000px] tw-bg-gray-200 tw-p-2 tw-cursor-pointer hover:tw-brightness-95" on:click={() => $changeProfilePic = true}>
              <Camera width={20} height={20} />
            </button>
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
                {user.friends.length} friends
              </span>
            </div>
          </div>

          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-rounded-md tw-flex tw-bg-[#0866FF] tw-items-center tw-px-[12px] tw-py-2 tw-gap-1">
              <Add width={16} height={16} class="tw-text-white" />
              <span class="tw-text-white tw-text-[15px] tw-font-bold">
                Add to story
              </span>
            </div>

            <div class="tw-rounded-md tw-flex tw-bg-[#E4E6EB] tw-items-center tw-px-[12px] tw-py-2 tw-gap-1">
              <Edit width={16} height={16} />
              <span class="tw-text-[15px] tw-font-bold">
                Edit profile
              </span>
            </div>

            <div class="tw-rounded-md tw-flex tw-bg-[#E4E6EB] tw-items-center tw-px-[16px] tw-py-[10px] tw-gap-1">
              <MenuDown width={16} height={16} />
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