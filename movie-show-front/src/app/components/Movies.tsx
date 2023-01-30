'use client';
import Link from "next/link";
import Image from "next/image";
import { fetcher } from "@/lib/api";
import { useEffect, useState } from "react";
import getMovies from "../api/getMovies";
import { AddMovie } from "./form/formAddMovie";
import axios from "axios";
import { Methods } from "@/enum";
import { getTokenFromLocalCookie, getUserFromLocalCookie } from "@/lib/auth";
export default function Movies({data}: {data: any}) {
    let jwt = getTokenFromLocalCookie()
    const [movies, setMovies] = useState([])
    const [isOpenForm, setIsOpenForm] = useState(false)
    const [idToUpdate, setIdToUpdate] = useState('')
    const [idCoverToUpdate, setIdCoverToUpdate] = useState('')
    const [methodToUse, setMethodToUse] = useState<any>()
    useEffect(() => {
        setMovies(data)
    }, [data])
    const deleteMovie = (movie_id: string,  cover_id: string, method: Methods) => {
        setMethodToUse(method)
        axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}` +`/api/upload/files/${cover_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
        fetcher(`${process.env.NEXT_PUBLIC_API_HOST}/api/movies/${movie_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          method: 'DELETE'
      }).then(res=> {
        getMovies()
        .then(function(result: any){
            setMovies(result.data)
        })
      }) 
    }
    const update = (id: string, cover_id: string, method: Methods) => {
        setMethodToUse(method)
        setIdToUpdate(id)
        setIdCoverToUpdate(cover_id)
        setIsOpenForm(true)
    }

    const close = () => {
        setIsOpenForm(false)
        updateContent()
    }    
    
    const updateContent = () => {
        console.log('--------------------------- Load updated!!!!!');
        getMovies()
        .then(function(result: any){
            setMovies(result.data)
            console.log("🚀 ~ file: Movies.tsx:57 ~ .then ~ result.data", result.data)  
        })
    }
    return (
        <div className="grid grid-cols-8 gap-4 p-4 text-white movies-content">
            {isOpenForm && <AddMovie id={idToUpdate} cover_id={idCoverToUpdate} method={methodToUse} isOpen={close} />}
            {movies?.map((movie: any) => (
            <div key={movie.id} className="relative group">
                <Link href={`movies/${movie.attributes.slug}`} className="relative z-0">
                    <figure className="bg-black col-span-1 h-96 relative cursor-pointer delay-200 transition-all">
                    {movie.attributes.cover.data && 
                        <Image 
                            fill
                            className='object-cover'
                            src={process.env.NEXT_PUBLIC_API_HOST + movie.attributes.cover.data.attributes.url}
                            alt={movie.attributes.cover.data.attributes.name}
                        />
                    
                    }
                    <figcaption className='text-white absolute hidden group-hover:flex bottom-0 left-0 bg-red-700 w-full h-10 px-1 items-center transition ease-in-out delay-200 z-10'>
                        <p>{movie.attributes.title}</p>
                    </figcaption>
                    <div className='absolute w-full h-full group-hover:bg-gray-800 opacity-50'></div>
                    <div className='absolute w-full h-full group-hover:flex hidden items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-700 z-40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                        </svg>
                    </div>
                    </figure>
                </Link>
                <div className="group-hover:flex hidden gap-5 ml-8 absolute top-0 right-0 p-3 z-50">
                    <div onClick={() => update(movie.id, movie.attributes.cover.data.id, Methods.UPDATE)} className="border text-white w-fit cursor-pointer p-2 rounded-full hover:bg-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-7 h-7">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </div>
                    <div onClick={() => deleteMovie(movie.id, movie.attributes.cover.data.id, Methods.CREATE)} className="border text-white w-fit cursor-pointer p-2 rounded-full hover:bg-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>        
                </div>
            </div>
            ))}
        </div>
    );
};