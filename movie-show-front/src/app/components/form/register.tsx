import { fetcher } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useState } from "react";

export function Register() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  })
  const handleChange = async (e: any) => {
    setUser({...user, [e.target.name]: e.target.value})
  }
  const handleSubmit =async (e:any) => {
    e.preventDefault();
    console.log(user);
    
    try {
        const response = fetcher(
            `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/local/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                    username: user.username
                })
            }
        )
        const data = await response
        console.log("🚀 ~ file: register.tsx:34 ~ handleSubmit ~ data", data)
        setToken(data)
        
    } catch(error) {
        console.error(error);
        
    }
  }
  return (
        <form onSubmit={handleSubmit} className="w-fit flex flex-col gap-4 mx-auto my-auto h-screen">
            <label htmlFor="username" className="text-white">Username</label>
            <input type="text" placeholder="Username" onChange={handleChange} className="p-2" required  name="username" /> 
            <label htmlFor="email" className="text-white">Email</label>
            <input type="email" placeholder="Email"  onChange={handleChange} className="p-2" required name="email" />         
            <label htmlFor="email" className="text-white">Password</label>
            <input type="password" placeholder="password at least 6 characters"  onChange={handleChange} className="p-2" required name="password" />        
            <button className="border bg-red-700 text-white p-2" type="submit">Submit</button>
        </form>
  );
};