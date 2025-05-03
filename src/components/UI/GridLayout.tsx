"use client";

import { ReactNode, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface GridItem {
  id: string;
  content: ReactNode;
  defaultSize: [number, number]; // [width, height]
  defaultPosition?: [number, number]; // [x, y]
  isResizable?: boolean;
  isDraggable?: boolean;
  minSize?: [number, number]; // [minW, minH]
  maxSize?: [number, number]; // [maxW, maxH]
}

interface GridLayoutProps {
  items: GridItem[];
  className?: string;
  rowHeight?: number;
  cols?: { [key: string]: number };
  onLayoutChange?: (layout: any) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
  compactType?: "vertical" | "horizontal" | null;
  preventCollision?: boolean;
}

export function GridLayout({
  items,
  className = "",
  rowHeight = 100,
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  onLayoutChange,
  isDraggable = true,
  isResizable = true,
  compactType = "vertical",
  preventCollision = false
}: GridLayoutProps) {
  // Generate layouts for different breakpoints
  const generateLayouts = () => {
    const layouts: { [key: string]: any[] } = {};
    
    // For each breakpoint
    Object.keys(cols).forEach(breakpoint => {
      layouts[breakpoint] = items.map(item => {
        const [w, h] = item.defaultSize;
        const [x, y] = item.defaultPosition || [0, 0];
        
        return {
          i: item.id,
          x: x,
          y: y,
          w: w,
          h: h,
          minW: item.minSize ? item.minSize[0] : 1,
          minH: item.minSize ? item.minSize[1] : 1,
          maxW: item.maxSize ? item.maxSize[0] : Infinity,
          maxH: item.maxSize ? item.maxSize[1] : Infinity,
          isDraggable: item.isDraggable !== undefined ? item.isDraggable : isDraggable,
          isResizable: item.isResizable !== undefined ? item.isResizable : isResizable,
        };
      });
    });
    
    return layouts;
  };
  
  const [layouts, setLayouts] = useState(generateLayouts());
  
  const handleLayoutChange = (currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts);
    if (onLayoutChange) {
      onLayoutChange(allLayouts);
    }
  };
  
  return (
    <div className={`grid-layout-container ${className}`}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={cols}
        rowHeight={rowHeight}
        onLayoutChange={handleLayoutChange}
        isDraggable={isDraggable}
        isResizable={isResizable}
        compactType={compactType}
        preventCollision={preventCollision}
        margin={[16, 16]}
      >
        {items.map(item => (
          <div key={item.id} className="grid-item">
            {item.content}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
