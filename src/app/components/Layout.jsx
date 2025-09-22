"use client"
import React from 'react'

const Layout = ({children}) => {
  return (
    <div className='mx-auto max-w-[1400px] px-[1em]'>
      {children}
    </div>
  )
}

export default Layout
