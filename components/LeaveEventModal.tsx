"use client";

import { Button, Modal } from "@/components/linkedin";

type LeaveEventModalProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function LeaveEventModal({
  open,
  loading = false,
  onClose,
  onConfirm,
}: LeaveEventModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Leave this event?">
      <div className="leave-event-modal">
        <p className="leave-event-modal__message">
          You will no longer be able to access the conversations in this event.
          Would you still like to leave this event?
        </p>
        <div className="leave-event-modal__footer">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm} disabled={loading}>
            Leave
          </Button>
        </div>
      </div>
    </Modal>
  );
}
