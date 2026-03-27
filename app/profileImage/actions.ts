'use server'

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma'; // 본인의 prisma 설정 경로에 맞게 수정하세요
import { revalidatePath } from 'next/cache';
// import { auth } from '@/auth'; // NextAuth 등을 사용 중이라면 세션 검증용으로 가져옵니다.

export async function updateProfileImage(formData: FormData) {
    try {
        // 1. 세션/유저 검증 (보안: 아무나 수정하면 안 되므로)
        // const session = await auth();
        // if (!session?.user?.email) {
        //   throw new Error("인증되지 않은 사용자입니다.");
        // }

        // 임시로 formData에서 userId를 받는다고 가정 (실제로는 위처럼 서버 세션에서 직접 가져오는 것이 안전합니다)
        const userId = formData.get('userId') as string;
        const file = formData.get('image') as File;

        if (!file || file.size === 0) {
            throw new Error("이미지 파일이 없습니다.");
        }

        // 2. Vercel Blob에 이미지 업로드
        // 파일명 중복 방지를 위해 사용자 ID나 타임스탬프를 섞어주면 좋습니다.
        const filename = `profile-${userId}-${Date.now()}-${file.name}`;
        const blob = await put(filename, file, {
            access: 'public', // 누구나 볼 수 있어야 하므로 public
        });

        // 3. Prisma를 이용해 DB의 imageUrl 컬럼 갱신
        const updatedUser = await prisma.user.update({
            where: {
                id: userId, // 세션 이메일이나 유저 ID 기준으로 업데이트
            },
            data: {
                imageUrl: blob.url, // Blob에서 반환된 이미지 URL 저장
            },
        });

        // 4. 캐시 무효화 (Next.js의 핵심)
        // 이 작업을 해줘야 새로고침 없이 Navbar나 프로필 페이지의 사진이 즉시 바뀝니다.
        revalidatePath('/'); // 메인 페이지나 Navbar가 포함된 레이아웃 경로
        // revalidatePath('/profile'); // 프로필 페이지가 따로 있다면 거기도 추가

        return { success: true, imageUrl: blob.url };

    } catch (error) {
        console.error("Profile Image Update Error:", error);
        return { success: false, error: "프로필 이미지 업데이트에 실패했습니다." };
    }
}