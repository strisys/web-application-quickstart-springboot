import { useParams } from "react-router-dom";
import { useDocumentTitle } from "./useDocumentTitle";
import { getRouteMetadata } from "./routeMetadata";
import { useEffectiveLocation } from "./useEffectiveLocation";

export function useRouteTitle() {
  const location = useEffectiveLocation();
  const params = useParams();
  const meta = getRouteMetadata(location.underlay, params);
  
  useDocumentTitle(meta.title);
}
