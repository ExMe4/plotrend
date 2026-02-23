"use client";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

export default function TooltipPortal({
  children,
  targetRef,
}: {
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLElement | null>;
}) {
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + rect.width / 2 + window.scrollX });
    }
  }, []);

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
        position: "absolute",
        zIndex: 50,
      }}
    >
      {children}
    </div>,
    document.body
  );
}