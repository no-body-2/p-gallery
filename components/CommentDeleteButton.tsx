'use client'

import { deleteComment } from "@/app/post/[id]/actions"

export default function CommentDeleteButton({ commentId, postId }: { commentId: number, postId: number }) {
    return (
        <button
            onClick={async () => {
                if (confirm("댓글을 삭제하시겠습니까?")) {
                    await deleteComment(commentId, postId)
                }
            }}
            className="text-red-500 text-xs hover:underline ml-2"
        >
            삭제
        </button>
    )
}