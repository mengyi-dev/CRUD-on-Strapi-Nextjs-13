import { fetcher } from "@/lib/api"
import { getTokenFromLocalCookie } from "@/lib/auth"

export default async function getMovies() {
  let jwt = getTokenFromLocalCookie()  
    const movies = await fetcher(`${process.env.NEXT_PUBLIC_API_HOST}/api/movies?populate=*`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        method: 'GET'
    })
    return movies
  }