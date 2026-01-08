// src/pages/VariantLayout.tsx
import { Outlet, Link, useSearchParams } from "react-router-dom";

export function VariantColorLayout() {
  const [searchParams] = useSearchParams();
  const currentVariant = searchParams.get("variant") || "light";

  const baseLinkStyle: React.CSSProperties = {
   textDecoration: "none",
   cursor: "pointer",
   padding: "6px 12px",
   fontFamily: "system-ui, sans-serif",
   fontSize: 14,
  };

  const activeStyle: React.CSSProperties = {
   ...baseLinkStyle,
   fontWeight: "bold",
   textDecoration: "underline",
  };

  return (
    <div style={{ padding: 16 }}>
         <Outlet />

         {/* Variant Selector */}
         <div
         style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            fontFamily: "system-ui, sans-serif",
            justifyContent: "center",
         }}
         >
            
         <Link
            to="?variant=light"
            style={currentVariant === "light" ? activeStyle : baseLinkStyle}
         >
            Light
         </Link>

         <Link
            to="?variant=dark"
            style={currentVariant === "dark" ? activeStyle : baseLinkStyle}
         >
            Dark
         </Link>
      </div>
    </div>
  );
}
