// app/edit/[id]/actions.ts
'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob" // 👈 추가

export async function updatePost(formData: FormData) {
    const session = await auth()
    const id = parseInt(formData.get('id') as string)
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    // 👇 파일 가져오기
    const imageFile = formData.get('file') as File;

    if (!session?.user?.name || isNaN(id) || !title || !content) return

    const post = await prisma.post.findUnique({
        where: { id },
        include: { author: true }
    })

    if (!post || post.author.username !== session.user.name) return

    // 👇 이미지 처리 로직
    let imageUrl = post.imageUrl; // 기본값: 기존 이미지 유지

    // 새 파일이 들어왔으면 업로드하고 교체
    if (imageFile && imageFile.size > 0) {
        const blob = await put(imageFile.name, imageFile, {
            access: 'public',
        });
        imageUrl = blob.url;
    }

    await prisma.post.update({
        where: { id },
        data: {
            title,
            content,
            imageUrl: imageUrl, // 새 주소 or 기존 주소
        },
    })

    revalidatePath(`/post/${id}`)
    revalidatePath('/')
    redirect(`/post/${id}`)
}