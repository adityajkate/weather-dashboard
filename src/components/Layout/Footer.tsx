"use client";

import { HeartIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">
              Weather data provided by{' '}
              <a
                href="https://openweathermap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                OpenWeatherMap
              </a>
            </p>
          </motion.div>

          <motion.div
            className="flex items-center mt-4 md:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-sm text-muted-foreground flex items-center">
              Made with <HeartIcon className="h-3 w-3 text-destructive mx-1 animate-pulse-subtle" /> by{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-medium ml-1">
                AdityaKate
              </span>
            </p>
          </motion.div>

          <motion.p
            className="text-sm text-muted-foreground mt-4 md:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            © {new Date().getFullYear()} Weather Dashboard by AdityaKate
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
