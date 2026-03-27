// components/Navbar.tsx
import Link from "next/link"
// Image 임포트 제거 (img 태그 사용)
import { auth, signOut } from "@/auth"

export default async function Navbar() {
    const session = await auth()

    return (
        <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* 로고 (클릭하면 메인으로) */}
                <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition">
                    ㅈㅇㅎ 갤러리 🖼️
                </Link>

                <div>
                    {session ? (
                        <div className="flex items-center gap-4">

                            {/* 👇 2. 프로필 영역 전체를 Link로 감싸서 클릭 가능하게 만듭니다 */}
                            <Link
                                href="/profileImage"
                                className="flex items-center gap-2 group cursor-pointer"
                                title="프로필 수정하기"
                            >
                                {/* 프로필 이미지 컨테이너 (마우스 올리면 테두리 생김) */}
                                <div
                                    className="relative w-8 h-8 shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-300 group-hover:ring-2 group-hover:ring-blue-400 transition">
                                    {session.user?.image ? (

                                        <img
                                            src={session.user.image}
                                            alt={`${session.user?.name || "사용자"}의 프로필`}
                                            className="w-full h-full object-cover"
                                        />
                                        ) : (
                                        // 이미지가 없을 때 보여줄 기본 실루엣 아이콘 (SVG)
                                        <svg
                                        className="w-full h-full text-gray-400 mt-1"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        >
                                        <path
                                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                                        </svg>
                                        )}
                                </div>
                                <span
                                    className="font-bold text-blue-800 hidden sm:block group-hover:text-blue-600 transition">
                                    {session.user?.name} 님
                                </span>
                            </Link>

                            <Link
                                href="/write"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold text-sm transition"
                            >
                                박제하기
                            </Link>

                            <form
                                action={async () => {
                                    "use server"
                                    await signOut()
                                }}
                            >
                                <button
                                    className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 font-bold text-sm transition">
                                    로그아웃
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link
                                href="/login"
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 font-bold text-sm transition"
                            >
                                로그인
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 font-bold text-sm transition"
                            >
                                가입하기
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}