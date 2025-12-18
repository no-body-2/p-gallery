'use client'

import { deletePost } from "@/app/post/[id]/actions"

export default function PostDeleteButton({ postId }: { postId: number }) {
    return (
        <button
            onClick={async () => {
                if (confirm("정말 이 글을 삭제하시겠습니까?")) {
                    await deletePost(postId)
                }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-bold"
        >
            글 삭제
        </button>
    )
}