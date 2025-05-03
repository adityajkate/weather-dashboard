"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../UI/GlassCard";

interface WeatherStatItemProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  delay?: number;
}

export function WeatherStatItem({
  icon,
  label,
  value,
  unit,
  color = "text-primary",
  delay = 0
}: WeatherStatItemProps) {
  return (
    <motion.div
      className="flex items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: delay * 0.1
      }}
    >
      <div className={`p-3 rounded-full ${color} bg-opacity-10 mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold">
          {value}
          {unit && <span className="text-sm ml-1 text-muted-foreground">{unit}</span>}
        </p>
      </div>
    </motion.div>
  );
}

interface WeatherStatsProps {
  title?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function WeatherStats({
  title,
  children,
  className = "",
  delay = 0
}: WeatherStatsProps) {
  return (
    <GlassCard className={className} delay={delay}>
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children}
      </div>
    </GlassCard>
  );
}
