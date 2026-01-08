import { useNavigate, useParams } from "react-router-dom";
import { ModalComponent } from "../../shared/components/ModalComponent";
import { StringUtil } from "../../shared/util/string-util";

export function ColorDetailsModal() {
  const { colorName } = useParams<{ colorName: string }>();
  const prettyName = colorName ? StringUtil.capitalizeFirstLetter(colorName) : "Unknown";
  const navigate = useNavigate();

  return (
    <ModalComponent
      message={`This is a modal route for ${prettyName}.`}
      color={colorName || "white"}
      onClose={() => navigate(-1)}
    />
  );
}
