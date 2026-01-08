import type { Location as RouterLocation } from "react-router-dom";
import { useLogLocation } from "./useLogLocation";

type BackgroundLocationState = {
  backgroundLocation?: RouterLocation;
  // Add other state properties as needed
};

export type LocationState = {
   current: RouterLocation;
   underlay: RouterLocation;
   overlay: (RouterLocation | undefined);
   overlayPresent: boolean;
};

export function useEffectiveLocation() {
   const current = useLogLocation();
   const backgroundLocation = (current.state as BackgroundLocationState)?.backgroundLocation;
   const overlayPresent = Boolean(backgroundLocation);

   if (overlayPresent) {
      console.log("effective location - overlay present", { current, backgroundLocation });
   }

   return { 
      current,
      overlay: (overlayPresent ? current : undefined), 
      underlay: (overlayPresent ? backgroundLocation : current), 
      overlayPresent 
   } as LocationState;
}
