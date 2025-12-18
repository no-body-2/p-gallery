import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { z } from 'zod';

// 입력값 검증
const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: '아이디', type: 'text' },
                password: { label: '비밀번호', type: 'password'},
            },
            authorize: async (credentials) => {
                const { username, password } = await loginSchema.parseAsync(credentials);

                // 유저 찾기 - ID
                const user = await prisma.user.findUnique({
                    where: { username },
                });

                if (!user) {
                    throw new Error('존재하지 않는 사용자 입니다.')
                }

                const isPasswordValid = await compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error('잘못된 비밀번호 입니다.');
                }

                return {
                    id: String(user.id),
                    name: user.username,
                    role: user.role,
                };
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    }
)