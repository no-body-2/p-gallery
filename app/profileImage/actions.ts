'use server'

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfileImage(formData: FormData) {
    try {
        // 1. FormData에서 값 추출 및 타입 변환
        const userIdString = formData.get('userId') as string;
        const file = formData.get('image') as File;

        // 👇 핵심 해결 부분: 문자열을 숫자로 변환합니다.
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
        const updatedUser = await prisma.user.update({
            where: {
                id: userId, // 👈 이제 완벽한 숫자(number) 타입이 들어갑니다.
            },
            data: {
                imageUrl: blob.url,
            },
        });

        // 4. 캐시 무효화
        revalidatePath('/');

        return { success: true, imageUrl: blob.url };

    } catch (error) {
        console.error("Profile Image Update Error:", error);
        return { success: false, error: "프로필 이미지 업데이트에 실패했습니다." };
    }
}