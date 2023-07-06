"use client"

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {signIn, signOut, useSession, getProviders} from 'next-auth/react' 
import GoogleLogo from '../public/assets/images/google.png'
import GitHubLogo from '../public/assets/images/githubLogo.png'


const Navbar = () => {
  const { data: session } = useSession();
  
  const [providers, setProviders] = useState(null);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const [loginMethodsModal, setLoginMethodsModal] = useState(false);
  
  const toCloseOnAnywhereClick = useRef(null);
  
  

  useEffect(() => {
  const setUpProviders = async () => {
    const response = await getProviders();
    setProviders(response)
  }  

  setUpProviders();
  }, []);
  
  // function closeOnAnywhereClick(ref) {
  //     useEffect(()=>{
  //       function handleClickOutside(event){
  //         if (ref.current && !ref.current.contains(event.target)){
  //           console.log(ref.current, event.target, ref.current.contains(event.target))
  //           setLoginMethodsModal(false)
  //         }
  //       }
  //       document.addEventListener('mousedown', handleClickOutside);
  //       return () => {
  //         document.removeEventListener("mousedown", handleClickOutside)
  //       }
  //     },[ref])
  // }

  // closeOnAnywhereClick(toCloseOnAnywhereClick);

   const getImage = (providerName) => {
    switch(providerName){
      case 'Google':
        return GoogleLogo;
      case 'GitHub':
        return GitHubLogo;
      default:
        return ''
    }
  }
  
  return (
    <nav className="flex-between w-full mb-16">
      <Link href={"/"} className="flex gap-2 flex-center">
        <Image 
          src='/assets/images/logo.svg'
          className="object-contain"
          alt="logo"
          width='30'
          height='30'
        />
        <p className="logo_text">World of Prompts</p>
      </Link>

      {/*Desktop Navigation*/}
      <div className="hidden sm:flex relative">
      {
          session?.user ? (
            <div className="flex flex-center gap-3 md:gap-5">
              <Link href={'/create-prompt'} className="black-btn">
                Create Post
              </Link>
              <button onClick={()=>signOut()} className="outline_btn">
                Sign Out
              </button>
              <Link href={'/profile'}>
                <Image src={session?.user?.image} alt='profile pic' width={37} height={37} className="w-30 h-30 rounded-full" />
              </Link>
            </div>
          ) : (
            <>
                {
                  providers && (
                    <>
                    <button type="button" onClick={() => setLoginMethodsModal(true)} className='black_btn'>
                      Sign In
                    </button>
                    {
                      loginMethodsModal && (
                        <div className="absolute right-0 top-4 dropdown border-2">
                          {
                            Object.values(providers).map(provider => (
                              <button type="button" key={provider.name} onClick={(e) => {console.log('a'); signIn(provider.id)}} className="text-sm p-2 flex items-center gap-x-2 hover:bg-[#FEEEEE] border-[#999]">
                                <Image src={getImage(provider.name)} alt={`${provider.name} Logo`} className="w-6 h-6" />
                                Sign in with {provider.name}
                              </button>
                            ))
                          }
                            <button type="button" className="text-sm p-2 w-full flex items-center gap-x-2 hover:bg-[#FEEEEE] border-[#999]">
                                Sign in with email
                            </button>
                        </div>
                      )
                    }
                    </>
                  )
                }              
            </>
          )
      }
      </div>

      {/* mobile nav */}
      <div className="sm:hidden flex relative">
        {
          session?.user ? (
            <div className="flex">
                <Image 
                  src={session?.user?.image} 
                  width={37} 
                  height={37} 
                  alt="profile"
                  className="rounded-full"
                  onClick={() => setToggleDropDown(prev => !prev)}
                />
                {
                  toggleDropDown && (
                    <div className="dropdown">
                      <Link href='/profile' className='dropdown_link' onClick={() => setToggleDropDown(false)}>
                        My Profile
                      </Link>
                      <Link href='/create-prompt' className='dropdown_link' onClick={() => setToggleDropDown(false)}>
                        Create Prompt
                      </Link>
                      <button 
                        className="mt-4 w-full black_btn"
                        onClick={() => {setToggleDropDown(false); signOut()}}
                      >
                        Sign Out
                      </button>
                    </div>

                  )
                }
            </div>
          ) : (
            <>
              {
                  providers && (
                    <>
                    <button type="button" onClick={() => setLoginMethodsModal(true)} className='black_btn'>
                      Sign In
                    </button>
                    {
                      loginMethodsModal && (
                        <div ref={toCloseOnAnywhereClick}  className="absolute right-0 top-10 dropdown">
                          {
                            Object.values(providers).map(provider => (
                              <button type="button" key={provider.name} onClick={() => {e.stopPropagation(); signIn(provider.id)}} className="text-sm p-2 flex items-center gap-x-2 hover:bg-[#FEEEEE] border-[#999]">
                                <Image src={getImage(provider.name)} alt={`${provider.name} Logo`} className="w-6 h-6" />
                                Sign in with {provider.name}
                              </button>
                            ))
                          }
                            <button type="button" className="text-sm p-2 w-full flex items-center gap-x-2 hover:bg-[#FEEEEE] border-[#999]">
                                Sign in with email
                            </button>
                        </div>
                      )
                    }
                    </>
                  )
                }              
            </>
          )
        }

      </div>
    </nav>
  )
};

export default Navbar;
