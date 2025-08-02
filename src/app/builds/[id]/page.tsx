"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Build, Change } from '@/app/types';
import { apiFetch, UnauthorizedError, ApiDownError } from '@/app/lib/api';
import UnauthorizedAccess from '@/app/components/UnauthorizedAccess';
import ApiDownErrorComponent from '@/app/components/ApiDownError';

export default function BuildDetailPage() {
    const { id } = useParams();
    const [build, setBuild] = useState<Build | null>(null);
    const [changes, setChanges] = useState<Change[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [isApiDown, setIsApiDown] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchBuildDetails = async () => {
            try {
                const buildData = await apiFetch<Build>(`/api/builds/${id}`);
                setBuild(buildData);

                if (buildData._links.changes.href) {
                    const changesData = await apiFetch(buildData._links.changes.href);
                    setChanges(changesData._embedded?.changes || []);
                }
            } catch (err) {
                if (err instanceof UnauthorizedError) {
                  setIsUnauthorized(true);
                } else if (err instanceof ApiDownError) {
                  setIsApiDown(true);
                } else {
                  setError((err as Error).message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchBuildDetails();
    }, [id]);

    if (isApiDown) return <ApiDownErrorComponent />;
    if (isUnauthorized) return <UnauthorizedAccess />;
    if (isLoading) return <div className="d-flex justify-content-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    if (error) return <div className="alert alert-danger text-center m-4" role="alert">Error: {error}</div>;
    if (!build) return <div className="alert alert-warning text-center m-4" role="alert">Build not found.</div>;

    return (
        <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="display-5 fw-bold">Build Details</h1>
                <Link href={`/approval/${id}`} className="btn btn-success btn-lg">Start Approval Process</Link>
            </div>
            
            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-0">Build #{build.buildNumber}</h2>
                        <span className="badge bg-primary fs-6">{`${build.majorVersion}.${build.minorVersion}.${build.patchVersion}`}</span>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Status:</strong> <span className={`text-${build.buildStatus === 'SUCCESS' ? 'success' : 'danger'}`}>{build.buildStatus}</span></p>
                            <p><strong>Branch:</strong> {build.branch}</p>
                            <p><strong>Date:</strong> {new Date(build.date).toLocaleString()}</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                             <Link href={build.githubActionLink} className="btn btn-secondary me-2 mb-2" target="_blank" rel="noopener noreferrer">View on GitHub</Link>
                             <Link href={build.sonatypeNexusLink} className="btn btn-info mb-2" target="_blank" rel="noopener noreferrer">View on Nexus</Link>
                        </div>
                    </div>

                    <hr />

                    <h3 className="mt-4">Changes</h3>
                    {changes.length > 0 ? (
                        <ul className="list-group">
                            {changes.map(change => (
                                <li key={change.hash} className="list-group-item">
                                    <p className="mb-1"><strong>{change.message}</strong></p>
                                    <small className="text-muted">by {change.author} - {change.hash}</small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No changes associated with this build.</p>
                    )}
                </div>
            </div>
        </main>
    );
}