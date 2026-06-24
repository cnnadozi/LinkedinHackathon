"use client";

import type { ReactNode } from "react";
import Button from "./Button";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="li-modal-backdrop"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="li-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="li-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="li-modal-header">
          <h2 id="li-modal-title" className="li-modal-title">
            {title}
          </h2>
          <button
            type="button"
            className="li-modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="li-modal-body">{children}</div>
      </div>
    </div>
  );
}

export { Button as ModalButton };
