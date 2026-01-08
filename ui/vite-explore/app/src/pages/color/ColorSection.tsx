import { useSearchParams } from "react-router-dom";
import { readableColor, lighten, darken } from "polished";
import { StringUtil } from "../../shared/util/string-util";

export default function ColorSection({ backcolor = "black" }) {
  const [searchParams] = useSearchParams();

  const variant = searchParams.get("variant") === "dark" ? "dark" : "light";
  const effectiveBackcolor = ((variant === "dark") ? darken(0.2, backcolor) : lighten(0.2, backcolor));
  const fc = readableColor(effectiveBackcolor);
  const bc = StringUtil.capitalizeFirstLetter(backcolor);

  return (
    <div style={{ background: effectiveBackcolor, height: "50vh" }}>
      <h1 style={{ color: fc, padding: 20 }}>
        {bc} ({variant})
      </h1>
    </div>
  );
}
