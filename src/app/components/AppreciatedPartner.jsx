import React from 'react'

const AppreciatedPartner = () => {
  return (
    <div className="w-full py-12">
      <h2 className="!text-[3em] md:!text-[4em] text-white mb-4">Appreciated Partner</h2>
      <p className="text-white/80 max-w-2xl mb-8">
        We thank Schmidt Sciences for funding that helps make COESSING possible.
      </p>
      <a
        href="https://www.schmidtsciences.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center bg-white p-6 border border-white/20 hover:border-white/40 transition-colors max-w-xs"
      >
        <img
          src="/partners/image.png"
          alt="Schmidt Sciences"
          className="w-full max-w-[240px] h-auto object-contain"
        />
      </a>
    </div>
  )
}

export default AppreciatedPartner
