"use client"
import React, { useState } from 'react'
import { HiChevronDown, HiMail, HiGlobe } from 'react-icons/hi'
import { affiliatedActions } from '@/data/affiliatedActions'

const AffiliatedActions = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <div className="w-full py-12">
      <h2 className="!text-[3em] md:!text-[4em] text-white mb-4">Affiliated Actions</h2>
      <p className="text-white/80 max-w-2xl mb-8">
        Ocean Decade partners and affiliated actions working alongside COESSING.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {affiliatedActions.map((action, index) => {
          const isOpen = openIndex === index
          const hasDetails = action.description || action.emails.length > 0 || action.websites.length > 0

          return (
            <div
              key={action.name}
              className="border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden flex flex-col"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full flex items-start justify-between gap-3 p-4 text-left !rounded-none !border-0 !bg-transparent hover:!bg-white/5"
                aria-expanded={isOpen}
              >
                <span className="text-white font-medium leading-snug">{action.name}</span>
                <HiChevronDown
                  className={`w-5 h-5 shrink-0 mt-0.5 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && hasDetails && (
                <div className="px-4 pb-5 space-y-2 text-white/80 text-sm border-t border-white/10">
                  {action.description && (
                    <p className="leading-relaxed pt-3">{action.description}</p>
                  )}
                  <div className="flex flex-col gap-1 pt-1">
                    {action.emails.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="flex items-center gap-2 hover:text-white break-all"
                      >
                        <HiMail className="w-4 h-4 shrink-0" />
                        {email}
                      </a>
                    ))}
                    {action.websites.map((site) => (
                      <a
                        key={site}
                        href={site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-white break-all"
                      >
                        <HiGlobe className="w-4 h-4 shrink-0" />
                        {site.replace(/^https?:\/\//, '')}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {isOpen && !hasDetails && (
                <p className="px-4 pb-5 text-white/60 text-sm border-t border-white/10 pt-3">More details coming soon.</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AffiliatedActions
