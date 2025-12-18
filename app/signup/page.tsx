import { signup } from './actions';

export default function SignupPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <div className='p-8 bg-white rounded-lg shadow-md w-96'>
                <h1 className='text-3xl font-bold mb-3 text-center text-gray-900'>표영옥 갤러리</h1>
                <h1 className='text-2xl font-bold mb-6 text-center text-gray-700'>회원가입</h1>
                <form action={signup as any} className='space-y-4'>
                    <div>
                        <label className='block mb-1 font-medium text-gray-700'>아이디</label>
                        <input
                            name='username'
                            type='text'
                            required
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                            placeholder='아이디를 입력하세요'
                        />
                    </div>
                    <div>
                        <label className='block mb-1 font-medium text-gray-700'>비밀번호</label>
                        <input
                            name='password'
                            type='password'
                            required
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                            placeholder='비밀번호를 입력하세요'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition'
                    >
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    )
}