'use client'
import { FC, useState } from "react";
import axios from "axios";
import createSlug from "@/lib/slugifyConverter";
import { Methods } from "@/enum";
import { getTokenFromLocalCookie } from "@/lib/auth";

export function AddMovie({id, cover_id, method, isOpen}: {id: any, cover_id: any, method: Methods, isOpen: any}) {
  let jwt = getTokenFromLocalCookie()
  const [isCreated, setIsCreated] = useState(false)
  const [isCreatedError, setIsCreatedError] = useState(false)
  const [image, setImage] = useState()
  const [movie, setMovie] = useState({
    title: '',
    slug: '',
  })
  const uploadToClient = (e: any) => {
    if (e.target.files && e.target.files[0]){
        const tmpImage = e.target.files[0]
        setImage(tmpImage)
    }
  }
  
  const handleChange = async (e: any) => {
    setIsCreated(false)
    setIsCreatedError(false)
    setMovie({...movie, [e.target.name]: e.target.value})
  }
  const handleSubmitCreate = async (e:any) => {
    e.preventDefault();
      if(image){
        axios(
        {
          url: `${process.env.NEXT_PUBLIC_API_HOST}/api/movies`,
          method: 'POST',
          data: {
            "data": {
              "title": movie.title,
              "slug": createSlug(movie.title),
            }
          },
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
        })
        .then(res =>{
          return res.data.data.id
        })
        .then(refId =>{
            const formData = new FormData();
            formData.append("files", image);
            formData.append("ref", "api::movie.movie");
            formData.append("refId", refId);
            formData.append("field", "cover");
            return axios(
              {
                url: `${process.env.NEXT_PUBLIC_API_HOST}` +"/api/upload/",
                method: 'POST',
                data: formData,
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${jwt}`,
                }
              }
           )
        })
        .then(res =>{
            setIsCreated(true)
            setIsCreatedError(false)
            close()
        })
        .catch(error =>{
            console.log(error)
            setIsCreatedError(true)
            setIsCreated(false)
        })
      }else{
        alert('Please Upload Cover image!!')
      }
  }
  
  const handleSubmitUpdate = async (e:any) => {
    e.preventDefault();
      axios(
      {
        url: `${process.env.NEXT_PUBLIC_API_HOST}/api/movies/${id}`,
        method: 'PUT',
        data: {
          "data": {
            "title": movie.title,
            "slug": createSlug(movie.title),
          }
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
      })
      .then(res =>{
        return res.data.data.id
      })
      .then(refId =>{
        console.log(image);
        if(image){
          axios(
            {
              url: `${process.env.NEXT_PUBLIC_API_HOST}/api/upload/files/${cover_id}`,
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${jwt}`,
                },
            }
          )
          const formData = new FormData();
          formData.append("files", image);
          formData.append("ref", "api::movie.movie");
          formData.append("refId", refId);
          formData.append("field", "cover");
          return axios(
          {
              url: `${process.env.NEXT_PUBLIC_API_HOST}/api/upload`,
              method: 'POST',
              data: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${jwt}`,
              }
          })
        }
      })
      .then(res =>{
          console.log("success", res?.data);
          setIsCreated(true)
          setIsCreatedError(false)
          close()
      })
      .catch(error =>{
          console.log(error)
          setIsCreatedError(true)
          setIsCreated(false)
      })
  }
  const close = () => {
    console.log('close --------------------------------- ');
    isOpen()
  }
  return (
    <div className="w-full fixed h-screen top-0 z-50 left-0">
      <div className="w-full fixed h-screen bg-slate-700 opacity-70 top-0 left-0"></div>
      {isCreated && 
        <section  className="bg-green-700 p-5 w-fit rounded absolute right-[10%] top-[20%] animate-pulse z-50">
            <h1>Created movie successfully!</h1>
        </section>
      }      
      {isCreatedError && 
        <section  className="bg-red-700 p-5 w-fit rounded absolute right-[10%] top-[20%] animate-pulse z-50">
            <h1>Error Created movie!!!</h1>
        </section>
      }
      <form onSubmit={method == Methods.UPDATE ? handleSubmitUpdate : handleSubmitCreate} className="w-fit flex flex-col gap-4 mx-auto p-5 mt-10 align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full text-red-700">
        <label htmlFor="title">Title</label>
        <input type="text" placeholder="title" className="text-black p-2 border border-gray-600 rounded-md outline-red-600" id="title" name="title" onChange={handleChange} required />        
        <label htmlFor="slug">Slug</label>
        <input type="text" placeholder="slug (auto)" className="text-black p-2 border border-gray-600 rounded-md outline-red-600" id="slug" name="slug" readOnly value={createSlug(movie.title)} />        
        <label htmlFor="cover">Cover</label>
        <div className="flex items-center justify-center w-full">
            {image 
              ?  <img id="output" src={URL.createObjectURL(image)} width="200"/> :
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={uploadToClient} />
              </label>
              }
        </div> 
        <button className="border bg-blue-700 p-2 text-white" type="submit">Submit</button>
        <button onClick={close} className="border bg-red-700 p-2 text-white" type="button">Cancel</button>
      </form>
    </div>
  );
};


