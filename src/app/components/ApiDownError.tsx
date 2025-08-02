"use client";

export default function ApiDownError() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="container d-flex align-items-center justify-content-center" style={{ height: '80vh' }}>
      <div className="text-center">
        <h1 className="display-4 fw-bold text-danger">Connection Lost</h1>
        <p className="fs-4">
          We couldn't connect to the server.
        </p>
        <p className="lead">
          The backend API might be down or experiencing issues. Please try again in a few moments.
        </p>
        <button className="btn btn-primary" onClick={handleRetry}>
          Retry Connection
        </button>
      </div>
    </main>
  );
}
