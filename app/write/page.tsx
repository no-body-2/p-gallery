import { createPost } from './actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function WritePage() {
    // 1. 비 로그인 상태일 시 로그인 페이지로 이동
    const session = await auth()
    if (!session) {
        // alert('로그인한 사용자만 이용 가능합니다.'); -> 에러 예상
        redirect('/login');
    }

    return (
        <div className='min-h-screen bg-gray-200 p-8 flex justify-center'>
            <div className='w-full max-w-2xl bg-white p-8 rounded-lg shadow'>
                <h1 className='text-2xl font-bold mb-6 text-gray-700'>박제하기</h1>

                <form action={createPost} className='flex flex-col gap-4'>
                    <input
                        name='title'
                        type='text'
                        placeholder='제목을 입력하세요.'
                        required
                        className='text-lg p-3 border border-gray-300 rounded focus-outline-none focus:ring-2 focus:ring-blue-500 text-black'
                        />

                    <textarea
                        name='content'
                        placeholder='내용을 입력하세요.'
                        required
                        rows={16}
                        className='p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none'
                        />
                    {/*<input*/}
                    {/*    name='imageUrl'*/}
                    {/*    type='text'*/}
                    {/*    placeholder='사진의 주소를 등록하세요. (선택 사항)'*/}
                    {/*    className='p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm'*/}
                    {/*    />*/}
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">사진 등록 (선택)</label>
                        <input
                            name="file"       // 중요: 서버 액션에서 이 이름으로 받음
                            type="file"
                            accept="image/*"  // 이미지만 선택 가능
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div className='flex justify-end gap-2 mt-4'>
                        <button
                            type='submit'
                            className='bg-cyan-200 text-black px-6 py-2 rounded font-bold hover:bg-cyan-300 transition'
                            >
                            박제하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}