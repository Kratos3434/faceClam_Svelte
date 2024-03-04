<script lang="ts">
	import { changeCoverPic } from "$lib";
	import Loading from "./Loading.svelte";
	import Modal from "./Modal.svelte";
  import Close from 'svelte-material-icons/Close.svelte';
  import AddPhoto from 'svelte-material-icons/PlusBoxMultiple.svelte';
  import { checkValidFileType } from "../helpers";
	import { userBaseURL } from "../env";
	import { invalidate } from "$app/navigation";

  export let photo: File | null = null;
  export let token: string | undefined;
  let loading = false;
  let error = "";

  const setPhoto = (e: any) => {
    if (e.target.files) {
      photo = e.target.files[0];
    }
  }

  const handleChangeCoverPic = async (e: any) => {
    e.preventDefault();
    loading = true;
    if (photo) {
      const fileType = photo.type;
      if (!checkValidFileType(fileType)) {
        error = "Invalid image";
        loading = false;
        return false;
      }
    }

    const formdata: any = new FormData();
    formdata.append('coverpicture', photo);

    const res = await fetch(`${userBaseURL}/update/coverpicture`, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formdata
    });

    const data = await res.json();

    if (data.status) {
      invalidate('app:name').then(() => $changeCoverPic = false);
    } else {
      console.log('Something went wrong :(');
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<Modal>
  <div class="tw-flex tw-flex-col tw-max-w-[500px] tw-w-full tw-bg-white tw-rounded-md tw-shadow-md tw-p-3 tw-gap-2">
    <div class="tw-flex tw-justify-center tw-relative">
      <span class="tw-text-[20px] tw-font-bold">
        Choose Cover Photo
      </span>
      <div class="tw-absolute tw-right-0 tw-pr-[16px] tw-cursor-pointer" on:click={() => $changeCoverPic = false}>
        <Close width={24} height={24} />
      </div>
    </div>
    <hr />
    <form on:submit={handleChangeCoverPic}>
      <div class="tw-flex tw-flex-col tw-gap-5">
        {#if !photo}
          <label class="tw-w-full tw-rounded-md tw-border-[1px] tw-border-gray-400 tw-p-2 tw-relative tw-items-center">
            <div class="tw-w-full tw-bg-gray-100 tw-rounded-md tw-h-[221px] tw-flex tw-flex-col tw-justify-center tw-text-center tw-cursor-pointer hover:tw-bg-gray-200 tw-transition-all">
              <input type="file" class="tw-w-full tw-hidden" on:change={setPhoto} />
              <div class="tw-flex tw-w-full tw-justify-center tw-items-center">
                <div class="tw-rounded-[1000px] tw-bg-gray-300 tw-p-2">
                  <AddPhoto width={20} height={20} />
                </div>
              </div>
              <span class="tw-text-[17px] tw-text-black tw-font-bold">
                Click here to Choose Photo
              </span>
            </div>
          </label>
        {:else}
          <div class="tw-w-full tw-rounded-md tw-border-[1px] tw-border-gray-400 tw-p-2 tw-relative tw-items-center">
            <img src={URL.createObjectURL(photo)} width={450} height={221} alt="Chosen" class="tw-w-full tw-bg-gray-100 tw-rounded" />
            <div class="tw-absolute tw-top-0 tw-right-0  tw-flex tw-justify-center tw-items-center tw-p-3">
              <div class="tw-rounded-[1234px] tw-bg-gray-200 tw-p-1 tw-px-2 tw-cursor-pointer hover:tw-brightness-75" on:click={() => photo = null}>
                <Close width={16} height={16} />
              </div>
            </div>
          </div>
        {/if}
        {#if error}
          <small class="tw-font-bold tw-text-red-600">
            *{error}
          </small>
        {/if}
        {#if photo}
          <button class="tw-text-center tw-rounded-md tw-bg-[#0866FF] tw-text-[15px] tw-text-black tw-font-bold tw-py-2">
            Change Cover Phto
          </button>
        {:else}
          <span class="tw-text-center tw-rounded-md tw-bg-gray-200 tw-text-[15px] tw-text-gray-400 tw-font-bold tw-py-2">
            Change Cover Photo
          </span>
        {/if}
      </div>
    </form>
  </div>
  {#if loading}
    <Modal>
      <Loading width={70} height={70} />
    </Modal>
  {/if}
</Modal>