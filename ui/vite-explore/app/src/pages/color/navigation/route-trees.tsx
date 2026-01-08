import { Navigate, type RouteObject } from "react-router-dom";
import { ColorRoute } from "../ColorPage";
import { VariantColorLayout } from "../VariantColorLayout";
import { ColorDetailsModal } from "../ColorDetailsModal";
import { ColorsLayout } from "../ColorsLayout";
import { type RouteModule } from "../../../navigation/RouteModule";
import { colorPathConfig } from './paths';

export const routeTrees: RouteModule =  {
   getRoutes: getRouteTree,
   getOverlayRoutes: getRouteTreeOverlay,
   rootPath: colorPathConfig.routePatterns.ROOT,
}

function getRouteTree(): RouteObject[] {
  return [
    {
      path: colorPathConfig.routePatterns.ROOT,
      element: <ColorsLayout />,
      children: [
         {
            index: true,
            element: <Navigate to={colorPathConfig.defaultColor} replace />,
         },
         {
            element: <VariantColorLayout />,
            children: [
               {
                  path: ":colorName",
                  element: <ColorRoute />,
               },
            ],
         },
      ],
    },
  ];
}

function getRouteTreeOverlay(): RouteObject[] {
  return [
    {
      path: colorPathConfig.routePatterns.DETAILS_MODAL,
      element: <ColorDetailsModal />,
    },
  ];
}