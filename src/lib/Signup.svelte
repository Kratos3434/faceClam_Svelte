<script lang="ts">
  import Close from "svelte-material-icons/Close.svelte";
  import { openSignup } from "$lib";
	import Loading from "./Loading.svelte";
	import Modal from "./Modal.svelte";

  interface UserSignup {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    password2: string,
    gender: string
  }

  const user: UserSignup = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    gender: "",
  };

  const error = { status: false, msg: "" };

  const setError = (message: string) => {
    error.status = true;
    error.msg = message;
    return false;
  }

  let submitting = false;

  const handleGender = (e: any) => {
    user.gender = e.target.value;
  }

  const validateUser = (_user: UserSignup) => {
    if (!_user.firstName) {
      return setError("First Name is required");
    }
    if (!_user.lastName) {
      return setError("Last Name is required");
    }
    if (!_user.email) {
      return setError("Email is required");
    }
    if (!_user.password) {
      return setError("Password is required");
    }
    if (!_user.password2) {
      return setError("Please confirm your password");
    }
    if (_user.password !== user.password2) {
      return setError("Passwords do not match");
    }
    if (!_user.gender) {
      return setError("Gender is required");
    }

    return true;
  }

  const handleSignup = (e: any) => {
    e.preventDefault();

    if (!validateUser(user)) return false;


    console.log("User: ", user);
  }
</script>

<Modal>
  <div class="tw-rounded-xl tw-shadow-md tw-bg-white tw-max-w-[432px] tw-w-full">
    <div class="tw-flex tw-flex-col">
      <div class="tw-flex tw-flex-col tw-px-[16px]">
        <div class="tw-flex tw-justify-between tw-items-center">
          <span class="tw-text-[32px] tw-font-bold">Sign Up</span>
          <button on:click={() => $openSignup = false}>
            <Close width={24} height={24} />
          </button>
        </div>
        <span class="tw-text-[#606770] tw-text-[15px]">It's quick and easy.</span>
      </div>
      <hr />
      <form class="tw-p-[16px] tw-max-w-[432px] tw-w-full" on:submit={handleSignup}>
        <div class="tw-flex tw-flex-col tw-gap-4">
          <div class="tw-flex signup-md:tw-justify-between tw-flex-wrap tw-justify-center signup-md:tw-gap-1 tw-gap-3">
            <input type="text" placeholder="First name" class="tw-w-full tw-rounded tw-border-[1px] tw-border-[#D0D3D8] tw-outline-none tw-bg-[#F5F6F7] signup-md:tw-max-w-[194px] tw-p-[11px] tw-h-[40px]" bind:value={user.firstName} />
            <input type="text" placeholder="Last name" class="tw-w-full tw-rounded tw-border-[1px] tw-border-[#D0D3D8] tw-outline-none tw-bg-[#F5F6F7] signup-md:tw-max-w-[194px] tw-p-[11px] tw-h-[40px]" bind:value={user.lastName} />
          </div>
          <input type="email" placeholder="Email" class="tw-w-full tw-rounded tw-border-[1px] tw-border-[#D0D3D8] tw-outline-none tw-bg-[#F5F6F7] tw-max-w-[399px] tw-p-[11px] tw-h-[40px]" bind:value={user.email} />
          <input type="password" placeholder="New Password" class="tw-w-full tw-rounded tw-border-[1px] tw-border-[#D0D3D8] tw-outline-none tw-bg-[#F5F6F7] tw-max-w-[399px] tw-p-[11px] tw-h-[40px]" bind:value={user.password} />
          <input type="password" placeholder="Confirm Password" class="tw-w-full tw-rounded tw-border-[1px] tw-border-[#D0D3D8] tw-outline-none tw-bg-[#F5F6F7] tw-max-w-[399px] tw-p-[11px] tw-h-[40px]" bind:value={user.password2} />
          <div class="tw-flex tw-flex-col">
            <span class="tw-text-[12px] tw-text-[#606770]">Gender</span>
            <div class="tw-flex signup-sm:tw-justify-between tw-flex-wrap tw-gap-1 tw-justify-center">
              <div class='tw-flex tw-justify-between tw-max-w-[128.28px] tw-w-full tw-border-[1px] tw-rounded tw-px-3 tw-py-2'>
                <span class='tw-text-[15px]'>Female</span>
                <input type="radio" id='female' value="F" on:change={handleGender} checked={user.gender === "F"} />
            </div>
            <div class='tw-flex tw-justify-between tw-max-w-[128.28px] tw-w-full tw-border-[1px] tw-rounded tw-px-3 tw-py-2'>
                <span class='tw-text-[15px]'>Male</span>
                <input type="radio" id='male' value="M" on:change={handleGender} checked={user.gender === "M"} />
            </div>
            <div class='tw-flex tw-justify-between tw-max-w-[128.28px] tw-w-full tw-border-[1px] tw-rounded tw-px-3 tw-py-2'>
                <span class='tw-text-[15px]'>Custom</span>
                <input type="radio" id='custom' value="C" on:change={handleGender} checked={user.gender === "C"} />
            </div>
            </div>
          </div>
          {#if error.status}
            <div class="tw-flex tw-justify-center">
              <small class="tw-text-red-600">*{error.msg}</small>
            </div>
          {/if}
          <div class="tw-flex tw-justify-center tw-gap-2 tw-items-center">
            {#if !submitting}
              <button class="tw-text-white tw-bg-[#00A400] tw-rounded tw-py-1 tw-px-10 tw-cursor-pointer">
                <span class="tw-text-[20px] tw-font-bold">Sign Up</span>
              </button>
            {:else}
              <div class='tw-text-white tw-bg-gray-400 tw-rounded tw-py-1 tw-px-10 tw-cursor-not-allowed'>
                <span class='tw-text-[20px] tw-font-bold'>Sign Up</span>
              </div>
            {/if}
            {#if submitting}
              <!-- <LinearProgress class="tw-w-[15px] tw-h-full tw-text-blue-500" closed={false} progress={0} /> -->
              <Loading width={15} height={15} />
            {/if}
          </div>
        </div>
      </form>
    </div>
  </div>
</Modal>