<script lang="ts">
	import type { CommentProps } from "../types";
    import placeholder from '$lib/assets/placeholder.png';
	import { linkifyDescrip } from "../helpers";

    export let comment: CommentProps;
</script>

<div class="tw-flex tw-gap-1">
    <a href={`/${comment.author.firstName}.${comment.author.lastName}.${comment.author.id}`} class="tw-shrink-0">
        <img src={comment.author.profilePicture ? comment.author.profilePicture : placeholder} width={32} height={32} class="tw-rounded-[1000px] tw-w-[32px] tw-h-[32px]" alt={`${comment.author.firstName} ${comment.author.lastName}`} />
    </a>
    <div class="tw-px-[12px] tw-py-[8px] tw-rounded-xl tw-bg-gray-100">
        <a class="tw-text-[13px] tw-font-bold hover:tw-underline" href={`/${comment.author.firstName}.${comment.author.lastName}.${comment.author.id}`}>
            {comment.author.firstName} {comment.author.lastName}
        </a>
        <div class="tw-text-[15px] tw-break-all tw-whitespace-normal tw-w-full">
            {@html linkifyDescrip(comment.comment).__html}
        </div>
    </div>
</div>