"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Build, SpringApiResponse } from './types';
import { apiFetch, UnauthorizedError } from '@/app/lib/api';
import UnauthorizedAccess from './components/UnauthorizedAccess';

const getStatusColor = (status: Build['buildStatus']) => {
  switch (status) {
    case 'SUCCESS': return 'success';
    case 'FAILURE': return 'danger';
    case 'IN_PROGRESS': return 'warning';
    default: return 'secondary';
  }
};

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const fetchAndProcessBuilds = async () => {
      try {
        const data: SpringApiResponse = await apiFetch('/api/builds');
        let fetchedBuilds = data._embedded.builds;

        fetchedBuilds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const latestBuildsByBranch = new Map<string, Build>();
        for (const build of fetchedBuilds) {
          if (build.buildStatus === "SUCCESS" && !latestBuildsByBranch.has(build.branch)) {
            latestBuildsByBranch.set(build.branch, build);
          }
        }
        fetchedBuilds.forEach(build => {
          build.tags = [];
          if (build.isRelease) build.tags.push("Released");
          const latestForBranch = latestBuildsByBranch.get(build.branch);
          if (latestForBranch && latestForBranch.buildNumber === build.buildNumber) {
            build.tags.push("New");
          }
        });
        setBuilds(fetchedBuilds);
      } catch (err: any) {
        if (err instanceof UnauthorizedError) setIsUnauthorized(true);
        else setError(err.message || 'Failed to load builds.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndProcessBuilds();
    if (error || isUnauthorized) return;
    const intervalId = setInterval(fetchAndProcessBuilds, 10000);
    return () => clearInterval(intervalId);
  }, [error, isUnauthorized]);

  if (isUnauthorized) return <UnauthorizedAccess />;
  if (isLoading) return <div className="d-flex justify-content-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger text-center m-4">Error: {error}</div>;

  return (
    <main className="container py-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">🚀 Build Dashboard</h1>
        <p className="lead text-muted">Latest builds, auto-refreshing every 10 seconds.</p>
      </div>
      <div className="row g-4">
        {builds.map((build) => {
          const statusColor = getStatusColor(build.buildStatus);
          return (
            <div key={build.buildNumber} className="col-lg-4 col-md-6">
              <Link href={`/builds/${build.buildNumber}`} className="text-decoration-none">
                <div className={`card h-100 shadow-sm border-start border-3 border-${statusColor}`}>
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <span className="badge bg-secondary-subtle text-secondary-emphasis py-2 px-3">{build.branch}</span>
                    <span className="fw-bold fs-5">{`${build.majorVersion}.${build.minorVersion}.${build.patchVersion}`}</span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={`fw-bold text-uppercase text-${statusColor}`}>{build.buildStatus}</span>
                      <div>
                        {build.tags?.includes("Released") && <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis ms-2">Released</span>}
                        {build.tags?.includes("New") && <span className="badge rounded-pill bg-success-subtle text-success-emphasis ms-2">New</span>}
                      </div>
                    </div>
                    <p className="card-text text-muted small">Build #{build.buildNumber} &bull; {new Date(build.date).toLocaleString()}</p>
                  </div>
                  <div className="card-footer bg-light d-grid gap-2">
                    <div className="btn btn-primary">View Details</div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}