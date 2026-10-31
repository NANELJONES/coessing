"use client"
import React, { useMemo, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSchoolContext } from '@/contexts/SchoolContext'
import GallerySection from '@/app/components/GallerySection'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { transformSchoolData } from '@/lib/schools'
import { FiMapPin, FiArrowLeft } from 'react-icons/fi'

const OrgGrid = ({ items }) => {
  if (!items?.length) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="border border-primary_color/20 p-5 flex flex-col items-center justify-center text-center gap-3 min-h-[8rem] hover:border-primary_color/50 transition-colors"
        >
          {item.logo ? (
            <div className="w-full h-20 flex items-center justify-center bg-white p-2">
              <img
                src={item.logo}
                alt={item.name || 'Organization'}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : null}
          <p className="text-sm md:text-base font-medium leading-snug">{item.name}</p>
        </div>
      ))}
    </div>
  )
}

const richTextRenderers = {
  p: ({ children }) => <p className="text-lg md:text-xl leading-relaxed mb-5 text-primary_color/90">{children}</p>,
  bold: ({ children }) => <strong className="font-semibold text-primary_color">{children}</strong>,
  italic: ({ children }) => <em className="italic text-primary_color/70">{children}</em>,
  ul: ({ children }) => <ul className="list-disc list-inside mb-5 space-y-2 text-lg">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-5 space-y-2 text-lg">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h2: ({ children }) => <h2 className="!text-[2em] mt-10 mb-4">{children}</h2>,
  h3: ({ children }) => <h3 className="!text-[1.5em] mt-8 mb-3">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-secondary_color pl-5 italic my-6 text-primary_color/80">
      {children}
    </blockquote>
  ),
  img: (props) => {
    const { src, altText, title, height, width } = props
    if (!src) return null
    return (
      <div className="my-10 w-full overflow-hidden">
        <Image
          src={src}
          alt={altText || title || 'Content image'}
          width={width || 1400}
          height={height || 800}
          className="w-full h-auto max-h-[520px] object-cover"
        />
      </div>
    )
  },
  a: ({ children, href, openInNewTab }) => (
    <a
      href={href}
      target={openInNewTab ? '_blank' : '_self'}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      className="text-secondary_color font-semibold hover:underline"
    >
      {children}
    </a>
  ),
  iframe: (props) => {
    const node = props?.node || props
    if (!node) return null
    const url = node.url || node.src || ''
    if (!url) return null

    let embedUrl = url
    if (url.includes('youtube.com/watch')) {
      const videoId = url.match(/[?&]v=([^&]+)/)?.[1]
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes('youtu.be/')) {
      const videoId = url.match(/youtu.be\/([^?]+)/)?.[1]
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
    }

    return (
      <div className="my-10 w-full relative pb-[56.25%] h-0 overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded content"
        />
      </div>
    )
  },
  embed: ({ node }) => {
    const url = node?.url || node?.src || ''
    if (!url) return null
    let embedUrl = url
    if (url.includes('youtube.com/watch')) {
      const videoId = url.match(/[?&]v=([^&]+)/)?.[1]
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes('youtu.be/')) {
      const videoId = url.match(/youtu.be\/([^?]+)/)?.[1]
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
    }
    return (
      <div className="my-10 w-full relative pb-[56.25%] h-0 overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded content"
        />
      </div>
    )
  },
}

const SchoolDetailClient = ({ slug }) => {
  const { schools, loading: schoolsLoading } = useSchoolContext()
  const [school, setSchool] = useState(null)
  const [transformedSchool, setTransformedSchool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/schools/${slug}`)
        const data = await response.json()

        if (data.success && data.data) {
          setSchool(data.data)
          setTransformedSchool(transformSchoolData(data.data))
        } else {
          setError(data.message || 'School not found')
        }
      } catch (err) {
        console.error('Error fetching school:', err)
        setError('Failed to fetch school')
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchSchool()
  }, [slug])

  const sections = useMemo(() => {
    if (!transformedSchool) return []
    const items = [{ id: 'overview', title: 'Overview' }]
    if (transformedSchool.excerpt) items.push({ id: 'about', title: 'About' })
    if (school?.schoolDetails?.raw) items.push({ id: 'details', title: 'Details' })
    if (transformedSchool.instructors?.length) items.push({ id: 'instructors', title: 'Instructors' })
    items.push({ id: 'gallery', title: 'Gallery' })
    if (transformedSchool.funders?.length) items.push({ id: 'funders', title: 'Funders' })
    if (transformedSchool.schoolPartners?.length) {
      items.push({ id: 'school-partners', title: 'School Partners' })
    }
    return items
  }, [transformedSchool, school])

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + 160
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (!el) continue
        if (pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveSection(section.id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [sections])

  const previousSchools = useMemo(() => {
    if (!schools || schoolsLoading || !transformedSchool) return []
    return schools
      .filter((s) => s.slug !== transformedSchool.slug)
      .sort((a, b) => b.schoolYear - a.schoolYear)
  }, [schools, schoolsLoading, transformedSchool])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_color mx-auto mb-4" />
          <p className="text-lg text-primary_color">Loading school...</p>
        </div>
      </div>
    )
  }

  if (error || !school || !transformedSchool) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-2">Error loading school</p>
          <p className="text-gray-600 mb-6">{error || 'School not found'}</p>
          <Link href="/schools" className="text-primary_color underline">
            ← Back to schools
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full text-primary_color pb-20">
      {/* Full-bleed hero */}
      <section className="relative w-full h-[70vh] min-h-[420px] max-h-[760px]">
        {transformedSchool.coverImage ? (
          <Image
            src={transformedSchool.coverImage}
            alt={transformedSchool.schoolName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-primary_color" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b2f3d] via-[#0b2f3d]/50 to-black/10" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 lg:p-14">
          <Link
            href="/schools"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm w-fit"
          >
            <FiArrowLeft /> All schools
          </Link>

          <div className="text-white max-w-5xl">
            <p className="text-white/70 text-sm uppercase tracking-[0.2em] mb-3">
              {transformedSchool.year}
              {transformedSchool.country ? ` · ${transformedSchool.country}` : ''}
            </p>
            <h1 className="!text-[3em] md:!text-[5.5em] lg:!text-[7em] leading-[0.9] mb-5">
              {transformedSchool.schoolName}
            </h1>
            {transformedSchool.theme && (
              <p className="text-xl md:text-2xl italic text-white/90 mb-5">
                {transformedSchool.theme}
              </p>
            )}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:text-base text-white/80">
              {transformedSchool.location && (
                <span className="inline-flex items-center gap-2">
                  <FiMapPin /> {transformedSchool.location}
                </span>
              )}
              {transformedSchool.status && (
                <span className="uppercase tracking-wider">{transformedSchool.status}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky section bar — full width */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-primary_color/10">
        <div className="w-full px-6 md:px-10 lg:px-14 overflow-x-auto">
          <div className="flex gap-1 min-w-max py-3">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollTo(section.id)}
                className={`px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary_color text-white'
                    : 'text-primary_color/70 hover:text-primary_color hover:bg-primary_color/5'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content — full width, no max-width cage */}
      <div className="w-full px-6 md:px-10 lg:px-14 pt-12 md:pt-16">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-12 xl:gap-16">
          <div className="min-w-0 space-y-20">
            <section id="overview" className="scroll-mt-28">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-y border-primary_color/15 py-8">
                {[
                  { label: 'Year', value: transformedSchool.year },
                  { label: 'Location', value: transformedSchool.location },
                  { label: 'Country', value: transformedSchool.country },
                  { label: 'Status', value: transformedSchool.status },
                ]
                  .filter((item) => item.value)
                  .map((item) => (
                    <div key={item.label}>
                      <p className="text-xs uppercase tracking-[0.18em] text-primary_color/45 mb-2">
                        {item.label}
                      </p>
                      <p className="text-lg md:text-xl font-medium capitalize leading-snug">
                        {item.value}
                      </p>
                    </div>
                  ))}
              </div>
            </section>

            {transformedSchool.excerpt && (
              <section id="about" className="scroll-mt-28">
                <h2 className="!text-[3em] md:!text-[4em] leading-none mb-6">About</h2>
                <p className="text-xl md:text-2xl leading-relaxed text-primary_color/90 max-w-5xl">
                  {transformedSchool.excerpt}
                </p>
              </section>
            )}

            {school.schoolDetails?.raw && (
              <section id="details" className="scroll-mt-28">
                <h2 className="!text-[3em] md:!text-[4em] leading-none mb-8">Details</h2>
                <div className="max-w-5xl">
                  <RichText content={school.schoolDetails.raw} renderers={richTextRenderers} />
                </div>
              </section>
            )}

            {transformedSchool.instructors.length > 0 && (
              <section id="instructors" className="scroll-mt-28">
                <h2 className="!text-[3em] md:!text-[4em] leading-none mb-8">Instructors</h2>
                <div className="flex flex-wrap gap-3">
                  {transformedSchool.instructors.map((instructor, index) => (
                    <span
                      key={`${instructor}-${index}`}
                      className="border border-primary_color text-primary_color px-5 py-2.5 text-sm md:text-base"
                    >
                      {instructor}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section id="gallery" className="scroll-mt-28">
              <GallerySection schoolSlug={transformedSchool.slug} />
            </section>

            {transformedSchool.funders?.length > 0 && (
              <section id="funders" className="scroll-mt-28">
                <h2 className="!text-[3em] md:!text-[4em] leading-none mb-3">Funders</h2>
                <p className="text-primary_color/60 mb-8 max-w-2xl">
                  Funding partners associated with this school.
                </p>
                <OrgGrid items={transformedSchool.funders} />
              </section>
            )}

            {transformedSchool.schoolPartners?.length > 0 && (
              <section id="school-partners" className="scroll-mt-28">
                <h2 className="!text-[3em] md:!text-[4em] leading-none mb-3">School Partners</h2>
                <p className="text-primary_color/60 mb-8 max-w-2xl">
                  Host institutions and partners for this school.
                </p>
                <OrgGrid items={transformedSchool.schoolPartners} />
              </section>
            )}
          </div>

          {/* Other schools — only on wide screens, no boxed cage feel */}
          <aside className="hidden xl:block">
            <div className="sticky top-28">
              <p className="text-xs uppercase tracking-[0.18em] text-primary_color/45 mb-4">
                Other schools
              </p>
              <div className="flex flex-col border-t border-primary_color/15">
                {schoolsLoading ? (
                  <p className="py-4 text-sm text-primary_color/50">Loading...</p>
                ) : previousSchools.length > 0 ? (
                  previousSchools.map((prev) => (
                    <Link
                      key={prev.slug}
                      href={`/schools/${prev.slug}`}
                      className="py-4 border-b border-primary_color/15 hover:text-secondary_color transition-colors"
                    >
                      <div className="font-medium leading-snug">{prev.schoolName}</div>
                      <div className="text-sm text-primary_color/50 mt-1">{prev.schoolYear}</div>
                    </Link>
                  ))
                ) : (
                  <p className="py-4 text-sm text-primary_color/50">No other schools</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default SchoolDetailClient
