"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Build, SpringApiResponse } from './types';
import { apiFetch, UnauthorizedError, ApiDownError } from '@/app/lib/api';
import UnauthorizedAccess from '@/app/components/UnauthorizedAccess';
import ApiDownErrorComponent from '@/app/components/ApiDownError';

// Utility function to determine the color based on build status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'SUCCESS': return 'success';
    case 'FAILURE': return 'danger';
    case 'IN_PROGRESS': return 'warning';
    default: return 'secondary';
  }
};

// Utility function to determine the color based on branch name
const getBranchColor = (branch: string) => {
  switch (branch) {
    case 'main': return 'bg-primary';
    case 'development': return 'bg-info';
    case 'feature/new-login': return 'bg-success';
    default: return 'bg-secondary';
  }
};

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isApiDown, setIsApiDown] = useState(false);
  const [allBranches, setAllBranches] = useState<string[]>(['all']);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedBuilds, setSelectedBuilds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [buildsPerPage] = useState(9);
  const router = useRouter();

  // Reset to the first page whenever the branch filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBranch]);

  // Fetch builds when page or filter changes
  useEffect(() => {
    const fetchBuilds = async () => {
      setIsLoading(true);
      try {
        // Adjust page number for 0-indexed API
        const page = currentPage - 1;
        let url = '';

        if (selectedBranch === 'all') {
          url = `/api/builds?sort=date,desc&page=${page}&size=${buildsPerPage}`;
        } else {
          // Use the search endpoint for filtering by branch
          url = `/api/builds/search/findByBranch?branch=${encodeURIComponent(selectedBranch)}&sort=date,desc&page=${page}&size=${buildsPerPage}`;
        }
        
        const response: SpringApiResponse = await apiFetch(url);
        const buildsData = response._embedded?.builds || [];
        setBuilds(buildsData);
        setTotalPages(response.page?.totalPages || 0);

      } catch (err) {
        if (err instanceof UnauthorizedError) {
          setIsUnauthorized(true);
        } else if (err instanceof ApiDownError) {
          setIsApiDown(true);
        } else {
          setError((err as Error).message);
          setBuilds([]);
          setTotalPages(0);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuilds();
    // Set up an interval to refetch the current page data
    const interval = setInterval(fetchBuilds, 30 * 1000);
    return () => clearInterval(interval);
  }, [currentPage, selectedBranch, buildsPerPage]);
  
  // Effect for fetching all unique branch names for the filter dropdown
  useEffect(() => {
      const fetchAllBranches = async () => {
          try {
              // Fetch a large page to get a representative list of branches
              const response: SpringApiResponse = await apiFetch('/api/builds?size=200');
              const buildsData = response._embedded?.builds || [];
              const uniqueBranches = ['all', ...Array.from(new Set(buildsData.map(b => b.branch)))];
              setAllBranches(uniqueBranches);
          } catch (err) {
              // Handle errors if necessary, but we can proceed with a default list
              console.error("Failed to fetch branches:", err);
          }
      };
      fetchAllBranches();
  }, []);


  const handleSelectBuild = (buildId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedBuilds);
    if (isSelected) {
      if (newSelection.size < 2) {
        newSelection.add(buildId);
      }
    } else {
      newSelection.delete(buildId);
    }
    setSelectedBuilds(newSelection);
  };

  const handleCompare = () => {
    if (selectedBuilds.size === 2) {
      const [build1, build2] = Array.from(selectedBuilds);
      router.push(`/compare?build1=${build1}&build2=${build2}`);
    }
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  const PageContent = () => {
    if (isLoading) {
      return <div className="d-flex justify-content-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }
    if (error) {
      return <div className="alert alert-danger text-center m-4">Error: {error}</div>;
    }
    if (builds.length === 0) {
        return <div className="alert alert-info text-center m-4">No builds found.</div>;
    }

    return (
        <div className="row g-4">
        {builds.map((build) => {
          const statusColor = getStatusColor(build.buildStatus);
          const branchColorClass = getBranchColor(build.branch);
          const buildId = build._links.self.href.split('/').pop()!;
          const isSelected = selectedBuilds.has(buildId);

          return (
            <div key={build.buildNumber} className="col-lg-4 col-md-6">
              <div className={`card h-100 shadow-sm border-start border-3 border-${statusColor}`}>
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <span className={`badge ${branchColorClass} py-2 px-3`}>{build.branch}</span>
                  <span className="fw-bold fs-5">{`${build.majorVersion}.${build.minorVersion}.${build.patchVersion}`}</span>
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className={`fw-bold text-uppercase text-${statusColor}`}>{build.buildStatus}</span>
                    <div>
                      {build.isRelease && <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis ms-2">Released</span>}
                      {build.approved && <span className="badge rounded-pill bg-success-subtle text-success-emphasis ms-2">Approved</span>}
                    </div>
                  </div>
                  <p className="card-text text-muted small">Build #{build.buildNumber} &bull; {new Date(build.date).toLocaleString()}</p>
                </div>
                <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <Link href={`/builds/${buildId}`} className="btn btn-primary btn-sm">View Details</Link>
                    {build.installLink && (
                        <a href={build.installLink} className="btn btn-success btn-sm ms-2" target="_blank" rel="noopener noreferrer">
                            Install
                        </a>
                    )}
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`compare-${buildId}`}
                      checked={isSelected}
                      onChange={(e) => handleSelectBuild(buildId, e.target.checked)}
                      disabled={!isSelected && selectedBuilds.size >= 2}
                    />
                    <label className="form-check-label" htmlFor={`compare-${buildId}`}>Compare</label>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (isApiDown) return <ApiDownErrorComponent />;
  if (isUnauthorized) return <UnauthorizedAccess />;

  return (
    <main className="container py-4">
      <div className="text-center mb-4">
        <h1 className="display-4 fw-bold">🚀 Build Dashboard</h1>
        <p className="lead text-muted">Latest builds, auto-refreshing every 30 seconds.</p>
      </div>
      <div className="row justify-content-center mb-4 align-items-center">
        <div className="col-md-4">
          <select className="form-select" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} aria-label="Filter by branch">
            {allBranches.map(branch => (<option key={branch} value={branch}>{branch === 'all' ? 'All Branches' : branch}</option>))}
          </select>
        </div>
        <div className="col-md-4 text-center">
          <button className="btn btn-success" onClick={handleCompare} disabled={selectedBuilds.size !== 2}>
            Compare Selected ({selectedBuilds.size}/2)
          </button>
        </div>
      </div>
      
      <PageContent />

      {totalPages > 1 && (
        <nav aria-label="Builds pagination" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>&laquo;</button>
            </li>
            {[...Array(totalPages).keys()].map(number => (
              <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(number + 1)} className="page-link">
                  {number + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>&raquo;</button>
            </li>
          </ul>
        </nav>
      )}
    </main>
  );
}