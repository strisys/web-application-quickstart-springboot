import { colorPathConfig } from "./navigation/paths";

export function NotFound() {
  return (
    <div
      style={{
        height: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>404 – Page not found</h1>
      <p>That color doesn’t exist in the color list.</p>
      <a href={colorPathConfig.paths.defaultDetail()} style={{ marginTop: 16 }}>
        Go back to Red
      </a>
    </div>
  );
}
