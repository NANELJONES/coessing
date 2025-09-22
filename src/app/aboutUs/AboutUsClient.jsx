"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { HiCalendar, HiLocationMarker, HiUsers, HiAcademicCap, HiGlobe, HiLightningBolt, HiHeart, HiStar } from 'react-icons/hi'

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
      years: "2015-2019 participant",
      description: "An international team of dedicated professionals aimed at protecting the environment from plastic waste, providing better waste management solutions, while improving people's living conditions.",
      website: "http://plasticpunch.org",
      social: {
        twitter: "@PlasticPunchGH",
        facebook: "https://www.facebook.com/plasticpunch/",
        instagram: "@plastic_punch"
      }
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

  return (
    <div className="min-h-screen bg-primary_color">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/ocean1.jpg"
            alt="Ocean background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary_color/80 to-primary_color/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-8 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            About
            <span className="block text-secondary_color">COESSING</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            Advancing ocean science education in West Africa through collaboration, 
            innovation, and community building since 2015.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {statistics.map((stat, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                {stat.icon}
                <span className="font-semibold">{stat.number}</span>
                <span className="text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-20 bg-primary_color/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex space-x-8 py-4">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-2 px-4 rounded-full transition-all duration-200 ${
                activeTab === 'timeline' 
                  ? 'bg-secondary_color text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`py-2 px-4 rounded-full transition-all duration-200 ${
                activeTab === 'values' 
                  ? 'bg-secondary_color text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Our Values
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`py-2 px-4 rounded-full transition-all duration-200 ${
                activeTab === 'impact' 
                  ? 'bg-secondary_color text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Impact
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`py-2 px-4 rounded-full transition-all duration-200 ${
                activeTab === 'partners' 
                  ? 'bg-secondary_color text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Partners
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      {activeTab === 'timeline' && (
        <div className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Our Journey</h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary_color to-primary_color"></div>
              
              {timelineData.map((item, index) => (
                <div key={index} className="relative flex items-start mb-12">
                  {/* Timeline Dot */}
                  <div className={`relative z-10 w-4 h-4 rounded-full ${
                    item.type === 'foundation' ? 'bg-blue-500' :
                    item.type === 'collaboration' ? 'bg-green-500' :
                    item.type === 'milestone' ? 'bg-yellow-500' :
                    item.type === 'launch' ? 'bg-red-500' :
                    item.type === 'growth' ? 'bg-purple-500' :
                    item.type === 'adaptation' ? 'bg-orange-500' :
                    item.type === 'expansion' ? 'bg-pink-500' :
                    item.type === 'return' ? 'bg-indigo-500' :
                    item.type === 'success' ? 'bg-emerald-500' :
                    'bg-secondary_color'
                  } ml-6 mt-2`}></div>
                  
                  {/* Content */}
                  <div className="ml-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-2xl font-bold text-secondary_color">{item.year}</span>
                      <span className="text-lg font-semibold text-white">{item.title}</span>
                    </div>
                    <p className="text-white/80 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Values Section */}
      {activeTab === 'values' && (
        <div className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-white/10 transition-all duration-300">
                  <div className="text-secondary_color mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-white/80 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>

            {/* Mission & Vision */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-white/80 leading-relaxed">
                  To empower African scientists today and tomorrow to lead in global ocean science 
                  through collaborative education, innovative research, and community building.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-white/80 leading-relaxed">
                  A future where West African scientists are at the forefront of ocean science 
                  research, driving solutions to global environmental challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Impact Section */}
      {activeTab === 'impact' && (
        <div className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Our Impact</h2>
            
            {/* Participant Initiatives */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8">Participant Initiatives</h3>
              {participantInitiatives.map((initiative, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-8 mb-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-secondary_color rounded-full flex items-center justify-center flex-shrink-0">
                      <HiStar className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{initiative.name}</h4>
                      <p className="text-white/80 mb-4">{initiative.description}</p>
                      <div className="text-sm text-white/60 mb-4">
                        Founded by {initiative.founder} ({initiative.years})
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <a 
                          href={initiative.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-secondary_color hover:text-white transition-colors"
                        >
                          Website
                        </a>
                        <span className="text-white/40">|</span>
                        <span className="text-white/60">{initiative.social.twitter}</span>
                        <span className="text-white/40">|</span>
                        <span className="text-white/60">{initiative.social.instagram}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Success Stories */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8">Success Stories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                  <h4 className="text-lg font-bold text-white mb-3">Academic Advancement</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Senam Tsai, a co-organizer of the 2017 summer school, is now a graduate student 
                    studying with Stephan Howden at University of Southern Mississippi.
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                  <h4 className="text-lg font-bold text-white mb-3">Research Impact</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Jennifer Moskel wrote an MS thesis at Oregon State University on the impacts 
                    of our summer school on participants from the US, Europe, and Africa.
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                  <h4 className="text-lg font-bold text-white mb-3">Career Development</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Python workshops since 2018 have introduced participants to computing basics, 
                    with several using this knowledge to advance their careers.
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                  <h4 className="text-lg font-bold text-white mb-3">Community Building</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Past participants return as instructors and organizers, including Oladipo Mumin, 
                    Daniel Quaye, Richmond Kennedy Quarcoo, and Roland Ovbiebo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partners Section */}
      {activeTab === 'partners' && (
        <div className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Our Partners & Funders</h2>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Funding Partners</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fundingPartners.map((partner, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-white font-medium">{partner}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Institutional Partners</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">Ghana</h4>
                  <ul className="space-y-2 text-white/80">
                    <li>• University of Ghana (UG)</li>
                    <li>• Regional Maritime University (RMU)</li>
                    <li>• University of Cape Coast (UCC)</li>
                    <li>• Kwame Nkrumah University of Science and Technology (KNUST)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-4">United States</h4>
                  <ul className="space-y-2 text-white/80">
                    <li>• University of Michigan</li>
                    <li>• Oregon State University</li>
                    <li>• University of Southern Mississippi</li>
                    <li>• The Consortium for Ocean Leadership</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutUsClient
