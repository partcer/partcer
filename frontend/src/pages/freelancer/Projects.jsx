import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    MessageCircle,
    DollarSign,
    MapPin,
    Calendar,
    Star,
    Users,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    MoreVertical,
    ThumbsUp,
    ThumbsDown,
    FileText,
    Download,
    Send,
    Ban,
    Edit,
    Trash2,
    Award,
    TrendingUp,
    Bookmark,
    Share2,
    HelpCircle
} from "lucide-react";
import { FreelancerSidebar, FreelancerHeader, FreelancerContainer, StartChatButton } from '../../components';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { dummyUserImg } from '../../assets';
import { useAuth } from '../../contexts/AuthContext';

const Projects = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalApplications, setTotalApplications] = useState(0);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawReason, setWithdrawReason] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        shortlisted: 0,
        hired: 0,
        rejected: 0,
        withdrawn: 0,
        interviewRate: 0,
        successRate: 0
    });

    const navigate = useNavigate();
    const { user } = useAuth();

    // Fetch applications on mount, tab change, page change
    useEffect(() => {
        fetchApplications();
    }, [currentPage, dateRange]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== undefined) {
                setCurrentPage(1);
                fetchApplications();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            // Build query params
            const params = new URLSearchParams();

            // Status filter - if tab is not 'all', use it as status filter
            if (activeTab !== 'all') {
                params.append('status', activeTab);
            } else if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            params.append('page', currentPage);
            params.append('limit', itemsPerPage);

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            if (dateRange !== 'all') {
                const date = new Date();
                date.setDate(date.getDate() - parseInt(dateRange));
                params.append('fromDate', date.toISOString());
            }

            const response = await axiosInstance.get(`/api/v1/projects/applications/me?${params.toString()}`);

            if (response.data.success) {
                const { applications: fetchedApplications, stats: fetchedStats, pagination } = response.data.data;

                setApplications(fetchedApplications || []);

                // Calculate stats from fetched stats or from applications
                if (fetchedStats) {
                    setStats(fetchedStats);
                } else {
                    calculateStats(fetchedApplications);
                }

                if (pagination) {
                    setTotalPages(pagination.pages);
                    setTotalApplications(pagination.total);
                }
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (apps) => {
        const stats = {
            total: apps.length,
            pending: apps.filter(a => a.status === 'pending').length,
            shortlisted: apps.filter(a => a.status === 'shortlisted').length,
            hired: apps.filter(a => a.status === 'hired').length,
            rejected: apps.filter(a => a.status === 'rejected').length,
            withdrawn: apps.filter(a => a.status === 'withdrawn').length,
            interviewRate: 0,
            successRate: 0
        };

        stats.interviewRate = stats.total > 0 ? ((stats.shortlisted + stats.hired) / stats.total * 100).toFixed(1) : 0;
        stats.successRate = stats.total > 0 ? (stats.hired / stats.total * 100).toFixed(1) : 0;

        setStats(stats);
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);
        // fetchApplications();
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRefresh = () => {
        fetchApplications();
        toast.success('Applications refreshed');
    };

    const handleWithdrawApplication = async () => {
        if (!selectedApplication) return;

        try {
            await axiosInstance.patch(`/api/v1/projects/${selectedApplication.projectId}/applications/${selectedApplication._id}/withdraw`, {
                reason: withdrawReason
            });

            toast.success('Application withdrawn successfully');
            setShowWithdrawModal(false);
            setSelectedApplication(null);
            setWithdrawReason('');

            // Refresh applications
            fetchApplications();
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Failed to withdraw application';
            toast.error(errorMessage);
        }
    };

    const handleMessageClient = (clientId, projectId) => {
        navigate(`/${user?.userType}/chat?user=${clientId}`);
    };

    const handleViewProject = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    const handleViewFreelancerProfile = (freelancerId) => {
        navigate(`/freelancer/profile/${freelancerId}`);
    };

    const tabs = [
        { id: 'all', label: 'All Applications', count: stats.total, icon: Briefcase },
        { id: 'pending', label: 'Pending', count: stats.pending, icon: Clock },
        { id: 'shortlisted', label: 'Shortlisted', count: stats.shortlisted, icon: ThumbsUp },
        { id: 'hired', label: 'Hired', count: stats.hired, icon: CheckCircle },
        { id: 'rejected', label: 'Rejected', count: stats.rejected, icon: XCircle },
        { id: 'withdrawn', label: 'Withdrawn', count: stats.withdrawn, icon: Ban }
    ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: Clock },
            shortlisted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Shortlisted', icon: ThumbsUp },
            hired: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hired', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: XCircle },
            withdrawn: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Withdrawn', icon: Ban }
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon size={12} />
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Client-side filtering only
    const filteredApplications = applications.filter(app => {
        // Filter by tab
        if (activeTab !== 'all' && app.applicantStatus !== activeTab) return false;

        // Filter by search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matches =
                app.projectTitle?.toLowerCase().includes(term) ||
                app.client?.name?.toLowerCase().includes(term) ||
                app.projectSkills?.some(skill => skill.toLowerCase().includes(term));
            if (!matches) return false;
        }

        // Filter by status dropdown
        if (statusFilter !== 'all' && app.applicantStatus !== statusFilter) return false;

        // Filter by date range
        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const appDate = new Date(app.appliedDate);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            if (appDate < cutoff) return false;
        }

        return true;
    });

    // Use filteredApplications for display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
    const calculatedTotalPages  = Math.ceil(filteredApplications.length / itemsPerPage);

    if (loading && applications.length === 0) {
        return (
            <section className="flex min-h-screen bg-gray-50">
                <FreelancerSidebar />
                <div className="w-full relative">
                    <FreelancerHeader />
                    <FreelancerContainer>
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    </FreelancerContainer>
                </div>
            </section>
        );
    }

    return (
        <section className="flex min-h-screen bg-gray-50">
            <FreelancerSidebar />
            <div className="w-full relative">
                <FreelancerHeader />
                <FreelancerContainer>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-20 md:mt-0">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Applications</h1>
                            <p className="text-gray-600 mt-1">Track and manage your project applications</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                            <button
                                onClick={handleRefresh}
                                className="p-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={18} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <Link
                                to="/projects"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                            >
                                <Briefcase size={18} />
                                Browse Projects
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Briefcase size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Applied</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <ThumbsUp size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Shortlisted</p>
                                    <p className="text-2xl font-bold">{stats.shortlisted}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <CheckCircle size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Hired</p>
                                    <p className="text-2xl font-bold">{stats.hired}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <TrendingUp size={20} className="text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Success Rate</p>
                                    <p className="text-2xl font-bold">{stats.successRate}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6 overflow-x-auto pb-2">
                        <div className="flex gap-2 min-w-max">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {tab.label} ({tab.count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by project title, client, or skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[140px]"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="hired">Hired</option>
                                <option value="rejected">Rejected</option>
                                <option value="withdrawn">Withdrawn</option>
                            </select>
                            <select
                                value={dateRange}
                                onChange={(e) => {
                                    setDateRange(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[140px]"
                            >
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                                <option value="365">Last year</option>
                                <option value="all">All time</option>
                            </select>
                        </div>
                    </div>

                    {/* Applications List - Desktop */}
                    <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentApplications.length > 0 ? (
                                        currentApplications.map((app) => (
                                            <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900 mb-1">
                                                            {app.projectTitle || app.project?.title}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(app.skills || app.project?.skills || []).slice(0, 3).map((skill, idx) => (
                                                                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                                    {typeof skill === 'string' ? skill : skill.name}
                                                                </span>
                                                            ))}
                                                            {(app.skills || app.project?.skills || []).length > 3 && (
                                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                                    +{(app.skills || app.project?.skills || []).length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={app.client?.avatar || app.client?.profileImage || 'https://via.placeholder.com/32'}
                                                            alt={app.client?.name || app.client?.displayName}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-gray-900 flex items-center gap-1">
                                                                {app.client?.name || app.client?.displayName}
                                                                {app.client?.isVerified && (
                                                                    <span className="text-blue-500 text-xs">✓</span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500">{app.client?.company || ''}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{formatDate(app.appliedDate)}</div>
                                                    {app.unreadMessages > 0 && (
                                                        <div className="text-xs text-green-600 mt-1">
                                                            {app.unreadMessages} new message{app.unreadMessages > 1 ? 's' : ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{formatCurrency(app.proposedBudget)}</div>
                                                    <div className="text-xs text-gray-500">{app.proposedTimeline || app.project?.duration}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(app.applicantStatus)}
                                                    {app.applicantStatus === 'shortlisted' && app.interviewDate && (
                                                        <div className="text-xs text-blue-600 mt-1">
                                                            Interview: {formatDateTime(app.interviewDate)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedApplication(app);
                                                                setShowDetailsModal(true);
                                                            }}
                                                            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        {/* <button
                                                            onClick={() => handleMessageClient(app.client?._id, app.project?._id || app.projectId)}
                                                            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg relative"
                                                            title="Messages"
                                                        >
                                                            <MessageCircle size={18} />
                                                            {app.unreadMessages > 0 && (
                                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                                    {app.unreadMessages}
                                                                </span>
                                                            )}
                                                        </button> */}
                                                        {app.applicantStatus === 'pending' && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedApplication(app);
                                                                    setShowWithdrawModal(true);
                                                                }}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                                title="Withdraw Application"
                                                            >
                                                                <Ban size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <Briefcase size={40} className="text-gray-300 mb-3" />
                                                    <p className="text-gray-500 font-medium">No applications found</p>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {searchTerm || activeTab !== 'all' || statusFilter !== 'all'
                                                            ? 'Try adjusting your filters'
                                                            : 'Start applying to projects to see them here'}
                                                    </p>
                                                    {!searchTerm && activeTab === 'all' && statusFilter === 'all' && (
                                                        <Link
                                                            to="/projects"
                                                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                                        >
                                                            Browse Projects
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalApplications > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-500">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalApplications)} of {totalApplications} applications
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-sm">
                                        Page {currentPage} of {calculatedTotalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === calculatedTotalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Applications List - Mobile */}
                    <div className="md:hidden space-y-4 mb-6">
                        {currentApplications.length > 0 ? (
                            currentApplications.map((app) => (
                                <div key={app._id} className="bg-white rounded-xl border border-gray-200 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-gray-900 flex-1">{app.projectTitle || app.project?.title}</h3>
                                        {getStatusBadge(app.applicantStatus)}
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <img
                                            src={app.client?.avatar || app.client?.profileImage || 'https://via.placeholder.com/24'}
                                            alt={app.client?.name || app.client?.displayName}
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                        <span className="text-sm text-gray-600">{app.client?.name || app.client?.displayName}</span>
                                        {app.client?.isVerified && (
                                            <span className="text-blue-500 text-xs">✓</span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Budget:</span>
                                            <span className="ml-1 font-medium">{formatCurrency(app.proposedBudget)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Timeline:</span>
                                            <span className="ml-1">{app.proposedTimeline || app.project?.duration}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Applied:</span>
                                            <span className="ml-1">{formatDate(app.appliedDate)}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {(app.skills || app.project?.skills || []).slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </span>
                                        ))}
                                    </div>

                                    {app.applicantStatus === 'shortlisted' && app.interviewDate && (
                                        <div className="bg-blue-50 p-2 rounded-lg mb-3">
                                            <p className="text-xs text-blue-700">
                                                <span className="font-medium">Interview:</span> {formatDateTime(app.interviewDate)}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between border-t pt-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedApplication(app);
                                                    setShowDetailsModal(true);
                                                }}
                                                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleMessageClient(app.client?._id, app.project?._id || app.projectId)}
                                                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg relative"
                                            >
                                                <MessageCircle size={18} />
                                                {app.unreadMessages > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                        {app.unreadMessages}
                                                    </span>
                                                )}
                                            </button>
                                            {app.applicantStatus === 'pending' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedApplication(app);
                                                        setShowWithdrawModal(true);
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Ban size={18} />
                                                </button>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ID: {app._id.substring(0, 6)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500 font-medium">No applications found</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {searchTerm || activeTab !== 'all' || statusFilter !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'Start applying to projects to see them here'}
                                </p>
                            </div>
                        )}

                        {/* Mobile Pagination */}
                        {totalApplications > 0 && (
                            <div className="flex items-center justify-between mt-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {calculatedTotalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === calculatedTotalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </FreelancerContainer>
            </div>

            {/* Application Details Modal */}
            {showDetailsModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                                <p className="text-sm text-gray-500 mt-1">Project: {selectedApplication.projectTitle || selectedApplication.project?.title}</p>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status and Key Info */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                {getStatusBadge(selectedApplication.applicantStatus)}
                                <div className="text-sm text-gray-500">
                                    Applied: {formatDateTime(selectedApplication.appliedDate)}
                                </div>
                            </div>

                            {/* Client Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Users size={16} />
                                    Client Information
                                </h4>
                                <div className="flex items-start gap-3">
                                    <img
                                        src={selectedApplication.client?.avatar || selectedApplication.client?.profileImage || dummyUserImg}
                                        alt={selectedApplication.client?.name || selectedApplication.client?.displayName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-900">{selectedApplication.client?.name || selectedApplication.client?.displayName}</p>
                                            {selectedApplication.client?.verified && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{selectedApplication.client?.company || ''}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{selectedApplication.client?.rating || 0}</span>
                                            </div>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-sm text-gray-600">{selectedApplication.client?.reviews || 0} reviews</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Briefcase size={16} />
                                    Project Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Budget Range</p>
                                        <p className="font-medium">{formatCurrency(selectedApplication.project?.budget || selectedApplication.projectBudget)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Duration</p>
                                        <p className="font-medium">{selectedApplication.project?.duration || selectedApplication.projectDuration}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <MapPin size={14} className="text-gray-400" />
                                            {selectedApplication.project?.location || selectedApplication.projectLocation || 'Remote'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-2">Skills Required</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedApplication.project?.skills || selectedApplication.projectSkills || []).map((skill, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200">
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Your Proposal */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <FileText size={16} />
                                    Your Proposal
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Cover Letter</p>
                                        <p className="text-gray-700">{selectedApplication.coverLetter}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Proposed Budget</p>
                                            <p className="font-semibold text-gray-900">{formatCurrency(selectedApplication.proposedBudget)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Proposed Timeline</p>
                                            <p className="font-semibold text-gray-900">{selectedApplication.proposedTimeline}</p>
                                        </div>
                                    </div>
                                    {selectedApplication.attachments && selectedApplication.attachments.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">Attachments</p>
                                            <div className="space-y-2">
                                                {selectedApplication.attachments.map((file, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:bg-gray-50"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileText size={14} className="text-gray-400" />
                                                            <span className="text-sm">{file.name}</span>
                                                            <span className="text-xs text-gray-500">({file.size})</span>
                                                        </div>
                                                        <Download size={14} className="text-gray-400" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Client Response */}
                            {selectedApplication.clientResponse && (
                                <div className={`p-4 rounded-lg ${selectedApplication.clientResponse.type === 'hired' ? 'bg-green-50' :
                                    selectedApplication.clientResponse.type === 'shortlisted' ? 'bg-blue-50' :
                                        'bg-red-50'
                                    }`}>
                                    <div className="flex items-start gap-3">
                                        {selectedApplication.clientResponse.type === 'hired' ? (
                                            <CheckCircle size={18} className="text-green-600 mt-0.5" />
                                        ) : selectedApplication.clientResponse.type === 'shortlisted' ? (
                                            <ThumbsUp size={18} className="text-blue-600 mt-0.5" />
                                        ) : (
                                            <XCircle size={18} className="text-red-600 mt-0.5" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">Client Response</p>
                                            <p className="text-sm text-gray-700 mt-1">{selectedApplication.clientResponse.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDateTime(selectedApplication.clientResponse.date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Interview Details */}
                            {selectedApplication.interviewDate && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Calendar size={18} className="text-purple-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">Scheduled Interview</p>
                                            <p className="text-sm text-gray-700 mt-1">
                                                {formatDateTime(selectedApplication.interviewDate)}
                                            </p>
                                            {selectedApplication.interviewLink && (
                                                <a
                                                    href={selectedApplication.interviewLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 mt-2 text-sm text-primary hover:text-primary-dark"
                                                >
                                                    Join Meeting
                                                    <Send size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hired Details */}
                            {selectedApplication.applicantStatus === 'hired' && selectedApplication.milestones && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Award size={16} className="text-green-600" />
                                        Contract Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Contract Amount</p>
                                            <p className="font-semibold text-gray-900">{formatCurrency(selectedApplication.contractAmount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Start Date</p>
                                            <p className="font-semibold text-gray-900">{formatDate(selectedApplication.startDate)}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">Milestones</p>
                                    <div className="space-y-2">
                                        {selectedApplication.milestones.map((milestone, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${milestone.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                                                        }`} />
                                                    <span className="text-sm">{milestone.name}</span>
                                                </div>
                                                <span className="text-sm font-medium">{formatCurrency(milestone.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Withdrawal Reason */}
                            {selectedApplication.applicantStatus === 'withdrawn' && selectedApplication.withdrawalReason && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Withdrawal Reason:</span> {selectedApplication.withdrawalReason}
                                    </p>
                                    {selectedApplication.withdrawnDate && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Withdrawn on {formatDateTime(selectedApplication.withdrawnDate)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Rejection Reason */}
                            {selectedApplication.applicantStatus === 'rejected' && selectedApplication.rejectionReason && (
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-sm text-red-600">
                                        <span className="font-medium">Rejection Reason:</span> {selectedApplication.rejectionReason}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-4">
                                {/* <button
                                    onClick={() => handleMessageClient(selectedApplication.client?._id, selectedApplication.project?._id || selectedApplication.projectId)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={18} />
                                    Message Client
                                </button> */}
                                {(selectedApplication.applicantStatus === 'shortlisted' || selectedApplication.applicantStatus === 'hired') &&<StartChatButton userId={selectedApplication?.client?._id} userName={selectedApplication?.name} />}
                                <button
                                    onClick={() => handleViewProject(selectedApplication.project?._id || selectedApplication.projectId)}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2"
                                >
                                    <Eye size={18} />
                                    View Project
                                </button>
                                {selectedApplication.applicantStatus === 'pending' && (
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            setShowWithdrawModal(true);
                                        }}
                                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                                    >
                                        <Ban size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdraw Confirmation Modal */}
            {showWithdrawModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Withdraw Application</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to withdraw your application for "{selectedApplication.projectTitle || selectedApplication.project?.title}"? This action cannot be undone.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for withdrawal (Optional)
                            </label>
                            <textarea
                                rows={3}
                                value={withdrawReason}
                                onChange={(e) => setWithdrawReason(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Let the client know why you're withdrawing..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowWithdrawModal(false);
                                    setSelectedApplication(null);
                                    setWithdrawReason('');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWithdrawApplication}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Projects;