// app/edit/[id]/page.tsx
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { updatePost } from "./actions"

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    const { id } = await params
    const postId = parseInt(id)

    if (isNaN(postId)) return notFound()

    // 1. 기존 글 데이터 가져오기
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { author: true }
    })

    if (!post) return notFound()

    // 2. 권한 체크 (작성자 아니면 튕겨냄)
    if (session?.user?.name !== post.author.username) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">글 수정하기 🛠️</h1>

                <form action={updatePost} className="flex flex-col gap-4">
                    {/* 👇 중요: 어떤 글을 수정하는지 ID를 숨겨서 보냄 */}
                    <input type="hidden" name="id" value={post.id} />

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">제목</label>
                        <input
                            name="title"
                            type="text"
                            required
                            defaultValue={post.title} // 👈 기존 제목 채워넣기
                            className="w-full text-lg p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {/*<div className="space-y-1">*/}
                    {/*    <label className="text-sm font-bold text-gray-700">이미지 주소 (URL)</label>*/}
                    {/*    <input*/}
                    {/*        name="imageUrl"*/}
                    {/*        type="text"*/}
                    {/*        defaultValue={post.imageUrl || ''} // 👈 기존 이미지 주소 채워넣기*/}
                    {/*        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">내용</label>
                        <textarea
                            name="content"
                            required
                            rows={10}
                            defaultValue={post.content} // 👈 기존 내용 채워넣기
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">사진 변경 (선택)</label>
                        <div className="text-xs text-gray-500 mb-1">
                            현재 사진: {post.imageUrl ? "있음 (파일 선택 안 하면 유지됨)" : "없음"}
                        </div>
                        <input
                            name="file"
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        {/* 취소 누르면 뒤로가기(상세페이지) */}
                        <a
                            href={`/post/${post.id}`}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-300 transition text-center"
                        >
                            취소
                        </a>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition"
                        >
                            수정 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}