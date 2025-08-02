"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Build, Change, SpringApiResponse } from '@/app/types';
import { apiFetch, ApiDownError } from '@/app/lib/api';
import { FaHashtag, FaCodeBranch, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

async function getBuildData(id: string): Promise<{ build: Build, changes: Change[] }> {
    const buildRes = await apiFetch(`/api/builds/${id}`);
    const build: Build = buildRes;

    if (!build._links.changes || !build._links.changes.href) {
        return { build, changes: [] };
    }

    const changesRes = await apiFetch(build._links.changes.href.replace(/.*\/api/, '/api'));
    const changes: Change[] = changesRes._embedded?.changes || [];

    return { build, changes };
}

function BuildColumn({ build, changes, title }: { build: Build, changes: Change[], title: string }) {
    const isSuccess = build.buildStatus === 'SUCCESS';
    return (
        <div className="col-md-6">
            <div className="card shadow-sm">
                <div className="card-header">
                    <h3 className="mb-0">{title}</h3>
                </div>
                <div className="card-body">
                    <h4 className="card-title">Version {`${build.majorVersion}.${build.minorVersion}.${build.patchVersion}`}</h4>
                    <div className={`d-flex align-items-center fs-5 mb-2 ${isSuccess ? 'text-success' : 'text-danger'}`}>
                        {isSuccess ? <FaCheckCircle className="me-2" /> : <FaExclamationCircle className="me-2" />}
                        {build.buildStatus}
                    </div>
                    <p className="text-muted"><FaCodeBranch className="me-2" />Branch: {build.branch}</p>
                    <p className="text-muted"><FaCalendarAlt className="me-2" />{new Date(build.date).toLocaleString()}</p>
                </div>
                <div className="card-header"><h5 className="mb-0">Unique Changes ({changes.length})</h5></div>
                <ul className="list-group list-group-flush">
                    {changes.length > 0 ? (
                        changes.map(change => (
                            <li key={change.hash} className="list-group-item">
                                <p className="mb-0 fw-bold">{change.message}</p>
                                <small className="text-muted">by {change.author} &bull; {change.hash.substring(0, 7)}</small>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item">No unique changes.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default function ComparePage() {
    const searchParams = useSearchParams();
    const [build1, setBuild1] = useState<{ build: Build, changes: Change[] } | null>(null);
    const [build2, setBuild2] = useState<{ build: Build, changes: Change[] } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const build1Id = searchParams.get('build1');
        const build2Id = searchParams.get('build2');

        if (build1Id && build2Id) {
            Promise.all([getBuildData(build1Id), getBuildData(build2Id)])
                .then(([data1, data2]) => {
                    setBuild1(data1);
                    setBuild2(data2);
                })
                .catch(err => {
                    setError(err.message || 'Failed to fetch build data.');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [searchParams]);
    
    if (isLoading) return <div className="d-flex justify-content-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    if (error) return <div className="alert alert-danger text-center m-4">Error: {error}</div>;
    if (!build1 || !build2) return <div className="alert alert-warning text-center m-4">Could not load build data.</div>;

    const changes1Hashes = new Set(build1.changes.map(c => c.hash));
    const changes2Hashes = new Set(build2.changes.map(c => c.hash));

    const uniqueTo1 = build1.changes.filter(c => !changes2Hashes.has(c.hash));
    const uniqueTo2 = build2.changes.filter(c => !changes1Hashes.has(c.hash));

    return (
        <main className="container py-5">
            <div className="text-center mb-4">
                <h1 className="display-5 fw-bold">Build Comparison</h1>
                <p className="lead text-muted">Showing the differences in changes between two builds.</p>
            </div>
            <div className="row g-4">
                <BuildColumn build={build1.build} changes={uniqueTo1} title="Build 1" />
                <BuildColumn build={build2.build} changes={uniqueTo2} title="Build 2" />
            </div>
        </main>
    );
}