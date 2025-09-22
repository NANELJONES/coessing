"use client";
import { useState, useEffect } from "react";

export default function Loading({ children }) {
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const handlePageLoad = () => setIsLoading(false); // Hide loader on complete load

    // Check if the document is already loaded
    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad); // Add listener for page load
    }

    // Cleanup event listener when component unmounts
    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  if (isLoading) {
    // Render the loading screen while elements are still loading
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center h-[100vh] w-full">
        <h3 className="text-white">Page Loading</h3>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" >  </div>
      </div>
    );
  }

  // Render the actual page content when loading is complete
  return <div>{children}</div>;
}
