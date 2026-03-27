// app/profile/edit/page.tsx
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
// 1단계에서 만든 서버 액션을 가져옵니다. (경로는 실제 파일 위치에 맞게 수정)
import { updateProfileImage } from "./actions";

export default async function ProfileEditPage() {
    const session = await auth();

    // 1. 로그인 안 된 사용자는 메인으로 튕겨냄 (보안)
    if (!session?.user?.username) {
        redirect('/');
    }

    // 2. DB에서 현재 유저 정보 가져오기 (기존 프로필 사진 확인용)
    const user = await prisma.user.findUnique({
        where: { username: session.user.username },
    });

    if (!user) redirect('/');

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
            {/* max-w-md 로 너비를 살짝 줄여서 프로필 사진에 시선이 집중되게 함 */}
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow h-fit">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">프로필 사진 수정 📸</h1>

                <form action={updateProfileImage} className="flex flex-col gap-6">
                    {/* 👇 중요: 어떤 유저를 수정하는지 ID를 숨겨서 보냄 */}
                    <input type="hidden" name="userId" value={user.id} />

                    {/* 현재 프로필 사진 크게 보여주기 영역 */}
                    <div className="flex flex-col items-center gap-3 py-4">
                        <div className="relative w-32 h-32 shrink-0 overflow-hidden rounded-full bg-gray-100 border-4 border-gray-200 shadow-sm">
                            {user.imageUrl ? (
                                <Image
                                    src={user.imageUrl}
                                    alt="현재 프로필"
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            ) : (
                                <svg className="w-full h-full text-gray-300 mt-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </div>
                        <span className="text-sm font-bold text-gray-500">
                            {user.username} 님의 현재 프로필
                        </span>
                    </div>

                    {/* 파일 업로드 상자 (기존 코드 디자인 재사용) */}
                    <div className="space-y-2 border-t pt-6">
                        <label className="text-sm font-bold text-gray-700">새 프로필 사진 업로드</label>
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            required // 프로필 사진 변경 페이지이므로 파일 선택을 강제함
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {/* 버튼 영역 (기존 코드 디자인 재사용) */}
                    <div className="flex justify-end gap-2 mt-2">
                        {/* 취소 누르면 뒤로가기(메인페이지) */}
                        <a
                            href="/"
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-300 transition text-center"
                        >
                            취소
                        </a>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition"
                        >
                            변경 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}