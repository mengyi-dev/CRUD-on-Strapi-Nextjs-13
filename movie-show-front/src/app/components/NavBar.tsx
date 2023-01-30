"use client"
import Link from "next/link";
import { useState } from "react";
import { setToken, unsetToken } from "@/lib/auth";
import { useFetchUser, useUser } from "@/lib/authContext";
import { fetcher } from "@/lib/api";
import { Register } from "./form/register";
import { AddMovie } from "./form/formAddMovie";
import { Methods } from "@/enum";
const menus = [
    {
        title: 'Home',
        path: '/'
    },
]

export default function NavBar(){
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [data, setData] = useState({
    identifier: '',
    password: ''
  })
  const [isRegister, setIsRegister] = useState(false)
  
  const {user, loading} = useFetchUser()
  
  if (loading) return <div className="fixed w-full h-screen bg-black z-[1000] top-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4335 4335" width="100" height="100" className="animate-spin">
            <path className="fill-red-700" d="M3346 1077c41,0 75,34 75,75 0,41 -34,75 -75,75 -41,0 -75,-34 -75,-75 0,-41 34,-75 75,-75zm-1198 -824c193,0 349,156 349,349 0,193 -156,349 -349,349 -193,0 -349,-156 -349,-349 0,-193 156,-349 349,-349zm-1116 546c151,0 274,123 274,274 0,151 -123,274 -274,274 -151,0 -274,-123 -274,-274 0,-151 123,-274 274,-274zm-500 1189c134,0 243,109 243,243 0,134 -109,243 -243,243 -134,0 -243,-109 -243,-243 0,-134 109,-243 243,-243zm500 1223c121,0 218,98 218,218 0,121 -98,218 -218,218 -121,0 -218,-98 -218,-218 0,-121 98,-218 218,-218zm1116 434c110,0 200,89 200,200 0,110 -89,200 -200,200 -110,0 -200,-89 -200,-200 0,-110 89,-200 200,-200zm1145 -434c81,0 147,66 147,147 0,81 -66,147 -147,147 -81,0 -147,-66 -147,-147 0,-81 66,-147 147,-147zm459 -1098c65,0 119,53 119,119 0,65 -53,119 -119,119 -65,0 -119,-53 -119,-119 0,-65 53,-119 119,-119z"
            />
          </svg>
    </div>
  const handleChange = async (e: any) => {
    setData({...data, [e.target.name]: e.target.value})
  }
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    const response = await fetcher(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier: data.identifier,
            password: data.password
        }),
    })
    
    setToken(response)
  }

  const logout = () => {
    unsetToken()
  }
  const close = (value: any) => {
    setIsOpenForm(false)
    document.location.reload();
  } 
  return (
    <>
        <nav className="flex items-center justify-between bg-red-700 px-7">
            <Link href={'/'} className="whitespace-pre text-white text-2xl underline">
                My Movie
            </Link>
            <ul className="text-white flex items-center justify-center gap-5 w-full h-16">
                {menus.map((menu: any) => (
                    <li key={menu.title} className="border-white border px-3 py-1 hover:bg-red-400">
                        <Link href={menu.path}>{menu.title}</Link>
                    </li> 
                ))}
                <li onClick={() => setIsOpenForm(true)} className="border-white border px-3 py-1 hover:bg-red-400 cursor-pointer">
                    Create
                </li> 
            </ul>
            <ul className=" flex gap-5">
              {user ?
                <>
                  <button className="bg-black p-2 text-white z-10">{user}</button>
                  <button className=" text-white z-10 border-white border px-3 py-1 hover:bg-red-400" onClick={logout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  </button>
                </>
                :
                <>
                  <input type="text" placeholder="username or email" className="p-2" onChange={handleChange} name="identifier" />
                  <input type="password" placeholder="password" className="p-2" onChange={handleChange} name="password"/>
                  <button className="bg-black p-2 text-white z-10" onClick={handleSubmit}>Login</button>
                  <button className="bg-black p-2 text-white z-10" onClick={() => setIsRegister(!isRegister)}>Register</button>
                </>
              }
            </ul>
        </nav>
        {isRegister && <Register />}
        {isOpenForm && <AddMovie id={null} cover_id={null} method={Methods.CREATE} isOpen={close} />}
    </>
  );
};
