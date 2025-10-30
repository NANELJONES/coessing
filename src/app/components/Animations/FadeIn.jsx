"use client";
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Reusable FadeIn animation component
 * @param {React.ReactNode} children - The content to animate
 * @param {string} type - Animation type: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right'
 * @param {number} delay - Animation delay in seconds (default: 0)
 * @param {number} duration - Animation duration in seconds (default: 0.6)
 * @param {number} amount - Amount of element that needs to be visible to trigger (default: 0.3)
 * @param {boolean} once - Whether animation should trigger only once (default: false)
 * @param {number} distance - Distance in pixels for the animation (default: 50)
 * @param {string} className - Additional CSS classes
 */
const FadeIn = ({ 
  children, 
  type = 'fade-up',
  delay = 0,
  duration = 0.6,
  amount = 0.3,
  once = false,
  distance = 50,
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  // Define animation variants based on type
  const getAnimationVariants = () => {
    const variants = {
      'fade-up': {
        initial: { opacity: 0, y: distance },
        animate: { opacity: isInView ? 1 : 0, y: isInView ? 0 : distance }
      },
      'fade-down': {
        initial: { opacity: 0, y: -distance },
        animate: { opacity: isInView ? 1 : 0, y: isInView ? 0 : -distance }
      },
      'fade-left': {
        initial: { opacity: 0, x: distance },
        animate: { opacity: isInView ? 1 : 0, x: isInView ? 0 : distance }
      },
      'fade-right': {
        initial: { opacity: 0, x: -distance },
        animate: { opacity: isInView ? 1 : 0, x: isInView ? 0 : -distance }
      }
    };

    return variants[type] || variants['fade-up'];
  };

  const animationVariants = getAnimationVariants();

  return (
    <motion.div
      ref={ref}
      initial={animationVariants.initial}
      animate={animationVariants.animate}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;

