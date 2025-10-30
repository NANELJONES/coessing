import React from 'react'
import { FadeIn } from './Animations'

const OcenVibes = () => {

  const data= [


    {
      firstTitle:"10 +",
      secondTitle:"years",
      description:"of ocean science education and research"

    },
    
    {
      firstTitle:"100+",
      secondTitle:"students",
      description:"empowered to  become the  best"

    },
    
    {
      firstTitle:"20+",
      secondTitle:"communites",
      description:"engaged in ocean science education and research"

    },
    
    {
      firstTitle:"United",
      secondTitle:"Nations",
      description:"endorsed initiative"

    },

  ]
  return (
    <div className='flex flex-col gap-[2em] self-end'>
      <FadeIn type="fade-up">
     <h1 className=' mt-[10em] !text-4xl md:!text-[5em] text-white max-w-[1000px]'>Strengthening Ocean Science Capacity in Africa</h1>
    
     </FadeIn>

    <div className= "flex flex-col gap-[2em] self-end text-white w-full max-w-[600px]">
      <p>Africa’s coasts and oceans are vital for livelihoods, climate resilience, and sustainable development.</p>
      <p>By training the next generation of ocean scientists, COESSING empowers young leaders to tackle regional challenges with global collaboration and local insights.</p>
  
   
    </div>


<div className="flex flex-col gap-[2em] md:flex-row">

  {/* leftside */}
  <div className="w-full md:w-1/2">
    <img src="/ocean1.jpg" alt="ocean" className='w-full h-full object-cover' />


  </div>
  
  {/* rightside */}

  <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-[2em] max-w-[600px]">
    {data.map((each_data, index) => (
      <div key={index} className="text-white text-center flex flex-col items-center justify-center bg-gradient to-b from-secondary_color/10 shadow-md  border border-secondary_color to-transparent backdrop-blur-sm rounded-md p-4 min-h-[8em]">
        <h1>{each_data.firstTitle}</h1>
        <h2>{each_data.secondTitle}</h2>
        <p className='!text-sm'>{each_data.description}</p>
      </div>
    ))}
  </div>
  
  



</div>






    </div>
  )
}

export default OcenVibes
