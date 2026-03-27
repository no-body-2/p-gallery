'use server'

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth'; // 👈 성공한 코드처럼 auth를 가져옵니다.

export async function updateProfileImage(formData: FormData) {
    // 1. 세션 확인 (보안 및 유저 식별)
    const session = await auth();
    // 로그인 안 되어 있으면 튕겨냄
    if (!session?.user?.name) redirect('/login');

    // 2. 파일 객체 가져오기 (프론트엔드 input name="image")
    const imageFile = formData.get('image') as File;
    let imageUrl = null;

    // 파일이 없거나 크기가 0이면 조용히 종료 (에러 뿜지 않음)
    if (!imageFile || imageFile.size === 0) return;

    // 3. 파일이 있으면 Vercel Blob에 업로드
    // 프로필 사진은 이름이 겹치면 캐싱 문제가 생길 수 있어 타임스탬프를 섞어줍니다.
    const filename = `profile-${Date.now()}-${imageFile.name}`;
    const blob = await put(filename, imageFile, {
        access: 'public', // 누구나 볼 수 있게 공개
    });
    imageUrl = blob.url; // 업로드된 주소를 변수에 담음

    // 4. DB에서 현재 유저 찾기
    const user = await prisma.user.findUnique({
        where: { username: session.user.name },
    });

    if (!user) return;

    // 5. DB에는 주소(String)만 저장해서 업데이트
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            imageUrl: imageUrl, // 새로 받아온 이미지 주소로 덮어쓰기
        },
    });

    // 6. UI 캐시 갱신 후 메인으로 리다이렉트
    revalidatePath('/');
    redirect('/');
}