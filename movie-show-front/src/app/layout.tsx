"use client"
import { UserProvider, useFetchUser, useUserInfo } from '@/lib/authContext';
import { SessionProvider } from "next-auth/react"
import NavBar from './components/NavBar';
import './styles/globals.css'
import "./styles/output.css";
import { Session } from 'next-auth';

export default function RootLayout({
  children
}: {
  children: React.ReactNode,
}) {
  let session;
  const {user, loading} = useFetchUser()
  const {id, jwt } = useUserInfo()
  console.log("🚀 ~ file: layout.tsx:18 ~ jwt", jwt)
  console.log("🚀 ~ file: layout.tsx:18 ~ id", id)
  return (
      <UserProvider value={{user, loading}}>
          <html lang="en">
            {/*
              <head /> will contain the components returned by the nearest parent
              head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
            */}
            <head />
            <body>
              <NavBar />
              {children}
            </body>
          </html>
      </UserProvider>
  )
}
