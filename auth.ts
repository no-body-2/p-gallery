import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            authorize: async (credentials) => {
                const { username, password } = await loginSchema.parseAsync(credentials);

                const user = await prisma.user.findUnique({
                    where: { username },
                });

                if (!user) throw new Error('존재하지 않는 사용자 입니다.');

                const isPasswordValid = await compare(password, user.password);
                if (!isPasswordValid) throw new Error('잘못된 비밀번호 입니다.');

                // 👇 1. 리턴 객체에 imageUrl을 image라는 키로 추가합니다.
                // NextAuth 기본 규격인 'image'에 맞춰주면 UI에서 session.user.image로 바로 쓸 수 있습니다.
                return {
                    id: String(user.id),
                    name: user.username,
                    role: user.role,
                    image: user.imageUrl,
                };
            },
        }),
    ],
    // 👇 2. 콜백 함수 추가 (중요!)
    // authorize에서 보낸 데이터를 실제 세션 쿠키에 구워넣는 과정입니다.
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.image = token.image as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});