// app/login/page.tsx
import { signIn } from '@/auth' // auth.ts에서 가져옴
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-96">
                <h1 className='text-3xl font-bold mb-3 text-center text-gray-900'>표영옥 갤러리</h1>
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">로그인</h1>

                <form
                    action={async (formData) => {
                        "use server"
                        try {
                            const data = Object.fromEntries(formData);
                            // NextAuth의 signIn 함수 호출
                            await signIn("credentials", { ...data, redirectTo: "/" });
                        } catch (error) {
                            // NextJS의 리다이렉트 에러는 다시 던져줘야 함 (필수 처리)
                            if (isRedirectError(error)) {
                                throw error;
                            }
                            // TODO: 로그인 실패 시 처리 (MVP라 일단 에러 로그만)
                            console.error("Login Failed:", error);
                        }
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">아이디</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">비밀번호</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700 transition"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    )
}