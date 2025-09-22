import { getSchoolBySlug, transformSchoolData } from '@/lib/schools'
import { notFound } from 'next/navigation'
import GallerySection from '@/app/components/GallerySection'
import SectionNavigation from '@/app/components/SectionNavigation'
import { RichText } from '@graphcms/rich-text-react-renderer'
import SchoolDetailClient from './SchoolDetailClient'

export async function generateStaticParams() {
  // You can pre-generate static params for known slugs
  // For now, we'll use dynamic rendering
  return []
}

export default async function SchoolDetail({ params }) {
  const school = await getSchoolBySlug(params.slug)
  
  if (!school) {
    notFound()
  }

  const transformedSchool = transformSchoolData(school)

  const sections = [
    { id: 'about', title: 'About' },
    { id: 'description', title: 'Description' },
    { id: 'details', title: 'Details' },
    { id: 'instructors', title: 'Instructors' },
    { id: 'info', title: 'Info' },
    { id: 'gallery', title: 'Gallery' }
  ]

  return (
    <SchoolDetailClient 
      school={school}
      transformedSchool={transformedSchool}
      sections={sections}
    />
  )
}