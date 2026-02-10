import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = (credentials.email as string).trim();
                const password = (credentials.password as string).trim();

                console.log(`[AUTH] Login attempt for: ${email}`);

                try {
                    // Use type assertion if linter is confused about 'user' property
                    const user = await (prisma as any).user.findUnique({
                        where: { email },
                    });

                    if (!user) {
                        console.log(`[AUTH] User not found: ${email}`);
                        return null;
                    }

                    if (!user.password) {
                        console.log(`[AUTH] User has no password set: ${email}`);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    console.log(`[AUTH] Password match for ${email}: ${passwordsMatch}`);

                    if (passwordsMatch) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                        };
                    }
                } catch (error) {
                    console.error('[AUTH] Database or bcrypt error:', error);
                }

                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
});
