// app/page.tsx
import Link from 'next/link';
import prisma from '@/lib/prisma';
// auth, signOut import 제거 (Navbar로 갔음)

export default async function Home() {
    // session 가져오는 코드도 제거 (여기선 안 씀)

    // 작성된 글 목록 가져오기
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            _count: {
                select: { comments: true }
            }
        }
    });

    return (
        <div className='min-h-screen p-4 sm:p-8 bg-gray-100'>
            {/* <header> 태그 전체 삭제됨 (Navbar가 대신함) */}

            <main className='grid gap-4'>
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className='text-xl text-gray-500 mb-4'>아직 작성된 글이 없습니다.</p>
                        <p className='text-gray-400'>첫 번째 글의 주인공이 되어보세요!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <Link href={`/post/${post.id}`} key={post.id} className='block group'>
                            <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 group-hover:border-blue-400'>
                                <div className='flex justify-between items-start mb-2'>
                                    <h2 className='text-xl font-bold text-gray-900 group-hover:text-blue-600 transition'>
                                        {post.title}
                                    </h2>
                                    <span className={`text-sm flex items-center gap-1 ${post._count.comments > 0 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                                        💬 {post._count.comments}
                                    </span>
                                </div>

                                <p className='text-gray-600 mb-4 line-clamp-2 h-12'>{post.content}</p>

                                {post.imageUrl && (
                                    <div className='relative w-full h-48 mb-4 overflow-hidden rounded-md bg-gray-100'>
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
                                        />
                                    </div>
                                )}

                                <div className='text-sm text-gray-500 flex justify-between border-t pt-4 mt-2'>
                                    <span className="flex items-center gap-1">
                                        🧑‍💻 {post.author.username}
                                    </span>
                                    <span>{post.createdAt.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </main>
        </div>
    )
}