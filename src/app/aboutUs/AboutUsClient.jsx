"use client"
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { HiCalendar, HiLocationMarker, HiUsers, HiAcademicCap, HiGlobe, HiLightningBolt, HiHeart, HiStar } from 'react-icons/hi'
import { FaTwitter, FaFacebook, FaInstagram, FaGlobe } from 'react-icons/fa'
import Partners from '../components/Partners'
const AboutUsClient = () => {
  const [activeTab, setActiveTab] = useState('timeline')

  const timelineData = [
    {
      year: "1990-1992",
      title: "The Beginning",
      description: "Professor Brian K. Arbic serves as US Peace Corps Volunteer Secondary Math and Physics Teacher at Damongo Secondary School",
      type: "foundation"
    },
    {
      year: "2011-2017",
      title: "Research Collaboration",
      description: "Dr. Joseph Ansong works as postdoc in Arbic's lab at University of Michigan",
      type: "collaboration"
    },
    {
      year: "2014",
      title: "Exploratory Trip",
      description: "Arbic and Ansong make scouting trip to Ghana and Nigeria universities",
      type: "milestone"
    },
    {
      year: "2015",
      title: "First COESSING",
      description: "Inaugural Coastal Ocean Environment Summer School held in Ghana",
      type: "launch"
    },
    {
      year: "2016-2019",
      title: "Annual Growth",
      description: "Annual in-person schools in Ghana, establishing core programs",
      type: "growth"
    },
    {
      year: "2020-2021",
      title: "Virtual Adaptation",
      description: "COVID-19 response with online summer schools",
      type: "adaptation"
    },
    {
      year: "2022",
      title: "Nigeria Expansion",
      description: "First in-person school in Nigeria, hybrid format",
      type: "expansion"
    },
    {
      year: "2023",
      title: "Ghana Return",
      description: "Hybrid school back in Ghana with enhanced programming",
      type: "return"
    },
    {
      year: "2024",
      title: "Nigeria Success",
      description: "Successful in-person school in Nigeria",
      type: "success"
    },
    {
      year: "2025-2028",
      title: "Future Vision",
      description: "Planned alternating between Ghana (odd years) and Nigeria (even years)",
      type: "future"
    }
  ]

  const coreValues = [
    {
      icon: <HiLightningBolt className="w-8 h-8" />,
      title: "Innovation",
      description: "Pioneering ocean science education in West Africa"
    },
    {
      icon: <HiUsers className="w-8 h-8" />,
      title: "Collaboration",
      description: "Building bridges between US and African institutions"
    },
    {
      icon: <HiAcademicCap className="w-8 h-8" />,
      title: "Excellence",
      description: "Maintaining high standards in education and research"
    },
    {
      icon: <HiGlobe className="w-8 h-8" />,
      title: "Global Impact",
      description: "Addressing ocean challenges through international cooperation"
    },
    {
      icon: <HiHeart className="w-8 h-8" />,
      title: "Community",
      description: "Fostering lasting relationships and networks"
    }
  ]

  const statistics = [
    { number: "10+", label: "Years of Impact", icon: <HiCalendar className="w-6 h-6" /> },
    { number: "100+", label: "Annual Participants", icon: <HiUsers className="w-6 h-6" /> },
    { number: "2", label: "Countries", icon: <HiLocationMarker className="w-6 h-6" /> },
    { number: "50+", label: "Instructors", icon: <HiAcademicCap className="w-6 h-6" /> }
  ]

  const participantInitiatives = [
    {
      name: "Plastic Punch",
      founder: "Richmond Kennedy Quarcoo",
      years: "COESSING participant 2015-2019",
      slogan: "Less Plastics, Better Lives",
      description: "An international team of dedicated professionals aimed at protecting the environment from plastic waste, providing better waste management solutions, while improving people's living conditions. Plastic Punch is a non profit organization launched in January 2018 in Accra, Ghana.",
      website: "http://plasticpunch.org",
      social: {
        twitter: "https://twitter.com/PlasticPunchGH",
        facebook: "https://www.facebook.com/plasticpunch/",
        instagram: "https://www.instagram.com/plastic_punch/"
      }
    }
  ]

  const successStories = [
    {
      type: "academic",
      person: "Senam Tsai",
      achievement: "Graduate Student",
      description: "A co-organizer of the 2017 summer school, Senam is now a graduate student studying with Stephan Howden at University of Southern Mississippi.",
      details: "University of Southern Mississippi"
    },
    {
      type: "research",
      person: "Jennifer Moskel",
      achievement: "MS Thesis Research",
      description: "Wrote an MS thesis at Oregon State University on the impacts of our summer school on participants from the US, Europe, and Africa.",
      thesisLink: "link to thesis",
      institution: "Oregon State University"
    },
    {
      type: "program",
      achievement: "Python Workshops",
      description: "The Python workshops that have been held at COESSING since 2018 have been a large success, introducing participants to the basics of Python computing. Several participants have used their Python knowledge to further their careers.",
      startYear: "2018",
      impact: "Participants using Python knowledge to advance careers"
    },
    {
      type: "alumni",
      achievement: "Participants Returning as Instructors",
      description: "Several past participants have returned to help run the school:",
      people: [
        {
          name: "Oladipo Mumin",
          role: "Python Instructor",
          years: "2022"
        },
        {
          name: "Daniel Quaye",
          role: "Python Instructor",
          years: "2023"
        },
        {
          name: "Richmond Kennedy Quarcoo",
          role: "Instructor and Organizer",
          years: "2019-2024"
        },
        {
          name: "Roland Ovbiebo",
          role: "Organizer of Lightning Talks",
          years: "2022"
        }
      ]
    }
  ]

  const pressContent = [
    {
      source: "Ghana News Agency",
      date: "August 2, 2016",
      link: "#"
    },
    {
      source: "Koowa Media",
      date: "August 2016",
      link: "#"
    },
    {
      source: "News Ghana",
      date: "August 2016",
      link: "#"
    },
    {
      source: "2016 Ocean Sciences Meeting, Poster presentation",
      date: "February 2016",
      link: "#"
    },
    {
      source: "2018 Ocean Sciences Meeting, Oral presentation slides",
      date: "February 2018",
      link: "#"
    },
    {
      source: "Independent Newspapers",
      date: "August 2022",
      link: "#"
    },
    {
      source: "UNILAG Media",
      date: "August 2022",
      link: "#"
    },
    {
      source: "NNN News Nigeria",
      date: "August 2022",
      link: "#"
    },
    {
      source: "Remote sensing in earth systems sciences",
      date: "July 2022",
      link: "#"
    },
    {
      source: "GhanaWeb",
      date: "August 2023",
      link: "#"
    },
    {
      source: "Ocean Decade",
      date: "June 2024",
      link: "#"
    }
  ]

  const fundingPartners = [
    "US National Science Foundation (NSF)",
    "University of Michigan",
    "Regional Maritime University (RMU)",
    "International Centre for Theoretical Physics",
    "Gordon and Betty Moore Foundation",
    "US Office of Naval Research",
    "Schmidt Sciences"
  ]





  const Timeline = () => {
    const containerRef = useRef(null)
    
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "end start"]
    })
    
    // Transform scroll progress to height percentage (0% to 100%)
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
    
    // Timeline Item Component
    const TimelineItem = ({ item, index, totalItems }) => {
      const itemRef = useRef(null)
      const isInView = useInView(itemRef, { once: false, amount: 0.3 })
      
      // Calculate if this item is active (closest to center of viewport)
      const isActive = useTransform(scrollYProgress, (latest) => {
        const itemStart = index / totalItems
        const itemEnd = (index + 1) / totalItems
        const itemCenter = (itemStart + itemEnd) / 2
        const distance = Math.abs(latest - itemCenter)
        // Consider active if within 75% of item's allocated space
        return distance < (1 / totalItems) * 0.75
      })
      
      const [isCurrentlyActive, setIsCurrentlyActive] = React.useState(false)
      
      React.useEffect(() => {
        const unsubscribe = isActive.on("change", (latest) => {
          setIsCurrentlyActive(latest > 0.5)
        })
        return () => unsubscribe()
      }, [isActive])
      
      return (
        <motion.div
          ref={itemRef}
          className='grid grid-cols-4 gap-[2em] relative'
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isInView ? (isCurrentlyActive ? 1 : 0.6) : 0.6,
            y: isInView ? 0 : 30
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className='col-span-1 flex items-start gap-4 relative'>
            {/* Dot indicator */}
            <DotIndicator isActive={isActive} isInView={isInView} />
            <h2 className='font !text-[3em]'>{item.year}</h2>
          </div>
          <div className='col-span-3 border-b border-b-4 border-primary_color'>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
          </div>
        </motion.div>
      )
    }
    
    // Dot Indicator Component
    const DotIndicator = ({ isActive, isInView }) => {
      const [isCurrentlyActive, setIsCurrentlyActive] = React.useState(false)
      
      React.useEffect(() => {
        const unsubscribe = isActive.on("change", (latest) => {
          setIsCurrentlyActive(latest > 0.5)
        })
        return () => unsubscribe()
      }, [isActive])
      
      return (
        <motion.div
          className='absolute left-[-28px] top-[0.5em] w-4 h-4 rounded-full border-2 border-primary_color flex items-center justify-center'
          animate={{
            backgroundColor: isInView && isCurrentlyActive ? "var(--color-primary_color)" : "transparent",
            scale: isInView && isCurrentlyActive ? 1.3 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className='w-2 h-2 rounded-full bg-primary_color'
            animate={{
              scale: isInView && isCurrentlyActive ? 1 : 0,
              opacity: isInView && isCurrentlyActive ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      )
    }
    
    return (
      <div className='flex flex-col gap-[4em] relative' >
        <h1 className='!text-[4em] '>Timeline</h1>
        {/* <p>A brief history of COESSING's journey and milestones.</p> */}

        <div ref={containerRef} className='flex flex-col gap-[4em] relative'>
          {/* Animated line */}
          <motion.div 
            className='absolute top-0 left-[-20px] w-[1px] bg-primary_color origin-top'
            style={{ height: lineHeight }}
          />
          
          {timelineData.map((item, index) => (
            <TimelineItem 
              key={index}
              item={item} 
              index={index} 
              totalItems={timelineData.length}
            />
          ))}
        </div>
      
      </div>
    )
  }


  const BackgroundHistory = () => {
    return (
      <div className='flex flex-col gap-[2em]'>
        <img src="/ocean1.jpg" alt="background history" className='w-full h-full max-h-[400px]  object-cover' />
        <h1>Background History</h1>
<div className='grid grid-cols-1  lg:grid-cols-3 gap-[2em]'>
<p>The Coastal Ocean Environment Summer School In Nigeria and Ghana began with an exploratory “scouting trip” made in August 2014 by Professor Brian K. Arbic  and Research Scientist Dr. Joseph Ansong of the University of Michigan to the University of Ghana (UG), Regional Maritime University (RMU), the Department of Fisheries and Aquatic Sciences in the University of Cape Coast (UCC), and several departments at the Kwame Nkrumah University of Science and Technology (KNUST).  Together with our Ghanaian and Nigerian colleagues, we have held summer schools every year since 2015. As COESSING enters its tenth year we remain true to our vision, mission, and five core values.</p>

<p>In-person schools have been held annually in Ghana from 2015-2019, and in 2023. In 2022 and 2024, in-person schools were held in Nigeria. We held online schools in the years 2020-2023. For the next four years (2025-2028) we plan to alternate in-person schools between Ghana (odd years) and Nigeria (even years).</p> 

<p>Arbic was a US Peace Corps Volunteer Secondary Math and Physics Teacher at Damongo Secondary School from 1990-1992.  Ansong was a student in Arbic’s Damongo classroom and worked as a postdoc in Arbic’s lab at University of Michigan from 2011-2017.  Ansong returned to Ghana, as a faculty member in the UG Department of Mathematics, in 2017.  Some background on Arbic and Ansong’s time together in Ghana in the 1990s and 2010s can be found here.  Another participating US professor, Emily Shroyer of Oregon State University, was also a Peace Corps Volunteer Teacher in Ghana (Half Assini Secondary School, 2001-2003).</p> 
   
</div>
   
   
      </div>
    )
  }


  const ParticipantsInitiatives = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })
    
    return (
      <motion.div 
        ref={ref}
        className='flex flex-col gap-[2em]'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className='!text-[4em]'>Participants Initiatives</h1>
        {participantInitiatives.map((item, index) => (
          <motion.div 
            key={index} 
            className='flex flex-col-reverse  md:flex-row-reverse gap-[2em]'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
          >
            {/* Image Section */}
            <div className='w-full md:w-1/2 lg:w-2/3 lg:mt-[10em]'>
              <Image 
                src="/ocean1.jpg" 
                alt={item.name}
                width={600}
                height={150}
                className='w-full object-cover rounded-lg'
              />


<div> 
              <p className='leading-relaxed mb-4'>{item.description}</p>
              
              {/* Links Section */}
              <div className='flex flex-col gap-3 mt-auto'>
                <div className='flex items-center gap-2'>
                  <FaGlobe className='w-5 h-5' />
                  <a 
                    href={item.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='text-white/80 hover:text-white underline transition-colors'
                  >
                    {item.website}
                  </a>
                </div>
                
                {/* Social Links */}
                <div className='flex items-center gap-4'>
                  <a 
                    href={item.social.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='text-white/80 hover:text-white transition-colors'
                    aria-label="Twitter"
                  >
                    <FaTwitter className='w-6 h-6' />
                  </a>
                  <a 
                    href={item.social.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='text-white/80 hover:text-white transition-colors'
                    aria-label="Facebook"
                  >
                    <FaFacebook className='w-6 h-6' />
                  </a>
                  <a 
                    href={item.social.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='text-white/80 hover:text-white transition-colors'
                    aria-label="Instagram"
                  >
                    <FaInstagram className='w-6 h-6' />
                  </a>
                </div>
              </div>

              </div>
            </div>

            
            
            {/* Content Section */}
            <div className='w-full md:w-1/2 lg:w-1/3 flex justify-between flex-col gap-4'>
              <div>
                <h2 className='!text-[3em] mb-2'>{item.name}</h2>
                <p className='text-white/80 mb-2'>Founded by {item.founder}</p>
                <p className='text-white/60 text-sm mb-4'>{item.years}</p>
              </div>
              
              {item.slogan && (
                <div className='mb-4'>
                  <p className='!text-[2em] italic'>"{item.slogan}"</p>
                </div>
              )}
              



           

            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }


  const CoessingSuccess = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })
    
    // Animated SVG Component
    const AnimatedSVG = ({ inView }) => {
      return (
        <motion.svg 
          width="100%" 
          height="24" 
          viewBox="0 0 304 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className='w-full lg:w-2/5'
        >
          <motion.path 
            d="M0 23.5H123L139.5 0.5H303.5" 
            stroke="white"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: inView ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.svg>
      )
    }
    
    return (
      <motion.div 
        ref={ref}
        className='flex flex-col gap-[3em]'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className='!text-[4em]'>COESSING Success</h1>
        
        <div className='grid md:grid-cols-2 gap-6'>
          {successStories.map((story, index) => (
            <motion.div 
              key={index} 
              className={`border border-white/20 bg-white/5 backdrop-blur-sm rounded-lg p-6 flex flex-col gap-4 ${
                story.type === "program" || story.type === "alumni" ? "md:col-span-2" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: "easeOut" }}
            >
              {/* Academic/Research Stories */}
              {story.type === "academic" || story.type === "research" ? (
                <>
                  <div>
                    <h2 className='!text-2xl mb-2'>{story.person}</h2>
                    <p className='text-white/80 text-sm'>{story.achievement}</p>
                  </div>
                  <p className='leading-relaxed !text-sm'>{story.description}</p>
                  {story.details && (
                    <p className='text-white/60 text-sm italic'>— {story.details}</p>
                  )}
                  {story.institution && (
                    <p className='text-white/60 text-sm italic'>— {story.institution}</p>
                  )}
                  {story.thesisLink && (
                    <a 
                      href="#" 
                      className='text-white/80 hover:text-white underline text-sm transition-colors'
                    >
                      {story.thesisLink}
                    </a>
                  )}
                </>
              ) : story.type === "program" ? (
                <>
                  {/* Program Success Story */}
                  <div className='flex items-start lg:items-center flex-col lg:flex-row w-full  justify-between gap-4'>
                   <span className='w-full  lg:w-2/5'>
                   <h2 className='!text-2xl mb-2'>{story.achievement}</h2>
                    {story.startYear && (
                      <p className='text-white/80 text-sm'>Since {story.startYear}</p>
                    )}
                   </span>
                


                  <AnimatedSVG inView={isInView} />

                <div className='w-full '>
                <p className='leading-relaxed !text-sm'>{story.description}</p>
                  {story.impact && (
                    <div className='mt-2 p-3 bg-white/10 rounded border-l-4 border-primary_color'>
                      <p className='text-sm text-white/90'>{story.impact}</p>
                    </div>
                  )}
                </div>
                </div>

                </>
              ) : (
                <>
                  {/* Alumni Returning as Instructors */}
                  <div className='flex items-start lg:items-center flex-col lg:flex-row w-full gap-4 '>
                    <h2 className='!text-2xl mb-2 w-auto lg:w-auto '>{story.achievement}</h2>
              
                    <AnimatedSVG inView={isInView} />


<div className='w-full lg:w-1/2'>
<p className='leading-relaxed mb-4'>{story.description}</p>
                  <div className='flex flex-col gap-3'>
                    {story.people?.map((person, personIndex) => (
                      <div 
                        key={personIndex}
                        className='border-l-4 border-primary_color pl-4 py-2 bg-white/5 rounded-r'
                      >
                        <p className='font-semibold'>{person.name}</p>
                        <p className='text-white/80 text-sm'>{person.role}</p>
                        <p className='text-white/60 text-xs'>{person.years}</p>
                      </div>
                    ))}
                  </div>
                  </div>

                  </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
    )
  }



  const PressContent = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })
    
    return (
      <motion.div 
        ref={ref}
        className='flex flex-col gap-[2em]'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className='!text-[4em]'>COESSING in the Press</h1>
        
        <div className='flex flex-col gap-3'>
          {pressContent.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className='group border border-white/20 bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 hover:border-white/30 transition-all duration-300'
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -30 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.05, ease: "easeOut" }}
            >
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                <p className='font-semibold group-hover:text-white transition-colors'>
                  {item.source}
                </p>
                <p className='text-white/60 text-sm md:text-base'>
                  {item.date}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    )
  }



  const FundingPartners = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })
    
    return (
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className='!text-[4em]'>Funding Partners</h1>
        <div className='flex flex-col gap-3 mt-4'>
          {fundingPartners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -30 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.05, ease: "easeOut" }}
              className='p-4 border border-white/20 bg-white/5 backdrop-blur-sm rounded-lg'
            >
              <p>{partner}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  const Statistics = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.2 })
    
    return (
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className='!text-[4em]'>Statistics</h1>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4'>
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: "easeOut" }}
              className='p-6 border border-white/20 bg-white/5 backdrop-blur-sm rounded-lg flex flex-col items-center gap-3'
            >
              <div className='text-primary_color'>
                {stat.icon}
              </div>
              <p className='!text-3xl font-bold'>{stat.number}</p>
              <p className='text-white/80 text-sm'>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: false, amount: 0.3 })

  return (
    <div className="min-h-screen gap-4 flex flex-col px-2 lg:px-0 py-2    w-full lg:grid lg:grid-cols-4 bg-gradient-to-b from-primary_color to-[#103F56] text-white ">
      {/* Hero Section */}
      <div ref={heroRef} className='lg:sticky shadow-xl border-r border-r-4 border-r-white/10  p-2   top-0 lg:h-screen flex flex-col justify-between items-start lg:col-span-1 '>

        <motion.h1 
          className='md:!text-[7em] !text-[3em]'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Advancing ocean science education in West Africa through collaboration, innovation, and community building since 2015.
        </motion.p>
      </div>
<div className='col-span-3 lg:pl-[3em] px-2 flex flex-col gap-[2em] mb-[5em]'>
  <BackgroundHistory />
  <Timeline />
  <ParticipantsInitiatives />
  <CoessingSuccess />
  <PressContent />
  <FundingPartners />
  <Partners/>
  {/* <Statistics /> */}
  

  
  </div>    
    </div>
  )
}

export default AboutUsClient
