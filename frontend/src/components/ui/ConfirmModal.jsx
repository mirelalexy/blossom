import Modal from "./Modal"
import Button from "./Button"

function ConfirmModal({ title = "Are you sure?", message, confirmLabel = "Continue", cancelLabel = "Cancel", variant = "default", onConfirm, onCancel }) {
    return (
        <Modal title={title} variant={variant} onClose={onCancel} actions={
            <>
                <Button onClick={onConfirm}>{confirmLabel}</Button>
                <Button onClick={onCancel}>{cancelLabel}</Button>
            </>
        }>
            {message && (
                <p style={{ whiteSpace: "pre-line" }}>{message}</p>
            )}
        </Modal>
    )
}

export default ConfirmModal