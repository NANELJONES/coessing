"use client"
import React, { useState } from 'react'
import Link from 'next/link'

const resourcesData = [
  {
    category: "Course Resources",
    items: [
      { title: "Weather in a Tank", urls: [{ label: "Link", href: "http://paoc.mit.edu/labguide/introduction.html" }] },
      { title: "Ocean Lab Demos", urls: [{ label: "Link", href: "http://www.atmos.washington.edu/gfd_exp/exp_e/index.htm" }] },
      { title: "Regional Oceanography", urls: [{ label: "Link", href: "http://www.es.flinders.edu.au/~mattom/regoc/pdfversion.html" }] },
      { title: "MIT OpenCourse, Earth, Atmospheric, and Planetary Sciences", urls: [{ label: "Link", href: "http://ocw.mit.edu/courses/earth-atmospheric-and-planetary-sciences/" }] },
      { title: "Brief, descriptive (no math) introduction to the oceanic general circulation, with accompanying animations", description: "Available in course materials." }
    ]
  },
  {
    category: "Python and Jupyter Notebook Resources",
    items: [
      { title: "Link to all Jupyter notebooks from COESSING 2022", description: "Check 2022 Archive" },
      { title: "Videos of recorded virtual Python tutorials (via youtube playlist) from COESSING 2022", description: "Check YouTube Channel" },
      { title: "Link to all Jupyter notebooks from COESSING 2021", description: "Check 2021 Archive" },
      { title: "Paige’s guide to install Anaconda (which includes Python and Jupyter Notebook) on Windows", urls: [{ label: "Install python on Windows (PDF)", href: "#" }] },
      { title: "Paige’s Jupyter Notebook tutorial: how to launch a Notebook and import/install Python libraries!", urls: [{ label: "JupyterNotebook tutorial by Paige! (PDF)", href: "#" }] },
      { title: "Python/jupyter notebook tutorial from Paige’s python lab, 2018 School", urls: [{ label: "Python lab COESSING 2018 (PDF)", href: "#" }] },
      { title: "More Python/Jupyter exercises can be found on the 2019 School page (under Days 1 and 2)", description: "Check 2019 Archive" }
    ]
  },
  {
    category: "Good websites with a lot of resources!",
    items: [
      { 
        title: "GREAT Python learning resource", 
        description: "You can read tutorials, watch instructional videos, and take quizzes to assess your knowledge.",
        urls: [{ label: "realpython.com", href: "https://realpython.com/start-here/" }] 
      },
      { 
        title: "Another good resource – you can do first chapter of all courses free. Has really nice cheat sheets!", 
        urls: [{ label: "datacamp.com", href: "https://www.datacamp.com" }] 
      },
      { title: "I put together some of the most useful cheat sheets here", urls: [{ label: "Python Cheat Sheets (PDF)", href: "#" }] },
      { 
        title: "Nice interactive introduction to python – you can run short python scripts in your browser as you go through the lesson!", 
        urls: [{ label: "learnpython.org", href: "https://www.learnpython.org/en/Welcome" }] 
      }
    ]
  },
  {
    category: "Text tutorials: Intro to JupyterNotebook and Python",
    items: [
      { title: "JupyterNotebook for Beginners: A Tutorial", urls: [{ label: "dataquest.io", href: "https://www.dataquest.io/blog/jupyter-notebook-tutorial/" }] },
      { title: "JupyterNotebook: An Introduction", urls: [{ label: "realpython.com", href: "https://realpython.com/jupyter-notebook-introduction/" }] },
      { title: "First Steps With Python", urls: [{ label: "realpython.com", href: "https://realpython.com/python-first-steps/" }] }
    ]
  },
  {
    category: "Videos: How to open/use JupyterNotebook (and Python)",
    items: [
      { title: "Video: Jupyter Notebook Tutorial: Introduction, Setup, and Walkthrough", urls: [{ label: "Watch on YouTube", href: "https://www.youtube.com/watch?v=HW29067qVWk" }] },
      { title: "Video: Python Jupyter Notebook | Simplilearn", urls: [{ label: "Watch on YouTube", href: "https://www.youtube.com/watch?v=3C9E2yPBw7s" }] },
      { title: "Video: Getting Started With Jupyter Notebook for Python", urls: [{ label: "Watch on YouTube", href: "https://www.youtube.com/watch?v=CwFq3YDU6_Y" }] },
      { title: "Video: Python plotting in JupyterNotebook", urls: [{ label: "Watch on YouTube", href: "https://www.youtube.com/watch?v=Hr4yh1_4GlQ" }] }
    ]
  },
  {
    category: "Online courses",
    description: "You can take Python courses (or any other course they offer!) for free (but you must pay to get a verified certificate of completion and to have your exercises graded)",
    items: [
      { title: "Coursera", urls: [{ label: "coursera.org", href: "https://www.coursera.org" }] },
      { title: "EdX", urls: [{ label: "edx.org", href: "https://www.edx.org" }] }
    ]
  },
  {
    category: "Data Resources",
    items: [
      { title: "National Data Buoy Center", urls: [{ label: "ndbc.noaa.gov", href: "http://www.ndbc.noaa.gov" }] },
      { 
        title: "Bathymetry Data", 
        urls: [
          { label: "Design a Grid", href: "http://www.ngdc.noaa.gov/mgg/gdas/gd_designagrid.html" },
          { label: "Marine Topography", href: "http://topex.ucsd.edu/marine_topo/mar_topo.html" },
          { label: "Arctic Bathymetry", href: "http://www.ngdc.noaa.gov/mgg/bathymetry/arctic/" }
        ] 
      },
      { title: "Sea Surface Temperature/Chlorophyll", urls: [{ label: "Ocean Color", href: "http://oceancolor.gsfc.nasa.gov/cgi/browse.pl?sen=am" }] },
      { title: "Argo Program", urls: [{ label: "argo.ucsd.edu", href: "http://www.argo.ucsd.edu" }] },
      { 
        title: "TAO Array, Pacific Ocean", 
        urls: [
          { label: "PMEL", href: "http://www.pmel.noaa.gov/tao/" },
          { label: "NCDC Indicators", href: "http://www.ncdc.noaa.gov/teleconnections/enso/indicators/sea-temp.php" }
        ] 
      },
      { title: "PIRATA Array, Atlantic Ocean", urls: [{ label: "pmel.noaa.gov", href: "http://www.pmel.noaa.gov/pirata/" }] },
      { title: "RAMA Array, Indian Ocean", urls: [{ label: "pmel.noaa.gov", href: "http://www.pmel.noaa.gov/tao/rama/" }] },
      { title: "Tides and Currents", urls: [{ label: "tidesandcurrents.noaa.gov", href: "http://tidesandcurrents.noaa.gov" }] },
      { title: "Oregon Surface Currents", urls: [{ label: "bragg.oce.orst.edu", href: "http://bragg.oce.orst.edu/" }] },
      { title: "Ice-Tethered Profilers", urls: [{ label: "whoi.edu", href: "http://www.whoi.edu/itp/" }] },
      { title: "Hawaii Ocean Time-series (HOT)", urls: [{ label: "Home", href: "http://hahana.soest.hawaii.edu/hot/" }, { label: "Data Extraction", href: "http://hahana.soest.hawaii.edu/hot/hot-dogs/bextraction.html" }] },
      { title: "NOAA Coast Watch", urls: [{ label: "coastwatch.noaa.gov", href: "http://coastwatch.noaa.gov" }] },
      { title: "Scatterometer Winds", urls: [{ label: "remss.com", href: "http://www.remss.com/qscat/qscat_browse.html" }] },
      { 
        title: "U.S. GLOBal Ocean Ecosystem, GLOBEC", 
        urls: [
          { label: "usglobec.org", href: "http://www.usglobec.org" },
          { label: "ltop.coas.oregonstate.edu", href: "http://ltop.coas.oregonstate.edu" }
        ] 
      },
      { title: "Bermuda Atlantic Time-series Study (BATS)", urls: [{ label: "bats.bios.edu", href: "http://bats.bios.edu/data/" }] },
      { title: "Geotraces (have to make an account and log in to access the data)", urls: [{ label: "bodc.ac.uk", href: "https://www.bodc.ac.uk/geotraces/data/idp2017/" }] }
    ]
  },
  {
    category: "Model Products",
    items: [
      { title: "Global Ocean Data Assimilation Experiment", urls: [{ label: "godae.org", href: "http://www.godae.org" }] },
      { title: "NRL HYCOM", urls: [{ label: "hycom.org", href: "http://hycom.org" }] },
      { 
        title: "NWS – Environmental Modeling Center", 
        urls: [
          { label: "Polar", href: "http://polar.ncep.noaa.gov" },
          { label: "Waves", href: "http://polar.ncep.noaa.gov/waves/" }
        ] 
      },
      { 
        title: "ECCO project", 
        description: "The web site of the ECCO project is: https://ecco.jpl.nasa.gov. The latest ECCO ocean state estimate is described here: https://ecco.jpl.nasa.gov/products/latest/ and is freely available here: ftp://ecco.jpl.nasa.gov/Version4/Release3/.",
        urls: [
          { label: "Website", href: "https://ecco.jpl.nasa.gov" },
          { label: "Description", href: "https://ecco.jpl.nasa.gov/products/latest/" },
          { label: "Download", href: "ftp://ecco.jpl.nasa.gov/Version4/Release3/" }
        ] 
      }
    ]
  },
  {
    category: "Ocean Data Atlases",
    items: [
      { title: "JAVA Ocean Atlas", urls: [{ label: "joa.ucsd.edu", href: "http://joa.ucsd.edu/home" }] },
      { title: "IRI/LDEO Climate Data Library", urls: [{ label: "iridl.ldeo.columbia.edu", href: "http://iridl.ldeo.columbia.edu" }] },
      { title: "World Ocean Atlas", urls: [{ label: "nodc.noaa.gov", href: "http://www.nodc.noaa.gov/OC5/WOA09/pr_woa09.html" }] },
      { 
        title: "Wind Climatology", 
        urls: [
          { label: "SCOW", href: "http://cioss.coas.oregonstate.edu/scow/" },
          { label: "COGOW", href: "http://cioss.coas.oregonstate.edu/cogow/" }
        ] 
      },
      { title: "WOCE Data", urls: [{ label: "woce.nodc.noaa.gov", href: "http://woce.nodc.noaa.gov/wdiu/" }] },
      { title: "Ocean Data Viewer", urls: [{ label: "odv.awi.de", href: "http://odv.awi.de/en/home/" }] }
    ]
  },
  {
    category: "Ocean Observatories",
    items: [
      { title: "NERACOOS, Northeastern", urls: [{ label: "neracoos.org", href: "http://www.neracoos.org" }] },
      { title: "OrCOOS, Oregon", urls: [{ label: "agate.coas.oregonstate.edu", href: "http://agate.coas.oregonstate.edu" }] },
      { title: "GoMOOS, Gulf of Maine", urls: [{ label: "oceandata.gmri.org", href: "http://oceandata.gmri.org/data/recent.html" }] },
      { 
        title: "Ocean Observatories Initiative", 
        urls: [
          { label: "oceanobservatories.org", href: "http://www.oceanobservatories.org" },
          { label: "oceanleadership.org", href: "http://www.oceanleadership.org" }
        ] 
      },
      { title: "CMOP, Coastal Margin", urls: [{ label: "stccmop.org", href: "http://www.stccmop.org/datamart" }] },
      { title: "Martha’s Vineyard Observatory", urls: [{ label: "whoi.edu", href: "http://www.whoi.edu/mvco" }] }
    ]
  },
  {
    category: "Other Resources",
    items: [
      { title: "IPCC Report", urls: [{ label: "ipcc.ch", href: "http://www.ipcc.ch" }] },
      { 
        title: "NASA Educational Site", 
        urls: [
          { label: "Atmospheres", href: "http://atmospheres.gsfc.nasa.gov" },
          { label: "Earth Science", href: "http://nasascience.nasa.gov/earth-science/" },
          { label: "Oceanography", href: "http://nasascience.nasa.gov/earth-science/oceanography/" }
        ] 
      },
      { 
        title: "NOAA Educational Site", 
        urls: [
          { label: "Ocean", href: "http://www.noaa.gov/ocean.html" },
          { label: "Weather", href: "http://www.noaa.gov/wx.html" },
          { label: "Weather Service", href: "http://weather.noaa.gov" }
        ] 
      },
      { title: "WHOI Oceanus Magazine", urls: [{ label: "whoi.edu", href: "http://www.whoi.edu/oceanus/index.do" }] },
      { title: "TAMU Educational Site", urls: [{ label: "oceanworld.tamu.edu", href: "http://oceanworld.tamu.edu" }] },
      { title: "Thermodynamic Equation of Seawater", urls: [{ label: "teos-10.org", href: "http://www.teos-10.org" }] },
      { title: "Matlab Tools", urls: [{ label: "woodshole.er.usgs.gov", href: "http://woodshole.er.usgs.gov/operations/sea-mat/" }] },
      { title: "Standard Atmosphere Calculator", urls: [{ label: "digitaldutch.com", href: "http://www.digitaldutch.com/atmoscalc/" }] },
      { title: "US Naval Observatory", urls: [{ label: "usno.navy.mil", href: "http://www.usno.navy.mil/USNO" }] }
    ]
  }
]

const Page = () => {
  const [activeCategory, setActiveCategory] = useState(null)

  return (
    <div className="min-h-screen w-full px-2 md:px-6 lg:px-8 py-8 bg-gradient-to-b from-primary_color to-[#103F56]">
      <div className="w-full gap-6 lg:grid lg:grid-cols-4">
        {/* Sticky Header */}
        <div className="lg:sticky top-0 lg:h-screen flex flex-col border-r border-white/20 g:col-span-1 pb-6 lg:pb-0 pr-4">
          <div>
            <h1 className="text-white !text-[2.5em] md:!text-[4em] leading-none tracking-tighter">
              Resources
            </h1>
            {/* <p className="text-white/60 mt-4 text-sm max-w-xs leading-relaxed">
              A curated collection of tools, data repositories, and learning materials for oceanography and python programming.
            </p> */}
          </div>
          
          <div className="hidden lg:flex cursor-pointer flex-col gap-2 w-full mt-8 overflow-y-auto  pr-2 custom-scrollbar">
            {resourcesData.map((cat, idx) => (
              <p 
                key={idx}
                onClick={() => {
                  document.getElementById(`category-${idx}`)?.scrollIntoView({ behavior: 'smooth' })
                  setActiveCategory(idx)
                }}
                className={`text-left !text-[0.8em] !py-2 !px-3 rounded-lg transition-all duration-300 ${activeCategory === idx ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              >
                {cat.category}
              </p>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 flex flex-col gap-12 md:gap-[5em] pb-24">
          {resourcesData.map((section, idx) => (
            <div key={idx} id={`category-${idx}`} className="flex flex-col gap-6 scroll-mt-24">
              <h2 className="text-2xl md:text-3xl text-white font-light border-b border-white/10 pb-4">
                {section.category}
              </h2>
              {section.description && (
                <p className="text-white/70 text-sm md:text-base -mt-2 mb-2">{section.description}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx} 
                    className="group relative border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-lg p-5 transition-all duration-300 hover:-translate-y-1"
                  >
                    <h5 className="text-white cursor-pointer font-medium text-lg mb-2 group-hover:text-secondary_color transition-colors">
                      {item.title}
                    </h5>
                    
                    {item.description && (
                      <p className="text-white/60 text-[0.8em] mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.urls && item.urls.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-auto pt-2">
                        {item.urls.map((url, urlIdx) => (
                          <Link 
                            key={urlIdx} 
                            href={url.href}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-3 py-1.5 rounded-full transition-all"
                          >
                            {url.label}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page
