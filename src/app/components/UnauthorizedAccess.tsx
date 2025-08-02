"use client";

export default function UnauthorizedAccess() {
  return (
    <main className="container d-flex align-items-center justify-content-center" style={{ height: '80vh' }}>
      <div className="text-center">
        <h1 className="display-1 fw-bold">401</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> You are not authorized.
        </p>
        <p className="lead">
          You do not have permission to view this page. Please log in to continue.
        </p>
        <a href="#" className="btn btn-primary">
          Login
        </a>
      </div>
    </main>
  );
}