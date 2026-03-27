// app/post/[id]/page.tsx
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { createComment } from "./actions"
import { notFound } from "next/navigation"
import Link from "next/link" // 👈 1. Link 컴포넌트 추가
import img from "next/image"

// 삭제 버튼 컴포넌트 가져오기
import PostDeleteButton from "@/components/PostDeleteButton"
import CommentDeleteButton from "@/components/CommentDeleteButton"

// Next.js 15 대응: params를 Promise로 처리
export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) return notFound();

    // DB 조회
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: true,
            comments: {
                include: { author: true },
                orderBy: { createdAt: 'asc' }
            },
        },
    })

    if (!post) return notFound()

    // 현재 로그인한 사람이 작성자인지 확인
    const isMyPost = session?.user?.name === post.author.username;

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow overflow-hidden">

                {/* 📸 이미지 영역 */}
                {post.imageUrl && (
                    <div className="w-full h-80 bg-gray-200">
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-contain bg-black"
                        />
                    </div>
                )}

                {/* 📝 게시글 내용 */}
                <div className="p-8 border-b">
                    {/* 제목과 버튼들 배치 */}
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

                        {/* 👇 2. 내 글일 때만 [수정] [삭제] 버튼 표시 */}
                        {isMyPost && (
                            <div className="flex gap-2">
                                {/* 수정 버튼 (회색) */}
                                <Link
                                    href={`/edit/${post.id}`}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm font-bold flex items-center"
                                >
                                    수정
                                </Link>

                                {/* 삭제 버튼 (빨간색 - 컴포넌트 내부 스타일) */}
                                <PostDeleteButton postId={post.id} />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-8">
                        {/* 프로필 이미지 + 작성자 이름 영역 */}
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-300">
                                {post.author.imageUrl ? ( // 👈 DB의 imageUrl 값을 확인합니다.
                                    <img
                                        src={post.author.imageUrl}
                                        alt={`${post.author.username}의 프로필`}
                                        fill
                                        className="object-cover"
                                        sizes="32px"
                                    />
                                ) : (
                                    // 이미지가 없을 때의 기본 실루엣
                                    <svg className="w-full h-full text-gray-400 mt-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                            </div>
                            <span className="font-bold text-gray-700">{post.author.username}</span>
                        </div>

                        {/* 작성일 영역 */}
                        <span>{new Date(post.createdAt).toISOString().split('T')[0]}</span>
                    </div>

                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                    </p>
                </div>

                {/* 💬 댓글 영역 */}
                <div className="p-8 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">
                        댓글 {post.comments.length}개
                    </h3>

                    {/* 댓글 목록 */}
                    <div className="space-y-4 mb-8">
                        {post.comments.map((comment: any) => (
                            <div key={comment.id} className="bg-white p-4 rounded shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">

                                    {/* 🧑‍💼 프로필 이미지 + 작성자 정보 (이름, 날짜 세로 배치) 영역 */}
                                    <div className="flex items-center gap-3">
                                        {/* 프로필 이미지 컨테이너 */}
                                        <div className="relative w-8 h-8 shrink-0 overflow-hidden rounded-full bg-gray-100 border border-gray-200">
                                            {comment.author.imageUrl ? (
                                                <img
                                                    src={comment.author.imageUrl}
                                                    alt={`${comment.author.username}의 프로필`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="32px"
                                                />
                                            ) : (
                                                // 이미지가 없을 때 기본 실루엣 아이콘
                                                <svg className="w-full h-full text-gray-300 mt-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* 이름과 날짜 (세로로 꽉 묶음) */}
                                        <div className="flex flex-col -space-y-0.5">
                        <span className="font-bold text-sm text-blue-600">
                            {comment.author.username}
                        </span>
                                            <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toISOString().split('T')[0]}
                        </span>
                                        </div>
                                    </div>

                                    {/* 내 댓글일 때만 삭제 버튼 표시 */}
                                    {session?.user?.name === comment.author.username && (
                                        // 버튼이 위쪽 라인에 맞도록 items-start 사용
                                        <div className="shrink-0">
                                            <CommentDeleteButton commentId={comment.id} postId={post.id} />
                                        </div>
                                    )}
                                </div>

                                {/* 댓글 내용 (왼쪽 여백을 줘서 이미지와 라인을 맞춤) */}
                                <p className="text-gray-700 text-sm pl-11">
                                    {comment.content}
                                </p>
                            </div>
                        ))}
                        {post.comments.length === 0 && (
                            <p className="text-gray-400 text-center text-sm py-4">첫 번째 댓글을 남겨보세요!</p>
                        )}
                    </div>

                    {/* 댓글 작성 폼 */}
                    {session ? (
                        <form action={createComment} className="flex gap-2">
                            <input type="hidden" name="postId" value={post.id} />
                            <input
                                name="content"
                                type="text"
                                required
                                placeholder="댓글을 입력하세요..."
                                className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 text-sm"
                            >
                                등록
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-4 bg-gray-200 rounded text-sm text-gray-600">
                            댓글을 작성하려면 로그인이 필요합니다.
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}