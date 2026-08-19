import localFont from "next/font/local";
import {Poppins}  from "next/font/google"
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import NextTopLoader from 'nextjs-toploader';
import Loading from "./components/Loading"
import {ReactLenis}  from  "./utils/Lenis"
import { SchoolProvider } from "@/contexts/SchoolContext"
// import { StateContext } from "./Context/StateContext";





const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});



export const metadata = {
  title: "COESSING — Coastal Ocean Environment Summer School in Nigeria and Ghana",
  description:
    "COESSING is an international collaboration building capacity in ocean and environmental sciences in West Africa. One-week summer schools held annually since 2015 in Ghana and Nigeria, endorsed by the UN Decade of Ocean Science.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body className={`font- ${poppins.className}`} >
        <Loading>
      {/* <StateContext>  */}
      <SchoolProvider>
        <NextTopLoader 
        />
              <Nav/> 
              <ReactLenis root>
              {children}
              </ReactLenis>
              <Footer/>
      </SchoolProvider>
        {/* </StateContext> */}
        </Loading>
        
      </body>
    </html>
  );
}
