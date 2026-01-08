// import { useEffect, type ReactElement } from "react";
// import { useNavigate, type RouteObject } from "react-router-dom";

// type RouteGuard = {
//   canActivate: () => boolean | Promise<boolean>;
//   redirectTo?: string;
// };

// type GuardedRouteObject = RouteObject & {
//   guards?: RouteGuard[];
// };

// // Implement guard checking component
// export function GuardedRoute({ guards, element }: { 
//   guards?: RouteGuard[]; 
//   element: ReactElement 
// }) {
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     const checkGuards = async () => {      
//       for (const guard of (guards || [])) {
//         const canActivate = (await guard.canActivate());

//         if (!canActivate) {
//           navigate(guard.redirectTo || '/');
//           return;
//         }
//       }
//     };
    
//     checkGuards();
//   }, [guards, navigate]);
  
//   return element;
// }