"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { 
  HiLightningBolt, 
  HiUsers, 
  HiAcademicCap, 
  HiTrendingUp 
} from 'react-icons/hi'

const WhyAttend = () => {
  const [hoveredItem, setHoveredItem] = useState(null)

  const reasons = [
    {
      id: 1,
      text: "Skill development",
      image: "/ocean3.jpg",
      icon: <HiLightningBolt className="text-4xl" />
    },
    {
      id: 2,
      text: "Networking",
      image: "/ocean4.jpg",
      icon: <HiUsers className="text-4xl" />
    },
    {
      id: 3,
      text: "Certification",
      image: "/ocean2.jpg",
      icon: <HiAcademicCap className="text-4xl" />
    },
    {
      id: 4,
      text: "Future opportunities",
      image: "/ocean3.jpg",
      icon: <HiTrendingUp className="text-4xl" />
    }
  ]

  return (
    <div className=' min-h-screen py-16 px-8 relative'>
      {/* Title */}
      <h1 className="text-6xl  text-white mb-16">Why attend?</h1>
      
      {/* Reasons List */}
      <div className='space-y-8 mt-[4em] flex flex-col gap-[2em]'>
        {reasons.map((reason, index) => (
          <div 
            key={reason.id}
            className='relative group'
            onMouseEnter={() => setHoveredItem(reason.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
             {/* Icon and Text */}
             <div className={`flex items-center space-x-6 ${index === 0 ? 'lg:ml-30' : index === 1  ? 'ml-5' : index === 3 ? 'ml-8' : index === 2 ? 'self-' : 'ml-0' || index === 4 ? 'ml-24' : 'ml-0'}`}>
               {/* Icon */}
               <div className='text-white flex-shrink-0'>
                 {reason.icon}
               </div>
               
               {/* Text with Underline */}
               <div className='relative'>
                 <h2 className='!text-[3em] md:!text-8xl  text-white mb-2'>
                   {reason.text}
                 </h2>
                 {/* Underline that extends beyond text */}
                 <div className='h-0.5 bg-white w-full'></div>
               </div>
             </div>

            {/* Hover Image - Positioned to the right */}
            {hoveredItem === reason.id && (
              <div className='absolute top-0 right-0 w-64 h-48 z-10 transition-all duration-300 ease-in-out'>
                <div className='relative w-full h-full rounded-lg overflow-hidden shadow-2xl'>
                  <Image
                    src={reason.image}
                    alt={reason.text}
                    fill
                    className='object-cover'
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WhyAttend
