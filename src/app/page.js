import  Header from "./components/Header"
import MissionAndVision from "./components/MissionAndVision"
import PrevSchools from "./components/PrevSchools"
import OcenVibes from "./components/OcenVibes"
import AboutUs from "./components/AboutUs"
import WhyAttend from "./components/WhyAttend"
import ReachOut from "./components/ReachOut"
import Partners from "./components/Partners"
import OceanWaves from "./components/OceanWaves"
import Layout from "./components/Layout"

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-primary_color to-[#103F56] min-h-screen relative flex flex-col gap-[3em]">
      <OceanWaves />
      <div className="relative z-10">
       <Layout>
      <Header/>
      <AboutUs/>
      <MissionAndVision/>
      <PrevSchools/>
      <OcenVibes/>
      <WhyAttend/>
      <ReachOut/>
      </Layout>
      
      </div>
    </div>
  );
}
