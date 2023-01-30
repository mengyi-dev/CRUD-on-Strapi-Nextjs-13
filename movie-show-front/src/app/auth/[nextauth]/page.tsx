import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
    
    const options = {
      providers: [
        GoogleProvider({
          //@ts-ignore
          clientId: process.env.GOOGLE_CLIENT_ID,
          //@ts-ignore
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ],
      database: process.env.NEXT_PUBLIC_DATABASE_URL,
      session: {
        jwt: true,
      },
      callbacks: {
        session: async (session: { jwt: any; id: any; }, user: { jwt: any; id: any; }) => {
          session.jwt = user.jwt;
          session.id = user.id;
          return Promise.resolve(session);
        },
        jwt: async (token: { jwt: any; id: any; }, user: any, account: { provider: any; accessToken: any; }) => {
          const isSignIn = user ? true : false;
          if (isSignIn) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
            );
            const data = await response.json();
            token.jwt = data.jwt;
            token.id = data.user.id;
          }
          return Promise.resolve(token);
        },
      },
    };

const Auth = () => NextAuth(options);

export default Auth;