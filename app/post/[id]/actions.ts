'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createComment(formData: FormData) {
    const session = await auth()
    if (!session || !session.user || !session.user.name) {
        return
    }

    const content = formData.get('content') as string
    const postId = parseInt(formData.get('postId') as string)

    if (!content || !postId) return

    // 1. 작성자 찾기
    const user = await prisma.user.findUnique({
        where: { username: session.user.name },
    })

    if (!user) return

    // 2. 댓글 저장
    await prisma.comment.create({
        data: {
            content,
            postId,
            authorId: user.id,
        },
    })

    // 3. 페이지 새로고침 (중요!)
    // 댓글을 썼으니 해당 글 페이지의 데이터를 다시 불러오게 합니다.
    revalidatePath(`/post/${postId}`)
}

// 1. 게시글 삭제
export async function deletePost(postId: number) {
    const session = await auth()
    if (!session?.user?.name) return

    // 본인 글인지 확인
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { author: true }
    })

    if (!post) return
    if (post.author.username !== session.user.name) return // 권한 없음

    // 게시글 삭제 (댓글도 같이 삭제됨 - DB 설정에 따라 다름)
    // 안전하게 댓글 먼저 지우고 글 지우기
    await prisma.comment.deleteMany({ where: { postId } })
    await prisma.post.delete({ where: { id: postId } })

    redirect('/') // 메인으로 튕겨내기
}

// 2. 댓글 삭제
export async function deleteComment(commentId: number, postId: number) {
    const session = await auth()
    if (!session?.user?.name) return

    // 본인 댓글인지 확인
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { author: true }
    })

    if (!comment) return
    if (comment.author.username !== session.user.name) return // 권한 없음

    await prisma.comment.delete({ where: { id: commentId } })

    revalidatePath(`/post/${postId}`) // 페이지 새로고침
}