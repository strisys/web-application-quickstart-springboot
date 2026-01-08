import { Outlet } from "react-router-dom";
import { useRouteTitle } from "./useRouteTitle";
import { ScrollRestoration } from "./ScrollRestoration";

export function RootLayout() {
   useRouteTitle();
   
   return (
      <div style={{ fontFamily: "system-ui, sans-serif" }}>
         <ScrollRestoration />
         <Outlet />
      </div>
   );
}
