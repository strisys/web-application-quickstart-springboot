import { Link, useLocation, type LinkProps } from "react-router-dom";

export function OverlayLink({ state, ...props }: LinkProps) {
  const location = useLocation();

  const mergedState = {
    ...(state as object | undefined),
    backgroundLocation: location,
  };

  return <Link {...props} state={mergedState} />;
}
