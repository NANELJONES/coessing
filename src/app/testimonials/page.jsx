"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const PAGE_SIZE = 10

const Page = () => {
  const [items, setItems] = useState([]) // [{id,title,interest,schoolYear,testimonial,imageUrl}]
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const seenIdsRef = useRef(new Set())
  const sentinelRef = useRef(null)
  const skipRef = useRef(0)
  const [expanded, setExpanded] = useState(new Set())

  const toggleExpand = (id) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const fetchTestimonials = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const currentSkip = skipRef.current
    try {
      const res = await fetch(`/api/testimonials?first=${PAGE_SIZE}&skip=${currentSkip}`, { cache: 'no-store' })
      const json = await res.json()
      if (json.success) {
        const incoming = Array.isArray(json.data) ? json.data : []
        const unique = incoming.filter(n => {
          if (!n?.id) return false
          if (seenIdsRef.current.has(n.id)) return false
          seenIdsRef.current.add(n.id)
          return true
        })
        if (unique.length) {
          setItems(prev => [...prev, ...unique])
        }
        setHasMore(json.pageInfo?.hasNextPage ?? false)
        skipRef.current = currentSkip + PAGE_SIZE
        setSkip(skipRef.current)
      }
    } catch (e) {
      console.error('Failed to fetch testimonials', e)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore])

  useEffect(() => { 
    fetchTestimonials() 
  }, [])

  useEffect(() => {
    if (!sentinelRef.current) return
    const ob = new IntersectionObserver((entries) => {
      entries.forEach(e => { 
        if (e.isIntersecting) {
          fetchTestimonials() 
        }
      })
    }, { rootMargin: '200px' })
    ob.observe(sentinelRef.current)
    return () => ob.disconnect()
  }, [fetchTestimonials])

  return (
    <div className="min-h-screen w-full px-2 md:px-6 lg:px-8 py-8 bg-gradient-to-b from-primary_color to-[#103F56]">
      <div className="w-full gap-6 lg:grid lg:grid-cols-4">
        {/* Sticky left heading (mirrors AboutUsClient) */}
        <div className="lg:sticky top-0 lg:h-screen flex flex-col border-r border-white justify-between items-start lg:col-span-1 pb-6 lg:pb-0">
         <div>
         <h1 className="text-white !text-[2.5em] md:!text-[7em] leading-none">Our</h1>
         <h1 className="text-white !text-[2.5em] md:!text-[3em] leading-none"> Testimonials</h1>
         
         </div>
         
          <p className="text-white/80 text-sm max-w-sm">Real voices from our community across years. Stories of impact, growth, and opportunity.</p>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {items.map(item => (
            <div key={item.id} className="border border-white/15 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch">
                {/* Image */}
                <div className="lg:col-span-1 p-4 flex items-center">
                  <div className="relative w-full  h-[300px] lg:w-full lg:h-[20em] overflow-hidden">
                    <Image src={item.imageUrl || '/Logo.webp'} alt={item.title || 'testimonial'} fill sizes="(min-width:1280px) 10vw,(min-width:1024px) 12vw,25vw" className="object-cover " />
                  </div>
                </div>

                {/* Meta: Title | Year | Interest */}
           

                {/* Testimonial - widest column with accordion */}
                <div className="lg:col-span-2 px-4 py-3">
                <div className="lg:col-span-3 border-y lg:border-y-0 lg:border-r border-white/10  py-3 flex flex-col justify-center">
                  <h6 className="text-white font-semibold leading-snug mb-1">{item.title}</h6>
                  <p className="text-white !text-xl leading-none">{item.schoolYear || '—'}</p>
                  <p className="text-white/70 text-xs mt-1">{item.interest}</p>
                </div>
                  <p className={`whitespace-pre-wrap md:columns-2 break-words text-white/90 !text-sm md:text-base leading-relaxed transition-all duration-200 ${expanded.has(item.id) ? 'max-h-none overflow-visible' : 'max-h-24 overflow-hidden'}`}>
                    {item.testimonial}
                  </p>
                  <div className="mt-2">
                    <button onClick={() => toggleExpand(item.id)} className="border border-white/30 text-white/90 rounded-md px-2 py-1 text-xs hover:bg-white/10">
                      {expanded.has(item.id) ? '− Close' : '+ Read more'}
                    </button>
                  </div>
                </div>
              </div>

              {/* just here it should show the full content here */}
              {/* <div className={`whitespace-pre-wrap break-words text-white/90 !text-sm md:text-base leading-relaxed transition-all duration-200 ${expanded.has(item.id) ? 'max-h-none overflow-visible' : 'max-h-24 overflow-hidden'}`}>
              <p className={`whitespace-pre-wrap break-words text-white/90 !text-sm md:text-base leading-relaxed transition-all duration-200 ${expanded.has(item.id) ? 'max-h-none overflow-visible' : 'max-h-24 overflow-hidden'}`}>
                    {item.testimonial}
                  </p>
              </div> */}
            </div>
          ))}

          {/* Infinite scroll sentinel and states */}
          <div ref={sentinelRef} className="h-24" />
          {loading && <div className="text-white/80">Loading more...</div>}
          {!hasMore && !loading && <div className="text-white/50">No more testimonials.</div>}
        </div>
      </div>
    </div>
  )
}

export default Page

