import { colorPathConfig } from '../pages/color/navigation/paths';
export { colorPathConfig as colorModuleConfig };

/**
 * Root-level paths
 */
export const ROOT_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  NOT_FOUND: '*',
} as const;

/**
 * Centralized path registry - imports from modules
 * This is your single source of truth for navigation
 */
export const PATHS = {
  ...ROOT_PATHS,
  COLORS: colorPathConfig.routePatterns,
  // DASHBOARD: dashboardPaths,  // Future modules
} as const;

/**
 * Centralized route patterns registry
 */
export const ROUTE_PATTERNS = {
  ...ROOT_PATHS,
  COLORS: colorPathConfig.routePatterns,
  // DASHBOARD: dashboardModuleConfig.paths,  // Future modules
} as const;

