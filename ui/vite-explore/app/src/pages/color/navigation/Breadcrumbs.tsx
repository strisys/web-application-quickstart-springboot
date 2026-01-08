import { NavLink, useLocation } from "react-router-dom";
import { StringUtil } from "../../../shared/util/string-util";

const segmentNameMap: Record<string, string> = {
  color: "Colors",
  login: "Login",
};

function formatSegment(segment: string): string {
   return ((segmentNameMap[segment]) ? segmentNameMap[segment] : StringUtil.capitalizeFirstLetter(segment));
}

function createElement(crumb: { label: string, path: string }, index: number, isLast: boolean) {
   if (isLast) {
      return <span key={crumb.path} style={{ fontWeight: 600 }}>{crumb.label}</span>
   }

   return (<span key={`${crumb.path}-${index}`}>
      <>
         <NavLink to={crumb.path} style={{ textDecoration: "none", color: "#0077cc" }}>
            {crumb.label}
         </NavLink>
         <span style={{ margin: "0 4px" }}>/</span>
      </>
   </span>)
}

export function Breadcrumbs() {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);
  const crumbs: Array<{ label: string; path: string }> = [];

  crumbs.push({ label: "Home", path: "/" });

  // Build rest of breadcrumbs from path segments
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    let label = formatSegment(segment);

    // Special case: /color/:colorName -> "Colors" / "Red"
    if (index === 0 && segment === "color") {
      label = "Colors";
    } 
    
    if (segments[0] === "color" && index === 1) {
      label = formatSegment(segment);
    }

    crumbs.push({ label, path: currentPath });
  });

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        padding: "8px 20px",
        borderBottom: "1px solid #eee",
        fontSize: 14,
      }}
    >
      {crumbs.map((crumb, index) => {
        return createElement(crumb, index, (index === crumbs.length - 1))
      })}
    </nav>
  );
}
