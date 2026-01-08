import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

type AppComponent = LazyExoticComponent<ComponentType<any>>;
type AppComponentLoader = () => Promise<{ default: ComponentType<any> }>;

const preloadedComponents: Record<string, string> = {};

// 1) Grab *all* TSX components in this folder and all subfolders
const modules = import.meta.glob("./**/*.tsx") as Record<string, AppComponentLoader>;
console.log(Object.keys(modules).length + " components found in glob scan");

// 2) Build loaderRecords from the glob, using the file name as the key
//    e.g. "./Red.tsx"        -> "red"
//         "./ColorDetailsModal.tsx" -> "colordetailsmodal"
const loaderRecords: Record<string, AppComponentLoader> = {};

Object.entries(modules).forEach(([path, loader]) => {
  const match = path.match(/\.\/(.+)\.tsx$/);
  
  if (!match) {
   return;
  }

  const fileName = match[1];             
  const key = fileName.toLowerCase();    

  console.log(`Registering lazy loader for component "${key}" from file "${path}"`);
  loaderRecords[key] = loader;
});

// 3) Lazily-wrapped components built from loaderRecords
const colorRegistry: Record<string, AppComponent> = Object.fromEntries(
  Object.entries(loaderRecords).map(([key, loader]) => [key, lazy(loader)])
);

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

export function colorComponentFactory() {
  const getComponent = (name: string): AppComponent | null => {
    const key = normalize(name);

    let component = (colorRegistry[key] as AppComponent | undefined);

    // If not found, try suffix match
    if (!component) {
      const entry = Object.entries(colorRegistry).find(([registryKey]) =>
        registryKey.endsWith(key)
      );

      if (entry) {
        component = (entry[1] as AppComponent);
      }
    }

    if (!component) {
      console.error(`Component "${name}" not found in registry`);
      return null;
    }

    console.log(`Getting component "${key}" from registry`);
    return component;
  };

  const preloadComponent = (name: string): void => {
   if (preloadedComponents[name]) {
      console.log(`Component "${name}" already preloaded`);
      return;
   }

   const key = normalize(name);
   let loader = loaderRecords[key];

   if (!loader) {
      const loaderEntry = Object.entries(loaderRecords).find(([registryKey]) =>
         registryKey.endsWith(key)
      );

      if (loaderEntry) {
         loader = loaderEntry[1];
      }
   }

   if (!loader) {
      console.error(`Component "${name}" not found in loader map`);
      return;
   }

   // Trigger the dynamic import early; React.lazy will reuse this promise.
   console.log(`Preloading component "${name}"`);
   preloadedComponents[name] = key;
   
   void loader();
  };

  const preloadAll = (): void => {
    Object.values(loaderRecords).forEach((loader) => {
      void loader();
    });
  };

  return {
    getComponent,
    preloadComponent,
    preloadAll,
  };
}
