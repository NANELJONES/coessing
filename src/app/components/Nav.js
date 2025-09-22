"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { useSchoolContext } from '@/contexts/SchoolContext';

const Nav = () => {
  const [show_nav, set_show_nav] = useState(false);
  const [show_schools_dropdown, set_show_schools_dropdown] = useState(false);
  const { schools, loading: schoolsLoading } = useSchoolContext();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        set_show_schools_dropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const nav_options = [
    { nav_name: "Home", nav_link: "/" },
    { nav_name: "Community Voice", nav_link: "/" },
    { nav_name: "Register & Apply", nav_link: "https://docs.google.com/forms/d/e/1FAIpQLScabZ-nLb_5q-VL_h4ZePASn3PToqe3W8ZYdw2ovFgMsLhcJg/closedform" },
    { nav_name: "Resources", nav_link: "/" },
    { nav_name: "About Us", nav_link: "/aboutUs" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-primary_color to-transparent backdrop-blur-md shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo - Left side */}
          <div className="flex-shrink-0">
            <div className="bg-white p-2 rounded-full">
              <img
                src="/Logo.webp"
                alt="Company Logo"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {nav_options.map((item) => (
                <Link
                  key={item.nav_name}
                  href={item.nav_link}
                  className="text-white hover:text-secondary_color px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.nav_name}
                </Link>
              ))}
              
              {/* Our Schools Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <span
                  onClick={() => set_show_schools_dropdown(!show_schools_dropdown)}
                  className="text-white hover:text-secondary_color px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  Our Schools
                  <HiChevronDown className={`w-4 h-4 transition-transform duration-200 ${show_schools_dropdown ? 'rotate-180' : ''}`} />
                </span>
                
                {show_schools_dropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {schoolsLoading ? (
                      <div className="px-4 py-2 text-gray-600 text-sm">Loading schools...</div>
                    ) : schools.length > 0 ? (
                      schools
                        .sort((a, b) => b.schoolYear - a.schoolYear)
                        .map((school) => (
                          <Link
                            key={school.slug}
                            href={`/schools/${school.slug}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary_color transition-colors duration-200"
                            onClick={() => set_show_schools_dropdown(false)}
                          >
                            <div className="font-medium">{school.schoolName}</div>
                            <div className="text-xs text-gray-500">{school.schoolYear}</div>
                          </Link>
                        ))
                    ) : (
                      <div className="px-4 py-2 text-gray-600 text-sm">No schools available</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Contact Us Button */}
          <div className="hidden md:block">
            <button className=" text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-80 transition-colors duration-200">
              Contact Us
            </button>
          </div>

          {/* Mobile menu button - Right side */}
          <div className="md:hidden">
            <button
              onClick={() => set_show_nav(!show_nav)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-secondary_color focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary_color transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {show_nav ? (
                <HiX className="block h-6 w-6" />
              ) : (
                <HiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {show_nav && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 shadow-lg">
            {nav_options.map((item) => (
              <Link
                key={item.nav_name}
                href={item.nav_link}
                className="text-gray-700 hover:text-primary_color block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => set_show_nav(false)}
              >
                {item.nav_name}
              </Link>
            ))}
            
            {/* Our Schools Mobile Dropdown */}
            <div className="px-3 py-2">
              <div className="text-gray-700 text-base font-medium mb-2">Our Schools</div>
              <div className="ml-4 space-y-1">
                {schoolsLoading ? (
                  <div className="text-gray-500 text-sm">Loading schools...</div>
                ) : schools.length > 0 ? (
                  schools
                    .sort((a, b) => b.schoolYear - a.schoolYear)
                    .map((school) => (
                      <Link
                        key={school.slug}
                        href={`/schools/${school.slug}`}
                        className="block text-gray-600 hover:text-primary_color text-sm py-1 transition-colors duration-200"
                        onClick={() => set_show_nav(false)}
                      >
                        <div className="font-medium">{school.schoolName}</div>
                        <div className="text-xs text-gray-500">{school.schoolYear}</div>
                      </Link>
                    ))
                ) : (
                  <div className="text-gray-500 text-sm">No schools available</div>
                )}
              </div>
            </div>
            
            {/* Contact Us button inside mobile menu */}
            <div className="pt-2">
              <button className="w-full bg-primary_color text-white px-4 py-2 rounded-full text-base font-medium hover:bg-opacity-80 transition-colors duration-200">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
