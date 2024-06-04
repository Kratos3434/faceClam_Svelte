<script lang="ts">
	import Loading from "./Loading.svelte";
	import Modal from "./Modal.svelte";
  import Close from 'svelte-material-icons/Close.svelte';
	import { publicBaseURL } from "../env";
	import { goto } from "$app/navigation";
	import { openSignup } from "$lib";

  interface Props {
    email: string,
    retrieveToken: string
  };

  export let data: Props;
  let otp = "";
  let error = "";
  let submitting = false;
  let loading = false;
  let openModal = false;
  let resendError = "";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    submitting = true;
    try {
      const res = await fetch(`${publicBaseURL}/signup`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: data.email, otp })
      });

      const d = await res.json();

      if (!d.status) {
        error = d.error;
        submitting = false;
      } else {
        await fetch("/apv2/retrieveToken", {
          method: 'DELETE'
        });
        goto("/login").then(() => {
          $openSignup = false;
          submitting = false;
        })
      }
    } catch (err) {
      error = "Something went wrong :(";
      submitting = false;
    }
  }

  const handleResend = async () => {
    openModal = true;
    try {
      loading = true;
      const res = await fetch(`${publicBaseURL}/resend/otp/${data.email}`, {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${data.retrieveToken}`
        }
      });

      const d = await res.json();

      if (!d.status) {
        resendError = d.error;
        loading = false;
      } else {
        resendError = "";
        loading = false;
      }
    } catch (err) {
      resendError = "Something went wrong :(";
      loading = false;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-flex tw-justify-center tw-flex-col tw-h-[100vh] tw-items-center tw-py-5 tw-bg-white tw-px-5">
  <div class="tw-flex tw-justify-center">
    <div class="tw-flex tw-flex-col tw-rounded-md tw-shadow-md tw-max-w-[500px] tw-w-full">
      <div class="tw-px-[16px] tw-py-[18px]">
        <h2 class="tw-text-[20px] tw-font-bold">Enter the code from your email</h2>
      </div>
      <hr />
      <div class="tw-flex tw-flex-col tw-gap-3">
        <span class="tw-px-[16px] tw-pt-[16px]">
          Let us know this email belongs to you. Enter the code in the email sent to
          <span class="tw-font-bold">{data.email}</span>
        </span>
        <form on:submit={handleSubmit}>
          <div class="tw-flex tw-flex-col tw-px-[16px] tw-gap-3">
            <input type="text" class="tw-rounded-md tw-border-[1px] tw-border-[#DEE1E4] tw-px-[40px] tw-py-[18px] tw-outline-[#0866FF] tw-max-w-[137px] tw-w-full" bind:value={otp} maxlength={6} />
            {#if error}
              <small class="tw-text-red-900">*{error}</small>
            {/if}
            <span class="tw-text-[15px] tw-text-[#1877F2] tw-mb-5 tw-cursor-pointer" on:click={handleResend}>Send email again</span>
          </div>
          <hr />
          <div class="tw-flex tw-justify-end tw-px-[16px] tw-py-[12px] tw-gap-5 tw-items-center tw-flex-wrap">
            <span class="tw-bg-[#EBEDF0] tw-rounded-md tw-px-3 tw-py-2 tw-font-bold tw-cursor-pointer hover:tw-bg-gray-300">
              Update contact info
            </span>
            {#if otp}
              {#if !submitting}
                <button class="tw-bg-[#1877F2] tw-text-white tw-px-10 tw-rounded-md tw-font-bold tw-py-2">
                  Continue
                </button>
              {:else}
                <div class="tw-flex tw-gap-[8px] tw-items-center">
                  <span class="tw-bg-[#EBEDF0] tw-text-[#BEC3CB] tw-px-10 tw-rounded-md tw-font-bold tw-py-2">
                    Continue
                  </span>
                  <Loading width={15} height={10} />
                </div>
              {/if}
            {:else}
              <span class="tw-bg-[#EBEDF0] tw-text-[#BEC3CB] tw-px-10 tw-rounded-md tw-font-bold tw-py-2">
                Continue
              </span>
            {/if}
          </div>
        </form>
      </div>
    </div>
  </div>

  {#if openModal}
    <Modal>
      <div class="tw-rounded-md tw-shadow-md tw-bg-white tw-py-[18px] tw-px-[16px] tw-flex tw-flex-col tw-gap-[18px] tw-max-w-[565px] tw-w-full tw-items-centerr tw-transition-all">
        {#if loading}
          <div class="tw-flex tw-justify-center">
            <Loading width={40} height={40} />
          </div>
        {:else}
          <div class="tw-flex tw-justify-between">
            <span class="tw-font-bold tw-text-[20px]">
              {#if resendError}
                Email sent
              {:else}
                Error while sending email
              {/if}
            </span>
            <span class="tw-cursor-pointer" on:click={() => openModal = false}>
              <Close width={36} height={36} />
            </span>
          </div>
          <div class="tw-max-w-[533px] tw-w-full tw-text-[17px] tw-text-[#606770]">
            {#if !resendError}
              To confirm your email, enter the 6-digit code in the email we just sent to <span class="tw-text-[17px] tw-font-bold"> {data.email}</span>. Be sure to check your spam folder.
            {:else}
              {resendError}
            {/if}
          </div>
          <div class="tw-flex tw-justify-end">
            <span class="tw-text-white tw-rounded-md tw-text-[20px] tw-bg-[#1877F2] tw-px-8 tw-font-bold tw-py-1 tw-cursor-pointer" on:click={() => openModal = false}>
              OK
            </span>
          </div>
        {/if}
      </div>
    </Modal>
  {/if}
</div>