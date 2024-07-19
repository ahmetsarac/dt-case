import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken: string;
        user: {
            id: string;
            username: string;
            role: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        accessToken: string;
        username: string;
        role: string;
    }
}
