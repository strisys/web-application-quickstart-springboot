import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthControls } from "../../auth/AuthControls";
import { Breadcrumbs } from "./navigation/Breadcrumbs";
import { StringUtil } from "../../shared/util/string-util";
import { colorComponentFactory } from "./componentRegistry";
import { colorPathConfig } from "./navigation/paths";
import type { JSX } from "react/jsx-dev-runtime";

const { preloadComponent } = colorComponentFactory();
let navlinksCache: JSX.Element[] | null = null;

export function getColorNavLinks() {
   if (navlinksCache) {
      return navlinksCache;
   }

   return (navlinksCache = colorPathConfig.getColors().map((color, index) => {
      return (
         <NavLink key={`colors-${index}`} 
                  to={colorPathConfig.paths.detail(color)} 
                  style={{background: 'transparent'}} 
                  onMouseOver={() => preloadComponent(color)}>
            {StringUtil.capitalizeFirstLetter(color)}
         </NavLink> );
   }));
}

export function ColorsLayout() {
  const location = useLocation();

  return (
    <div>
      <nav
         style={{
            padding: 20,
            display: "flex",
            gap: 20,
            borderBottom: "1px solid #ccc",
            alignItems: "center",
         }}>

         {getColorNavLinks()}

         <div style={{ marginLeft: "auto" }}>
            <AuthControls />
         </div>
      </nav>

      <Breadcrumbs />

      <AnimatePresence mode="wait">
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}>
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
