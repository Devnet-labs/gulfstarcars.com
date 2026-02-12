"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoPreloader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const siteLoaded = sessionStorage.getItem("siteLoaded");

    if (!siteLoaded) {
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem("siteLoaded", "true");
      }, 1800);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <img
              src="/images/portfolio/logo/logo.png"
              alt="Gulf Star Automotive"
              className="w-[280px] md:w-[360px] object-contain"
              style={{
                filter: "drop-shadow(0 0 40px rgba(212, 175, 55, 0.3))",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "160px" }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-8"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
