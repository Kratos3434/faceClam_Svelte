<script>
  import { openPopup } from "$lib";
	import Modal from "./Modal.svelte";
  import Close from 'svelte-material-icons/Close.svelte';
</script>

<Modal>
  <div class="tw-rounded-md tw-bg-white tw-shadow-md tw-max-w-[500px] tw-w-full tw-px-[16px] tw-py-[12px] tw-text-center tw-flex tw-flex-col tw-gap-2">
    <div class="tw-relative">
      <span class="tw-text-[40px] tw-font-bold tw-text-[#0866FF] sm:tw-text-[60px]">faceClam</span>
      <button class="tw-absolute tw-right-0 tw-top-0 tw-rounded-[1000px] tw-bg-gray-200 hover:tw-brightness-95" on:click={() => $openPopup = false}>
        <Close width={24} height={24} />
      </button>
    </div>
    <hr />
    <p class="tw-py-[8px] tw-font-bold tw-text-[18px]">Login or signup to interact, post, and like pictures on faceClam</p>
    <p>Click the button below to login or signup</p>
    <hr />
    <a class="tw-px-[16px] tw-py-[12px] tw-rounded-md tw-text-white tw-font-bold tw-text-[20px] tw-bg-[#00A400] hover:tw-brightness-95" href="/login">
      Log in
    </a>
  </div>
</Modal>