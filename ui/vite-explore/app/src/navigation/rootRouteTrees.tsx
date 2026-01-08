import { Navigate, type RouteObject } from "react-router-dom";

import { Login } from "../auth/Login";
import { RootLayout } from "./RootLayout";
import { NotFound } from "../pages/color/NotFound";
import { ErrorPage } from "./ErrorPage";

import { type RouteModule } from "./RouteModule";
import { ROOT_PATHS } from "./paths";
import { routeTrees as colorRootTrees } from "../pages/color/navigation/route-trees";


const routeModules: RouteModule[] = [
  colorRootTrees,
  // add more modules here later
];

const appRootTrees = {
  moduleRoutes: routeModules.flatMap((m) => m.getRoutes()),
  moduleOverlayRoutes: routeModules.flatMap((m) => ((m.getOverlayRoutes) ? m.getOverlayRoutes() : [])),
  defaultRootPath: routeModules.find((m) => m.rootPath)?.rootPath ?? "/",
}

let appRootTree = (null as RouteObject[] | null);
let appRootTreeOverlay = (null as RouteObject[] | null);

export function getAppRouteTree(): RouteObject[] {
   if (appRootTree) {
      return appRootTree;
   }

  return ((appRootTree) || (appRootTree = [
    {
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Navigate to={appRootTrees.defaultRootPath} replace />,
        },
        ...appRootTrees.moduleRoutes,
        {
          path: ROOT_PATHS.LOGIN,
          element: <Login />,
        },
        {
          path: ROOT_PATHS.NOT_FOUND,
          element: <NotFound />,
        },
      ],
    },
  ]));
}

export function getAppRouteTreeOverlay(): RouteObject[] {
  return ((appRootTreeOverlay) || (appRootTreeOverlay = appRootTrees.moduleOverlayRoutes));
}