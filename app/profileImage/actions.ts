'use server'

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export async function updateProfileImage(formData: FormData) {
    // 1. 세션 확인 (이메일이 아닌 name 기준으로 검증)
    const session = await auth();
    if (!session?.user?.name) redirect('/login');

    // 2. 파일 객체 가져오기
    const imageFile = formData.get('image') as File;
    let imageUrl = null;

    if (!imageFile || imageFile.size === 0) return;

    // 3. Vercel Blob 업로드
    const filename = `profile-${Date.now()}-${imageFile.name}`;
    const blob = await put(filename, imageFile, {
        access: 'public',
    });
    imageUrl = blob.url;

    // 4. DB에서 현재 유저 찾기 (🚨 username 기준으로 변경 완료!)
    const user = await prisma.user.findUnique({
        where: { username: session.user.name },
    });

    if (!user) return;

    // 5. DB 업데이트
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            imageUrl: imageUrl,
        },
    });

    // 6. 캐시 무효화 및 리다이렉트
    revalidatePath('/');
    redirect('/');
}