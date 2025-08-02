"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Build, SpringApiResponse } from './types';
import { apiFetch, UnauthorizedError, ApiDownError } from '@/app/lib/api';
import UnauthorizedAccess from '@/app/components/UnauthorizedAccess';
import ApiDownErrorComponent from '@/app/components/ApiDownError';

const getStatusColor = (status: Build['buildStatus']) => {
  switch (status) {
    case 'SUCCESS': return 'success';
    case 'FAILURE': return 'danger';
    case 'IN_PROGRESS': return 'warning';
    default: return 'secondary';
  }
};

const branchColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
const getBranchColor = (branchName: string) => {
    let hash = 0;
    for (let i = 0; i < branchName.length; i++) {
        hash = branchName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % branchColors.length);
    return `bg-${branchColors[index]}-subtle text-${branchColors[index]}-emphasis`;
};

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isApiDown, setIsApiDown] = useState(false);
  const [allBranches, setAllBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  useEffect(() => {
    const fetchAndProcessBuilds = async () => {
      try {
        const data: SpringApiResponse = await apiFetch('/api/builds');
        let fetchedBuilds = data._embedded.builds;

        fetchedBuilds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latestBuildsByBranch = new Map<string, Build>();
        const uniqueBranches = new Set<string>();
        for (const build of fetchedBuilds) {
          uniqueBranches.add(build.branch);
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
        setAllBranches(['all', ...Array.from(uniqueBranches).sort()]);
        setIsApiDown(false);
      } catch (err: any) {
        if (err instanceof ApiDownError) setIsApiDown(true);
        else if (err instanceof UnauthorizedError) setIsUnauthorized(true);
        else setError(err.message || 'Failed to load builds.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndProcessBuilds();
    if (error || isUnauthorized || isApiDown) return;
    const intervalId = setInterval(fetchAndProcessBuilds, 10000);
    return () => clearInterval(intervalId);
  }, [error, isUnauthorized, isApiDown]);

  const filteredBuilds = useMemo(() => {
    if (selectedBranch === 'all') return builds;
    return builds.filter(build => build.branch === selectedBranch);
  }, [builds, selectedBranch]);

  if (isApiDown) return <ApiDownErrorComponent />;
  if (isUnauthorized) return <UnauthorizedAccess />;
  if (isLoading) return <div className="d-flex justify-content-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger text-center m-4">Error: {error}</div>;

  return (
    <main className="container py-4">
      <div className="text-center mb-4">
        <h1 className="display-4 fw-bold">🚀 Build Dashboard</h1>
        <p className="lead text-muted">Latest builds, auto-refreshing every 10 seconds.</p>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-md-4">
            <select className="form-select" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} aria-label="Filter by branch">
                {allBranches.map(branch => (<option key={branch} value={branch}>{branch === 'all' ? 'All Branches' : branch}</option>))}
            </select>
        </div>
      </div>
      <div className="row g-4">
        {filteredBuilds.map((build) => {
          const statusColor = getStatusColor(build.buildStatus);
          const branchColorClass = getBranchColor(build.branch);
          const buildId = build._links.self.href.split('/').pop();
          return (
            <div key={build.buildNumber} className="col-lg-4 col-md-6">
              <Link href={`/builds/${buildId}`} className="text-decoration-none">
                <div className={`card h-100 shadow-sm border-start border-3 border-${statusColor}`}>
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <span className={`badge ${branchColorClass} py-2 px-3`}>{build.branch}</span>
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