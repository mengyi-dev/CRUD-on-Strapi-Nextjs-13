import { fetcher } from "@/lib/api";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from 'next/navigation';
export default async function Page({params}: any) {
  const nextCookies = cookies();
  const cookie = nextCookies.get('jwt');
  const jwt = cookie?.value
  if (!jwt) {
    redirect('/');
  }
  const post = await getPost(params, jwt);
    return (
        <div key={post.id} className="p-10 flex">
            <figure  className="bg-black w-[250px] h-80 relative cursor-pointer group delay-200 transition-all">
          <Image 
            fill
            className='object-cover'
            src={process.env.NEXT_PUBLIC_API_HOST + post.attributes?.cover.data.attributes.url}
            alt={post.attributes.cover.data.attributes.name}
          />
          <figcaption className='text-white absolute hidden group-hover:flex bottom-0 left-0 bg-red-700 w-full h-10 px-1 items-center transition ease-in-out delay-200 z-10'>
            <p>{post.attributes.title}</p>
          </figcaption>
          <div className='absolute w-full h-full group-hover:bg-gray-800 opacity-50'></div>
          <div className='absolute w-full h-full group-hover:flex hidden items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-700 z-40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
            </svg>
          </div>
        </figure>
        </div>
    );
};  
async function getPost(params: any, jwt: string) {
    const res = await fetcher(`
      ${process.env.NEXT_PUBLIC_API_HOST}/api/movies?filters[slug][$eq]=${params.slug}&populate=*`,
      jwt &&
      {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }}
    );
    const post = await res;
    if (!post.data[0]) {
      return undefined
    }
    return post.data[0]
}