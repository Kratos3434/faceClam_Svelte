<script lang="ts">
	import { goto } from "$app/navigation";
	import { publicBaseURL } from "../env";
	import Loading from "./Loading.svelte";
  import Sad from 'svelte-material-icons/EmoticonSadOutline.svelte';

  export let token: string | undefined;
  export let valid: boolean;
  export let code: number;

  let hasExpired = false;
  let loading = false;
  let password = "";
  let password2 = "";
  let error = "";

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    loading = true;
    //Validate again if token is valid or has expired
    const validateRes = await fetch(`${publicBaseURL}/token/verify/${token}`);

    if (validateRes.status === 401) {
      loading = false;
      hasExpired = true;
      return false;
    } else if (validateRes.status === 400) {
      goto("/login");
      return false;
    }
    //If not, then proceed to change password
    const res = await fetch(`${publicBaseURL}/forgot/password`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        password,
        password2,
        token
      })
    });

    const data = await res.json();

    if (data.status) {
      goto("/login");
    } else {
      error = data.error;
      loading = false;
    }
  }
</script>

<div class="tw-flex tw-flex-col tw-h-[100vh] tw-justify-center tw-items-center">
  {#if valid || !hasExpired}
    <div class="tw-rounded-md tw-bg-white tw-flex tw-flex-col tw-shadow-md tw-max-w-[500px] tw-w-full tw-py-2">
      <h1 class="tw-text-[28px] tw-font-bold tw-px-[16px] tw-text-center">New Password</h1>
      <hr class="tw-my-3" />
      <form class="tw-flex tw-flex-col tw-px-[16px] tw-gap-3" on:submit={handleChangePassword}>
        <input type="password" placeholder="Password" class="tw-px-[16px] tw-py-[14px] tw-rounded-md tw-border-[1px] tw-border-gray-400 tw-w-full" bind:value={password} />
        <input type="password" placeholder="Confirm Password" class="tw-px-[16px] tw-py-[14px] tw-rounded-md tw-border-[1px] tw-border-gray-400 tw-w-full" bind:value={password2} />
        <hr />
        {#if error}
          <small class="tw-text-center tw-text-red-600">*{error}</small>
        {/if}
        {#if (password && password2) && !loading}
          <button class="tw-bg-[#1877F2] tw-px-[16px] tw-py-[14px] tw-rounded-md tw-text-white tw-font-bold hover:tw-brightness-95">
            Change Password
          </button>
        {:else}
          <span class="tw-bg-gray-500 tw-px-[16px] tw-py-[14px] tw-rounded-md tw-text-white tw-font-bold tw-text-center tw-cursor-not-allowed tw-flex tw-justify-center tw-items-center tw-gap-3">
            Change Password
            {#if loading}
              <Loading width={17} height={17} />
            {/if}
          </span>
        {/if}
      </form>
    </div>
  {:else}
    {#if code === 401 || hasExpired}
      <div class="tw-text-center tw-flex tw-flex-col tw-gap-3">
        <span class="tw-text-[#0866FF] sm:tw-text-[60px] tw-text-[50px] tw-font-bold">faceClam</span>
        <span class="tw-text-[30px] tw-font-bold" >This link have expired <Sad /></span>
        <span class="tw-text-[30px] tw-font-bold">This happens when you wait for too long to reset your password</span>
        <a href="/login/identify" class="tw-text-[16px] tw-text-blue-600 hover:tw-underline">
          Send another email
        </a>
      </div>
      {:else}
        <div>Invalid token</div>
    {/if}
  {/if}
</div>