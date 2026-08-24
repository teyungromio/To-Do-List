export default function Alert({ message, type = "error", onClose }) {
  if (!message) return null;

  return (
    <div className={`alert ${type}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
}
