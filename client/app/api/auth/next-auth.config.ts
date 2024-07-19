import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { JWT } from 'next-auth/jwt';
import { Session, SessionStrategy } from 'next-auth';

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Username or Student Number', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_AUTH}/auth/login`, {
                        identifier: credentials?.identifier,
                        password: credentials?.password,
                    });

                    if (res.data && res.data.access_token) {
                        const user = {
                            id: res.data.user.id,
                            accessToken: res.data.access_token,
                            username: res.data.user.username,
                            role: res.data.user.role,
                        };
                        return user;
                    }
                    return null;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt' as SessionStrategy,
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: any }) {
            if (user) {
                token.id = user.id;
                token.accessToken = user.accessToken;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            session.accessToken = token.accessToken as string;
            session.user = {
                id: token.id as string,
                username: token.username as string,
                role: token.role as string,
            };
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
};

export { authOptions };
