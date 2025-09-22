"use client"
import React, { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSchoolContext } from '@/contexts/SchoolContext'
import GallerySection from '@/app/components/GallerySection'
import SectionNavigation from '@/app/components/SectionNavigation'
import { RichText } from '@graphcms/rich-text-react-renderer'

const SchoolDetailClient = ({ school, transformedSchool, sections }) => {
  const { schools, loading: schoolsLoading } = useSchoolContext()

  // Memoize previous schools to avoid re-renders
  const previousSchools = useMemo(() => {
    if (!schools || schoolsLoading) return []
    
    // Sort by year descending and exclude current school
    return schools
      .filter(s => s.slug !== transformedSchool.slug)
      .sort((a, b) => b.schoolYear - a.schoolYear)
      .map(school => ({
        schoolName: school.schoolName,
        slug: school.slug,
        year: school.schoolYear
      }))
  }, [schools, schoolsLoading, transformedSchool.slug])

  return (
    <div className="min-h-screen bg-primary_color py-16 px-8 relative">
      <div className=" mx-auto">
        <div className="flex gap-8">
          {/* Left Sidebar - Previous Schools */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Previous Schools</h3>
              <div className="space-y-2 ">
                {schoolsLoading ? (
                  <div className="text-white">Loading...</div>
                ) : previousSchools.length > 0 ? (
                  previousSchools.map((prevSchool) => (
                    <Link
                      key={prevSchool.slug}
                      href={`/schools/${prevSchool.slug}`}
                      className="block p-3 bg-secondary_color/30  shadow-lg rounded-lg hover:bg-opacity-20 transition-all duration-200 group"
                    >
                      <div className="text-white group-hover:text-secondary_color transition-colors">
                        <div className="font-semibold text-sm">{prevSchool.schoolName}</div>
                        <div className="text-xs text-gray-300">{prevSchool.year}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-white text-sm">No previous schools found</div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* School Header */}
            <div className="text-white mb-8">
              <h1 className="text-6xl font-bold mb-4">{transformedSchool.schoolName}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-semibold">{transformedSchool.year}</span>
                <span className="text-lg">📍 {transformedSchool.location}</span>
              </div>
              <p className="text-xl text-gray-300 mb-6">{transformedSchool.theme}</p>
            </div>

            {/* Cover Image - Fixed to use Next.js Image */}
            {transformedSchool.coverImage && (
              <div className="mb-8 relative h-96 rounded-lg overflow-hidden">
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
            <div className="text-white space-y-6">
              <div id="about">
                <h2 className="text-3xl font-bold mb-4">About This School</h2>
                <p className="text-lg leading-relaxed">{transformedSchool.excerpt}</p>
              </div>

              {transformedSchool.description && (
                <div id="description">
                  <h2 className="text-3xl font-bold mb-4">Description</h2>
                  <p className="text-lg leading-relaxed">{transformedSchool.description}</p>
                </div>
              )}

              {school.schoolDetails?.raw && (
                <div id="details">
                  <h2 className="text-3xl font-bold mb-4">Details</h2>
                  <div className="prose prose-invert max-w-none text-white">
                    <RichText 
                      content={school.schoolDetails.raw}
                      renderers={{
                        p: ({ children }) => <p className="text-lg leading-relaxed mb-4">{children}</p>,
                        bold: ({ children }) => <strong className="font-bold">{children}</strong>,
                        italic: ({ children }) => <em className="italic">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                        li: ({ children }) => <li className="text-lg leading-relaxed">{children}</li>,
                        h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-secondary_color pl-4 italic mb-4">{children}</blockquote>,
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
                        className="bg-secondary_color text-white px-4 py-2 rounded-full"
                      >
                        {instructor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* School Info */}
              <div id="info" className="grid text-primary_color grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Country</h3>
                  <p className="text-lg capitalize">{transformedSchool.country}</p>
                </div>
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Status</h3>
                  <p className="text-lg capitalize">{transformedSchool.status}</p>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div id="gallery" className="mt-16">
              <GallerySection schoolSlug={transformedSchool.slug} />
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <SectionNavigation sections={sections} />
    </div>
  )
}

export default SchoolDetailClient
