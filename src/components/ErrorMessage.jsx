function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <h2>Oops!</h2>

      <p>{message}</p>

      <button onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default ErrorMessage;