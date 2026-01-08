import { useEffect } from "react";
import { motion } from "framer-motion";
import readableColor from "polished/lib/color/readableColor";

interface ModalProps {
  message: string;
  color?: string;
  onClose: () => void;
  onClone?: () => void;
}

export function ModalComponent({ message, color = "white", onClose, onClone }: ModalProps) {
  const textColor = readableColor(color);

  // Close on ESC key
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2 }}
        style={{
          background: "white",
          color: "#111",
          borderRadius: 12,
          padding: 24,
          width: "min(400px, 90vw)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p style={{ marginBottom: 16 }}>{message}</p>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          {onClone && (
            <button
              type="button"
              onClick={onClone}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #ccc",
                background: color,
                color: textColor,
                cursor: "pointer",
              }}
            >
              Clone
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: color,
              color: textColor,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
