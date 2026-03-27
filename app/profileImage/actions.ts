'use server'

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'; // 👈 리다이렉트 추가

export async function updateProfileImage(formData: FormData) {
    try {
        // 1. FormData에서 값 추출 및 타입 변환
        const userIdString = formData.get('userId') as string;
        const file = formData.get('image') as File;

        const userId = parseInt(userIdString, 10);

        // 방어 로직: 변환된 숫자가 유효하지 않거나 파일이 없는 경우
        if (isNaN(userId)) {
            throw new Error("유효하지 않은 사용자 ID입니다.");
        }
        if (!file || file.size === 0) {
            throw new Error("이미지 파일이 없습니다.");
        }

        // 2. Vercel Blob에 이미지 업로드
        const filename = `profile-${userId}-${Date.now()}-${file.name}`;
        const blob = await put(filename, file, {
            access: 'public',
        });

        // 3. Prisma를 이용해 DB의 imageUrl 컬럼 갱신
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                imageUrl: blob.url,
            },
        });

        // 🚨 기존에 있던 return { success: true ... } 삭제됨 🚨

    } catch (error) {
        console.error("Profile Image Update Error:", error);
        // 에러가 발생하면 콘솔에만 찍고 조용히 함수를 종료합니다. (void 반환)
        return;
    }

    // 4. 캐시 무효화 및 리다이렉트 (반드시 try-catch 블록 바깥에 위치해야 함!)
    revalidatePath('/');
    redirect('/');
}