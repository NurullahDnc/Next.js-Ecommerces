"use client"
import { User } from '@prisma/client'
import { useState } from 'react';
import { CiUser } from "react-icons/ci";
import {signOut} from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { register } from 'module';


interface userProps{
  currentUser: User | null | undefined
}

const  User:React.FC<userProps> =({currentUser})=> {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  
  //cıkıs islemi
  const menuFunc =(type:any)=>{
    setOpenMenu(false)
      if (type == "logout") {
        router.push("/login")
        signOut()
      }
      else if(type == "register") {
          
        router.push("/register")
      }else{
        router.push("/login")
      }
  }

  // console.log(currentUser,"currentUser");
  

  return (
    <div className=' md:flex hidden relative'>
      <div onClick={()=> setOpenMenu(!openMenu) } className='flex gap-1 cursor-pointer'>
          <CiUser size="24" />
          {
            currentUser?<div> {currentUser.name} </div>: <div>Kulanıcı</div>
          }
      </div>
      <div className='absolute top-10 bg-blacks right-0 w-[100px] text-center rounded-md'>
        {
          //openMenu true ise
          openMenu &&(
            <div className='p-1 text-yellows'>
              {
                currentUser? (

                  <div >
                      <div onClick={()=> router.push("/admin")} className='cursor-pointer py-2'>Admin</div>
                      <div onClick={()=> menuFunc("logout")} className='cursor-pointer' >Cıkıs Yap</div>
                  </div> ) : (
                
                  <div >
                      <div onClick={()=> menuFunc("register")} className='cursor-pointer py-2'>Kayıt ol</div>
                      <div onClick={()=> menuFunc("login")} className='cursor-pointer'>Giris Yap</div>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default User

//setOpenMenu(!openMenu)   = tıklandıgında true, false tersini al