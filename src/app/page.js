import  Header from "./components/Header"
import MissionAndVision from "./components/MissionAndVision"
import PrevSchoolsGrid from "./components/PrevSchoolsGrid"
import OcenVibes from "./components/OcenVibes"
import AboutUs from "./components/AboutUs"
import WhyAttend from "./components/WhyAttend"
import ReachOut from "./components/ReachOut"
import AppreciatedPartner from "./components/AppreciatedPartner"
import SchoolPartners from "./components/SchoolPartners"
import Partners from "./components/Partners"
import AffiliatedActions from "./components/AffiliatedActions"
import FeaturedMentions from "./components/FeaturedMentions"
import ContactForm from "./components/ContactForm"
import OceanWaves from "./components/OceanWaves"
import Layout from "./components/Layout"

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-primary_color to-[#103F56] min-h-screen relative flex flex-col gap-[3em]">
      <OceanWaves />
      <div className="relative z-10 mt-[5em] pb-[5em] z-20">
       <Layout>
      <Header/>
      <AboutUs/>
      <MissionAndVision/>
      <PrevSchoolsGrid/>
      <OcenVibes/>
      <WhyAttend/>
      <AppreciatedPartner/>
      <SchoolPartners/>
      <Partners/>
      <AffiliatedActions/>
      <FeaturedMentions/>
      <ContactForm siteName="COESSING" siteLink="https://coessing.org" imageLink="/gallery/9.jpg" />
      {/* <ReachOut/> */}
      </Layout>
      
      </div>
    </div>
  );
}
