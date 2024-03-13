<script lang="ts">
	import type { UserProps } from "../types";
	import placeholder from '$lib/assets/placeholder.png';
	import { onlineUsers } from "$lib";
	import Dot from 'svelte-material-icons/Circle.svelte';
	import Spider from 'svelte-material-icons/Spider.svelte';
	import MessageQuestion from 'svelte-material-icons/MessageQuestion.svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import Arrow from 'svelte-material-icons/ArrowUpCircle.svelte';
	import { onMount } from "svelte";
	import { socket } from "../socket";

	export let otherUser: UserProps;
	export let currentUser: UserProps;

	$: isOnline = $onlineUsers.get(otherUser.email);

	interface MessageProps {
		sender: UserProps,
		message: string
	}

	let messages: MessageProps[] = [];
	let closeNotice = false;
	let message = "";
	let messageEl: any;
	const handleMessageSubmit = (e: any) => {
		e.preventDefault();
		console.log(`Message: ${message}`);
		socket.emit('messageSend', {
			sender: currentUser,
			message,
			to: otherUser
		});
		messages.push({ sender: currentUser, message });
		messages = messages;
		console.log("Messages: ", messages);
		message = "";
	}

	onMount(() => {
		if (messageEl) {
			messageEl.addEventListener('DOMNodeInserted', (event: any) => {
				const { currentTarget: target } = event;
				target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
			})
		}
	});

	onMount(() => {
		const handleMessageReceive = (data: MessageProps) => {
			console.log("Message data:", data);
			messages.push(data);
			messages = messages;
		}
		socket.on('messageReceive', handleMessageReceive);

		return () => {
			socket.off('messageReceive', handleMessageReceive);
		}
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tw-fixed tw-top-0 tw-left-0 tw-h-[100vh] tw-w-full tw-z-[-1]">
	<div class="tw-h-full tw-w-full tw-pt-[110px]">
		<div class="tw-h-full tw-w-full tw-flex tw-flex-col tw-justify-between tw-px-[16px] tw-py-5 tw-overflow-hidden">
			<!-- Main content area-->
			<div class="tw-overflow-y-auto tw-flex tw-flex-col tw-flex-1 tw-h-full viewpost goblin" bind:this={messageEl}>
				<div class="tw-flex tw-flex-col tw-items-center tw-relative">
					<a href={`/${otherUser.firstName}.${otherUser.lastName}.${otherUser.id}`}>
						<img src={otherUser.profilePicture ? otherUser.profilePicture : placeholder} width={150} height={150} alt={`${otherUser.firstName} ${otherUser.lastName}`} class="tw-rounded-[1000px] tw-w-[150px] tw-h-[150px]" />
					</a>
					<a href={`/${otherUser.firstName}.${otherUser.lastName}.${otherUser.id}`}>
						<span class="tw-text-[40px] tw-font-bold">{otherUser.firstName} {otherUser.lastName}</span>
					</a>
					<div class="tw-flex tw-gap-1 tw-items-center">
						<Dot class={`${isOnline ? "tw-text-green-600" : "tw-text-red-600"}`} />
						{#if isOnline}
							<p>Online</p>
						{:else}
							<p>Offline</p>
						{/if}
					</div>
					<div class={`${closeNotice ? "tw-hidden" : "tw-flex"} tw-rounded-md tw-max-w-[500px] tw-w-full tw-p-5 tw-bg-yellow-200 tw-mt-3 tw-relative tw-px-10`}>
						<span class="tw-absolute tw-right-[10px] tw-font-bold tw-cursor-pointer" on:click={() => closeNotice = true}>
							<Close width={18} height={18} />
						</span>
						<p class="tw-text-[15px]"><b>NOTICE:</b> This is the <b>BETA</b> version and all chat history will not be saved. Thank you for your understanding.<br /><br /> If you found any bugs <Spider class="tw-inline"/>, please report to the boss (joke).</p>
					</div>
				</div>
				<!-- Array of messages -->
				{#if messages.length === 0}
					<div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-full">
						<p class="tw-text-[18px] tw-font-bold">No messages yet, start a conversation</p>
						<MessageQuestion width={60} height={60} class="tw-text-[#0866FF]"/>
					</div>
				{:else}
					<div class="tw-flex tw-flex-col tw-py-3 tw-gap-3 tw-pt-5 tw-px-[16px]">
						{#each messages as e }
							<div class={`tw-flex tw-gap-2 ${e.sender.id == currentUser.id ? "tw-flex-row-reverse" : "tw-justify-start"}`}>
								<a href={`${e.sender.firstName}.${e.sender.lastName}.${e.sender.id}`}>
									<img src={e.sender.profilePicture ? e.sender.profilePicture : placeholder} width={30} height={30} alt={`${e.sender.firstName} ${e.sender.lastName}`} 
								  class="tw-rounded-[1000px] tw-w-[30px] tw-h-[30px]" />
								</a>
								<div class="tw-rounded-xl tw-bg-[#0866FF] tw-max-w-[300px] tw-w-full tw-p-2 tw-text-white tw-break-all tw-whitespace-normal">
									{e.message}
								</div>
							</div>
						{/each}
					</div>
				{/if}
				<!-- Array of messages END -->
			</div>
			<!-- Main content area -->
			<div class="tw-flex tw-justify-center">
				<form class="tw-max-w-[800px] tw-w-full tw-p-3 tw-flex tw-border-0 tw-gap-2 tw-items-center" on:submit={handleMessageSubmit}>
					<textarea class="tw-p-3 tw-w-full tw-outline-none tw-resize-none viewpost tw-bg-transparent tw-max-h-[25dvh] tw-h-[52px] tw-rounded-lg tw-border-[1px] tw-border-black" rows="1" bind:value={message}></textarea>
					<div class="tw-flex tw-justify-end">
						{#if message}
							<button class="tw-cursor-pointer">
								<Arrow width={30} height={30} />
							</button>
						{:else}
							<span>
								<Arrow width={30} height={30} />
							</span>
						{/if}
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
