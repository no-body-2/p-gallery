// app/write/actions.ts
'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { put } from "@vercel/blob" // 👈 패키지 import

export async function createPost(formData: FormData) {
    const session = await auth()
    if (!session?.user?.name) redirect('/login')

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    // 👇 1. 파일 객체 가져오기
    const imageFile = formData.get('file') as File;
    let imageUrl = null;

    if (!title || !content) return

    // 👇 2. 파일이 있으면 Vercel Blob에 업로드
    // (파일 크기가 0보다 커야 진짜 파일임)
    if (imageFile && imageFile.size > 0) {
        const blob = await put(imageFile.name, imageFile, {
            access: 'public', // 누구나 볼 수 있게 공개
        });
        imageUrl = blob.url; // 업로드된 주소를 변수에 담음
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.name },
    })

    if (!user) return

    // 3. DB에는 주소(String)만 저장
    await prisma.post.create({
        data: {
            title,
            content,
            imageUrl: imageUrl, // 여기 주소가 들어감
            authorId: user.id,
        },
    })

    redirect('/')
}