"use client"
import React, { useState, useEffect } from 'react'

const SectionNavigation = ({ sections }) => {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140

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
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="border border-primary_color/10 bg-white p-5 shadow-sm">
      <h3 className="text-sm uppercase tracking-wider text-primary_color/50 mb-4">On this page</h3>
      <nav className="flex flex-col gap-1">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className={`w-full text-left px-3 py-2 text-sm transition-colors border-l-2 ${
              activeSection === section.id
                ? 'border-primary_color text-primary_color font-semibold bg-primary_color/5'
                : 'border-transparent text-primary_color/55 hover:text-primary_color hover:bg-primary_color/[0.03]'
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default SectionNavigation
