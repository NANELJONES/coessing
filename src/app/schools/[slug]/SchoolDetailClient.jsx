"use client"
import React, { useMemo, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSchoolContext } from '@/contexts/SchoolContext'
import GallerySection from '@/app/components/GallerySection'
import SectionNavigation from '@/app/components/SectionNavigation'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { transformSchoolData } from '@/lib/schools'
import { FiMapPin } from 'react-icons/fi'



const SchoolDetailClient = ({ slug }) => {
  const { schools, loading: schoolsLoading, hasMore, loadingMore, loadMoreSchools } = useSchoolContext()
  const [school, setSchool] = useState(null)
  const [transformedSchool, setTransformedSchool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch school data from API
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching school:', slug)
        const response = await fetch(`/api/schools/${slug}`)
        const data = await response.json()
        console.log('School API Response:', data)
        
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

    if (slug) {
      fetchSchool()
    }
  }, [slug])

  const sections = [
    { id: 'about', title: 'About' },
    { id: 'description', title: 'Description' },
    { id: 'details', title: 'Details' },
    { id: 'instructors', title: 'Instructors' },
    { id: 'info', title: 'Info' },
    { id: 'gallery', title: 'Gallery' }
  ]

  // Memoize previous schools to avoid re-renders
  const previousSchools = useMemo(() => {
    if (!schools || schoolsLoading || !transformedSchool) return []
    
    // Sort by year descending and exclude current school
    return schools
      .filter(s => s.slug !== transformedSchool.slug)
      .sort((a, b) => b.schoolYear - a.schoolYear)
      .map(school => ({
        schoolName: school.schoolName,
        slug: school.slug,
        year: school.schoolYear
      }))
  }, [schools, schoolsLoading, transformedSchool])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_color mx-auto mb-4"></div>
          <p className="text-lg text-primary_color">Loading school data...</p>
        </div>
      </div>
    )
  }

  if (error || !school || !transformedSchool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-2">Error loading school</p>
          <p className="text-gray-600">{error || 'School not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-primary_color mb-[2em] w-full flex   px-8 lg:px-0 relative">
      <div className=" mx-auto w-full">
        <div className="flex gap-8">
          {/* Left Sidebar - Section Navigation */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <SectionNavigation sections={sections} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* School Header */}
            <div className=" mb-8">
              <h1 className="!text-[3em] md:!text-[5em] mb-4">{transformedSchool.schoolName}</h1>
              <div className="flex items-center justify-between gap-4 flex-wrap">
             
             
                <span className=" ">Year:  {transformedSchool.year}</span>
                  <p className="text-lg capitalize">Status: {transformedSchool.status}</p>
                <span className="flex items-center gap-1"><FiMapPin /> {transformedSchool.location}</span>
              </div>




              <h3 className="text-xl italic ">Theme:{transformedSchool.theme}</h3>
            
            </div>

            {/* Cover Image - Fixed to use Next.js Image */}
            {transformedSchool.coverImage && (
              <div className="mb-8 relative h-96  overflow-hidden">
                <Image
                  src={transformedSchool.coverImage}
                  alt={transformedSchool.schoolName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* School Details */}
            <div className=" space-y-6">
            {transformedSchool?.excerpt && (
  <div id="about">
    <h2 className="text-3xl mb-4">Excerpt</h2>
    <p className="!text-[1.5em] leading-none">
      {transformedSchool.excerpt}
    </p>
  </div>
)}







              {/* {transformedSchool.description && (
                <div id="description">
                  <h2 className="text-3xl font-bold mb-4">Description</h2>
                  <p className="text-lg leading-relaxed">{transformedSchool.description}</p>
                </div>
              )} */}

              {school.schoolDetails?.raw && (
                <div id="details">
                  {/* <h2 className="text-3xl  mb-4">Details</h2> */}
                  <div className="prose prose-invert max-w-none ">
                    <RichText 
                      content={school.schoolDetails.raw}
                      renderers={{
                        p: ({ children }) => <p className="text-lg leading-relaxed mb-4 break-inside-avoid-orphans">{children}</p>,
                        bold: ({ children }) => <strong className="font-bold text-primary_color">{children}</strong>,
                        italic: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 break-inside-avoid">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 break-inside-avoid">{children}</ol>,
                        li: ({ children }) => <li className="text-lg leading-relaxed">{children}</li>,
                    
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-secondary_color pl-4 italic mb-4 break-inside-avoid 0 p-4 rounded-r">{children}</blockquote>,
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-8  break-inside-avoid">
                            <table className="min-w-full divide-y divide-gray-200">
                              {children}
                            </table>
                          </div>
                        ),
                        table_head: ({ children }) => <thead className="">{children}</thead>,
                        table_body: ({ children }) => <tbody className=" divide-y divide-gray-200">{children}</tbody>,
                        table_row: ({ children }) => <tr className=" transition-colors">{children}</tr>,
                        table_cell: ({ children }) => <td className="px-6 py-4 text-sm text-gray-600">{children}</td>,
                        table_header_cell: ({ children }) => <th className="px-6 py-3 text-left text-xs font-bold text-primary_color uppercase tracking-wider">{children}</th>,
                        img: (props) => {
                          console.log('Image renderer props:', props);
                          const { src, altText, title, height, width } = props;
                          if (!src) return null;
                          return (
                           <div className="my-8 w-full overflow-hidden max-h-[400px] break-inside-avoid">
                             <Image 
                               src={src} 
                               alt={altText || title || 'Content image'} 
                               width={width || 1000}
                               height={height || 600}
                               className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                             />
                           </div>
                          );
                        },
                        a: ({ children, href, openInNewTab }) => (
                          <a 
                            href={href} 
                            target={openInNewTab ? '_blank' : '_self'}
                            rel={openInNewTab ? 'noopener noreferrer' : ''}
                            className="text-secondary_color font-bold hover:text-primary_color hover:underline transition-colors decoration-2 underline-offset-2"
                          >
                            {children}
                          </a>
                        ),
                        iframe: (props) => {
                          // Handle iframe nodes directly from GraphCMS rich text
                          const node = props?.node || props
                          if (!node) {
                            console.warn('Iframe renderer: node is undefined', props)
                            return null
                          }
                          
                          const url = node.url || node.src || ''
                          if (!url) {
                            console.warn('Iframe renderer: no URL found', node)
                            return null
                          }
                          
                          console.log('Rendering iframe with URL:', url, 'Node:', node)
                          
                          // Handle YouTube URLs - convert to embed format if needed
                          let embedUrl = url
                          if (url.includes('youtube.com/watch')) {
                            const videoId = url.match(/[?&]v=([^&]+)/)?.[1]
                            if (videoId) {
                              embedUrl = `https://www.youtube.com/embed/${videoId}`
                            }
                          } else if (url.includes('youtu.be/')) {
                            const videoId = url.match(/youtu.be\/([^?]+)/)?.[1]
                            if (videoId) {
                              embedUrl = `https://www.youtube.com/embed/${videoId}`
                            }
                          }
                          
                          console.log('Converted embed URL:', embedUrl)
                          
                          return (
                            <div className="my-8 w-full break-inside-avoid" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                              <iframe
                                src={embedUrl}
                                className="absolute top-0 left-0 w-full h-full  shadow-lg"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded content"
                              />
                            </div>
                          )
                        },
                        embed: ({ node }) => {
                          // GraphCMS embed nodes can have different structures
                          const url = node.url || node.src || (node.nodeType === 'Asset' && node.url) || ''
                          if (!url) return null
                          
                          // Handle YouTube URLs - convert to embed format if needed
                          let embedUrl = url
                          if (url.includes('youtube.com/watch')) {
                            const videoId = url.match(/[?&]v=([^&]+)/)?.[1]
                            if (videoId) {
                              embedUrl = `https://www.youtube.com/embed/${videoId}`
                            }
                          } else if (url.includes('youtu.be/')) {
                            const videoId = url.match(/youtu.be\/([^?]+)/)?.[1]
                            if (videoId) {
                              embedUrl = `https://www.youtube.com/embed/${videoId}`
                            }
                          }
                          
                          return (
                            <div className="my-8 w-full break-inside-avoid" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                              <iframe
                                src={embedUrl}
                                className="absolute top-0 left-0 w-full h-full  shadow-lg"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded content"
                              />
                            </div>
                          )
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Instructors */}
              {transformedSchool.instructors.length > 0 && (
                <div id="instructors">
                  <h2 className="text-3xl font-bold mb-4">Instructors</h2>
                  <div className="flex flex-wrap gap-2">
                    {transformedSchool.instructors.map((instructor, index) => (
                      <span
                        key={index}
                        className="bg-primary_color text-white  px-4 py-2 rounded-full"
                      >
                        {instructor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* School Info */}
              {/* <div id="info" className="grid text-primary_color grid-cols-1 md:grid-cols-2 gap-6">
                <div className=" bg-opacity-10 border-2 border-primary_color p-6 ">
                  <h3 className="text-xl font-semibold mb-2">Country</h3>
                  <p className="text-lg capitalize">{transformedSchool.country}</p>
                </div>
                <div className=" bg-opacity-10 border-2 border-primary_color p-6 ">
                  <h3 className="text-xl font-semibold mb-2">Status</h3>
                  <p className="text-lg capitalize">{transformedSchool.status}</p>
                </div>


              </div> */}


            </div>

            {/* Gallery Section */}
            <div id="gallery" className="mt-16">
              <GallerySection schoolSlug={transformedSchool.slug} />
            </div>
          </div>

          {/* Right Sidebar - Previous Schools */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <h3 className="text-xl   mb-4">Previous Schools</h3>
              <div className="space-y-2 ">
                {schoolsLoading ? (
                  <div className="">Loading...</div>
                ) : previousSchools.length > 0 ? (
                  previousSchools.map((prevSchool) => (
                    <Link
                      key={prevSchool.slug}
                      href={`/schools/${prevSchool.slug}`}
                      className="block border-b-2 border-b-primary_color py-2    hover:bg-opacity-20 transition-all duration-200 group"
                    >
                      <div className=" group-hover:text-secondary_color transition-colors">
                        <div className="font-semibold text-sm">{prevSchool.schoolName}</div>
                        <div className="text-xs ">{prevSchool.year}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className=" text-sm">No previous schools found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>
  )
}

export default SchoolDetailClient
