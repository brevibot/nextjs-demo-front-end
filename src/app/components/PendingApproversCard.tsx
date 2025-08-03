import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserClock } from 'react-icons/fa';

interface PendingApproversCardProps {
    stage: 'deployer' | 'teamLead' | 'qa' | 'manager' | 'approved' | 'canceled';
}

const approverMap = {
    deployer: ['Deployer Team'],
    teamLead: ['Team Leaders'],
    qa: ['QA Team'],
    manager: ['Management'],
    approved: [],
    canceled: []
};


export default function PendingApproversCard({ stage }: PendingApproversCardProps) {
    // Add a fallback to an empty array to prevent crashes
    const approvers = approverMap[stage] || [];

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-header fs-5 fw-bold">Pending Approvals</div>
            <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                    {approvers.length > 0 ? (
                        approvers.map((approver, index) => (
                            <li key={index} className="list-group-item d-flex align-items-center">
                                <FaUserClock className="me-3 text-muted" />
                                <span>{approver}</span>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item">None for this stage.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}