"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { FiPlay, FiX } from 'react-icons/fi'

const PAGE_SIZE = 10

const isVideoMime = (mimeType = '') => mimeType.startsWith('video/')

const MediaThumb = ({ item, onPlayVideo }) => {
  const mediaType =
    item.mediaType ||
    (isVideoMime(item.mimeType) ? 'video' : item.mediaUrl || item.imageUrl ? 'image' : 'none')
  const src = item.mediaUrl || item.imageUrl || '/new-logo.png'

  if (mediaType === 'video') {
    return (
      <button
        type="button"
        onClick={() => onPlayVideo(src)}
        className="relative w-full h-[300px] lg:h-[20em] overflow-hidden bg-black/40 group !p-0 !rounded-none !border-0 !bg-none"
        style={{ backgroundImage: 'none', background: 'rgba(0,0,0,0.4)', borderRadius: 0 }}
        aria-label={`Play video testimonial from ${item.title || 'participant'}`}
      >
        <video
          src={src}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <span className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-14 h-14 rounded-full border border-white/80 bg-black/40 flex items-center justify-center text-white">
            <FiPlay className="w-6 h-6 ml-0.5" />
          </span>
        </span>
      </button>
    )
  }

  return (
    <div className="relative w-full h-[300px] lg:h-[20em] overflow-hidden">
      <Image
        src={src}
        alt={item.title || 'testimonial'}
        fill
        sizes="(min-width:1280px) 10vw,(min-width:1024px) 12vw,25vw"
        className="object-cover"
      />
    </div>
  )
}

const VideoOverlay = ({ src, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Video testimonial"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 !p-3 !rounded-full !border-white/40 !bg-black/50 !bg-none text-white"
        style={{ backgroundImage: 'none' }}
        aria-label="Close video"
      >
        <FiX className="w-6 h-6" />
      </button>
      <div
        className="relative w-full max-w-4xl aspect-video bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <video src={src} controls autoPlay playsInline className="w-full h-full object-contain" />
      </div>
    </div>
  )
}

const YearSection = ({ year, eager = false, onActive, expanded, toggleExpand, onPlayVideo, sectionRef }) => {
  const [items, setItems] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const skipRef = useRef(0)
  const loadingRef = useRef(false)
  const seenIdsRef = useRef(new Set())
  const startedRef = useRef(false)
  const sectionElRef = useRef(null)
  const sentinelRef = useRef(null)

  const setRefs = useCallback(
    (el) => {
      sectionElRef.current = el
      if (typeof sectionRef === 'function') sectionRef(el)
      else if (sectionRef) sectionRef.current = el
    },
    [sectionRef]
  )

  const fetchPage = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)
    setError('')
    const currentSkip = skipRef.current
    try {
      const res = await fetch(
        `/api/testimonials?year=${encodeURIComponent(year)}&first=${PAGE_SIZE}&skip=${currentSkip}`,
        { cache: 'no-store' }
      )
      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Failed to fetch testimonials')

      const incoming = Array.isArray(json.data) ? json.data : []
      const unique = incoming.filter((n) => {
        if (!n?.id) return false
        if (seenIdsRef.current.has(n.id)) return false
        seenIdsRef.current.add(n.id)
        return true
      })

      if (unique.length) setItems((prev) => [...prev, ...unique])
      setHasMore(Boolean(json.pageInfo?.hasNextPage))
      skipRef.current = currentSkip + PAGE_SIZE
    } catch (e) {
      console.error(`Failed to fetch testimonials for ${year}`, e)
      setError(e.message || 'Failed to load testimonials')
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [year, hasMore])

  // Start loading when section enters view
  useEffect(() => {
    const el = sectionElRef.current
    if (!el) return

    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onActive?.(year)
            if (!startedRef.current) {
              startedRef.current = true
              fetchPage()
            }
          }
        })
      },
      { rootMargin: '200px 0px', threshold: 0 }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [year, onActive, fetchPage])

  // Load more within this year
  useEffect(() => {
    if (!sentinelRef.current || !startedRef.current) return
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) fetchPage()
        })
      },
      { rootMargin: '160px' }
    )
    ob.observe(sentinelRef.current)
    return () => ob.disconnect()
  }, [fetchPage, items.length, hasMore])

  // Eager-load only the first (latest) year so content appears immediately
  useEffect(() => {
    if (!eager || startedRef.current) return
    startedRef.current = true
    fetchPage()
  }, [eager, fetchPage])

  return (
    <section id={`year-${year}`} ref={setRefs} className="scroll-mt-36 space-y-4">
      <div className="flex items-end justify-between border-b border-white/20 pb-2">
        <h2 className="text-white !text-[2em] md:!text-[2.5em] leading-none">{year}</h2>
        <p className="text-white/60 text-sm">
          {items.length}
          {hasMore ? '+' : ''} stories
        </p>
      </div>

      {error && <div className="text-red-200 text-sm">{error}</div>}

      {items.map((item) => (
        <div key={item.id} className="border border-white/15 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch">
            <div className="lg:col-span-1 p-4 flex items-center">
              <MediaThumb item={item} onPlayVideo={onPlayVideo} />
            </div>

            <div className="lg:col-span-2 px-4 py-3">
              <div className="border-y lg:border-y-0 lg:border-r border-white/10 py-3 flex flex-col justify-center">
                <h6 className="text-white font-semibold leading-snug mb-1">{item.title}</h6>
                <p className="text-white !text-xl leading-none">{item.schoolYear || year}</p>
                <p className="text-white/70 text-xs mt-1">{item.interest}</p>
              </div>
              <p
                className={`whitespace-pre-wrap md:columns-2 break-words text-white/90 !text-sm md:text-base leading-relaxed transition-all duration-200 ${
                  expanded.has(item.id) ? 'max-h-none overflow-visible' : 'max-h-24 overflow-hidden'
                }`}
              >
                {item.testimonial}
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="border border-white/30 text-white/90 rounded-md px-2 py-1 text-xs hover:bg-white/10"
                >
                  {expanded.has(item.id) ? '− Close' : '+ Read more'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div ref={sentinelRef} className="h-10" />
      {loading && <div className="text-white/70 text-sm">Loading {year}...</div>}
      {!loading && startedRef.current && !items.length && !error && (
        <div className="text-white/50 text-sm">No testimonials for {year}.</div>
      )}
    </section>
  )
}

const Page = () => {
  const [years, setYears] = useState([])
  const [yearsLoading, setYearsLoading] = useState(true)
  const [yearsError, setYearsError] = useState('')
  const [expanded, setExpanded] = useState(new Set())
  const [activeYear, setActiveYear] = useState(null)
  const [videoSrc, setVideoSrc] = useState(null)
  const sectionRefs = useRef({})

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setYearsLoading(true)
      setYearsError('')
      try {
        const res = await fetch('/api/testimonials/years', { cache: 'no-store' })
        const json = await res.json()
        if (!json.success) throw new Error(json.message || 'Failed to load years')
        if (cancelled) return
        const list = Array.isArray(json.data) ? json.data : []
        setYears(list)
        if (list.length) setActiveYear(list[0])
      } catch (e) {
        if (!cancelled) setYearsError(e.message || 'Failed to load years')
      } finally {
        if (!cancelled) setYearsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const scrollToYear = (year) => {
    const el = sectionRefs.current[year]
    if (!el) return
    setActiveYear(year)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen w-full px-2 md:px-6 lg:px-8 py-8 bg-gradient-to-b from-primary_color to-[#103F56]">
      <div className="w-full gap-6 lg:grid lg:grid-cols-4">
        <div className="lg:sticky top-0 lg:h-screen flex flex-col border-r border-white justify-between items-start lg:col-span-1 pb-6 lg:pb-0">
          <div>
            <h1 className="text-white !text-[2.5em] md:!text-[7em] leading-none">Our</h1>
            <h1 className="text-white !text-[2.5em] md:!text-[3em] leading-none"> Testimonials</h1>
          </div>
          <p className="text-white/80 text-sm max-w-sm">
            Real voices from our community across years. Stories of impact, growth, and opportunity.
          </p>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-8">
          {years.length > 0 && (
            <div className="sticky top-16 z-20 -mx-2 px-2 md:mx-0 md:px-0">
              <div className="bg-[#103F56]/90 backdrop-blur-md border border-white/15 px-3 py-3 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => scrollToYear(year)}
                      className={`!px-4 !py-2 !text-sm !rounded-full whitespace-nowrap !border transition-colors ${
                        activeYear === year
                          ? '!bg-white !border-white !text-primary_color !bg-none'
                          : '!bg-transparent !border-white/40 !text-white !bg-none hover:!bg-white/10'
                      }`}
                      style={{
                        backgroundImage: 'none',
                        background: activeYear === year ? '#fff' : 'transparent',
                        color: activeYear === year ? 'var(--color-primary_color)' : '#fff',
                        border: `1px solid ${activeYear === year ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {yearsLoading && <div className="text-white/80">Loading years...</div>}
          {yearsError && <div className="text-red-200">{yearsError}</div>}

          {years.map((year, index) => (
            <YearSection
              key={year}
              year={year}
              eager={index === 0}
              onActive={setActiveYear}
              expanded={expanded}
              toggleExpand={toggleExpand}
              onPlayVideo={setVideoSrc}
              sectionRef={(el) => {
                sectionRefs.current[year] = el
              }}
            />
          ))}

          {!yearsLoading && !yearsError && !years.length && (
            <div className="text-white/50">No testimonials found.</div>
          )}
        </div>
      </div>

      {videoSrc ? <VideoOverlay src={videoSrc} onClose={() => setVideoSrc(null)} /> : null}
    </div>
  )
}

export default Page
