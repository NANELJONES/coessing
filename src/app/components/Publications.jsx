'use client'
import React from 'react'
import { publicationsAbout, publicationsMention } from '@/data/publications'

const Publications = () => {
  return (
    <div className="w-full py-12">
      <h2 className="!text-[3em] md:!text-[4em] text-white mb-4">Publications</h2>
      <p className="text-white/80 max-w-2xl mb-10">
        Scholarly articles and resources about COESSING, plus publications that mention the school.
      </p>

      <div className="flex flex-col gap-10">
        <div>
          <h3 className="text-xl md:text-2xl text-white mb-4">Primarily about COESSING</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {publicationsAbout.map((item) => (
              <a
                key={item.link}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/20 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 hover:border-white/40 transition-all"
              >
                <p className="text-white group-hover:text-secondary_color transition-colors leading-snug">
                  {item.title}
                </p>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl text-white mb-4">Publications that mention COESSING</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {publicationsMention.map((item) => (
              <a
                key={item.link}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/20 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 hover:border-white/40 transition-all"
              >
                <p className="text-white group-hover:text-secondary_color transition-colors leading-snug">
                  {item.title}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Publications
