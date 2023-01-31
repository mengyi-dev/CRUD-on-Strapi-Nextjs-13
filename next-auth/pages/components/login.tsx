import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
export default function login() {
const {data: session} = useSession()
if(session) {
  return (
    <>
      <Image src={session.user?.image} alt={session.user?.name} width={50} height={50}></Image>
      <h1>Welcome, {session.user?.name}</h1>
      <button onClick={()=>signOut()}>SignOut</button>
    </>
  )

}else
  return (
    <div>
      <h1>Please login first!!</h1>
      <button onClick={()=>signIn()}>Login</button>
    </div>
  );
};