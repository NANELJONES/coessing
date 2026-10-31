"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSchoolContext } from "@/contexts/SchoolContext";
import { HiChevronDown } from "react-icons/hi";

const nav_options = [
  { nav_name: "Home", nav_link: "/" },
  { nav_name: "About Us", nav_link: "/aboutUs" },
  { nav_name: "Our Schools", nav_link: "/schools", isSchools: true },
  { nav_name: "Community Voice", nav_link: "/community-voice" },
  { nav_name: "Testimonials", nav_link: "/testimonials" },
];

const Nav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [schoolsExpanded, setSchoolsExpanded] = useState(false);
  const [desktopSchoolsOpen, setDesktopSchoolsOpen] = useState(false);
  const { schools, loading: schoolsLoading, hasMore, loadingMore, loadMoreSchools } =
    useSchoolContext();

  const toggleMenu = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDesktopSchoolsOpen(false);
    setSchoolsExpanded(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (link) => {
    if (link === "/") return pathname === "/";
    return pathname === link || pathname?.startsWith(`${link}/`);
  };

  const sortedSchools = [...(schools || [])].sort(
    (a, b) => (b.schoolYear || 0) - (a.schoolYear || 0)
  );

  return (
    <>
      {/* Desktop / tablet regular nav */}
      <div className="hidden md:block h-16" aria-hidden="true" />
      <header className="hidden md:block fixed top-0 left-0 w-full z-50 pointer-events-auto">
        <div className="w-full bg-white/95 backdrop-blur-md border-b border-primary_color/10">
          <div className="w-full px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
            <Link href="/" className="flex-shrink-0">
              <img
                src="/Logo.webp"
                alt="COESSING"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <nav className="flex items-center gap-1 lg:gap-2">
              {nav_options.map((item) => {
                if (item.isSchools) {
                  return (
                    <div
                      key={item.nav_name}
                      className="relative"
                      onMouseEnter={() => setDesktopSchoolsOpen(true)}
                      onMouseLeave={() => setDesktopSchoolsOpen(false)}
                    >
                      <Link
                        href={item.nav_link}
                        className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                          isActive("/schools")
                            ? "text-secondary_color"
                            : "text-primary_color hover:text-secondary_color"
                        }`}
                      >
                        {item.nav_name}
                        <HiChevronDown
                          className={`w-4 h-4 transition-transform ${
                            desktopSchoolsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Link>

                      <AnimatePresence>
                        {desktopSchoolsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.18 }}
                            className="absolute left-0 top-full pt-2"
                          >
                            <div className="w-72 max-h-[70vh] overflow-y-auto bg-white border border-primary_color/10 shadow-xl p-3">
                              <Link
                                href="/schools"
                                className="block px-3 py-2 text-sm font-semibold text-primary_color hover:bg-primary_color/5 mb-1"
                              >
                                View all schools
                              </Link>
                              {schoolsLoading ? (
                                <p className="px-3 py-2 text-sm text-primary_color/50">
                                  Loading schools...
                                </p>
                              ) : sortedSchools.length > 0 ? (
                                <>
                                  {sortedSchools.map((school) => (
                                    <Link
                                      key={school.slug}
                                      href={`/schools/${school.slug}`}
                                      className="block px-3 py-2 hover:bg-primary_color/5 transition-colors"
                                    >
                                      <div className="text-sm font-medium text-primary_color">
                                        {school.schoolName}
                                      </div>
                                      <div className="text-xs text-primary_color/50">
                                        {school.schoolYear}
                                      </div>
                                    </Link>
                                  ))}
                                  {hasMore && (
                                    <button
                                      type="button"
                                      onClick={loadMoreSchools}
                                      disabled={loadingMore}
                                      className="mt-2 w-full px-3 py-2 text-sm bg-primary_color text-white hover:opacity-90 disabled:opacity-50"
                                    >
                                      {loadingMore ? "Loading..." : "Load more"}
                                    </button>
                                  )}
                                </>
                              ) : (
                                <p className="px-3 py-2 text-sm text-primary_color/50">
                                  No schools available
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.nav_name}
                    href={item.nav_link}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.nav_link)
                        ? "text-secondary_color"
                        : "text-primary_color hover:text-secondary_color"
                    }`}
                  >
                    {item.nav_name}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/contact"
              className="flex-shrink-0 px-4 py-2 text-sm font-medium bg-primary_color text-white hover:opacity-90 transition-opacity"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu button + drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full z-50 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <header
          className={`relative ${
            open ? "z-[60]" : "z-50"
          } flex justify-between items-center h-16 px-4 bg-transparent pointer-events-auto`}
        >
          <Link href="/" className="pointer-events-auto">
            <img src="/Logo.webp" alt="COESSING" className="h-9 w-auto object-contain" />
          </Link>

          <button
            type="button"
            className="relative flex items-center justify-center px-4 py-2 border-2 border-white cursor-pointer bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
            onClick={toggleMenu}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait">
              {!open ? (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs font-medium uppercase text-white"
                >
                  Menu
                  <span className="relative w-4 h-4">
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white" />
                    <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white" />
                  </span>
                </motion.span>
              ) : (
                <motion.span
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs font-medium uppercase text-primary_color"
                >
                  Close
                  <span className="relative w-4 h-4 rotate-45">
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary_color" />
                    <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-primary_color" />
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </header>

        <AnimatePresence>
          {open && (
            <motion.aside
              className="fixed top-0 right-0 w-full h-screen bg-white z-[55] shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pt-20 px-6 pb-10 h-full overflow-y-auto" data-lenis-prevent>
                <ul className="space-y-5 mb-10">
                  {nav_options.map((item, index) => {
                    if (item.isSchools) {
                      return (
                        <li key={item.nav_name}>
                          <div className="flex items-center justify-between">
                            <Link
                              href="/schools"
                              className="text-3xl text-primary_color"
                              onClick={() => setOpen(false)}
                            >
                              {String(index + 1).padStart(2, "0")}. Our Schools
                            </Link>
                            <button
                              type="button"
                              onClick={() => setSchoolsExpanded((v) => !v)}
                              className="p-2"
                              aria-label="Toggle schools list"
                            >
                              <HiChevronDown
                                className={`w-6 h-6 text-primary_color transition-transform ${
                                  schoolsExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>

                          <AnimatePresence>
                            {schoolsExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-3 ml-4"
                              >
                                {schoolsLoading ? (
                                  <p className="text-sm text-primary_color/50">Loading...</p>
                                ) : sortedSchools.length > 0 ? (
                                  <div className="space-y-2">
                                    {sortedSchools.map((school) => (
                                      <Link
                                        key={school.slug}
                                        href={`/schools/${school.slug}`}
                                        className="block border-b border-primary_color/20 py-2 text-primary_color"
                                        onClick={() => setOpen(false)}
                                      >
                                        <div className="font-medium">{school.schoolName}</div>
                                        <div className="text-sm opacity-60">{school.schoolYear}</div>
                                      </Link>
                                    ))}
                                    {hasMore && (
                                      <button
                                        type="button"
                                        onClick={loadMoreSchools}
                                        disabled={loadingMore}
                                        className="mt-2 px-4 py-2 bg-primary_color text-white text-sm disabled:opacity-50"
                                      >
                                        {loadingMore ? "Loading..." : "Load more"}
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-primary_color/50">
                                    No schools available
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </li>
                      );
                    }

                    return (
                      <li key={item.nav_name}>
                        <Link
                          href={item.nav_link}
                          className="block text-3xl text-primary_color"
                          onClick={() => setOpen(false)}
                        >
                          {String(index + 1).padStart(2, "0")}. {item.nav_name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="block w-full bg-primary_color text-white px-6 py-4 text-center text-lg"
                >
                  Contact Us
                </Link>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Nav;
