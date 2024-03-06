<script lang="ts">
	import type { PostProps, UserProps } from "../types";
  import Edit from 'svelte-material-icons/Pencil.svelte';
  import Clock from 'svelte-material-icons/Clock.svelte';
  import { monthToString } from "../helpers";
	import { userBaseURL } from "../env";
	import { invalidate } from "$app/navigation";

  let editBio = false;
  let bioCharacters = 101;
  let bio = "";
  export let token: string | undefined;
  export let user: UserProps;
  export let posts: PostProps[];

  const handleBio = (e: any) => {
    bio = e.target.value;
  }

  const handleEditBio = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`${userBaseURL}/update/bio`, {
      method: 'PATCH',
      headers: {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ bio })
    });

    const data = await res.json();

    if (data.status) {
      editBio = false;
      bioCharacters = 101;
      bio = "";
      invalidate('app:name');
    }
  }
</script>

<div class="tw-flex tw-flex-col tw-gap-5 homeprof-md:tw-max-w-[490px] tw-max-w-[680px] tw-w-full homeprof-md:tw-sticky homeprof-md:tw-top-[70px]">
  <!-- Intro -->
  <div class="tw-flex tw-flex-col tw-px-[16px] tw-py-[20px] tw-rounded-md tw-bg-white tw-shadow-md tw-gap-5 homeprof-md:tw-max-w-[490px] tw-max-w-[680px] tw-w-full">
    <span class="tw-text-[20px] tw-font-bold">
      Intro
    </span>
    {#if editBio}
      <form on:submit={handleEditBio}>
        <div class="tw-flex tw-flex-col tw-w-full tw-gap-1">
          <textarea rows={3} class="tw-w-full tw-rounded-md tw-bg-gray-200 tw-resize-none tw-border-[1px] tw-border-black focus:tw-border-[#0866FF] focus:tw-bg-white tw-items-center tw-text-center tw-px-[12px] tw-py-[8px] tw-outline-none tw-font-bold" maxlength={101} placeholder="Describe who you are" tabindex={0} 
          on:input={handleBio} on:keydown={(e) => {
            switch (e.key) {
              case "Backspace":
                bioCharacters < 101 && bioCharacters++;
                break;
              case "Shift":
                break;
              default: 
                bioCharacters > 0 && bioCharacters--;
                break;
            }
          }}></textarea>
          <div class="tw-flex tw-justify-end">
            <span class="tw-text-[13px] tw-text-gray-500">
              {bioCharacters} characters remaining
            </span>
          </div>
          <div class="tw-flex tw-justify-end tw-gap-1">
            <button class="tw-rounded-md tw-bg-gray-200 tw-px-[12px] tw-py-2 tw-text-[15px] tw-font-bold tw-cursor-pointer hover:tw-brightness-95" on:click={() => {
              editBio = false;
              bioCharacters = 101;
              bio = "";
            }}>
              Cancel
            </button>
            {#if bio.length === 0}
              <span class="tw-rounded-md tw-bg-gray-200 tw-px-[12px] tw-py-2 tw-text-[15px] tw-font-bold tw-text-gray-400 tw-cursor-not-allowed">
                Save
              </span>
            {:else}
              <button class="tw-rounded-md tw-bg-gray-200 tw-px-[12px] tw-py-2 tw-text-[15px] tw-font-bold tw-cursor-pointer hover:tw-brightness-95 tw-text-black">
                Save
              </button>
            {/if}
          </div>
        </div>
      </form>
    {:else}
      {#if !user.bio}
        <button class="tw-w-full tw-rounded-md tw-text-center tw-bg-gray-200 hover:tw-brightness-95 tw-px-[12px] tw-py-2 tw-cursor-pointer" on:click={() => editBio = true}>
          <span class="tw-text-[15px] tw-text-[#050505] tw-font-[600]">
            Add bio
          </span>
        </button>
      {:else}
        <div class="tw-text-center tw-text-[15px]">
          <div class="tw-flex tw-flex-col tw-gap-1 tw-py-2">
            <div class="tw-py-2 tw-break-words">
              {user.bio}
            </div>
            <div class="tw-flex tw-justify-end">
              <button class="tw-rounded-md tw-bg-gray-200 tw-px-[12px] tw-py-2 tw-text-[12px] tw-font-bold tw-cursor-pointer hover:tw-brightness-95 tw-flex tw-items-center tw-gap-1" on:click={() => editBio = true}>
                <Edit width={12} height={12} />
                <span>
                  Edit Bio
                </span>
              </button>
            </div>
          </div>
        </div>
      {/if}
    {/if}
    <div class="tw-w-full tw-rounded-md tw-text-center tw-bg-gray-200 hover:tw-brightness-95 tw-px-[12px] tw-py-2 tw-cursor-pointer">
      <span class="tw-text-[15px] tw-text-[#050505] tw-font-[600]">
        Add current city
      </span>
    </div>
  
    <div class="tw-w-full tw-rounded-md tw-text-center tw-bg-gray-200 hover:tw-brightness-95 tw-px-[12px] tw-py-2 tw-cursor-pointer">
      <span class="tw-text-[15px] tw-text-[#050505] tw-font-[600]">
        Add where you from
      </span>
    </div>
  
    <div class="tw-flex tw-gap-2 tw-items-center">
      <Clock class="tw-text-gray-400" />
      <span class="tw-text-[15px] tw-text-[#050505]">
        Joined {monthToString(new Date(user.createdAt).getMonth())} {new Date(user.createdAt).getFullYear()}
      </span>
    </div>
  </div>
  <!-- Intro End -->

  <!-- Photos (top 9) -->
  <div class="tw-flex tw-flex-col tw-px-[16px] tw-py-[20px] tw-rounded-md tw-bg-white tw-shadow-md tw-gap-5 homeprof-md:tw-max-w-[490px] tw-max-w-[680px] tw-w-full">
    <div class="tw-flex tw-justify-between tw-items-center">
      <span class="tw-text-[20px] tw-font-bold">
        Photos
      </span>
      <span class="tw-text-[17px] tw-cursor-pointer tw-text-[rgb(0,100,209)] tw-rounded-md hover:tw-bg-gray-200 tw-px-2">
        See all photos
      </span>
    </div>
    <!-- 149.98 img w*h-->
    <div class="tw-grid tw-grid-cols-3 tw-gap-1">
      {#each posts as post }
        <img src={post.featureImage} width={149} height={149} alt={post.description} class="tw-w-[149px] tw-h-[149px] tw-rounded-md"/>
      {/each}
    </div>
  </div>
  <!-- Photos end -->
</div>