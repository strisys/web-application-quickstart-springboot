import type { Location } from "react-router-dom";
import type { Params } from "react-router";
import { StringUtil } from "../shared/util/string-util";
import { PATHS } from "./paths";

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface RouteMetadata {
  id: string;
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

export function getRouteMetadata(location: Location, _: Readonly<Params<string>>): RouteMetadata {
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", path: PATHS.HOME }];
  const path = location.pathname;

  // Root / home (you redirect to /color/red, but we still handle this)
  if (path === PATHS.HOME || path === "") {
    return {
      id: "home",
      title: `Home`,
      breadcrumbs,
    };
  }

  const segments = path.split("/").filter(Boolean);
  const first = segments[0];

   if (first) {
      const pretty = StringUtil.capitalizeFirstLetter(first);
      breadcrumbs.push({ label: pretty, path: `/${first}` });

      return {
         id: first,
         title: pretty,
         breadcrumbs,
      };
   }

   // Anything else → Not Found
   breadcrumbs.push({ 
      label: "Not Found", 
      path 
   });

  return {
    id: "notFound",
    title: `Not Found`,
    breadcrumbs,
  };
}
