"use client"
import React, { useState, useEffect } from 'react'

const SectionNavigation = ({ sections }) => {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className=" backdrop-blur-sm h-screen p-6 border-r-2 border-primary_color shadow-lg">
      <h3 className="  mb-4 !text-[3em]">Sections</h3>
      <nav className=" flex flex-col gap-[1em]">
        {sections.map((section) => (
          <p
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
              activeSection === section.id
                ? ' text-primary_color !text-[2em]'
                : 'text-gray-300 !text-sm '
            }`}
          >
            {section.title}
          </p>
        ))}
      </nav>
    </div>
  )
}

export default SectionNavigation
