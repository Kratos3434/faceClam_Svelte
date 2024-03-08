<script lang="ts">
	import type { UserProps } from "../types";
  import placeholder from '$lib/assets/placeholder.png';

  export let user: UserProps;
</script>

<div class="tw-rounded-md tw-bg-white tw-shadow-lg tw-max-w-[185px] tw-max-h-[286px] tw-w-full tw-h-full tw-flex tw-flex-col">
  <a href={`/${user.firstName}.${user.lastName}.${user.id}`}>
    <img src={user.profilePicture ? user.profilePicture : placeholder} width={185} height={185} alt={`${user.firstName} ${user.lastName}`} class="tw-w-[185px] tw-h-[185px] tw-rounded-t-md" />
  </a>
  <div class="tw-px-[12px] tw-py-[8px]">
    <a class="tw-text-[17px] tw-font-bold hover:tw-underline" href={`/${user.firstName}.${user.lastName}.${user.id}`}>{(user.firstName + " " + user.lastName).length > 17 ? `${(user.firstName + " " + user.lastName).substring(0, 15) + "...."}` : `${user.firstName} ${user.lastName}`}</a>
    <div></div>
    <div></div>
  </div>
</div>