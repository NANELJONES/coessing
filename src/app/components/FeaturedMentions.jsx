"use client"
import React from 'react'
import { pressMentions } from '@/data/pressMentions'

const FeaturedMentions = ({ title = 'Featured Mentions' }) => {
  return (
    <div className="w-full py-12">
      <h2 className="!text-[3em] md:!text-[4em] text-white mb-4">{title}</h2>
      <p className="text-white/80 max-w-2xl mb-8">
        COESSING in the press, journals, and partner channels.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pressMentions.map((item) => (
          <a
            key={`${item.source}-${item.link}`}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-white/20 bg-white/5 backdrop-blur-sm p-5 hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex flex-col justify-between gap-3 min-h-[110px]"
          >
            <p className="font-semibold text-white group-hover:text-secondary_color transition-colors leading-snug">
              {item.source}
            </p>
            <p className="text-white/50 text-xs mt-auto">{item.date}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

export default FeaturedMentions
