"use client"
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
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
      image: "/gallery/3.jpg",
      icon: <HiLightningBolt className="lg:text-4xl text-2xl" />
    },
    {
      id: 2,
      text: "Networking",
      image: "/gallery/5.jpg",
      icon: <HiUsers className="lg:text-4xl text-2xl" />
    },
    {
      id: 3,
      text: "Certification",
      image: "/gallery/7.jpg",
      icon: <HiAcademicCap className="lg:text-4xl text-2xl" />
    },
    {
      id: 4,
      text: "Future opportunities",
      image: "/gallery/8.jpg",
      icon: <HiTrendingUp className="lg:text-4xl text-2xl" />
    }
  ]

  return (
    <div className='  py-16 lg:px-8 relative'>
      {/* Title */}
      <h1 className="text-6xl  text-white lg:mb-16">Why attend?</h1>
      
      {/* Reasons List */}
      <div className='lg:space-y-8 mt-[4em] flex flex-col gap-[2em]'>
        {reasons.map((reason, index) => {
          const ref = useRef(null)
          const isInView = useInView(ref, { once: false, amount: 0.3 })
          
          return (
            <motion.div 
              key={reason.id}
              ref={ref}
              className='relative group'
              onMouseEnter={() => setHoveredItem(reason.id)}
              onMouseLeave={() => setHoveredItem(null)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
            >
             {/* Icon and Text */}
             <div className={`flex items-center lg:space-x-6 ${index === 0 ? 'lg:ml-30' : index === 1  ? 'ml-5' : index === 3 ? 'ml-8' : index === 2 ? 'self-' : 'ml-0' || index === 4 ? 'ml-24' : 'ml-0'}`}>
               {/* Icon */}
               <div className='text-white  flex-shrink-0'>
                 {reason.icon}
               </div>
               
               {/* Text with Underline */}
               <div className='relative'>
                 <h2 className='!text-[2em] md:!text-8xl  text-white mb-2'>
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
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default WhyAttend
