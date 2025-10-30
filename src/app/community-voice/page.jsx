"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Layout from '../components/Layout'
const PAGE_SIZE = 10

const Page = () => {
  // Flat images array and de-dupe sets
  const [images, setImages] = useState([]) // [{ url, key }]
  const seenIdsRef = useRef(new Set())
  const seenUrlsRef = useRef(new Set())
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef(null)

  const fetchVoices = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await fetch(`/api/community-voices?first=${PAGE_SIZE}&skip=${skip}`, { cache: 'no-store' })
      const json = await res.json()
      if (json.success) {
        const incoming = Array.isArray(json.data) ? json.data : []
        const batch = []
        for (const node of incoming) {
          if (!node?.id) continue
          if (seenIdsRef.current.has(node.id)) continue
          seenIdsRef.current.add(node.id)
          const files = Array.isArray(node.voice) ? node.voice : []
          for (let i = 0; i < files.length; i++) {
            const url = files[i]?.url
            if (!url || seenUrlsRef.current.has(url)) continue
            seenUrlsRef.current.add(url)
            batch.push({ url, key: `${node.id}-${i}` })
          }
        }
        if (batch.length) setImages(prev => [...prev, ...batch])
        setHasMore(json.pageInfo?.hasNextPage ?? false)
        setSkip(prev => prev + PAGE_SIZE)
      }
    } catch (e) {
      console.error('Failed to fetch community voices', e)
    } finally {
      setLoading(false)
    }
  }, [skip, loading, hasMore])

  useEffect(() => {
    fetchVoices()
  }, [])

  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) fetchVoices()
      })
    }, { rootMargin: '200px' })
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [fetchVoices])

  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-12 bg-gradient-to-b from-primary_color to-[#103F56]">
<div className='flex flex-col items-start w-full lg:flex-row gap-4'>
<h1 className="text-white !text-[2em] md:!text-[5em] mb-6">Our Community Voices</h1>
<p className="text-white/80 text-sm mb-6">Scroll through the community voices of the students and teachers of the West African Science Academy.</p>
   
   
</div>
   
      {/* Masonry layout via CSS columns */}
      <Layout>
      <div className="columns_container">
        {images.map(({ url, key }) => (
          <a key={key} href={url} target="_blank" rel="noreferrer" className="inline-block w-full mb-4 h-auto break-inside-avoid">
            <Image
              src={url}
              alt="voice"
              width={1200}
              height={800}
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="w-full h-auto object-cover shadow"
            />
          </a>
        ))}
      </div>
      </Layout>
      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-24" />

      {loading && (
        <div className="text-white/80 mt-6">Loading more...</div>
      )}
      {!hasMore && !loading && (
        <div className="text-white/50 mt-6">No more voices.</div>
      )}
    </div>
  )
}

export default Page
