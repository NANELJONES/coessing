'use client'
import React from 'react'
import { HiMenu } from 'react-icons/hi'
import { HiMap } from 'react-icons/hi'
import { motion } from 'framer-motion'

const AboutUs = () => {
  // Animated SVG components
  const AnimatedWaveSVG = () => (
    <motion.svg 
      width="78" 
      height="78" 
      viewBox="0 0 78 78" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path 
        d="M64.3628 64.0894C45.5176 57.6282 48.8828 39.4111 52.9211 31.1102C50.7673 32.1871 47.5367 29.7641 46.1907 28.4181C45.742 29.3155 44.3062 31.3795 42.1524 32.4563C39.4602 33.8024 38.1142 32.4563 34.7489 32.4563C32.0568 32.4563 27.7941 36.4946 25.9993 38.5137C19.5381 50.3593 20.615 64.9868 21.9611 70.8199C41.3447 83.2039 58.3054 71.4929 64.3628 64.0894Z" 
        stroke="white" 
        strokeWidth="2.64355"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path 
        d="M63.1914 13.5754C67.4989 13.0011 70.9461 15.695 73.2637 19.2913C74.4077 21.0666 75.2141 22.9796 75.6523 24.6252C75.8713 25.4477 75.9923 26.1788 76.0244 26.7737C76.0498 27.2433 76.0159 27.5689 75.9697 27.7708C75.7741 27.634 75.4501 27.3995 75.1738 27.2219C74.5075 26.7936 73.4883 26.2605 72.2236 26.4485C70.9567 26.637 69.7993 27.4911 68.6895 28.9709C67.8064 30.1483 67.1215 30.4538 66.666 30.5159C66.1792 30.5822 65.6144 30.4204 64.875 29.9768C64.0923 29.5072 63.4461 28.9456 62.5713 28.3137C61.8418 27.7869 60.8037 27.0959 59.6514 27.0959C58.5572 27.096 57.7901 27.5448 57.2334 28.1711C56.9873 28.448 56.792 28.7478 56.6367 28.9973C56.4624 29.2775 56.3504 29.4732 56.1963 29.7043C55.921 30.1173 55.6397 30.4357 55.2178 30.6731C54.79 30.9137 54.1014 31.135 52.9209 31.135C50.8537 31.1349 49.8499 30.038 48.9668 28.9944C48.7567 28.7461 48.5027 28.44 48.2559 28.1965C48.0236 27.9674 47.6347 27.6225 47.0986 27.4846C46.4472 27.3171 45.85 27.5121 45.3896 27.8655C44.9883 28.1737 44.6654 28.6166 44.3848 29.0842C43.8763 29.9317 43.4959 30.5332 43.1475 30.9709C42.8071 31.3985 42.5627 31.583 42.3623 31.6741C41.9622 31.8558 41.2593 31.8871 39.2051 31.2024C37.9462 30.7828 36.5014 31.1 35.2197 31.5872C33.8825 32.0955 32.4435 32.8995 31.0508 33.8049C30.6036 34.0957 30.1565 34.4006 29.7139 34.7131C34.8965 27.0274 40.3357 22.2528 45.5146 19.2102C52.0195 15.3886 58.2072 14.24 63.1914 13.5754Z" 
        stroke="white" 
        strokeWidth="2.64355"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
      />
      <mask id="path-3-inside-1_15_521" fill="white">
        <path d="M38.5889 0.294617C50.2589 0.294719 60.692 5.58525 67.625 13.8972C62.994 13.8325 58.2739 14.4784 53.6094 15.9177C29.6744 23.303 16.2585 48.6926 23.6436 72.6276C23.6658 72.6998 23.6903 72.7714 23.7129 72.8434C10.2353 67.067 0.79309 53.6824 0.792969 38.0905C0.792969 17.2166 17.715 0.294617 38.5889 0.294617Z"/>
      </mask>
      <motion.path 
        d="M38.5889 0.294617L38.5889 -2.34894H38.5889V0.294617ZM67.625 13.8972L67.5881 16.5405L73.3392 16.6208L69.6551 12.2039L67.625 13.8972ZM53.6094 15.9177L52.83 13.3916L52.8299 13.3916L53.6094 15.9177ZM23.6436 72.6276L21.1175 73.407L21.1175 73.407L23.6436 72.6276ZM23.7129 72.8434L22.6715 75.2732L27.9576 77.5388L26.2351 72.0517L23.7129 72.8434ZM0.792969 38.0905H-1.85058V38.0905L0.792969 38.0905ZM38.5889 0.294617L38.5888 2.93817C49.4415 2.93827 59.1425 7.85463 65.5949 15.5904L67.625 13.8972L69.6551 12.2039C62.2416 3.31587 51.0764 -2.34883 38.5889 -2.34894L38.5889 0.294617ZM67.625 13.8972L67.6619 11.2539C62.7589 11.1854 57.7632 11.8695 52.83 13.3916L53.6094 15.9177L54.3888 18.4437C58.7847 17.0874 63.229 16.4795 67.5881 16.5405L67.625 13.8972ZM53.6094 15.9177L52.8299 13.3916C27.4999 21.2074 13.302 48.0769 21.1175 73.407L23.6436 72.6276L26.1696 71.8482C19.215 49.3082 31.849 25.3986 54.3888 18.4437L53.6094 15.9177ZM23.6436 72.6276L21.1175 73.407C21.1356 73.4658 21.1534 73.5201 21.165 73.5557C21.1785 73.5971 21.1849 73.6167 21.1907 73.6352L23.7129 72.8434L26.2351 72.0517C26.1589 71.809 26.2162 71.9992 26.1696 71.8482L23.6436 72.6276ZM23.7129 72.8434L24.7543 70.4137C12.2138 65.0388 3.43664 52.5874 3.43652 38.0905L0.792969 38.0905L-1.85058 38.0905C-1.85046 54.7773 8.25689 69.0952 22.6715 75.2732L23.7129 72.8434ZM0.792969 38.0905H3.43652C3.43652 18.6766 19.175 2.93817 38.5889 2.93817V0.294617V-2.34894C16.255 -2.34894 -1.85058 15.7566 -1.85058 38.0905H0.792969Z" 
        fill="white" 
        mask="url(#path-3-inside-1_15_521)"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeInOut", delay: 0.4 }}
      />
    </motion.svg>
  )

  const AnimatedGlobeSVG = () => (
    <motion.svg 
      width="66" 
      height="66" 
      viewBox="0 0 66 66" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.circle 
        cx="33" 
        cy="33" 
        r="30" 
        stroke="white" 
        strokeWidth="6"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path 
        d="M38.2857 21.375H42.5714L46.4286 25.3125L49 28.8125L42.1429 38V42.8125L36.5714 52H32.7143L30.5714 47.625V44.125L28 41.5V35.8125L24.5714 33.625L16 31.4375L20.7143 18.75H26.7143L31 17L38.2857 21.375Z" 
        stroke="white" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
      />
    </motion.svg>
  )

  return (

    <div className=' py-[2em] min-h-screen  flex-col gap-[4em] justify-around flex items-start'>

   
    <div className='flex flex-wrap items-center gap-[2em]'>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        COESSING
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <AnimatedWaveSVG />
      </motion.span>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        is
      </motion.span>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        an
      </motion.span>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      >
        interantional
      </motion.span>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
      >
        summer
      </motion.span>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
      >
        school
      </motion.span>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
      >
        advancing
      </motion.span>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
      >
        ocean science
      </motion.span>
      <motion.span 
        className= "w-[6em] h-[4em]  lg:w-[10em] rounded-sm lg:h-[5em]  rounded-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
      >
      <img src="/gallery/6.jpg" alt="wave" className='w-full bg-white rounded-lg h-full object-cover' />
      </motion.span>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
      >
        in West Africa
      </motion.span>
      <motion.span 
        className="huge"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
      >
        <AnimatedGlobeSVG />
      </motion.span>
    </div>

    <motion.h5 
      className='w-full self-end text-white md:w-2/3 lg:w-1/3'
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    > 
      Since 2015, it has offered one-week programs in Ghana and Nigeria, expanding to Kenya in 2025; combining lectures, projects, and collaboration under the UN Decade of Ocean Science.
    </motion.h5>



    </div>
  )
}

export default AboutUs
