/* types/react-heatmap-grid.d.ts */
declare module "react-heatmap-grid" {
    import * as React from "react";
  
    export interface HeatMapGridProps {
      data: number[][];
      xLabels?: string[];
      yLabels?: string[];
      // ↳ add the few props you actually use (all optional = no compile errors)
      [key: string]: any;
    }
  
    export const HeatMapGrid: React.ComponentType<HeatMapGridProps>;
  }
  