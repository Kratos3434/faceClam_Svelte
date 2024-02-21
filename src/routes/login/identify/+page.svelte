<script lang="ts">
	import Loading from "$lib/Loading.svelte";
	import { publicBaseURL } from "../../../env";

  let showSuccessMsg = false;
  let loading = false;
  let error = "";
  let email = "";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    loading = true;
    if (!email) {
      error = "Email is required";
      return false;
    }
    try {
      const res = await fetch(`${publicBaseURL}/forgot/link/${email}`);
      const data = await res.json();

      if (data.status) {
        error = "";
        showSuccessMsg = true;
      } else {
        error = "Something went wrong, please try again :(";
        loading = false;
      }
    } catch (err) {
      error = "Something went wrong, please try again :(";
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>faceClam - forgot password</title>
  <meta name="description" content="Connect with friends and the world around you on faceClam" />
</svelte:head>

<div class="tw-flex tw-justify-center tw-flex-col tw-h-[100vh] tw-items-center tw-py-5 tw-px-5">
  <div class="tw-flex tw-flex-col tw-rounded-md tw-shadow-md tw-bg-white">
    {#if !showSuccessMsg}
      <span class="tw-text-[20px] tw-font-bold tw-p-[18px]">Find your account</span>
      <hr class="tw-text-[#E5E5E5]" />
      <form on:submit={handleSubmit}>
        <div class="tw-flex tw-flex-col tw-m-[16px] tw-gap-3">
          <span class="tw-text-[17px] tw-max-w-[464px] tw-w-full">Please enter your email to search for your account</span>
          <input type="email" placeholder="Email" class="tw-w-full tw-rounded-md tw-border-[1px] tw-border-[#CCD0D5] tw-py-[16px] tw-pl-[16px] tw-outline-none" bind:value={email} />
        </div>
        <hr class="tw-text-[#E5E5E5]" />
        {#if error}
          <small class="tw-p-1 tw-text-red-600 tw-font-bold">{error}</small>
        {/if}
        <div class="tw-flex tw-justify-end tw-p-[16px] tw-gap-3">
          <a href="/login" class="tw-rounded-md tw-px-[20px] tw-text-[#4B4F56] tw-bg-[#E4E6EB] tw-font-bold tw-py-2 hover:tw-brightness-95">
            Cancel
          </a>
          {#if !email || loading}
            <span class="tw-rounded-md tw-bg-[#E4E6EB] tw-px-[20px] tw-py-2 tw-font-bold tw-text-white hover:tw-brightness-95 tw-cursor-not-allowed tw-flex tw-items-center tw-gap-2">
              Search
              {#if loading}
                <Loading width={15} height={15} />
              {/if}
            </span>
          {:else}
            <button class="tw-rounded-md tw-bg-[#1877F2] tw-px-[20px] tw-py-2 tw-font-bold tw-text-white hover:tw-brightness-95">
              Search
            </button>
          {/if}
        </div>
      </form>
    {:else}
      <span class="tw-text-[20px] tw-font-bold tw-p-[18px]">A password reset link has been sent to: <bt /><small>{email}</small></span>
      <hr class="tw-text-[#E5E5E5]"/>
      <div class="tw-flex tw-flex-col tw-gap-3 tw-px-[16px] tw-text-center tw-py-2">
        <span class="tw-text-[17px] tw-max-w-[464px] tw-w-full">If this email exists, you will receive an email shortly, please check your inbox or spam.</span>
        <hr />
        <div class="tw-flex tw-justify-between">
          <a href="/login" class="tw-text-[15px] hover:tw-underline tw-text-blue-600">Login using password</a>
          <button class="tw-text-[15px] hover:tw-underline tw-text-blue-600 tw-cursor-pointer" on:click={() => {
            email = "";
            error = "";
            loading = false;
            showSuccessMsg = false;
          }}>
            try another email
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>