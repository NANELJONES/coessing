"use client"
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  HiHand, 
  HiUsers, 
  HiGlobe, 
  HiAcademicCap, 
  HiLightningBolt 
} from 'react-icons/hi'

// Animated SVG Component for Mission
const MissionSVG = ({ inView }) => {
  return (
    <svg 
      width="471" 
      height="369" 
      viewBox="0 0 471 369" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Circles */}
      <motion.circle 
        cx="132" 
        cy="111" 
        r="110.5" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="132" 
        cy="111" 
        r="90.5" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.1, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="14.7568" 
        cy="14.7568" 
        r="14.2568" 
        transform="matrix(1 0 0 -1 117.243 125.757)" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="37" 
        cy="60" 
        r="36.8333" 
        stroke="white" 
        strokeWidth="0.333333"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="6" 
        cy="6" 
        r="6" 
        transform="matrix(1 0 0 -1 31 66)" 
        fill="white"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />
      <motion.circle 
        cx="234" 
        cy="332" 
        r="36.8333" 
        stroke="white" 
        strokeWidth="0.333333"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="6" 
        cy="6" 
        r="6" 
        transform="matrix(1 0 0 -1 228 338)" 
        fill="white"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      <motion.circle 
        cx="434" 
        cy="60" 
        r="36.8333" 
        stroke="white" 
        strokeWidth="0.333333"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="6" 
        cy="6" 
        r="6" 
        transform="matrix(1 0 0 -1 428 66)" 
        fill="white"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />
      <motion.circle 
        cx="334" 
        cy="111" 
        r="110.5" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="334" 
        cy="111" 
        r="87.5" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="18" 
        cy="18" 
        r="17.5" 
        transform="matrix(1 0 0 -1 316 129)" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="234" 
        cy="222" 
        r="110.5" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="234" 
        cy="222" 
        r="91.5" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="18" 
        cy="18" 
        r="17.5" 
        transform="matrix(1 0 0 -1 216 240)" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.7, ease: "easeInOut" }}
      />
      {/* Rectangles */}
      <motion.rect 
        x="309.5" 
        y="84.5" 
        width="50" 
        height="50" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
      />
      <motion.rect 
        x="107.5" 
        y="84.5" 
        width="50" 
        height="50" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
      />
      <motion.rect 
        x="209.5" 
        y="196.5" 
        width="50" 
        height="50" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
      />
    </svg>
  )
}

// Animated SVG Component for Vision
const VisionSVG = ({ inView }) => {
  return (
    <svg 
      width="335" 
      height="325" 
      viewBox="0 0 335 325" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Circles */}
      {[
        { cx: "171.5", cy: "269.5", r: "21", delay: 0 },
        { cx: "171.5", cy: "64.5", r: "21", delay: 0.1 },
        { cx: "274", cy: "167", r: "21", transform: "rotate(-90 274 167)", delay: 0.2 },
        { cx: "69", cy: "167", r: "21", transform: "rotate(-90 69 167)", delay: 0.3 },
        { cx: "243.979", cy: "94.5213", r: "21", transform: "rotate(-135 243.979 94.5213)", delay: 0.4 },
        { cx: "99.0215", cy: "239.478", r: "21", transform: "rotate(-135 99.0215 239.478)", delay: 0.5 },
        { cx: "99.0212", cy: "94.5221", r: "21", transform: "rotate(135 99.0212 94.5221)", delay: 0.6 },
        { cx: "243.978", cy: "239.479", r: "21", transform: "rotate(135 243.978 239.479)", delay: 0.7 },
        { cx: "171.5", cy: "166.5", r: "21", transform: "rotate(-90 171.5 166.5)", delay: 0.8 },
      ].map((circle, index) => (
        <motion.circle
          key={index}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          transform={circle.transform}
          stroke="white"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 1 : 0 }}
          transition={{ duration: 1, delay: circle.delay, ease: "easeInOut" }}
        />
      ))}
      {/* Rectangles */}
      <motion.rect 
        x="28.5" 
        y="27.5" 
        width="282" 
        height="282" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.9, ease: "easeInOut" }}
      />
      <motion.rect 
        x="0.5" 
        y="270.5" 
        width="54" 
        height="54" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeInOut" }}
      />
      <motion.rect 
        x="0.5" 
        y="0.5" 
        width="54" 
        height="54" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.1, ease: "easeInOut" }}
      />
      <motion.rect 
        x="280.5" 
        y="0.5" 
        width="54" 
        height="54" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeInOut" }}
      />
      <motion.rect 
        x="280.5" 
        y="270.5" 
        width="54" 
        height="54" 
        stroke="white"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1.3, ease: "easeInOut" }}
      />
    </svg>
  )
}

// Animated SVG Component for Values
const ValuesSVG = ({ inView }) => {
  const paths = [
    { d: "M193.816 0.5L131.542 33.5002H1.23438L63.5085 0.5H193.816Z", delay: 0 },
    { d: "M193.816 112.5L131.542 145.5H1.23438L63.5085 112.5H193.816Z", delay: 0.05 },
    { d: "M2.23438 145.5V34.5H131.234V145.5H2.23438Z", delay: 0.1 },
    { d: "M193.234 112.5L193.234 0.5", delay: 0.15 },
    { d: "M63.2344 112.5L63.2344 0.5", delay: 0.2 },
    { d: "M390.653 17.5L360.445 33.5079H297.234L327.443 17.5H390.653Z", delay: 0.25, strokeWidth: "0.485086" },
    { d: "M390.653 71.8297L360.445 87.8377H297.234L327.443 71.8297H390.653Z", delay: 0.3, strokeWidth: "0.485086" },
    { d: "M297.72 87.8375V33.9929H360.296V87.8375H297.72Z", delay: 0.35, strokeWidth: "0.485086" },
    { d: "M390.371 71.8296L390.371 17.5", delay: 0.4, strokeWidth: "0.485086" },
    { d: "M327.311 71.8296L327.311 17.5", delay: 0.45, strokeWidth: "0.485086" },
    { d: "M453.653 71.1687L423.445 87.1766H360.234L390.443 71.1687H453.653Z", delay: 0.5, strokeWidth: "0.485086" },
    { d: "M453.653 125.498L423.445 141.506H360.234L390.443 125.498H453.653Z", delay: 0.55, strokeWidth: "0.485086" },
    { d: "M360.72 141.506V87.6616H423.296V141.506H360.72Z", delay: 0.6, strokeWidth: "0.485086" },
    { d: "M453.371 125.498L453.371 71.1687", delay: 0.65, strokeWidth: "0.485086" },
    { d: "M390.311 125.498L390.311 71.1687", delay: 0.7, strokeWidth: "0.485086" },
    { d: "M323.816 112.5L261.542 145.5H131.234L193.508 112.5H323.816Z", delay: 0.75 },
    { d: "M323.816 224.5L261.542 257.5H131.234L193.508 224.5H323.816Z", delay: 0.8 },
    { d: "M132.234 257.5V146.5H261.234V257.5H132.234Z", delay: 0.85 },
    { d: "M323.234 224.5L323.234 112.5", delay: 0.9 },
    { d: "M193.234 224.5L193.234 112.5", delay: 0.95 },
    { d: "M452.816 224.5L390.542 257.5H260.234L322.508 224.5H452.816Z", delay: 1 },
    { d: "M452.816 336.5L390.542 369.5H260.234L322.508 336.5H452.816Z", delay: 1.05 },
    { d: "M261.234 369.5V258.5H390.234V369.5H261.234Z", delay: 1.1 },
    { d: "M452.234 336.5L452.234 224.5", delay: 1.15 },
    { d: "M322.234 336.5L322.234 224.5", delay: 1.2 },
    { d: "M192.816 112.5L130.542 145.5H0.234375L62.5085 112.5H192.816Z", delay: 1.25 },
    { d: "M192.816 224.5L130.542 257.5H0.234375L62.5085 224.5H192.816Z", delay: 1.3 },
    { d: "M1.23438 257.5V146.5H130.234V257.5H1.23438Z", delay: 1.35 },
    { d: "M192.234 224.5L192.234 112.5", delay: 1.4 },
    { d: "M62.2344 224.5L62.2344 112.5", delay: 1.45 },
    { d: "M192.816 224.5L130.542 257.5H0.234375L62.5085 224.5H192.816Z", delay: 1.5 },
    { d: "M192.816 336.5L130.542 369.5H0.234375L62.5085 336.5H192.816Z", delay: 1.55 },
    { d: "M1.23438 369.5V258.5H130.234V369.5H1.23438Z", delay: 1.6 },
    { d: "M192.234 336.5L192.234 224.5", delay: 1.65 },
    { d: "M62.2344 336.5L62.2344 224.5", delay: 1.7 },
    { d: "M384.816 191.5L322.542 224.5H192.234L254.508 191.5H384.816Z", delay: 1.75 },
    { d: "M384.816 303.5L322.542 336.5H192.234L254.508 303.5H384.816Z", delay: 1.8 },
    { d: "M193.234 336.5V225.5H322.234V336.5H193.234Z", delay: 1.85 },
    { d: "M384.234 303.5L384.234 191.5", delay: 1.9 },
    { d: "M254.234 303.5L254.234 191.5", delay: 1.95 },
  ]

  return (
    <svg 
      width="454" 
      height="370" 
      viewBox="0 0 454 370" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {paths.map((path, index) => (
        <motion.path
          key={index}
          d={path.d}
          stroke="white"
          strokeWidth={path.strokeWidth || "1"}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: path.delay, ease: "easeInOut" }}
        />
      ))}
    </svg>
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
    <div className='relative w-full py-16 md:py-24'>
      {/* Mission Section */}
      <div ref={missionRef} className='w-full flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-16 md:mb-24 px-4 md:px-8'>
        {/* SVG on Left - 50% */}
        <div className='w-full md:w-1/2 flex justify-center items-center'>
          <div className='w-full max-w-[471px] aspect-[471/369]'>
            <MissionSVG inView={missionInView} />
          </div>
        </div>
        
        {/* Content on Right - 50% */}
        <div className='w-full md:w-1/2 text-white flex flex-col justify-center'>
          <h1 className="!text-[3em] md:!text-[5em] mb-4 md:mb-6">Mission</h1>
          <div className='w-full'>
            <motion.h3
              className="leading-relaxed"
              initial="hidden"
              animate={missionInView ? 'visible' : 'hidden'}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.025 } }
              }}
            >
              {`To attract, empower, and educate future international African scientists, providing a platform for promoting African science, improvement of Africa and Africans scientific global ties.`
                .split(/(\s+)/)
                .map((token, idx) => (
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
                ))}
            </motion.h3>

            <br />
            <br />

            <motion.h3
              className="leading-relaxed"
              initial="hidden"
              animate={missionInView ? 'visible' : 'hidden'}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.025 } }
              }}
            >
              {`We create opportunities that foster collaboration, innovation, and knowledge exchange within the West African community, particularly in the fields of oceanic and environmental sciences.`
                .split(/(\s+)/)
                .map((token, idx) => (
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
                ))}
            </motion.h3>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div ref={visionRef} className='w-full flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-16 md:mb-24 px-4 md:px-8'>
        {/* SVG on Left - 50% */}
        <div className='w-full md:w-1/2 flex justify-center items-center order-2 md:order-1'>
          <div className='w-full max-w-[335px] aspect-[335/325]'>
            <VisionSVG inView={visionInView} />
          </div>
        </div>
        
        {/* Content on Right - 50% */}
        <div className='w-full md:w-1/2 text-white flex flex-col justify-center order-1 md:order-2'>
          <h1 className="!text-[3em] md:!text-[5em] mb-4 md:mb-6">Vision</h1>
          <h6 className="leading-relaxed">
            Addressing the conditions and equity issues that have historically led to the exclusion of African representation, we aim to empower both current and future generations of African scientists in the global science arena.
          </h6>
        </div>
      </div>

      {/* Values Section */}
      <div ref={valuesRef} className='w-full flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 px-4 md:px-8'>
        {/* SVG on Left - 50% */}
        <div className='w-full md:w-1/2 flex justify-center items-center'>
          <div className='w-full max-w-[454px] aspect-[454/370]'>
            <ValuesSVG inView={valuesInView} />
          </div>
        </div>
        
        {/* Content on Right - 50% */}
        <div className='w-full md:w-1/2 text-white flex flex-col justify-center'>
          <h1 className="!text-[3em] md:!text-[5em] mb-4 md:mb-6">Values</h1>
          <div className='grid md:grid-cols-2 gap-4'>
            {values.map((each_value, idx) => (
              <motion.div 
                className='border flex flex-col justify-around items-start min-h-[200px] lg:min-h-[12em] border-primary_color bg-gradient-to-b from-primary_color/10 to-transparent backdrop-blur-sm rounded-md p-4' 
                key={each_value.key}
                initial={{ opacity: 0, y: 20 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: valuesInView ? idx * 0.12 : 0 }}
              >
                <span className='flex flex-col gap-2 items-start mb-2'>
                  {each_value.icon}
                  <h6 className='!text-lg font-semibold'>{each_value.valueName}</h6>
                </span> 
                <p className='!text-sm'>{each_value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionAndVision
