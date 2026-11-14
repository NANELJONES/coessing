"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  HiHand,
  HiGlobe,
  HiAcademicCap,
  HiLightningBolt,
} from 'react-icons/hi'

const SLIDER_IMAGES = [
  '/gallery/2.JPG',
  '/gallery/4.JPG',
  '/gallery/6.jpg',
  '/gallery/8.jpg',
  '/gallery/3.JPG',
  '/gallery/7.jpg',
]

/** Auto-advancing image only — no dots, arrows, or controls */
const SharedImageSlider = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDER_IMAGES.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative w-full aspect-[4/3] min-h-[280px] md:min-h-[420px] overflow-hidden bg-white/5">
      <AnimatePresence mode="wait">
        <motion.img
          key={SLIDER_IMAGES[index]}
          src={SLIDER_IMAGES[index]}
          alt="COESSING"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </AnimatePresence>
    </div>
  )
}

const MissionAndVision = () => {
  const missionRef = useRef(null)
  const visionRef = useRef(null)
  const valuesRef = useRef(null)

  const missionInView = useInView(missionRef, { once: false, amount: 0.3 })
  const visionInView = useInView(visionRef, { once: false, amount: 0.3 })
  const valuesInView = useInView(valuesRef, { once: false, amount: 0.3 })

  const values = [
    {
      valueName: 'Respect',
      description: 'Valuing dignity and diversity in every interaction.',
      icon: <HiHand className="text-2xl" />,
      key: 1,
    },
    {
      valueName: 'Community',
      description: 'Building lasting global networks rooted in collaboration.',
      icon: <HiGlobe className="text-2xl" />,
      key: 3,
    },
    {
      valueName: 'Knowledge Exchange',
      description: 'Cultivating continuous learning and open communication',
      icon: <HiAcademicCap className="text-2xl" />,
      key: 4,
    },
    {
      valueName: 'Skill Building',
      description: 'Strengthening technical, interpersonal, and leadership capacities.',
      icon: <HiLightningBolt className="text-2xl" />,
      key: 5,
    },
  ]

  return (
    <div className="relative w-full py-16 md:py-24 px-4 md:px-8">
      {/*
        One shared slider for Mission + Vision + Values.
        md+: left column stretches with content height so sticky works while text scrolls.
        mobile: slider sits above, not sticky.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        {/* One slider for all three sections — sticky on md+ while Mission/Vision/Values scroll */}
        <div className="w-full md:sticky md:top-24 md:self-start md:h-fit">
          <SharedImageSlider />
        </div>

        <div className="flex flex-col gap-16 md:gap-24 text-white">
          <div ref={missionRef}>
            <h1 className="!text-[3em] md:!text-[5em] mb-4 md:mb-6">Mission</h1>
            <div className="w-full">
              <motion.h3
                className="leading-relaxed"
                initial="hidden"
                animate={missionInView ? 'visible' : 'hidden'}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.025 } },
                }}
              >
                {`To attract, empower, and educate future international African scientists, providing a platform for promoting African science, improvement of Africa and Africans scientific global ties.`
                  .split(/(\s+)/)
                  .map((token, idx) =>
                    token.trim().length === 0 ? (
                      <span key={`space-${idx}`}>{token}</span>
                    ) : (
                      <motion.span
                        key={`w-${idx}`}
                        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.6, delay: idx * 0.03, ease: 'easeOut' }}
                      >
                        {token}
                      </motion.span>
                    )
                  )}
              </motion.h3>

              <br />
              <br />

              <motion.h3
                className="leading-relaxed"
                initial="hidden"
                animate={missionInView ? 'visible' : 'hidden'}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.025 } },
                }}
              >
                {`We create opportunities that foster collaboration, innovation, and knowledge exchange within the West African community, particularly in the fields of oceanic and environmental sciences.`
                  .split(/(\s+)/)
                  .map((token, idx) =>
                    token.trim().length === 0 ? (
                      <span key={`m2-space-${idx}`}>{token}</span>
                    ) : (
                      <motion.span
                        key={`m2-w-${idx}`}
                        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.6, delay: idx * 0.03, ease: 'easeOut' }}
                      >
                        {token}
                      </motion.span>
                    )
                  )}
              </motion.h3>
            </div>
          </div>

          <div ref={visionRef}>
            <h1 className="!text-[3em] md:!text-[5em] mb-4 md:mb-6">Vision</h1>
            <h6 className="leading-relaxed">
              Addressing the conditions and equity issues that have historically led to the exclusion of African representation, we aim to empower both current and future generations of African scientists in the global science arena.
            </h6>
          </div>

          <div ref={valuesRef}>
            <h1 className="!text-[3em] md:!text-[5em] mb-4 md:mb-6">Values</h1>
            <div className="grid md:grid-cols-2 gap-4">
              {values.map((each_value, idx) => (
                <motion.div
                  className="border flex flex-col justify-around items-start min-h-[200px] lg:min-h-[12em] border-white/30 bg-transparent p-4"
                  key={each_value.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.7,
                    ease: 'easeOut',
                    delay: valuesInView ? idx * 0.12 : 0,
                  }}
                >
                  <span className="flex flex-col gap-2 items-start mb-2">
                    {each_value.icon}
                    <h6 className="!text-lg font-semibold">{each_value.valueName}</h6>
                  </span>
                  <p className="!text-sm">{each_value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionAndVision
