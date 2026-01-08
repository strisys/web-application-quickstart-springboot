import { type RouteObject } from "react-router-dom";

export type RouteModule = {
  getRoutes: () => RouteObject[];
  getOverlayRoutes?: () => RouteObject[];
  rootPath?: string; 
};