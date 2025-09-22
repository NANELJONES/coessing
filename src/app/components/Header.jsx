import React from 'react'

const Header = () => {
  return (
    <div className=' flex flex-col justify-between h-auto md:h-screen relative'>


      <div className='md:absolute md:top-20 md:right-10  block w-full  max-w-[600px] h-full max-h-[400px] '>
    <img src="/architecture_gif.gif" autoPlay loop muted className='w-full h-full object-cover'></img>
      </div>


      <div className='md:absolute block  text-white md:bottom-5 md:left-10 w-full md:w-1/2'>

        <h1 className='text-4xl  md:!text-[3.5em]'>Empowering Tomorrow’s Ocean Scientists in West Africa</h1>
    <h6>One week immersive summer schools alternating between Ghana and Nigeria uniting researchers, fostering innovation, and amplifying African ocean science leadership</h6>
    <div className='flex gap-4 text-sm'>
    <button>Apply for 2025 School</button>
    <button>Learn More</button>
    </div>
  
     
      </div>
    </div>
  )
}

export default Header
