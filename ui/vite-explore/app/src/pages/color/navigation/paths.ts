// ============================================================================
// IMPROVED: paths.ts - Type-Safe Path Configuration
// ============================================================================

import { getFeatureFlag } from "../../../shared/featureFlags";

/**
 * Color module path configuration
 * This file is owned by the color module and can be modified independently
 */

const BASE_PATH = '/colors';
const DEFAULT_COLOR = 'red';
const EXPERIMENTAL_COLORS = ['brown'];

// ============================================================================
// Color Names - Single Source of Truth
// ============================================================================

/**
 * All available color names in the application.
 * This is the single source of truth - add new colors here.
 */
export const ColorNames = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'violet',
  'brown'
] as const;

/**
 * Type-safe color name union type.
 * Automatically derived from ColorNames array.
 */
export type ColorName = typeof ColorNames[number];

// ============================================================================
// Path Templates
// ============================================================================

/**
 * Internal path templates - not exported
 */
const colorPaths = {
  ROOT: BASE_PATH,
  DETAIL: (colorName: string) => `${BASE_PATH}/${colorName}`,
  DETAILS_MODAL: (colorName: string) => `${BASE_PATH}/${colorName}/details`,
  COMPARE: (color1: string, color2: string) => `${BASE_PATH}/compare/${color1}/${color2}`,
} as const;

// ============================================================================
// Route Patterns - For React Router
// ============================================================================

/**
 * Color route patterns - for route definitions.
 * Use these when defining routes, use ColorPaths for navigation.
 */
export const COLOR_ROUTE_PATTERNS = {
  ROOT: BASE_PATH,
  DETAIL: `${BASE_PATH}/:colorName`,
  DEFAULT_DETAIL: `${BASE_PATH}/${DEFAULT_COLOR}`,
  DETAILS_MODAL: `${BASE_PATH}/:colorName/details`,
  COMPARE: `${BASE_PATH}/compare/:color1/:color2`,
} as const;

// ============================================================================
// Type-Safe Path Builder Types
// ============================================================================

/**
 * Generates a type with a method for each color name.
 * Each method accepts optional params and returns a string path.
 * 
   type PathBuilder<typeof ColorNames> = {
      red: (params?: Record<string, string>) => string;
      orange: (params?: Record<string, string>) => string;
      yellow: (params?: Record<string, string>) => string;
      ...
   };
 */
type PathBuilder<T extends readonly string[]> = {
  [K in T[number]]: (params?: Record<string, string>) => string;
};

/**
 * Complete type definition for ColorPaths.
 * Includes both generated color methods and utility methods.
 * 
   type ColorPathBuilders = {
   {
      red: (params?: Record<string, string>) => string;
      orange: (params?: Record<string, string>) => string;
      yellow: (params?: Record<string, string>) => string;
      ...

      root: () => string;
      detail: (colorName: ColorName) => string;
      defaultDetail: () => string;
      detailsModal: (colorName: ColorName) => string;
      compare: (color1: ColorName, color2: ColorName) => string;
   };
 */
type ColorPathBuilders = PathBuilder<typeof ColorNames> & {
  root: () => string;
  detail: (colorName: ColorName) => string;
  defaultDetail: () => string;
  detailsModal: (colorName: ColorName) => string;
  compare: (color1: ColorName, color2: ColorName) => string;
};

// ============================================================================
// Path Builder Factory
// ============================================================================

/**
 * A factory function that creates an object obeying the ColorPathBuilders contract.
 * Automatically generates a method for each color name.
 */
function createColorPaths(): ColorPathBuilders {
  // Generate color-specific methods dynamically
  // e.g. ColorPaths.red({ variant: 'dark' }) => '/colors/red?variant=dark'
  const colorMethods = ColorNames.reduce((acc, colorName) => {
    acc[colorName] = (params?: Record<string, string>): string => {
      const variant = ((params) ? params['variant'] : 'light');
      return `${colorPaths.DETAIL(colorName)}?variant=${variant}`;
    };
    return acc;
  }, {} as PathBuilder<typeof ColorNames>);

  // Return the complete ColorPaths object
  return {
    ...colorMethods,
    
    /**
     * Returns the root colors path.
     * @example ColorPaths.root() // '/colors'
     */
    root: () => colorPaths.ROOT,
    
    /**
     * Returns the detail path for a specific color.
     * @param colorName - Valid color name (type-checked)
     * @example ColorPaths.detail('red') // '/colors/red'
     */
    detail: (colorName: ColorName): string => {
      return colorPaths.DETAIL(colorName.toLowerCase());
    },

    /**
     * Returns the detail path for the default color.
     * @example ColorPaths.defaultDetail() // '/colors/red'
     */
    defaultDetail: (): string => {
      return colorPaths.DETAIL(DEFAULT_COLOR);
    },
    
    /**
     * Returns the details modal path for a specific color.
     * @param colorName - Valid color name (type-checked)
     * @example ColorPaths.detailsModal('blue') // '/colors/blue/details'
     */
    detailsModal: (colorName: ColorName): string => {
      return colorPaths.DETAILS_MODAL(colorName.toLowerCase());
    },
    
    /**
     * Returns the comparison path for two colors.
     * @param color1 - First color name (type-checked)
     * @param color2 - Second color name (type-checked)
     * @example ColorPaths.compare('red', 'blue') // '/colors/compare/red/blue'
     */
    compare: (color1: ColorName, color2: ColorName): string => {
      return colorPaths.COMPARE(color1.toLowerCase(), color2.toLowerCase());
    },
  };
}

/**
 * Type-safe path builders for color module.
 * All methods are strongly typed and validated at compile time.
 * 
 * @example
 * navigate(ColorPaths.detail('red'))
 * navigate(ColorPaths.red({ variant: 'dark' }))
 * navigate(ColorPaths.compare('red', 'blue'))
 * navigate(ColorPaths.detailsModal('green'))
 */
export const ColorPaths = createColorPaths();

// ============================================================================
// Runtime Validation Helpers
// ============================================================================

/**
 * Type guard to check if a string is a valid ColorName.
 * Use this when receiving color names from external sources.
 * 
 * @example
 * const colorFromUrl = params.color;
 * if (isValidColorName(colorFromUrl)) {
 *   // colorFromUrl is now typed as ColorName
 *   navigate(ColorPaths.detail(colorFromUrl));
 * }
 */
export function isValidColorName(value: string): value is ColorName {
  return ColorNames.includes(value as ColorName);
}

/**
 * Assertion function that throws if the value is not a valid ColorName.
 * Use this when you need strict validation with error throwing.
 * 
 * @throws Error if value is not a valid ColorName
 * @example
 * const colorFromUrl = params.color;
 * assertValidColorName(colorFromUrl);
 * // colorFromUrl is now typed as ColorName
 * navigate(ColorPaths.detail(colorFromUrl));
 */
export function assertValidColorName(value: string): asserts value is ColorName {
  if (!isValidColorName(value)) {
    throw new Error(
      `Invalid color name: "${value}". Valid colors: ${ColorNames.join(', ')}`
    );
  }
}

/**
 * Safely converts a string to a ColorName, returning null if invalid.
 * Use this when you want to handle invalid values gracefully.
 * 
 * @example
 * const colorFromUrl = params.color;
 * const validColor = toColorName(colorFromUrl);
 * if (validColor) {
 *   navigate(ColorPaths.detail(validColor));
 * } else {
 *   navigate(ColorPaths.defaultDetail());
 * }
 */
export function toColorName(value: string): ColorName | null {
  return isValidColorName(value) ? value : null;
}

// ============================================================================
// Module Configuration Export
// ============================================================================

/**
 * Module export configuration.
 * This tells the root route system about this module.
 */
export const colorPathConfig = {
  /**
   * Type-safe path builders
   */
  paths: ColorPaths,
  
  /**
   * Route patterns for React Router route definitions
   */
  routePatterns: COLOR_ROUTE_PATTERNS,
  
  /**
   * Base path for the color module
   */
  basePath: BASE_PATH,
  
  /**
   * Default color name
   */
  defaultColor: DEFAULT_COLOR,
  
  /**
   * All available color names
   */
  colorNames: ColorNames,
  
  /**
   * Get colors based on feature flags.
   * Filters out experimental colors if flag is disabled.
   */
  getColors: (): readonly ColorName[] => {
    return getFeatureFlag("experimentalColors") ? [...ColorNames] : ColorNames.filter(color => !colorPathConfig.isExperimentalColor(color));
  },
  
  /**
   * Get experimental color names
   */
  getExperimentalColors: (): readonly string[] => {
    return [...EXPERIMENTAL_COLORS];
  },
  
  /**
   * Check if a color is experimental
   */
  isExperimentalColor: (colorName: string): boolean => {
    return EXPERIMENTAL_COLORS.includes(colorName.toLowerCase());
  },
  
  /**
   * Check if a color name is valid (runtime check)
   */
  isValidColor: isValidColorName,
  
  /**
   * Convert string to ColorName (safe)
   */
  toColorName,
  
  /**
   * Assert color name is valid (throws if not)
   */
  assertValidColor: assertValidColorName,
} as const;