import { useRoutes } from "react-router-dom";
import { useEffectiveLocation, type LocationState } from "./useEffectiveLocation";
import { getAppRouteTree, getAppRouteTreeOverlay } from "./rootRouteTrees"; 
import { tryValidatePaths } from './pathValidation';

tryValidatePaths();

export function RouteTree() {
   const locationState: LocationState  = useEffectiveLocation();

   const appTreeRoutes = useRoutes(getAppRouteTree(), locationState.underlay);
   const overlayTreeRoutes = useRoutes(getAppRouteTreeOverlay(), locationState.overlay);

   console.log("RouteTree", { locationState });

   return (
      <>
         {appTreeRoutes}
         {overlayTreeRoutes}
      </>
   );
}
