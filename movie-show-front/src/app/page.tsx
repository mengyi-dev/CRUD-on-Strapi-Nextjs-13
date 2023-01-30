import Movies from './components/Movies'
import { fetcher } from '@/lib/api';
import { signIn } from 'next-auth/react';
import { cookies } from 'next/headers';

async function getData() {
  const nextCookies = cookies();
  const cookie = nextCookies.get('jwt');
  const jwt = cookie?.value
  const res = await fetcher(`${process.env.NEXT_PUBLIC_API_HOST}/api/movies?populate=*`, 
  jwt ? 
  {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${jwt}`,
    }}
    : {cache: 'no-store',}
    );
    console.log("🚀 ~ file: page.tsx:11 ~ getData ~ res", res)
  if(!res.data){
    return undefined
  }
  return res
}
export default async function Home() {
  const movies = await getData();
  
  return (
    <div className='w-full'>
      <div>
        { movies ?
          <>
            <h1 className='text-white text-2xl font-bold ml-4 mt-14'>Trending Now</h1>  
            <Movies data={movies.data}/>
          </>
          :
          <h1 className='text-4xl text-white text-center mt-96 bg-red-600 p-3 w-fit mx-auto'>Please Login first or Register First!!!!!!</h1>
        }
      </div>
  </div>
  )
}

