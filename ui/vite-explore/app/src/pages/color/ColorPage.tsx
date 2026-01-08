import { Suspense, Fragment  } from "react";
import { useParams } from "react-router-dom";
import { colorComponentFactory } from "./componentRegistry";
import { ProtectedRoute } from "../../auth/ProtectedRoute";
import { OverlayLink } from "../../navigation/OverlayLink";
import { colorPathConfig } from "./navigation/paths";
import Transparent from "./Transparent";

const { getComponent } = colorComponentFactory();

export function ColorRoute() {
   const { colorName } = useParams<{ colorName: string }>();

   if (!colorName) {
      return <div>No color specified.</div>;
   }

   const ColorComponent = getComponent(colorName);

   if (!ColorComponent) {
      return <div>Unknown color: {colorName}</div>;
   }

   // const prettyName = StringUtil.capitalizeFirstLetter(colorName);

   const content = (
      <Fragment>
         <Suspense fallback={<Transparent />}>
            <ColorComponent />
         </Suspense>

         <div
            style={{
               position: "relative",
               padding: "8px 12px",
               background: 'transparent',
               display: 'flex',
               justifyContent: 'flex-end'
            }}
            >
            <OverlayLink
               to={colorPathConfig.paths.detailsModal(colorName)}
               style={{ textDecoration: "none" }}
            >
               Details
            </OverlayLink>
         </div>
      </Fragment>
   );

   if (colorName.toLowerCase() === "blue") {
    return (
         <ProtectedRoute>
            {content}
         </ProtectedRoute>
      );
   }

   return content;
}
