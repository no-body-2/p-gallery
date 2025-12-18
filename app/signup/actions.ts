'use server'

import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function signup(form: FormData) {
    const username = form.get('username') as string;
    const password = form.get('password') as string;

    if (!username || !password) {
        // TODO: alter로 변경?
        console.log('Missing username or password');
        return;
    }

    // 1. password 암호화
    const hashedPassword = await hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
    } catch (err) {
        console.error('이미 존재하는 ID 입니다.', err);
        return { error: '이미 존재하는 ID 입니다.' }
    }

    redirect('/');
}