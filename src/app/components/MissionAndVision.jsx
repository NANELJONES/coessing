"use client"
import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  HiHand, 
  HiUsers, 
  HiGlobe, 
  HiAcademicCap, 
  HiLightningBolt 
} from 'react-icons/hi'

const MissionAndVision = () => {
  const containerRef = useRef()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  // Parallax transforms for each image
  const image1Y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const image2Y = useTransform(scrollYProgress, [0, 1], [0, -150])
  const image3Y = useTransform(scrollYProgress, [0, 1], [0, -200])
  
  const values =[

{valueName:"Respect",
  description:"Valuing dignity and diversity in every interaction.",
  icon: <HiHand className="text-2xl" />,
  key:1,

},
{valueName:"Diversity & Inclusion",
  description:"Welcoming varied perspectives across race, gender, background, and experience",
  icon: <HiUsers className="text-2xl" />,
  key:2,
},
{valueName:"Community",
  description:"Building lasting global networks rooted in collaboration.",
  icon: <HiGlobe className="text-2xl" />,
  key:3,
},
{valueName:"Knowledge Exchange",
  description:"Cultivating continuous learning and open communication",
  icon: <HiAcademicCap className="text-2xl" />,
  key:4,
},
{valueName:"Skill Building",
  description:"Strengthening technical, interpersonal, and leadership capacities.",
  icon: <HiLightningBolt className="text-2xl" />,
  key:5,
},

  ]
  return (
    <div ref={containerRef} className='relative min-h-[300vh] relative'>
      {/* Sticky Images Container */}
      <div className='sticky md:h-screen top-20 w-full lg:w-1/2 h-full flex flex-col gap-2 z-10 float-left'>
        {/* First Image with Parallax */}
        <div className='w-full  max-w-[600px] relative h-full max-h-[250px]  overflow-hidden'>
          <motion.img
            src="/ocean2.jpg"
            alt="wave"
            style={{ y: image1Y }}
            className='absolute inset-0 w-full h-full object-cover'
          />
        </div>
        
        {/* Second Image with Parallax */}
        <div className='w-full max-w-[300px] relative h-full max-h-[215px]  overflow-hidden'>
          <motion.img
            src="/ocean3.jpg"
            alt="wave"
            style={{ y: image2Y }}
            className='absolute inset-0 w-full h-full object-cover'
          />
        </div>
        
        {/* Third Image with Parallax */}
        <div className='w-full max-w-[600px] relative h-full max-h-[250px]  overflow-hidden'>
          <motion.img
            src="/ocean4.jpg"
            alt="wave"
            style={{ y: image3Y }}
            className='absolute inset-0 w-full h-full object-cover'
          />
        </div>
      </div>
      
      {/* Content Container - This will push the sticky element */}
      <div className='w-full lg:w-1/2 flex  flex-col gap-[10em] px-8 py-16 float-right'>
        {/* Mission */}
        <div className='text-white'>
          <h1 className="!text-[5em]">Mission</h1>
          <div className='border-l-[1em] border-l-white pl-4 w-full'>
            <h3>To empower African scientists today and tomorrow to lead in global ocean</h3>
          </div>
        </div>

        {/* Vision */}
        <div className='text-white'>
          <h1 className="!text-[3em]">Vision</h1>
          <h6>Our mission is to attract, educate, and empower emerging African scientists in ocean and environmental science by fostering collaboration, innovation, and knowledge exchange across West Africa and beyond.</h6>
        </div>

        {/* Statistics Grid */}
       

        {/* Values */}
        <div className='text-white'>
          <h1 className="!text-[5em]">Values</h1>
          <div className='grid grid-cols-2 gap-4'>
            {values.map((each_value) => (
              <div 
                className='border flex flex-col justify-around items-start border-primary_color bg-gradient-to-b from-primary_color/10 to-transparent backdrop-blur-sm rounded-md p-4 min-h-[8em]' 
                key={each_value.key}
              >
                <span className='flex flex-col gap-2 items-start mb-2'>
                  {each_value.icon}
                  <h6 className='!text-lg font-semibold'>{each_value.valueName}</h6>
                </span> 
                <p className='!text-sm'>{each_value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionAndVision
