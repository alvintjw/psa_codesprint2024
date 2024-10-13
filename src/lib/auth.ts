import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_APP_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) {
        return false;
      }
  
      const existingAccount = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
      });
  
      // Create the account if it doesn't exist
      if (!existingAccount) {
        await prisma.account.create({
          data: {
            userId: user.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: account.type,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
          },
        });
      }
  
      return true;
    },
  
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.teamNumber = user.teamNumber;
      }
  
      return session;
    },
  
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
  
      return token;
    },
  }
  
};
