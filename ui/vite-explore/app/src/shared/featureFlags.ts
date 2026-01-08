declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      API_BASE_URL?: string;
      AUTH0_DOMAIN?: string;
      AUTH0_CLIENT_ID?: string;
      GOOGLE_API_KEY?: string;
      MAINTENANCE?: boolean;
      EXPERIMENTAL_COLORS?: boolean;
    };
  }
}

const runtimeConfig = (window.__RUNTIME_CONFIG__ || {});

const featureFlags = {
   devRoutes: import.meta.env.MODE === "development",
   maintenance: Boolean(runtimeConfig.MAINTENANCE),
   experimentalColors: Boolean(runtimeConfig.EXPERIMENTAL_COLORS),
};

export function getFeatureFlags(): typeof featureFlags {
   console.log("Feature Flags:", JSON.stringify(runtimeConfig), import.meta.env.MODE);
   return featureFlags;
}

export function getFeatureFlag(flagName: keyof typeof featureFlags): boolean {
   const value = getFeatureFlags()[flagName];
   console.log("Getting feature flag:", flagName, value, import.meta.env.MODE);
   return value;
}