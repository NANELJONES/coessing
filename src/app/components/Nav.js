"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSchoolContext } from '@/contexts/SchoolContext';
import { HiChevronDown } from "react-icons/hi";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [schoolsExpanded, setSchoolsExpanded] = useState(false);
  const { schools, loading: schoolsLoading, hasMore, loadingMore, loadMoreSchools } = useSchoolContext();

  const nav_options = [
    { nav_name: "Home", nav_link: "/" },
    { nav_name: "Community Voice", nav_link: "/community-voice" },
    { nav_name: "Resources", nav_link: "/resources" },
    { nav_name: "Testimonials", nav_link: "/testimonials" },
    { nav_name: "About Us", nav_link: "/aboutUs" },
  ];

  const toggleMenu = useCallback(() => {
    setOpen(prev => !prev);
  }, []);



  return (
    <div 
      className={`fixed top-0 left-0 w-full z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      data-open={open || undefined}
    >
      {/* Header */}
      <header className={`relative ${open ? 'z-[60]' : 'z-50'} flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8 bg-transparent pointer-events-auto`}>
          <div className="flex-shrink-0">
            {/* <Link href="/" className="block bg-white p-2">
              <img
                src="/Logo.webp"
                alt="Company Logo"
                className="w-20"
              />
            </Link> */}
          </div>

        {/* Menu Toggle div */}
        <motion.div
          className="relative flex items-center justify-center px-4 py-2 rounded-sm border-2 border-white cursor-pointer bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
          onClick={toggleMenu}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >

          
          {/* Menu State - Horizontal Layout */}
          <AnimatePresence mode="wait">
            {!open && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2"
              >
                <span className="text-xs font-medium uppercase text-white">Menu</span>
                <motion.span
                  className="flex items-center justify-center w-4 h-4"
                  style={{ originX: 0.5, originY: 0.5 }}
                >
                  <span className="absolute w-3 h-0.5 bg-white"></span>
                  <span className="absolute w-3 h-0.5 bg-white rotate-90"></span>
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close State - Horizontal Layout */}
          <AnimatePresence mode="wait">
            
            {open && (
              <motion.div
                key="close"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2"
              >
                <span className="text-xs font-medium uppercase text-primary_color">Close</span>
                <motion.span
                  className="flex items-center justify-center w-4 h-4"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 45 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ originX: 0.5, originY: 0.5 }}
                >
                  <span className="absolute w-3 h-0.5 bg-primary_color"></span>
                  <span className="absolute w-3 h-0.5 bg-primary_color rotate-90"></span>
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>

      {/* Main Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className="fixed top-0 right-0 w-full sm:w-[400px] lg:w-[500px] h-screen bg-white z-[55] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
            aria-hidden={!open}
          >

                 <div className="flex-shrink-0">
            <Link href="/" className="block bg-white p-2">
              <img
                src="/Logo.webp"
                alt="Company Logo"
                className="w-full max-w-[200px]"
              />
            </Link>
          </div>
            <div className="h-full overflow-y-auto px-8 pt-10 pb-12 pointer-events-auto" style={{ overscrollBehavior: 'contain' }} data-lenis-prevent>
             
             
              {/* Navigation Items */}
              <ul className="space-y-4 mb-12">
              
                {nav_options.map((item, index) => {
                  const navIndex = index + 1;
                  
                  // Insert "Our Schools" after "Community Voice" (index 1) to match previous logic roughly or just keep order
                  // The previous code had a specific insertion logic. Let's simplify or keep it.
                  // Previous logic: insert at index 3 (after Register & Apply).
                  // Current list: Home, Community Voice, Resources, Testimonials, About Us.
                  // Let's insert "Our Schools" after "Community Voice" (index 1) to make it prominent? 
                  // Or stick to the list order. The user removed "Register & Apply".
                  // Let's place "Our Schools" after "Community Voice" as item 3.
                  
                  if (navIndex === 3) {
                     // This is where we inject Our Schools
                     return (
                      <React.Fragment key={`fragment-${index}`}>
                         {/* Our Schools - Expandable Nav Item */}
                         <motion.li
                          key="our-schools"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          transition={{ 
                            duration: 0.5,
                            delay: 0.1 + (index * 0.05),
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className="overflow-hidden"
                        >
                          <div
                            onMouseEnter={() => setSchoolsExpanded(true)}
                            onMouseLeave={() => setSchoolsExpanded(false)}
                            className="group w-full text-left"
                          >
                            <div className="flex items-center justify-between w-full text-4xl md:text-5xl text-primary_color hover:text-secondary_color transition-colors duration-200">
                              <Link 
                                href="/schools"
                                className="block flex-grow"
                                onClick={() => setOpen(false)}
                              >
                                <span className="block">
                                  {String(navIndex).padStart(2, '0')}. Our Schools
                                </span>
                              </Link>
                              <motion.span
                                animate={{ rotate: schoolsExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-4 flex-shrink-0 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSchoolsExpanded(!schoolsExpanded);
                                }}
                              >
                                <HiChevronDown className="w-8 h-8 text-primary_color group-hover:text-secondary_color transition-colors duration-200" />
                              </motion.span>
                            </div>
                          
                          {/* Expandable Schools List */}
                          <AnimatePresence>
                            {schoolsExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden mt-4 ml-8 text-primary_color"
                              >
                                <div className="space-y-3 pt-2">
                                  {schoolsLoading ? (
                                    <div className="text-gray-500 text-sm">Loading schools...</div>
                                  ) : schools.length > 0 ? (
                                    <>
                                      {schools
                                        .sort((a, b) => b.schoolYear - a.schoolYear)
                                        .map((school) => (
                                          <motion.div
                                            key={school.slug}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                          >
                                            <Link
                                              href={`/schools/${school.slug}`}
                                              className="block px-2 border-b-2 border-b-primary_color transition-colors duration-200 hover:text-secondary_color"
                                              onClick={() => setOpen(false)}
                                            >
                                              <div className="font-semibold ">{school.schoolName}</div>
                                              <div className="text-sm mt-1">{school.schoolYear}</div>
                                            </Link>
                                          </motion.div>
                                        ))}
                                      {hasMore && (
                                        <motion.button
                                          onClick={loadMoreSchools}
                                          disabled={loadingMore}
                                          className="mt-4 px-4 py-2 bg-primary_color text-white rounded-md hover:bg-secondary_color transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          {loadingMore ? 'Loading...' : 'Load More Schools'}
                                        </motion.button>
                                      )}
                                    </>
                                  ) : (
                                    <div className="text-gray-500 text-sm">No schools available</div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          </div>
                        </motion.li>

                        {/* The actual item for this index (Resources) */}
                        <motion.li
                          key={item.nav_name}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          transition={{ 
                            duration: 0.5,
                            delay: 0.1 + ((index + 1) * 0.05),
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className="overflow-hidden text-primary_color hover:text-secondary_color "
                        >
                          <Link
                            href={item.nav_link}
                            className="block text-4xl md:text-5xl  text-primary_color hover:text-secondary_color transition-colors duration-200"
                            onClick={() => setOpen(false)}
                          >
                            <span className="block">
                              {String(navIndex + 1).padStart(2, '0')}. {item.nav_name}
                            </span>
                          </Link>
                        </motion.li>
                      </React.Fragment>
                     )
                  }

                  // Standard items
                  const displayIndex = index < 2 ? navIndex : navIndex + 1;
                  return (
                    <motion.li
                      key={item.nav_name}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ 
                        duration: 0.5,
                        delay: 0.1 + (index * 0.05),
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="overflow-hidden text-primary_color hover:text-secondary_color "
                    >
                      <Link
                        href={item.nav_link}
                        className="block text-4xl md:text-5xl  text-primary_color hover:text-secondary_color transition-colors duration-200"
                        onClick={() => setOpen(false)}
                      >
                        <span className="block">
                          {String(displayIndex).padStart(2, '0')}. {item.nav_name}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Contact Us div */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 25 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.4,
                  ease: [0.65, 0, 0.35, 1]
                }}
                className="w-full bg-primary_color text-white px-6 py-4 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors duration-200 text-center cursor-pointer"
              >
                Contact Us
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Nav;
