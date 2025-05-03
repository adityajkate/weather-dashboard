"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useThemeValue } from "@/components/ThemeProvider";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-[350px] flex items-center justify-center">Loading chart...</div>
});

interface ChartData {
  name: string;
  data: number[];
}

interface WeatherChartProps {
  title: string;
  subtitle?: string;
  categories: string[];
  series: ChartData[];
  type?: "line" | "area" | "bar";
  height?: number;
  stacked?: boolean;
  yAxisTitle?: string;
  colors?: string[];
  className?: string;
  delay?: number;
}

export function WeatherChart({
  title,
  subtitle,
  categories,
  series,
  type = "line",
  height = 350,
  stacked = false,
  yAxisTitle,
  colors,
  className = "",
  delay = 0
}: WeatherChartProps) {
  const { isDark } = useThemeValue();

  // Memoize all chart options to prevent unnecessary re-renders
  const chartOptions = useMemo(() => {
    // Default colors based on theme
    const defaultColors = isDark
      ? ["#60A5FA", "#06B6D4", "#22c55e", "#F97316", "#f472b6"]
      : ["#1E40AF", "#0891B2", "#16a34a", "#ea580c", "#be185d"];

    const chartColors = colors || defaultColors;
    const textColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "#334155" : "#e2e8f0";
    const tooltipBg = isDark ? "#1e293b" : "#ffffff";
    const tooltipBorder = isDark ? "#334155" : "#e2e8f0";
    const tooltipTextColor = isDark ? "#ffffff" : "#1e293b";

    return {
      chart: {
        type: type,
        height: height,
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        fontFamily: "var(--font-roboto), sans-serif",
        background: "transparent",
        foreColor: textColor
      },
      colors: chartColors,
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth" as "smooth", // Type assertion to fix TypeScript error
        width: 3
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 3,
        position: "back" as "back", // Type assertion to fix TypeScript error
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: textColor,
            fontSize: "12px",
            fontFamily: "var(--font-roboto), sans-serif"
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        title: {
          text: yAxisTitle,
          style: {
            color: textColor,
            fontSize: "12px",
            fontFamily: "var(--font-roboto), sans-serif"
          }
        },
        labels: {
          style: {
            colors: textColor,
            fontSize: "12px",
            fontFamily: "var(--font-roboto), sans-serif"
          }
        }
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        style: {
          fontSize: "12px",
          fontFamily: "var(--font-roboto), sans-serif"
        },
        custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
          const value = series[seriesIndex][dataPointIndex];
          const category = w.globals.labels[dataPointIndex];
          const seriesName = w.globals.seriesNames[seriesIndex];

          return `<div class="apexcharts-tooltip-custom" style="background: ${tooltipBg}; color: ${tooltipTextColor}; border: 1px solid ${tooltipBorder}; padding: 8px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="font-weight: 600; margin-bottom: 4px;">${category}</div>
            <div style="display: flex; align-items: center; margin-bottom: 2px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${chartColors[seriesIndex]}; margin-right: 6px;"></span>
              <span>${seriesName}: <b>${value}${yAxisTitle || ''}</b></span>
            </div>
          </div>`;
        },
        marker: {
          show: true
        },
        fixed: {
          enabled: false,
          position: "topRight",
          offsetX: 0,
          offsetY: 0
        }
      },
      legend: {
        position: "top" as "top", // Type assertion to fix TypeScript error
        horizontalAlign: "right" as "right", // Type assertion to fix TypeScript error
        floating: false,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: textColor
        }
      },
      fill: {
        type: type === "area" ? "gradient" : "solid",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.3,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 100]
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "60%",
          dataLabels: {
            position: "top"
          }
        }
      }
    };
  }, [isDark, categories, yAxisTitle, colors, type, height]);

  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: delay * 0.1
      }}
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="chart-container">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type={type}
          height={height}
        />
      </div>
    </motion.div>
  );
}
