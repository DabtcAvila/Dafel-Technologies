import NextAuth from 'next-auth';
import { authOptionsHub } from '@/lib/auth-hub';

const handler = NextAuth(authOptionsHub);

export { handler as GET, handler as POST };