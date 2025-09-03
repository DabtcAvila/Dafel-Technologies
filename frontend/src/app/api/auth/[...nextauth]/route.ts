import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import {
  verifyPassword,
  checkAccountLock,
  handleFailedLogin,
  handleSuccessfulLogin,
  createAuditLog,
} from '@/lib/auth';
import { AuditEventType } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const headersList = headers();
        const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        try {
          // Check if account is locked
          const { isLocked, user } = await checkAccountLock(credentials.email);

          if (isLocked) {
            await createAuditLog(
              AuditEventType.LOGIN_FAILED,
              user?.id || null,
              false,
              'Account is locked due to multiple failed login attempts',
              ip,
              userAgent
            );
            throw new Error('Account locked. Please try again later.');
          }

          if (!user) {
            await createAuditLog(
              AuditEventType.LOGIN_FAILED,
              null,
              false,
              `Invalid email: ${credentials.email}`,
              ip,
              userAgent
            );
            return null;
          }

          if (!user.isActive) {
            await createAuditLog(
              AuditEventType.LOGIN_FAILED,
              user.id,
              false,
              'Account is deactivated',
              ip,
              userAgent
            );
            throw new Error('Account has been deactivated.');
          }

          // Verify password
          const isValid = await verifyPassword(credentials.password, user.password);

          if (!isValid) {
            const accountLocked = await handleFailedLogin(user.id);
            await createAuditLog(
              AuditEventType.LOGIN_FAILED,
              user.id,
              false,
              'Invalid password',
              ip,
              userAgent
            );

            if (accountLocked) {
              throw new Error('Account locked due to multiple failed attempts.');
            }
            return null;
          }

          // Successful login
          await handleSuccessfulLogin(user.id, ip);
          await createAuditLog(
            AuditEventType.LOGIN_SUCCESS,
            user.id,
            true,
            'User logged in successfully',
            ip,
            userAgent
          );

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error('Login error:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/login',
    signOut: '/', // Redirect to home after signout
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role;
        token.name = user.name;
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      const headersList = headers();
      const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
      const userAgent = headersList.get('user-agent') || 'unknown';

      if (token?.id) {
        await createAuditLog(
          AuditEventType.LOGOUT,
          token.id as string,
          true,
          'User logged out',
          ip,
          userAgent
        );
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };