import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';

console.log(
	'Add [YOUR_DOMAIN]/api/auth/callback/google to the Authorized Redirect URIs in your Google Cloud Console.'
); // Remove this line after reading

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Google],
	adapter: PrismaAdapter(prisma),
});
