import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Search,
    Filter,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Users,
    Download,
    Plus,
    Ban,
    Award,
    MessageSquare,
    FileText,
    Calendar,
    MapPin,
    User,
    Briefcase,
    CreditCard,
    HelpCircle,
    Flag,
    RotateCcw,
    Banknote,
    Landmark,
    Smartphone,
    Wallet,
    X
} from "lucide-react";
import { AdminSidebar, AdminHeader, AdminContainer } from '../../components';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const Withdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const actionMenuRef = useRef(null);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        rejected: 0,
        totalAmount: 0,
        completedAmount: 0,
        pendingAmount: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    // Click outside handler for dropdown menus
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('[data-action-menu]')) {
                setOpenActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);

            // Mock data for withdrawal requests
            // const mockWithdrawals = [
            //     {
            //         id: "WD-2025-001",
            //         freelancer: {
            //             id: 2001,
            //             name: "Sarah Johnson",
            //             avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            //             email: "sarah.j@example.com",
            //             location: "United States",
            //             verified: true,
            //             level: "top_rated",
            //             balance: 3450.75
            //         },
            //         amount: 500.00,
            //         fee: 5.00,
            //         netAmount: 495.00,
            //         method: "paypal",
            //         methodDetails: "sarah.j@example.com",
            //         status: "completed",
            //         requestedAt: "2025-05-15T10:30:00",
            //         processedAt: "2025-05-16T14:20:00",
            //         transactionId: "PP-123456789",
            //         notes: "Monthly withdrawal"
            //     },
            //     {
            //         id: "WD-2025-002",
            //         freelancer: {
            //             id: 2002,
            //             name: "Michael Chen",
            //             avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
            //             email: "michael.c@example.com",
            //             location: "Singapore",
            //             verified: true,
            //             level: "level_2",
            //             balance: 5678.50
            //         },
            //         amount: 750.00,
            //         fee: 7.50,
            //         netAmount: 742.50,
            //         method: "bank_transfer",
            //         methodDetails: "****1234 (Chase Bank)",
            //         status: "completed",
            //         requestedAt: "2025-05-10T14:45:00",
            //         processedAt: "2025-05-12T09:15:00",
            //         transactionId: "BT-987654321",
            //         notes: "Project payment"
            //     },
            //     {
            //         id: "WD-2025-003",
            //         freelancer: {
            //             id: 2003,
            //             name: "Priya Patel",
            //             avatar: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
            //             email: "priya.p@example.com",
            //             location: "India",
            //             verified: true,
            //             level: "level_1",
            //             balance: 2345.00
            //         },
            //         amount: 300.00,
            //         fee: 3.00,
            //         netAmount: 297.00,
            //         method: "paypal",
            //         methodDetails: "priya.p@example.com",
            //         status: "pending",
            //         requestedAt: "2025-05-05T09:20:00",
            //         processedAt: null,
            //         notes: "Rush withdrawal"
            //     },
            //     {
            //         id: "WD-2025-004",
            //         freelancer: {
            //             id: 2004,
            //             name: "James Wilson",
            //             avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            //             email: "james.w@example.com",
            //             location: "United Kingdom",
            //             verified: true,
            //             level: "level_2",
            //             balance: 8900.25
            //         },
            //         amount: 1200.00,
            //         fee: 12.00,
            //         netAmount: 1188.00,
            //         method: "bank_transfer",
            //         methodDetails: "****5678 (Wells Fargo)",
            //         status: "processing",
            //         requestedAt: "2025-04-28T16:30:00",
            //         processedAt: null,
            //         notes: "Monthly savings"
            //     },
            //     {
            //         id: "WD-2025-005",
            //         freelancer: {
            //             id: 2005,
            //             name: "Emma Wilson",
            //             avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg",
            //             email: "emma.w@example.com",
            //             location: "Australia",
            //             verified: true,
            //             level: "level_1",
            //             balance: 1560.00
            //         },
            //         amount: 250.00,
            //         fee: 2.50,
            //         netAmount: 247.50,
            //         method: "paypal",
            //         methodDetails: "emma.w@example.com",
            //         status: "processing",
            //         requestedAt: "2025-04-20T11:15:00",
            //         processedAt: null,
            //         notes: "Express withdrawal"
            //     },
            //     {
            //         id: "WD-2025-006",
            //         freelancer: {
            //             id: 2006,
            //             name: "David Kim",
            //             avatar: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg",
            //             email: "david.k@example.com",
            //             location: "South Korea",
            //             verified: true,
            //             level: "top_rated",
            //             balance: 12450.00
            //         },
            //         amount: 800.00,
            //         fee: 8.00,
            //         netAmount: 792.00,
            //         method: "bank_transfer",
            //         methodDetails: "****1234 (Chase Bank)",
            //         status: "completed",
            //         requestedAt: "2025-04-15T13:40:00",
            //         processedAt: "2025-04-17T10:30:00",
            //         transactionId: "BT-789123456",
            //         notes: "Project milestone"
            //     },
            //     {
            //         id: "WD-2025-007",
            //         freelancer: {
            //             id: 2007,
            //             name: "Elena Petrova",
            //             avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg",
            //             email: "elena.p@example.com",
            //             location: "Germany",
            //             verified: true,
            //             level: "expert",
            //             balance: 7890.50
            //         },
            //         amount: 450.00,
            //         fee: 4.50,
            //         netAmount: 445.50,
            //         method: "paypal",
            //         methodDetails: "elena.p@example.com",
            //         status: "rejected",
            //         requestedAt: "2025-04-10T15:20:00",
            //         processedAt: "2025-04-11T09:30:00",
            //         rejectionReason: "Insufficient account verification",
            //         notes: "Cancelled by user"
            //     },
            //     {
            //         id: "WD-2025-008",
            //         freelancer: {
            //             id: 2008,
            //             name: "Michael Rodriguez",
            //             avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            //             email: "michael.r@example.com",
            //             location: "Spain",
            //             verified: false,
            //             level: "new",
            //             balance: 890.00
            //         },
            //         amount: 150.00,
            //         fee: 1.50,
            //         netAmount: 148.50,
            //         method: "paypal",
            //         methodDetails: "michael.r@example.com",
            //         status: "pending",
            //         requestedAt: "2025-04-05T10:10:00",
            //         processedAt: null,
            //         notes: "First withdrawal"
            //     },
            //     {
            //         id: "WD-2025-009",
            //         freelancer: {
            //             id: 2009,
            //             name: "Lisa Wang",
            //             avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
            //             email: "lisa.w@example.com",
            //             location: "China",
            //             verified: true,
            //             level: "level_2",
            //             balance: 5600.00
            //         },
            //         amount: 1000.00,
            //         fee: 10.00,
            //         netAmount: 990.00,
            //         method: "bank_transfer",
            //         methodDetails: "****4321 (ICBC)",
            //         status: "pending",
            //         requestedAt: "2025-04-01T09:30:00",
            //         processedAt: null,
            //         notes: "Monthly earnings"
            //     },
            //     {
            //         id: "WD-2025-010",
            //         freelancer: {
            //             id: 2010,
            //             name: "Robert Brown",
            //             avatar: "https://images.pexels.com/photos/428361/pexels-photo-428361.jpeg",
            //             email: "robert.b@example.com",
            //             location: "Germany",
            //             verified: true,
            //             level: "level_1",
            //             balance: 3450.00
            //         },
            //         amount: 600.00,
            //         fee: 6.00,
            //         netAmount: 594.00,
            //         method: "paypal",
            //         methodDetails: "robert.b@example.com",
            //         status: "completed",
            //         requestedAt: "2025-03-28T14:20:00",
            //         processedAt: "2025-03-30T11:45:00",
            //         transactionId: "PP-456789123",
            //         notes: "Project completion"
            //     }
            // ];

            setTimeout(() => {
                setWithdrawals([]);
                calculateStats([]);
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.error('Error fetching withdrawals:', error);
            toast.error('Failed to load withdrawal requests');
            setLoading(false);
        }
    };

    const calculateStats = (withdrawalsData) => {
        const pending = withdrawalsData.filter(w => w.status === 'pending');
        const processing = withdrawalsData.filter(w => w.status === 'processing');
        const completed = withdrawalsData.filter(w => w.status === 'completed');

        const stats = {
            total: withdrawalsData.length,
            pending: pending.length,
            processing: processing.length,
            completed: completed.length,
            rejected: withdrawalsData.filter(w => w.status === 'rejected').length,
            totalAmount: withdrawalsData.reduce((sum, w) => sum + w.amount, 0),
            completedAmount: completed.reduce((sum, w) => sum + w.amount, 0),
            pendingAmount: [...pending, ...processing].reduce((sum, w) => sum + w.amount, 0),
        };
        setStats(stats);
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: Clock },
            processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing', icon: RotateCcw },
            completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: XCircle }
        };
        const badge = config[status] || config.pending;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                <Icon size={12} />
                {badge.label}
            </span>
        );
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case 'paypal':
                return <Banknote size={14} className="text-blue-600" />;
            case 'bank_transfer':
                return <Landmark size={14} className="text-green-600" />;
            case 'payoneer':
                return <CreditCard size={14} className="text-purple-600" />;
            case 'mobile_money':
                return <Smartphone size={14} className="text-orange-600" />;
            default:
                return <DollarSign size={14} className="text-gray-600" />;
        }
    };

    const getMethodBadge = (method) => {
        const config = {
            paypal: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'PayPal' },
            bank_transfer: { bg: 'bg-green-100', text: 'text-green-700', label: 'Bank Transfer' },
            payoneer: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Payoneer' },
            mobile_money: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Mobile Money' }
        };
        const badge = config[method] || { bg: 'bg-gray-100', text: 'text-gray-700', label: method };
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {getMethodIcon(method)}
                {badge.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
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
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const handleViewWithdrawal = (withdrawal) => {
        setSelectedWithdrawal(withdrawal);
        setShowWithdrawalModal(true);
    };

    const handleProcessWithdrawal = async (withdrawalId) => {
        try {
            setWithdrawals(withdrawals.map(w =>
                w.id === withdrawalId
                    ? {
                        ...w,
                        status: 'processing',
                        processedAt: new Date().toISOString()
                    }
                    : w
            ));
            calculateStats(withdrawals);
            toast.success('Withdrawal marked as processing');
            setShowProcessModal(false);
            setSelectedWithdrawal(null);
        } catch (error) {
            toast.error('Failed to update withdrawal status');
        }
    };

    const handleCompleteWithdrawal = async (withdrawalId, transactionId) => {
        try {
            setWithdrawals(withdrawals.map(w =>
                w.id === withdrawalId
                    ? {
                        ...w,
                        status: 'completed',
                        processedAt: new Date().toISOString(),
                        transactionId: transactionId || `TXN-${Date.now()}`
                    }
                    : w
            ));
            calculateStats(withdrawals);
            toast.success('Withdrawal completed successfully');
            setShowProcessModal(false);
            setSelectedWithdrawal(null);
        } catch (error) {
            toast.error('Failed to complete withdrawal');
        }
    };

    const handleRejectWithdrawal = async (withdrawalId, reason) => {
        try {
            setWithdrawals(withdrawals.map(w =>
                w.id === withdrawalId
                    ? {
                        ...w,
                        status: 'rejected',
                        processedAt: new Date().toISOString(),
                        rejectionReason: reason
                    }
                    : w
            ));
            calculateStats(withdrawals);
            toast.success('Withdrawal rejected');
            setShowRejectModal(false);
            setSelectedWithdrawal(null);
        } catch (error) {
            toast.error('Failed to reject withdrawal');
        }
    };

    const handleViewFreelancer = (freelancerId) => {
        navigate(`/admin/users/${freelancerId}`);
    };

    const filteredWithdrawals = withdrawals.filter(withdrawal => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matches =
                withdrawal.id.toLowerCase().includes(term) ||
                withdrawal.freelancer.name.toLowerCase().includes(term) ||
                withdrawal.freelancer.email.toLowerCase().includes(term) ||
                withdrawal.transactionId?.toLowerCase().includes(term);
            if (!matches) return false;
        }

        if (statusFilter !== 'all' && withdrawal.status !== statusFilter) return false;
        if (methodFilter !== 'all' && withdrawal.method !== methodFilter) return false;

        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const requestDate = new Date(withdrawal.requestedAt);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            if (requestDate < cutoff) return false;
        }

        return true;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentWithdrawals = filteredWithdrawals.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);

    if (loading) {
        return (
            <section className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="w-full relative">
                    <AdminHeader />
                    <AdminContainer>
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    </AdminContainer>
                </div>
            </section>
        );
    }

    return (
        <section className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="w-full relative">
                <AdminHeader />
                <AdminContainer>
                    <div className="w-full max-w-full overflow-x-hidden">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-20 md:mt-0">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Withdrawal Requests</h1>
                                <p className="text-gray-600 mt-1">Manage and process freelancer withdrawal requests</p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <button
                                    onClick={() => fetchWithdrawals()}
                                    className="p-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1"
                                    title="Refresh"
                                >
                                    <RefreshCw size={18} className="text-gray-600" />
                                    <span>Refresh</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Wallet size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Total Requests</p>
                                        <p className="text-xl font-bold">{stats.total}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Clock size={20} className="text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Pending</p>
                                        <p className="text-xl font-bold">{stats.pending}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <RotateCcw size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Processing</p>
                                        <p className="text-xl font-bold">{stats.processing}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Completed</p>
                                        <p className="text-xl font-bold">{stats.completed}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <DollarSign size={20} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Total Amount</p>
                                        <p className="text-xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by ID, freelancer, email, transaction ID..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[130px]"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <select
                                        value={methodFilter}
                                        onChange={(e) => {
                                            setMethodFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[130px]"
                                    >
                                        <option value="all">All Methods</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="payoneer">Payoneer</option>
                                        <option value="mobile_money">Mobile Money</option>
                                    </select>
                                    <select
                                        value={dateRange}
                                        onChange={(e) => {
                                            setDateRange(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[130px]"
                                    >
                                        <option value="7">Last 7 days</option>
                                        <option value="30">Last 30 days</option>
                                        <option value="90">Last 90 days</option>
                                        <option value="365">Last year</option>
                                        <option value="all">All time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Withdrawals Table - Desktop */}
                        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[160px]">Freelancer</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[90px]">Amount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[100px]">Method</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[90px]">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[130px]">Requested</th>
                                            {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[130px]">Processed</th> */}
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[90px]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentWithdrawals.length > 0 ? (
                                            currentWithdrawals.map((withdrawal) => (
                                                <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <img
                                                                src={withdrawal.freelancer.avatar}
                                                                alt={withdrawal.freelancer.name}
                                                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                            />
                                                            <div>
                                                                <div className="font-medium text-gray-900 text-base flex items-center gap-0.5">
                                                                    <span className="truncate max-w-[150px]">{withdrawal.freelancer.name}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 truncate max-w-[150px]">{withdrawal.freelancer.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-bold text-gray-900 text-sm">{formatCurrency(withdrawal.amount)}</div>
                                                        <div className="text-xs text-gray-500">Fee: {formatCurrency(withdrawal.fee)}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {getMethodBadge(withdrawal.method)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {getStatusBadge(withdrawal.status)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-900 whitespace-nowrap">{formatDate(withdrawal.requestedAt)}</div>
                                                    </td>
                                                    {/* <td className="px-4 py-3">
                                                        <div className="text-xs text-gray-900 whitespace-nowrap">
                                                            {withdrawal.processedAt ? formatDate(withdrawal.processedAt) : '—'}
                                                        </div>
                                                    </td> */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-0.5">
                                                            <button
                                                                onClick={() => handleViewWithdrawal(withdrawal)}
                                                                className="p-1 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                                                                title="View Details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>

                                                            {/* Three Dots Dropdown */}
                                                            <div className="relative" data-action-menu>
                                                                <button
                                                                    onClick={() => setOpenActionMenu(openActionMenu === withdrawal.id ? null : withdrawal.id)}
                                                                    className="p-1 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                                                                    title="More Actions"
                                                                >
                                                                    <MoreVertical size={18} />
                                                                </button>

                                                                {openActionMenu === withdrawal.id && (
                                                                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                                                        <button
                                                                            onClick={() => {
                                                                                handleViewFreelancer(withdrawal.freelancer.id);
                                                                                setOpenActionMenu(null);
                                                                            }}
                                                                            className="w-full px-4 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                                                                        >
                                                                            <Users size={12} />
                                                                            View Freelancer
                                                                        </button>

                                                                        {(withdrawal.status === 'pending' || withdrawal.status === 'processing') && (
                                                                            <>
                                                                                <hr className="my-1 border-gray-200" />
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setSelectedWithdrawal(withdrawal);
                                                                                        setShowProcessModal(true);
                                                                                        setOpenActionMenu(null);
                                                                                    }}
                                                                                    className="w-full px-4 py-1.5 text-left text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-1"
                                                                                >
                                                                                    <RotateCcw size={12} />
                                                                                    Process
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setSelectedWithdrawal(withdrawal);
                                                                                        setShowRejectModal(true);
                                                                                        setOpenActionMenu(null);
                                                                                    }}
                                                                                    className="w-full px-4 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-1"
                                                                                >
                                                                                    <XCircle size={12} />
                                                                                    Reject
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <DollarSign size={40} className="text-gray-300 mb-3" />
                                                        <p className="text-gray-500 font-medium">No withdrawal requests found</p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {searchTerm ? 'Try adjusting your search' : 'No requests match the selected filters'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Withdrawals List - Mobile */}
                        <div className="md:hidden space-y-4 mb-6">
                            {currentWithdrawals.length > 0 ? (
                                currentWithdrawals.map((withdrawal) => (
                                    <div key={withdrawal.id} className="bg-white rounded-xl border border-gray-200 p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-xs font-medium text-gray-500">{withdrawal.id}</span>
                                                <h3 className="font-medium text-gray-900 text-sm mt-1">{withdrawal.freelancer.name}</h3>
                                            </div>
                                            {getStatusBadge(withdrawal.status)}
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <img
                                                src={withdrawal.freelancer.avatar}
                                                alt={withdrawal.freelancer.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            <span className="text-xs text-gray-600 truncate">{withdrawal.freelancer.email}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                            <div>
                                                <span className="text-gray-500">Amount:</span>
                                                <span className="ml-1 font-bold">{formatCurrency(withdrawal.amount)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Method:</span>
                                                <span className="ml-1">{getMethodBadge(withdrawal.method)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Requested:</span>
                                                <span className="ml-1">{formatDate(withdrawal.requestedAt)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t pt-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewWithdrawal(withdrawal)}
                                                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {/* Three Dots Dropdown - Mobile */}
                                                <div className="relative" data-action-menu>
                                                    <button
                                                        onClick={() => setOpenActionMenu(openActionMenu === withdrawal.id ? null : withdrawal.id)}
                                                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>

                                                    {openActionMenu === withdrawal.id && (
                                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                                            <button
                                                                onClick={() => {
                                                                    handleViewFreelancer(withdrawal.freelancer.id);
                                                                    setOpenActionMenu(null);
                                                                }}
                                                                className="w-full px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                                                            >
                                                                <Users size={12} />
                                                                View Freelancer
                                                            </button>

                                                            {(withdrawal.status === 'pending' || withdrawal.status === 'processing') && (
                                                                <>
                                                                    <hr className="my-1 border-gray-200" />
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedWithdrawal(withdrawal);
                                                                            setShowProcessModal(true);
                                                                            setOpenActionMenu(null);
                                                                        }}
                                                                        className="w-full px-2 py-1.5 text-left text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-1"
                                                                    >
                                                                        <RotateCcw size={12} />
                                                                        Process
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedWithdrawal(withdrawal);
                                                                            setShowRejectModal(true);
                                                                            setOpenActionMenu(null);
                                                                        }}
                                                                        className="w-full px-2 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-1"
                                                                    >
                                                                        <XCircle size={12} />
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {withdrawal.transactionId || 'No TXN'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                    <DollarSign size={40} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No withdrawal requests found</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {searchTerm ? 'Try adjusting your search' : 'No requests match the selected filters'}
                                    </p>
                                </div>
                            )}

                            {/* Mobile Pagination */}
                            {filteredWithdrawals.length > 0 && (
                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Withdrawal Statistics Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <Clock size={16} className="text-yellow-600" />
                                    Pending Processing
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Pending Requests</span>
                                        <span className="font-medium text-gray-900">{stats.pending}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Processing</span>
                                        <span className="font-medium text-blue-600">{stats.processing}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Pending Amount</span>
                                        <span className="font-medium text-yellow-600">{formatCurrency(stats.pendingAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-600" />
                                    Completed
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Completed</span>
                                        <span className="font-medium text-green-600">{stats.completed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Amount</span>
                                        <span className="font-medium text-green-600">{formatCurrency(stats.completedAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Avg. Processing</span>
                                        <span className="font-medium text-gray-900">1.5 days</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <DollarSign size={16} className="text-purple-600" />
                                    Financial Summary
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Requested</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(stats.totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Platform Fees</span>
                                        <span className="font-medium text-red-600">
                                            {formatCurrency(withdrawals.reduce((sum, w) => sum + w.fee, 0))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Avg. Request</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(stats.totalAmount / stats.total || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <Users size={16} className="text-orange-600" />
                                    Method Distribution
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">PayPal</span>
                                        <span className="font-medium text-blue-600">
                                            {withdrawals.filter(w => w.method === 'paypal').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Bank Transfer</span>
                                        <span className="font-medium text-green-600">
                                            {withdrawals.filter(w => w.method === 'bank_transfer').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Others</span>
                                        <span className="font-medium text-gray-600">
                                            {withdrawals.filter(w => w.method !== 'paypal' && w.method !== 'bank_transfer').length}
                                        </span>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </AdminContainer>
            </div>

            {/* Withdrawal Details Modal */}
            {showWithdrawalModal && selectedWithdrawal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Withdrawal Details</h3>
                                <p className="text-sm text-gray-500 mt-1">Request ID: {selectedWithdrawal.id}</p>
                            </div>
                            <button
                                onClick={() => setShowWithdrawalModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(selectedWithdrawal.status)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Requested: {formatDate(selectedWithdrawal.requestedAt)}
                                </div>
                            </div>

                            {/* Freelancer Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Users size={16} />
                                    Freelancer Information
                                </h4>
                                <div className="flex items-start gap-3">
                                    <img
                                        src={selectedWithdrawal.freelancer.avatar}
                                        alt={selectedWithdrawal.freelancer.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-gray-900">{selectedWithdrawal.freelancer.name}</p>
                                            {selectedWithdrawal.freelancer.verified && (
                                                <span className="text-blue-500 text-xs">✓</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{selectedWithdrawal.freelancer.email}</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <MapPin size={10} />
                                            {selectedWithdrawal.freelancer.location} • Level: {selectedWithdrawal.freelancer.level}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Available Balance: {formatCurrency(selectedWithdrawal.freelancer.balance)}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setShowWithdrawalModal(false);
                                                handleViewFreelancer(selectedWithdrawal.freelancer.id);
                                            }}
                                            className="mt-2 text-xs text-primary hover:text-primary-dark"
                                        >
                                            View Full Profile →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Withdrawal Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <DollarSign size={16} />
                                    Withdrawal Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Amount Requested</p>
                                        <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedWithdrawal.amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Platform Fee</p>
                                        <p className="text-sm text-red-600">-{formatCurrency(selectedWithdrawal.fee)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Net Amount</p>
                                        <p className="text-sm font-medium text-green-600">{formatCurrency(selectedWithdrawal.netAmount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Payment Method</p>
                                        <div className="mt-1">{getMethodBadge(selectedWithdrawal.method)}</div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t">
                                    <p className="text-xs text-gray-500">Account Details</p>
                                    <p className="text-sm font-medium mt-1">{selectedWithdrawal.methodDetails}</p>
                                </div>
                            </div>

                            {/* Transaction Info */}
                            {(selectedWithdrawal.status === 'completed' || selectedWithdrawal.status === 'processing') && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <CreditCard size={16} />
                                        Transaction Information
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedWithdrawal.transactionId && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Transaction ID</span>
                                                <span className="text-sm font-medium">{selectedWithdrawal.transactionId}</span>
                                            </div>
                                        )}
                                        {selectedWithdrawal.processedAt && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Processed Date</span>
                                                <span className="text-sm font-medium">{formatDate(selectedWithdrawal.processedAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Rejection Reason */}
                            {selectedWithdrawal.status === 'rejected' && selectedWithdrawal.rejectionReason && (
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        <span className="font-medium">Rejection Reason:</span> {selectedWithdrawal.rejectionReason}
                                    </p>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedWithdrawal.notes && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2 text-sm">Notes</h4>
                                    <p className="text-sm text-gray-700">{selectedWithdrawal.notes}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 pt-4">
                                {(selectedWithdrawal.status === 'pending' || selectedWithdrawal.status === 'processing') && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowWithdrawalModal(false);
                                                setShowProcessModal(true);
                                            }}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                                        >
                                            <RotateCcw size={18} />
                                            Process
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowWithdrawalModal(false);
                                                setShowRejectModal(true);
                                            }}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                                        >
                                            <X size={18} />
                                            Reject
                                        </button>
                                    </>
                                )}
                                {/* {selectedWithdrawal.status === 'completed' && (
                                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                                        <Download size={18} />
                                        Download Receipt
                                    </button>
                                )} */}
                                <button
                                    onClick={() => {
                                        setShowWithdrawalModal(false);
                                        handleViewFreelancer(selectedWithdrawal.freelancer.id);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                    <Users size={18} />
                                    View Freelancer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Process Withdrawal Modal */}
            {showProcessModal && selectedWithdrawal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Process Withdrawal</h3>
                        <p className="text-gray-600 mb-4">
                            Request ID: {selectedWithdrawal.id}
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Amount:</span>
                                <span className="font-bold">{formatCurrency(selectedWithdrawal.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Method:</span>
                                <span>{getMethodBadge(selectedWithdrawal.method)}</span>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                                <p className="text-xs text-gray-500">Account:</p>
                                <p className="text-sm font-medium">{selectedWithdrawal.methodDetails}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transaction ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="transactionId"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter external transaction ID"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        id="markComplete"
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span className="text-sm text-gray-700">Mark as completed immediately</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowProcessModal(false);
                                    setSelectedWithdrawal(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const transactionId = document.getElementById('transactionId')?.value;
                                    const markComplete = document.getElementById('markComplete')?.checked;

                                    if (markComplete) {
                                        handleCompleteWithdrawal(selectedWithdrawal.id, transactionId);
                                    } else {
                                        handleProcessWithdrawal(selectedWithdrawal.id);
                                    }
                                }}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                                Process
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Withdrawal Modal */}
            {showRejectModal && selectedWithdrawal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Withdrawal</h3>
                        <p className="text-gray-600 mb-4">
                            Request ID: {selectedWithdrawal.id}
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for rejection
                            </label>
                            <textarea
                                id="rejectReason"
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Explain why this withdrawal is being rejected..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedWithdrawal(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const reason = document.getElementById('rejectReason').value;
                                    if (!reason) {
                                        toast.error('Please provide a reason');
                                        return;
                                    }
                                    handleRejectWithdrawal(selectedWithdrawal.id, reason);
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Withdrawals;