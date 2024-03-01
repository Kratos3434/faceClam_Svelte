<script lang="ts">
  import EyeOutline from "svelte-material-icons/EyeOutline.svelte";
  import EyeOffOutline from "svelte-material-icons/EyeOffOutline.svelte";
  import Signup from "$lib/Signup.svelte";
  import { openSignup } from "$lib";
	import Loading from "$lib/Loading.svelte";
	import Modal from "$lib/Modal.svelte";
	import { goto, invalidateAll } from "$app/navigation";
  import { socket } from "../../socket";

  let showPass = false;
  let email = "";
  let password = "";
  const error = { status: false, error: ""};
  let loading = false;

  const handlePassword = (e: any) => {
    password = e.target.value;
  }

  const handleLogin = async (e: any) => {
    e.preventDefault();
    loading = true;
    if (!email) {
      error.status = true;
      error.error = "Email is required"
      return false;
    }
    if (!password) {
      error.status = false;
      error.error = "Password is required";
      return false;
    }

    try {
      const res = await fetch("/api/v1/public/signin", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!data.status) {
        error.status = true;
        error.error = data.error;
        loading = false;
      } else {
        // goto("/").then(() => invalidateAll());
        invalidateAll().then(() => {
          socket.connect();
          socket.emit("join", {
            email: data.data.email
          });
          goto("/");
        });
      }
    } catch (err) {
      error.status = true;
      error.error = "Something went wrong, please try again :(";
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>faceClam - login or signup</title>
  <meta name="description" content="Connect with friends and the world around you on faceClam" />
</svelte:head>

<main class="tw-flex tw-justify-center tw-flex-col tw-items-center tw-w-full tw-h-[100vh] tw-py-5 tw-px-[16px]">
  <div class="tw-flex tw-gap-10 login-xl:tw-gap-24 login-xl:tw-flex-nowrap tw-flex-wrap tw-justify-center">

    <div class="tw-flex tw-flex-col tw-justify-center login-xl:tw-text-start tw-text-center">
      <span class="tw-text-[#0866FF] sm:tw-text-[60px] tw-text-[50px] tw-font-bold">
        faceClam
      </span>
      <span class="sm:tw-text-[28px] tw-text-[20px] tw-max-w-[500px] tw-w-full">
        Connect with friends and the world around you on faceClam
      </span>
    </div>

    <div class="tw-flex tw-flex-col tw-rounded-xl tw-shadow-md tw-max-w-[396px] tw-w-full tw-bg-white tw-p-5 tw-justify-center tw-gap-4">

      <form on:submit={handleLogin}>
        <div class="tw-flex tw-flex-col tw-gap-3">
          <input type="email" placeholder="Email" class="tw-w-full tw-px-[16px] tw-py-[14px] tw-rounded tw-border-2 tw-border-[#DDDFE2] tw-outline-none focus:tw-border-[#0866FF]" bind:value={email} />
          <div class="tw-flex tw-justify-between tw-w-full tw-px-[16px] tw-py-[14px] tw-rounded tw-border-2 tw-border-[#DDDFE2] tw-items-center focus:tw-border-[#0866FF]">
            <input type={showPass ? "text" : "password"} placeholder="Password" class="tw-w-full tw-outline-none" on:input={handlePassword} />
            {#if showPass}
              <button on:click={() => showPass = false}>
                <EyeOutline width={16} height={16} />
              </button>
            {:else}
              <button on:click={() => showPass = true}>
                <EyeOffOutline width={16} height={16} />
              </button>
            {/if}
          </div>
          {#if error.status}
            <small class="tw-text-[#FF0000]">*{error.error}</small>
          {/if}
          <button class="tw-flex tw-justify-center tw-w-full tw-bg-[#1877F2] tw-rounded tw-text-white tw-cursor-pointer tw-h-[48px] tw-items-center">
            <span class="tw-text-[22px]">Log In</span>
          </button>
        </div>
      </form>
      <a href="/login/identify" class="tw-text-center tw-text-[14px] tw-text-[#2989F4] hover:tw-underline">Forgot password?</a>
      <hr class="tw-my-5" />
      <div class="tw-flex tw-justify-center tw-text-center">
        <button class="tw-text-white tw-rounded tw-bg-[#42B72A] tw-text-center  tw-px-[16px] tw-py-3 tw-cursor-pointer" on:click={() => $openSignup = true}>
          <span class="tw-text-[19px]">Create new account</span>
        </button>
      </div>
    </div>
  </div>
  {#if $openSignup}
    <Signup />
  {/if}
  {#if loading}
    <Modal>
      <Loading width={70} height={70} />
    </Modal>
  {/if} 
</main>