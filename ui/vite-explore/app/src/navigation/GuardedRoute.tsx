import { useEffect, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

type RouteGuard = {
  canActivate: () => boolean | Promise<boolean>;
  redirectTo?: string;
};

type GuardedRouteProps = {
  guards?: RouteGuard[];
  element: ReactElement;
};

export function GuardedRoute({ guards, element }: GuardedRouteProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkGuards = async () => {      
      for (const guard of (guards || [])) {
        const canActivate = (await guard.canActivate());

        if (!canActivate) {
          navigate(guard.redirectTo || '/');
          return;
        }
      }
    };
    
    checkGuards();
  }, [guards, navigate]);
  
  return element;
}