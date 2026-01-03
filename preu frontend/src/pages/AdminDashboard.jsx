import React, { useState, useMemo } from "react";

// --- NEUMORPHISM COLOR PALETTE & CONSTANTS (Pale Sky Blue Theme) ---
const NEUMO_BG = "bg-blue-50"; 
const NEUMO_CARD_BG = "bg-blue-100"; 
const PRIMARY_ACCENT_TEXT = "text-blue-700"; 

// Neumorphic Shadows
const PRIMARY_SHADOW = "shadow-[6px_6px_12px_rgba(174,174,192,0.4),-6px_-6px_12px_rgba(255,255,255,1)]";
const PRESSED_SHADOW = "shadow-[inset_3px_3px_5px_rgba(174,174,192,0.4),inset_-3px_-3px_5px_rgba(255,255,255,1)]";
const INNER_SHADOW = "shadow-[inset_2px_2px_4px_rgba(174,174,192,0.4),inset_-2px_-2px_4px_rgba(255,255,255,1)]";

// --- MOCK DATA ---
const INITIAL_MOCK_REQUESTS = [
    {
        id: 1,
        type: 'COMMUNITY_CREATION',
        data: {
            communityName: "Ethical AI Principles Group",
            contentType: "Text Generation",
            motive: "Educational",
            proposal: "This community aims to foster discussion and documentation around responsible and ethical use of large language models. We will share best practices, guidelines, and conduct peer reviews of text generation outputs for bias.",
        },
        metadata: {
            requesterId: "user-A123",
            timestamp: new Date(Date.now() - 3600000),
        },
        status: 'PENDING',
    },
    {
        id: 2,
        type: 'COMMUNITY_POST',
        data: {
            prompt: "A detailed description of a solar-powered mech traversing a Martian canyon at sunset, cinematic lighting, 16k resolution, wide angle shot, photorealistic. The heat from the atmospheric entry is still visible on the horizon, casting long, sharp shadows.",
            tags: ["MidJourney", "Sci-Fi", "Visual", "Robotics"],
            imageUrl: "https://placehold.co/400x200/5C7699/FFFFFF?text=Mech+Placeholder",
        },
        metadata: {
            community: "ai_vision",
            authorId: "user-B456",
            timestamp: new Date(Date.now() - 172800000),
        },
        status: 'PENDING',
    },
    {
        id: 3,
        type: 'COMMUNITY_CREATION',
        data: {
            communityName: "Advanced Pytorch Hooks",
            contentType: "Code Generation",
            motive: "Commercial",
            proposal: "A space for developers to share complex PyTorch training scripts, custom hooks, and discuss deployment strategies for large-scale ML models in production environments.",
        },
        metadata: {
            requesterId: "user-C789",
            timestamp: new Date(Date.now() - 86400000),
        },
        status: 'PENDING',
    },
    {
        id: 4,
        type: 'COMMUNITY_POST',
        data: {
            prompt: "Write a complete, runnable TypeScript component for a responsive navigation bar using Tailwind CSS that includes a dark mode toggle button. Must be clean and efficient.",
            tags: ["React", "TypeScript", "Code", "WebDev"],
            imageUrl: "", // No image
        },
        metadata: {
            community: "code_gen",
            authorId: "user-D012",
            timestamp: new Date(Date.now() - 1200000),
        },
        status: 'PENDING',
    },
];

// --- CORE UI COMPONENTS (Stripped of animations/excessive icons) ---

const Button = ({ children, className = "", variant = "default", ...props }) => {
    const baseStyle = "font-semibold rounded-xl transition-all duration-200 px-4 py-2 flex items-center justify-center text-sm";
    
    let variantStyle = "";
    switch (variant) {
        case "accept":
            variantStyle = "bg-green-500 text-white shadow-lg hover:bg-green-600 active:shadow-none";
            break;
        case "reject":
            variantStyle = "bg-red-500 text-white shadow-lg hover:bg-red-600 active:shadow-none";
            break;
        case "view":
            variantStyle = `bg-blue-300 text-blue-800 ${PRIMARY_SHADOW} hover:bg-blue-400 active:${PRESSED_SHADOW}`;
            break;
        case "neumo":
        default:
            variantStyle = `${NEUMO_CARD_BG} ${PRIMARY_ACCENT_TEXT} ${PRIMARY_SHADOW} hover:scale-[1.01] active:${PRESSED_SHADOW}`;
            break;
    }

    return (
        <button 
            className={`${baseStyle} ${variantStyle} ${className}`} 
            {...props}
        >
            {children}
        </button>
    );
};

const Card = ({ children, className = "", ...props }) => (
    <div 
        className={`rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW} ${className}`} 
        {...props}
    >
        {children}
    </div>
);

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-blue-50/70" onClick={onClose}>
            <div 
                className={`rounded-3xl ${NEUMO_CARD_BG} ${PRIMARY_SHADOW} p-6 w-full max-w-lg mx-4`}
                onClick={e => e.stopPropagation()} // Prevents closing when clicking inside
            >
                <div className="flex justify-between items-center mb-4 border-b border-blue-200 pb-3">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <Button onClick={onClose} variant="view" className="p-2 w-8 h-8 rounded-full">
                        X
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
};

// --- DIFFUSION EFFECT COMPONENT ---

const PromptDisplay = ({ prompt }) => {
    // Determine the split point (e.g., first 70 characters)
    const splitIndex = 70;
    const visiblePart = prompt.substring(0, splitIndex);
    const hiddenPart = prompt.substring(splitIndex);

    return (
        <div className={`relative p-3 rounded-xl text-sm bg-blue-50 ${INNER_SHADOW} text-gray-700 font-mono`}>
            {/* Visible Text */}
            <span className="text-gray-800 font-normal">{visiblePart}</span>
            
            {/* Diffusing/Fading Effect */}
            <span className="relative">
                {hiddenPart}
                {/* Overlay to create the diffusion effect */}
                <div 
                    className="absolute inset-y-0 left-0 w-8 bg-gradient-to-l from-blue-50 to-transparent"
                    style={{ marginLeft: '-8px' }} // Overlap slightly
                ></div>
            </span>
            
            {/* Ellipsis for clarity */}
            <span className="text-gray-500 font-bold">...</span>
        </div>
    );
};

// --- REQUEST ITEM COMPONENT ---

const RequestItem = ({ request, onAction, onView }) => {
    // Type Labeling
    const isCommunityCreation = request.type === 'COMMUNITY_CREATION';
    const typeLabel = isCommunityCreation ? 'New Community' : 'New Post';
    const typeColor = isCommunityCreation ? 'bg-cyan-200 text-cyan-800' : 'bg-lime-200 text-lime-800';

    return (
        <Card className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            {/* Left Section: Details */}
            <div className="flex-grow w-full sm:w-auto">
                {/* Request Type Badge */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColor} mb-2 inline-block`}>
                    {typeLabel}
                </span>

                {/* Content Display */}
                {isCommunityCreation ? (
                    // Community Creation: Only Name
                    <h4 className="text-lg font-bold text-gray-800">{request.data.communityName}</h4>
                ) : (
                    // Community Post: Diffused Prompt
                    <div className="mt-1">
                        <PromptDisplay prompt={request.data.prompt} />
                    </div>
                )}
            </div>

            {/* Right Section: Actions */}
            <div className="flex space-x-2 w-full sm:w-auto justify-end sm:justify-start">
                <Button variant="view" onClick={() => onView(request)} className="px-3">View</Button>
                <Button variant="accept" onClick={() => onAction(request.id, 'ACCEPTED')}>Accept</Button>
                <Button variant="reject" onClick={() => onAction(request.id, 'REJECTED')}>Reject</Button>
            </div>
        </Card>
    );
};

// --- MAIN DASHBOARD COMPONENT ---

const AdminDashboard = () => {
    const [requests, setRequests] = useState(INITIAL_MOCK_REQUESTS);
    const [filter, setFilter] = useState('ALL'); // ALL, COMMUNITY_CREATION, COMMUNITY_POST
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Filtered requests list
    const filteredRequests = useMemo(() => {
        return requests.filter(req => req.status === 'PENDING' && (filter === 'ALL' || req.type === filter));
    }, [requests, filter]);

    // Action handler (Accept/Reject)
    const handleAction = (id, status) => {
        setRequests(prev => prev.map(req => 
            req.id === id ? { ...req, status: status } : req
        ));
        // Simple Console feedback
        const req = requests.find(r => r.id === id);
        console.log(`${req.type} request (ID: ${id}) has been ${status}.`);
    };

    // View Modal handler
    const handleView = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    // Renders the full details within the modal
    const renderModalContent = () => {
        if (!selectedRequest) return null;

        const req = selectedRequest;
        const isCC = req.type === 'COMMUNITY_CREATION';

        return (
            <div className="space-y-4 text-gray-700">
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Request Type:</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isCC ? 'bg-cyan-200 text-cyan-800' : 'bg-lime-200 text-lime-800'}`}>
                        {isCC ? 'Community Creation' : 'Community Post'}
                    </span>
                </div>
                
                {/* Common Metadata */}
                <div className="p-3 rounded-xl bg-blue-50 text-xs font-mono">
                    <p>ID: {req.id}</p>
                    <p>Requester/Author ID: {req.metadata.requesterId || req.metadata.authorId}</p>
                    <p>Submitted: {req.metadata.timestamp.toLocaleString()}</p>
                    {req.metadata.community && <p>Target Community: {req.metadata.community}</p>}
                </div>

                {/* Request Specific Data */}
                {isCC ? (
                    <div className="space-y-3">
                        <h4 className="font-bold text-gray-800">Community Details:</h4>
                        <p><span className="font-semibold">Name:</span> {req.data.communityName}</p>
                        <p><span className="font-semibold">Content Type:</span> {req.data.contentType}</p>
                        <p><span className="font-semibold">Motive:</span> {req.data.motive}</p>
                        <p className={`p-3 rounded-xl text-sm bg-blue-50 ${INNER_SHADOW}`}><span className="font-semibold block">Proposal (50 words max):</span> {req.data.proposal}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <h4 className="font-bold text-gray-800">Post Details:</h4>
                        <p className={`p-3 rounded-xl text-sm bg-blue-50 ${INNER_SHADOW}`}><span className="font-semibold block">Prompt:</span> {req.data.prompt}</p>
                        <p><span className="font-semibold">Tags:</span> {req.data.tags.join(', ')}</p>
                        {req.data.imageUrl && (
                            <div>
                                <p className="font-semibold mb-2">Image Preview:</p>
                                <img 
                                    src={req.data.imageUrl} 
                                    alt="Prompt visual reference" 
                                    className="w-full rounded-xl object-cover border border-blue-200"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x150/EEEEEE/666666?text=Image+Load+Error" }}
                                />
                            </div>
                        )}
                    </div>
                )}
                
                <div className="pt-4 flex justify-between space-x-3 border-t border-blue-200">
                    <Button variant="reject" onClick={() => { handleAction(req.id, 'REJECTED'); setIsModalOpen(false); }} className="flex-grow">Reject</Button>
                    <Button variant="accept" onClick={() => { handleAction(req.id, 'ACCEPTED'); setIsModalOpen(false); }} className="flex-grow">Accept</Button>
                </div>
            </div>
        );
    };

    return (
        <div className={`${NEUMO_BG} text-gray-800 min-h-screen font-sans p-4 md:p-10`}>
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <header className="pb-4 border-b border-blue-200">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                        Admin Verification Dashboard
                    </h1>
                    <p className="text-gray-600">Reviewing {requests.filter(r => r.status === 'PENDING').length} pending requests.</p>
                </header>

                {/* Controls: Filtering */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <h2 className="text-xl font-bold text-gray-800">Pending Submissions</h2>
                    
                    <div className="flex space-x-3">
                        <Button 
                            variant={filter === 'ALL' ? 'default' : 'neumo'} 
                            onClick={() => setFilter('ALL')}
                            className={filter === 'ALL' ? 'bg-cyan-500 text-white' : ''}
                        >
                            All ({requests.filter(r => r.status === 'PENDING').length})
                        </Button>
                        <Button 
                            variant={filter === 'COMMUNITY_CREATION' ? 'default' : 'neumo'} 
                            onClick={() => setFilter('COMMUNITY_CREATION')}
                            className={filter === 'COMMUNITY_CREATION' ? 'bg-cyan-500 text-white' : ''}
                        >
                            Community Creation
                        </Button>
                        <Button 
                            variant={filter === 'COMMUNITY_POST' ? 'default' : 'neumo'} 
                            onClick={() => setFilter('COMMUNITY_POST')}
                            className={filter === 'COMMUNITY_POST' ? 'bg-cyan-500 text-white' : ''}
                        >
                            Community Post
                        </Button>
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(req => (
                            <RequestItem 
                                key={req.id} 
                                request={req} 
                                onAction={handleAction} 
                                onView={handleView}
                            />
                        ))
                    ) : (
                        <Card className="p-8 text-center text-gray-500">
                            <p className="text-lg font-semibold">No pending requests found for this filter.</p>
                            <p className="text-sm mt-1">Great job, Admin!</p>
                        </Card>
                    )}
                </div>

                {/* History (Processed Requests) - Optional but useful for completeness */}
                {requests.some(r => r.status !== 'PENDING') && (
                    <div className="pt-8 border-t border-blue-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Processed History</h2>
                        <div className="space-y-3 opacity-60">
                            {requests.filter(r => r.status !== 'PENDING').map(req => (
                                <div key={req.id} className="text-sm p-3 rounded-xl bg-blue-100 flex justify-between items-center shadow-inner">
                                    <span>
                                        #{req.id} - {req.type === 'COMMUNITY_CREATION' ? req.data.communityName : 'Post by ' + req.metadata.authorId}
                                    </span>
                                    <span className={`font-bold ${req.status === 'ACCEPTED' ? 'text-green-600' : 'text-red-600'}`}>
                                        {req.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* View Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Request Details"
            >
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default AdminDashboard;