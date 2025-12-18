// components/Navbar.tsx
import Link from "next/link"
import { auth, signOut } from "@/auth"

export default async function Navbar() {
    const session = await auth()

    return (
        <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* 로고 (클릭하면 메인으로) */}
                <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition">
                    표영옥 갤러리 🖼️
                </Link>

                <div>
                    {session ? (
                        <div className="flex items-center gap-4">
              <span className="font-bold text-blue-800 hidden sm:block">
                {session.user?.name} 님
              </span>

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
                                <button className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 font-bold text-sm transition">
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