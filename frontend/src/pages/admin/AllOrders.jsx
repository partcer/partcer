import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
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
    DollarSign,
    Users,
    Star,
    TrendingUp,
    Download,
    Plus,
    Copy,
    PauseCircle,
    PlayCircle,
    Shield,
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
    X
} from "lucide-react";
import { AdminSidebar, AdminHeader, AdminContainer } from '../../components';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const actionMenuRef = useRef(null);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        active: 0,
        pending: 0,
        cancelled: 0,
        disputed: 0,
        refunded: 0,
        totalRevenue: 0,
        platformFees: 0,
        avgOrderValue: 0,
        totalOrders: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
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

    const fetchOrders = async () => {
        try {
            setLoading(true);

            // Mock data for orders
            // const mockOrders = [
            //     {
            //         id: "ORD-2246872",
            //         date: "2025-05-13T14:00:00",
            //         buyer: {
            //             id: 1001,
            //             name: "Alex Chen",
            //             avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
            //             email: "alex.c@example.com",
            //             location: "Singapore",
            //             verified: true
            //         },
            //         seller: {
            //             id: 2001,
            //             name: "Sarah Johnson",
            //             avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            //             email: "sarah.j@example.com",
            //             location: "United States",
            //             verified: true,
            //             level: "top_rated"
            //         },
            //         service: {
            //             id: "SVC-123",
            //             title: "Professional Website UI/UX Design",
            //             category: "Design & Creative",
            //             type: "service",
            //             package: "Premium Package"
            //         },
            //         amount: 500,
            //         fee: 50,
            //         netAmount: 450,
            //         status: "completed",
            //         paymentStatus: "paid",
            //         paymentMethod: "credit_card",
            //         orderType: "service",
            //         createdAt: "2025-05-13T14:00:00",
            //         deliveredAt: "2025-05-19T16:30:00",
            //         completedAt: "2025-05-20T10:15:00",
            //         disputes: 0,
            //         refundStatus: null,
            //         rating: 5,
            //         review: "Excellent work, delivered ahead of schedule!"
            //     },
            //     {
            //         id: "ORD-9519785",
            //         date: "2025-05-13T14:55:00",
            //         buyer: {
            //             id: 1002,
            //             name: "Sarah Johnson",
            //             avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            //             email: "sarah.j@example.com",
            //             location: "United States",
            //             verified: true
            //         },
            //         seller: {
            //             id: 2002,
            //             name: "Michael Chen",
            //             avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
            //             email: "michael.c@example.com",
            //             location: "Singapore",
            //             verified: true,
            //             level: "level_2"
            //         },
            //         service: {
            //             id: "SVC-456",
            //             title: "Custom E-commerce Development",
            //             category: "Development & IT",
            //             type: "service",
            //             package: "Standard Package"
            //         },
            //         amount: 200,
            //         fee: 20,
            //         netAmount: 180,
            //         status: "active",
            //         paymentStatus: "paid",
            //         paymentMethod: "paypal",
            //         orderType: "service",
            //         createdAt: "2025-05-13T14:55:00",
            //         deadline: "2025-05-25T14:55:00",
            //         disputes: 0,
            //         refundStatus: null
            //     },
            //     {
            //         id: "ORD-6658427",
            //         date: "2025-05-13T14:54:00",
            //         buyer: {
            //             id: 1003,
            //             name: "Emma Wilson",
            //             avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg",
            //             email: "emma.w@example.com",
            //             location: "United Kingdom",
            //             verified: false
            //         },
            //         seller: {
            //             id: 2003,
            //             name: "David Kim",
            //             avatar: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg",
            //             email: "david.k@example.com",
            //             location: "South Korea",
            //             verified: true,
            //             level: "level_1"
            //         },
            //         service: {
            //             id: "SVC-789",
            //             title: "WordPress Website Development",
            //             category: "Development & IT",
            //             type: "service",
            //             package: "Basic Package"
            //         },
            //         amount: 150,
            //         fee: 15,
            //         netAmount: 135,
            //         status: "pending",
            //         paymentStatus: "unpaid",
            //         paymentMethod: null,
            //         orderType: "service",
            //         createdAt: "2025-05-13T14:54:00",
            //         deadline: "2025-05-27T14:54:00",
            //         disputes: 0,
            //         refundStatus: null
            //     },
            //     {
            //         id: "ORD-9854988",
            //         date: "2025-05-13T14:46:00",
            //         buyer: {
            //             id: 1004,
            //             name: "James Wilson",
            //             avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            //             email: "james.w@example.com",
            //             location: "United Kingdom",
            //             verified: true
            //         },
            //         seller: {
            //             id: 2004,
            //             name: "Priya Patel",
            //             avatar: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
            //             email: "priya.p@example.com",
            //             location: "India",
            //             verified: true,
            //             level: "level_2"
            //         },
            //         service: {
            //             id: "SVC-234",
            //             title: "Mobile App UI/UX Design",
            //             category: "Design & Creative",
            //             type: "service",
            //             package: "Premium Package"
            //         },
            //         amount: 200,
            //         fee: 20,
            //         netAmount: 180,
            //         status: "completed",
            //         paymentStatus: "paid",
            //         paymentMethod: "bank_transfer",
            //         orderType: "service",
            //         createdAt: "2025-05-13T14:46:00",
            //         deliveredAt: "2025-05-17T11:20:00",
            //         completedAt: "2025-05-18T14:20:00",
            //         disputes: 0,
            //         refundStatus: null,
            //         rating: 4.5,
            //         review: "Great design work, very responsive to feedback."
            //     },
            //     {
            //         id: "ORD-6989952",
            //         date: "2025-05-13T14:40:00",
            //         buyer: {
            //             id: 1005,
            //             name: "Michael Chen",
            //             avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
            //             email: "michael.c@example.com",
            //             location: "Singapore",
            //             verified: true
            //         },
            //         seller: {
            //             id: 2005,
            //             name: "Elena Petrova",
            //             avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg",
            //             email: "elena.p@example.com",
            //             location: "Germany",
            //             verified: true,
            //             level: "expert"
            //         },
            //         service: {
            //             id: "SVC-567",
            //             title: "SEO Optimization Service",
            //             category: "Digital Marketing",
            //             type: "service",
            //             package: "Standard Package"
            //         },
            //         amount: 300,
            //         fee: 30,
            //         netAmount: 270,
            //         status: "active",
            //         paymentStatus: "paid",
            //         paymentMethod: "credit_card",
            //         orderType: "service",
            //         createdAt: "2025-05-13T14:40:00",
            //         deadline: "2025-06-13T14:40:00",
            //         disputes: 0,
            //         refundStatus: null
            //     },
            //     {
            //         id: "ORD-3365479",
            //         date: "2025-05-13T14:30:00",
            //         buyer: {
            //             id: 1006,
            //             name: "Priya Patel",
            //             avatar: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
            //             email: "priya.p@example.com",
            //             location: "India",
            //             verified: true
            //         },
            //         seller: {
            //             id: 2006,
            //             name: "James Wilson",
            //             avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            //             email: "james.w@example.com",
            //             location: "United Kingdom",
            //             verified: false,
            //             level: "new"
            //         },
            //         service: {
            //             id: "SVC-890",
            //             title: "Logo Design Package",
            //             category: "Design & Creative",
            //             type: "custom_offer",
            //             package: "Basic Package"
            //         },
            //         amount: 80,
            //         fee: 8,
            //         netAmount: 72,
            //         status: "cancelled",
            //         paymentStatus: "refunded",
            //         paymentMethod: "credit_card",
            //         orderType: "custom_offer",
            //         createdAt: "2025-05-13T14:30:00",
            //         cancelledAt: "2025-05-15T10:20:00",
            //         cancellationReason: "Buyer requested cancellation",
            //         disputes: 1,
            //         refundStatus: "completed",
            //         refundAmount: 80,
            //         refundDate: "2025-05-16T09:30:00"
            //     },
            //     {
            //         id: "ORD-6552589",
            //         date: "2025-05-13T13:00:00",
            //         buyer: {
            //             id: 1007,
            //             name: "David Kim",
            //             avatar: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg",
            //             email: "david.k@example.com",
            //             location: "South Korea",
            //             verified: true
            //         },
            //         seller: {
            //             id: 2007,
            //             name: "Emma Wilson",
            //             avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg",
            //             email: "emma.w@example.com",
            //             location: "United Kingdom",
            //             verified: true,
            //             level: "level_1"
            //         },
            //         service: {
            //             id: "SVC-901",
            //             title: "Content Writing - Blog Posts",
            //             category: "Writing & Translation",
            //             type: "service",
            //             package: "Standard Package"
            //         },
            //         amount: 125,
            //         fee: 12.5,
            //         netAmount: 112.5,
            //         status: "disputed",
            //         paymentStatus: "held",
            //         paymentMethod: "paypal",
            //         orderType: "service",
            //         createdAt: "2025-05-13T13:00:00",
            //         deadline: "2025-05-20T13:00:00",
            //         disputes: 1,
            //         disputeReason: "Quality of work not as expected",
            //         disputeOpenedAt: "2025-05-18T11:30:00",
            //         disputeStatus: "under_review",
            //         refundStatus: null
            //     },
            //     {
            //         id: "ORD-9745845",
            //         date: "2025-05-13T12:30:00",
            //         buyer: {
            //             id: 1008,
            //             name: "Elena Petrova",
            //             avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg",
            //             email: "elena.p@example.com",
            //             location: "Germany",
            //             verified: true
            //         },
            //         seller: {
            //             id: 2008,
            //             name: "Michael Rodriguez",
            //             avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            //             email: "michael.r@example.com",
            //             location: "Spain",
            //             verified: true,
            //             level: "level_2"
            //         },
            //         service: {
            //             id: "SVC-234",
            //             title: "Mobile App UI/UX Design",
            //             category: "Design & Creative",
            //             type: "project",
            //             package: "Standard Package"
            //         },
            //         amount: 185,
            //         fee: 18.5,
            //         netAmount: 166.5,
            //         status: "pending",
            //         paymentStatus: "unpaid",
            //         paymentMethod: null,
            //         orderType: "project",
            //         createdAt: "2025-05-13T12:30:00",
            //         deadline: "2025-05-27T12:30:00",
            //         disputes: 0,
            //         refundStatus: null
            //     },
            //     {
            //         id: "ORD-7891389",
            //         date: "2025-05-13T11:28:00",
            //         buyer: {
            //             id: 1009,
            //             name: "Michael Rodriguez",
            //             avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            //             email: "michael.r@example.com",
            //             location: "Spain",
            //             verified: true
            //         },
            //         seller: {
            //             id: 2009,
            //             name: "Sarah Johnson",
            //             avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            //             email: "sarah.j@example.com",
            //             location: "United States",
            //             verified: true,
            //             level: "top_rated"
            //         },
            //         service: {
            //             id: "SVC-567",
            //             title: "SEO Optimization Service",
            //             category: "Digital Marketing",
            //             type: "service",
            //             package: "Basic Package"
            //         },
            //         amount: 45,
            //         fee: 4.5,
            //         netAmount: 40.5,
            //         status: "completed",
            //         paymentStatus: "paid",
            //         paymentMethod: "credit_card",
            //         orderType: "service",
            //         createdAt: "2025-05-13T11:28:00",
            //         deliveredAt: "2025-05-17T09:15:00",
            //         completedAt: "2025-05-18T10:30:00",
            //         disputes: 0,
            //         refundStatus: null,
            //         rating: 4,
            //         review: "Good work, improved our local search ranking."
            //     },
            //     {
            //         id: "ORD-3669852",
            //         date: "2025-05-13T11:25:00",
            //         buyer: {
            //             id: 1010,
            //             name: "James Wilson",
            //             avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            //             email: "james.w@example.com",
            //             location: "United Kingdom",
            //             verified: false
            //         },
            //         seller: {
            //             id: 2010,
            //             name: "David Kim",
            //             avatar: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg",
            //             email: "david.k@example.com",
            //             location: "South Korea",
            //             verified: true,
            //             level: "level_1"
            //         },
            //         service: {
            //             id: "SVC-890",
            //             title: "Logo Design Package",
            //             category: "Design & Creative",
            //             type: "custom_offer",
            //             package: "Basic Package"
            //         },
            //         amount: 35,
            //         fee: 3.5,
            //         netAmount: 31.5,
            //         status: "pending",
            //         paymentStatus: "unpaid",
            //         paymentMethod: null,
            //         orderType: "custom_offer",
            //         createdAt: "2025-05-13T11:25:00",
            //         deadline: "2025-05-20T11:25:00",
            //         disputes: 0,
            //         refundStatus: null
            //     }
            // ];

            setTimeout(() => {
                setOrders([]);
                calculateStats([]);
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
            setLoading(false);
        }
    };

    const calculateStats = (ordersData) => {
        const completed = ordersData.filter(o => o.status === 'completed');
        const active = ordersData.filter(o => o.status === 'active');
        const disputed = ordersData.filter(o => o.status === 'disputed');

        const stats = {
            total: ordersData.length,
            completed: completed.length,
            active: active.length,
            pending: ordersData.filter(o => o.status === 'pending').length,
            cancelled: ordersData.filter(o => o.status === 'cancelled').length,
            disputed: disputed.length,
            refunded: ordersData.filter(o => o.refundStatus === 'completed').length,
            totalRevenue: completed.reduce((sum, o) => sum + o.netAmount, 0),
            platformFees: ordersData.reduce((sum, o) => sum + o.fee, 0),
            avgOrderValue: completed.length > 0
                ? completed.reduce((sum, o) => sum + o.amount, 0) / completed.length
                : 0,
            totalOrders: ordersData.length
        };
        setStats(stats);
    };

    const getStatusBadge = (status) => {
        const config = {
            active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active', icon: Clock },
            completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed', icon: CheckCircle },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: AlertCircle },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled', icon: XCircle },
            disputed: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Disputed', icon: Flag }
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

    const getPaymentStatusBadge = (paymentStatus) => {
        const config = {
            paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid' },
            unpaid: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Unpaid' },
            refunded: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Refunded' },
            held: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Held' }
        };
        const badge = config[paymentStatus] || config.unpaid;
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const getOrderTypeBadge = (type) => {
        const config = {
            service: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Service' },
            custom_offer: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Custom Offer' },
            project: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Project' }
        };
        const badge = config[type] || config.service;
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
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

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleRefundOrder = async (orderId) => {
        try {
            setOrders(orders.map(order =>
                order.id === orderId
                    ? {
                        ...order,
                        status: 'cancelled',
                        paymentStatus: 'refunded',
                        refundStatus: 'completed',
                        refundDate: new Date().toISOString()
                    }
                    : order
            ));
            calculateStats(orders);
            toast.success('Refund processed successfully');
            setShowRefundModal(false);
            setSelectedOrder(null);
        } catch (error) {
            toast.error('Failed to process refund');
        }
    };

    const handleResolveDispute = async (orderId, resolution) => {
        try {
            setOrders(orders.map(order =>
                order.id === orderId
                    ? {
                        ...order,
                        status: resolution === 'refund' ? 'cancelled' : 'completed',
                        disputeStatus: 'resolved',
                        paymentStatus: resolution === 'refund' ? 'refunded' : 'paid'
                    }
                    : order
            ));
            calculateStats(orders);
            toast.success('Dispute resolved successfully');
            setShowDisputeModal(false);
            setSelectedOrder(null);
        } catch (error) {
            toast.error('Failed to resolve dispute');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            setOrders(orders.filter(order => order.id !== orderId));
            calculateStats(orders);
            toast.success('Order deleted successfully');
            setShowDeleteModal(false);
            setSelectedOrder(null);
        } catch (error) {
            toast.error('Failed to delete order');
        }
    };

    const handleViewBuyer = (buyerId) => {
        navigate(`/admin/users/${buyerId}`);
    };

    const handleViewSeller = (sellerId) => {
        navigate(`/admin/users/${sellerId}`);
    };

    const filteredOrders = orders.filter(order => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matches =
                order.id.toLowerCase().includes(term) ||
                order.buyer.name.toLowerCase().includes(term) ||
                order.seller.name.toLowerCase().includes(term) ||
                order.service.title.toLowerCase().includes(term);
            if (!matches) return false;
        }

        if (statusFilter !== 'all' && order.status !== statusFilter) return false;
        if (typeFilter !== 'all' && order.orderType !== typeFilter) return false;
        if (paymentFilter !== 'all' && order.paymentStatus !== paymentFilter) return false;

        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const orderDate = new Date(order.createdAt);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            if (orderDate < cutoff) return false;
        }

        return true;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
                                <p className="text-gray-600 mt-1">Manage and monitor all platform orders</p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <button
                                    onClick={() => fetchOrders()}
                                    className="p-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1"
                                    title="Refresh"
                                >
                                    <RefreshCw size={18} className="" />
                                    <span>Refresh</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ShoppingBag size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Total Orders</p>
                                        <p className="text-xl font-bold">{stats.total}</p>
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
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Clock size={20} className="text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Active</p>
                                        <p className="text-xl font-bold">{stats.active}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Flag size={20} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Disputed</p>
                                        <p className="text-xl font-bold">{stats.disputed}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <DollarSign size={20} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Revenue</p>
                                        <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <CreditCard size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Fees</p>
                                        <p className="text-xl font-bold">{formatCurrency(stats.platformFees)}</p>
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
                                        placeholder="Search by order ID, buyer, seller, service..."
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
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="disputed">Disputed</option>
                                    </select>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => {
                                            setTypeFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[130px]"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="service">Service</option>
                                        <option value="custom_offer">Custom Offer</option>
                                        <option value="project">Project</option>
                                    </select>
                                    <select
                                        value={paymentFilter}
                                        onChange={(e) => {
                                            setPaymentFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[130px]"
                                    >
                                        <option value="all">All Payments</option>
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">Unpaid</option>
                                        <option value="refunded">Refunded</option>
                                        <option value="held">Held</option>
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

                        {/* Orders Table - Desktop */}
                        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            {/* <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[150px]">Order ID</th> */}
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[180px]">Buyer</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[180px]">Seller</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[250px]">Service</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[120px]">Amount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[120px]">Status</th>
                                            {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[100px]">Payment</th> */}
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[100px]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentOrders.length > 0 ? (
                                            currentOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                    {/* <td className="px-4 py-3">
                                                        <div>
                                                            <div className="font-medium text-gray-900 text-xs">{order.id}</div>
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                {formatDate(order.createdAt)}
                                                            </div>
                                                            <div className="mt-0.5">{getOrderTypeBadge(order.orderType)}</div>
                                                        </div>
                                                    </td> */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={order.buyer.avatar}
                                                                alt={order.buyer.name}
                                                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                            />
                                                            <div>
                                                                <div className="font-medium text-gray-900 text-base flex items-center gap-1">
                                                                    <span className="truncate max-w-[100px]">{order.buyer.name}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 truncate max-w-[100px]">{order.buyer.location}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={order.seller.avatar}
                                                                alt={order.seller.name}
                                                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                            />
                                                            <div>
                                                                <div className="font-medium text-gray-900 text-base flex items-center gap-1">
                                                                    <span className="truncate max-w-[100px]">{order.seller.name}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 truncate max-w-[100px]">{order.seller.location}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-900 line-clamp-2">{order.service.title}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">{order.service.category}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-bold text-gray-900 text-sm">{formatCurrency(order.amount)}</div>
                                                        <div className="text-xs text-gray-500">Fee: {formatCurrency(order.fee)}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {getStatusBadge(order.status)}
                                                        {order.disputes > 0 && (
                                                            <div className="text-xs text-red-600 mt-0.5 flex items-center gap-0.5">
                                                                <Flag size={8} />
                                                                {order.disputes}
                                                            </div>
                                                        )}
                                                    </td>
                                                    {/* <td className="px-4 py-3">
                                                        {getPaymentStatusBadge(order.paymentStatus)}
                                                    </td> */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-0.5">
                                                            <button
                                                                onClick={() => handleViewOrder(order)}
                                                                className="p-1 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                                                                title="View Details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>

                                                            {/* Three Dots Dropdown */}
                                                            <div className="relative" data-action-menu>
                                                                <button
                                                                    onClick={() => setOpenActionMenu(openActionMenu === order.id ? null : order.id)}
                                                                    className="p-1 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                                                                    title="More Actions"
                                                                >
                                                                    <MoreVertical size={18} />
                                                                </button>

                                                                {openActionMenu === order.id && (
                                                                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                                                        <button
                                                                            onClick={() => {
                                                                                handleViewBuyer(order.buyer.id);
                                                                                setOpenActionMenu(null);
                                                                            }}
                                                                            className="w-full px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                                                                        >
                                                                            <Users size={12} />
                                                                            View Buyer
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleViewSeller(order.seller.id);
                                                                                setOpenActionMenu(null);
                                                                            }}
                                                                            className="w-full px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                                                                        >
                                                                            <Briefcase size={12} />
                                                                            View Seller
                                                                        </button>

                                                                        {order.status === 'disputed' && (
                                                                            <>
                                                                                <hr className="my-1 border-gray-200" />
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setSelectedOrder(order);
                                                                                        setShowDisputeModal(true);
                                                                                        setOpenActionMenu(null);
                                                                                    }}
                                                                                    className="w-full px-2 py-1.5 text-left text-xs text-orange-600 hover:bg-orange-50 flex items-center gap-1"
                                                                                >
                                                                                    <Flag size={12} />
                                                                                    Resolve
                                                                                </button>
                                                                            </>
                                                                        )}

                                                                        {order.paymentStatus === 'paid' && order.status !== 'cancelled' && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedOrder(order);
                                                                                    setShowRefundModal(true);
                                                                                    setOpenActionMenu(null);
                                                                                }}
                                                                                className="w-full px-2 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-1"
                                                                            >
                                                                                <RotateCcw size={12} />
                                                                                Refund
                                                                            </button>
                                                                        )}

                                                                        <hr className="my-1 border-gray-200" />

                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedOrder(order);
                                                                                setShowDeleteModal(true);
                                                                                setOpenActionMenu(null);
                                                                            }}
                                                                            className="w-full px-2 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-1"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                            Delete
                                                                        </button>
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
                                                        <ShoppingBag size={40} className="text-gray-300 mb-3" />
                                                        <p className="text-gray-500 font-medium">No orders found</p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {searchTerm ? 'Try adjusting your search' : 'No orders match the selected filters'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Orders List - Mobile */}
                        <div className="md:hidden space-y-4 mb-6">
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-xs font-medium text-gray-500">{order.id}</span>
                                                <h3 className="font-medium text-gray-900 text-sm mt-1">{order.service.title}</h3>
                                            </div>
                                            {getStatusBadge(order.status)}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                            <div>
                                                <span className="text-gray-500">Buyer:</span>
                                                <span className="ml-1 font-medium">{order.buyer.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Seller:</span>
                                                <span className="ml-1 font-medium">{order.seller.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Amount:</span>
                                                <span className="ml-1 font-bold">{formatCurrency(order.amount)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Payment:</span>
                                                <span className="ml-1">{getPaymentStatusBadge(order.paymentStatus)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t pt-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewOrder(order)}
                                                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {/* Three Dots Dropdown - Mobile */}
                                                <div className="relative" data-action-menu>
                                                    <button
                                                        onClick={() => setOpenActionMenu(openActionMenu === order.id ? null : order.id)}
                                                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>

                                                    {openActionMenu === order.id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                                            <button
                                                                onClick={() => handleViewBuyer(order.buyer.id)}
                                                                className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <Users size={14} />
                                                                View Buyer
                                                            </button>
                                                            <button
                                                                onClick={() => handleViewSeller(order.seller.id)}
                                                                className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <Briefcase size={14} />
                                                                View Seller
                                                            </button>

                                                            {order.status === 'disputed' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedOrder(order);
                                                                        setShowDisputeModal(true);
                                                                        setOpenActionMenu(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-xs text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                                                                >
                                                                    <Flag size={14} />
                                                                    Resolve Dispute
                                                                </button>
                                                            )}

                                                            {order.paymentStatus === 'paid' && order.status !== 'cancelled' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedOrder(order);
                                                                        setShowRefundModal(true);
                                                                        setOpenActionMenu(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                >
                                                                    <RotateCcw size={14} />
                                                                    Process Refund
                                                                </button>
                                                            )}

                                                            <hr className="my-1 border-gray-200" />

                                                            <button
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setShowDeleteModal(true);
                                                                    setOpenActionMenu(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete Order
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                    <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No orders found</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {searchTerm ? 'Try adjusting your search' : 'No orders match the selected filters'}
                                    </p>
                                </div>
                            )}

                            {/* Mobile Pagination */}
                            {filteredOrders.length > 0 && (
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

                        {/* Order Statistics Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-blue-600" />
                                    Order Performance
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Completion Rate</span>
                                        <span className="font-medium text-gray-900">
                                            {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Avg. Order Value</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(stats.avgOrderValue)}</span>
                                    </div>
                                    {/* <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Dispute Rate</span>
                                        <span className="font-medium text-orange-600">
                                            {stats.total > 0 ? ((stats.disputed / stats.total) * 100).toFixed(1) : 0}%
                                        </span>
                                    </div> */}
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <DollarSign size={16} className="text-green-600" />
                                    Financial Summary
                                </h4>
                                <div className="space-y-2">
                                    {/* <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Platform Fees</span>
                                        <span className="font-medium text-green-600">{formatCurrency(stats.platformFees)}</span>
                                    </div> */}
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Refunded Amount</span>
                                        <span className="font-medium text-red-600">
                                            {formatCurrency(orders.filter(o => o.refundStatus === 'completed').reduce((sum, o) => sum + (o.refundAmount || 0), 0))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Held Payments</span>
                                        <span className="font-medium text-orange-600">
                                            {formatCurrency(orders.filter(o => o.paymentStatus === 'held').reduce((sum, o) => sum + o.amount, 0))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <Flag size={16} className="text-orange-600" />
                                    Disputes & Issues
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Open Disputes</span>
                                        <span className="font-medium text-orange-600">{stats.disputed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Pending Refunds</span>
                                        <span className="font-medium text-yellow-600">
                                            {orders.filter(o => o.refundStatus === 'pending').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Resolution Rate</span>
                                        <span className="font-medium text-gray-900">
                                            {stats.disputed > 0 ? '78%' : '100%'}
                                        </span>
                                    </div>
                                </div>
                            </div> */}

                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <Users size={16} className="text-purple-600" />
                                    User Impact
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Unique Buyers</span>
                                        <span className="font-medium text-gray-900">
                                            {[...new Set(orders.map(o => o.buyer.id))].length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Unique Sellers</span>
                                        <span className="font-medium text-gray-900">
                                            {[...new Set(orders.map(o => o.seller.id))].length}
                                        </span>
                                    </div>
                                    {/* <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Repeat Buyers</span>
                                        <span className="font-medium text-gray-900">34</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminContainer>
            </div>

            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                                <p className="text-sm text-gray-500 mt-1">Order ID: {selectedOrder.id}</p>
                            </div>
                            <button
                                onClick={() => setShowOrderModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Order Status */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(selectedOrder.status)}
                                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Created: {formatDate(selectedOrder.createdAt)}
                                </div>
                            </div>

                            {/* Buyer & Seller Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Users size={16} />
                                        Buyer Information
                                    </h4>
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={selectedOrder.buyer.avatar}
                                            alt={selectedOrder.buyer.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-gray-900">{selectedOrder.buyer.name}</p>
                                                {selectedOrder.buyer.verified && (
                                                    <span className="text-blue-500 text-xs">✓</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{selectedOrder.buyer.email}</p>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <MapPin size={10} />
                                                {selectedOrder.buyer.location}
                                            </p>
                                            <button
                                                onClick={() => handleViewBuyer(selectedOrder.buyer.id)}
                                                className="mt-2 text-xs text-primary hover:text-primary-dark"
                                            >
                                                View Profile →
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Briefcase size={16} />
                                        Seller Information
                                    </h4>
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={selectedOrder.seller.avatar}
                                            alt={selectedOrder.seller.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-gray-900">{selectedOrder.seller.name}</p>
                                                {selectedOrder.seller.verified && (
                                                    <span className="text-blue-500 text-xs">✓</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{selectedOrder.seller.email}</p>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <MapPin size={10} />
                                                {selectedOrder.seller.location}
                                            </p>
                                            <button
                                                onClick={() => handleViewSeller(selectedOrder.seller.id)}
                                                className="mt-2 text-xs text-primary hover:text-primary-dark"
                                            >
                                                View Profile →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <ShoppingBag size={16} />
                                    Service Details
                                </h4>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{selectedOrder.service.title}</p>
                                        <p className="text-xs text-gray-600">{selectedOrder.service.category} • {selectedOrder.service.package}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Order Type</p>
                                            <p className="text-sm font-medium">{getOrderTypeBadge(selectedOrder.orderType)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Payment Method</p>
                                            <p className="text-sm font-medium capitalize">{selectedOrder.paymentMethod?.replace('_', ' ') || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <DollarSign size={16} />
                                    Financial Details
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Order Amount</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(selectedOrder.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Platform Fee</span>
                                        <span className="font-medium text-red-600">-{formatCurrency(selectedOrder.fee)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="text-sm font-medium text-gray-700">Net Amount</span>
                                        <span className="font-bold text-green-600">{formatCurrency(selectedOrder.netAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Clock size={16} />
                                    Timeline
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Order Placed</span>
                                        <span className="text-sm font-medium">{formatDate(selectedOrder.createdAt)}</span>
                                    </div>
                                    {selectedOrder.deliveredAt && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Delivered</span>
                                            <span className="text-sm font-medium">{formatDate(selectedOrder.deliveredAt)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.completedAt && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Completed</span>
                                            <span className="text-sm font-medium">{formatDate(selectedOrder.completedAt)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.deadline && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Deadline</span>
                                            <span className="text-sm font-medium">{formatDate(selectedOrder.deadline)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.cancelledAt && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Cancelled</span>
                                            <span className="text-sm font-medium">{formatDate(selectedOrder.cancelledAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dispute Info */}
                            {selectedOrder.status === 'disputed' && (
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <Flag size={16} className="text-orange-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-orange-800">Dispute Details</p>
                                            <p className="text-sm text-orange-700 mt-1">
                                                <span className="font-medium">Reason:</span> {selectedOrder.disputeReason}
                                            </p>
                                            <p className="text-xs text-orange-600 mt-1">
                                                Opened: {formatDate(selectedOrder.disputeOpenedAt)} • Status: {selectedOrder.disputeStatus}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cancellation Info */}
                            {selectedOrder.status === 'cancelled' && selectedOrder.cancellationReason && (
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        <span className="font-medium">Cancellation Reason:</span> {selectedOrder.cancellationReason}
                                    </p>
                                    {selectedOrder.refundDate && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Refunded on {formatDate(selectedOrder.refundDate)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Review */}
                            {selectedOrder.rating && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                        Review
                                    </h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={14}
                                                    className={star <= selectedOrder.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-600">{selectedOrder.rating} out of 5</span>
                                    </div>
                                    <p className="text-sm text-gray-700 italic">"{selectedOrder.review}"</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 pt-4">
                                {selectedOrder.status === 'disputed' && (
                                    <button
                                        onClick={() => {
                                            setShowOrderModal(false);
                                            setShowDisputeModal(true);
                                        }}
                                        className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                                    >
                                        <Flag size={18} />
                                        Resolve Dispute
                                    </button>
                                )}
                                {selectedOrder.paymentStatus === 'paid' && selectedOrder.status !== 'cancelled' && (
                                    <button
                                        onClick={() => {
                                            setShowOrderModal(false);
                                            setShowRefundModal(true);
                                        }}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={18} />
                                        Process Refund
                                    </button>
                                )}
                                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                                    <MessageSquare size={18} />
                                    Message Buyer
                                </button>
                                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                                    <MessageSquare size={18} />
                                    Message Seller
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Modal */}
            {showRefundModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Process Refund</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to process a refund for order "{selectedOrder.id}"?
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Order Amount:</span>
                                <span className="font-medium">{formatCurrency(selectedOrder.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Refund Amount:</span>
                                <span className="font-bold text-red-600">{formatCurrency(selectedOrder.amount)}</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for refund
                            </label>
                            <textarea
                                id="refundReason"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter reason for refund..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRefundModal(false);
                                    setSelectedOrder(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRefundOrder(selectedOrder.id)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Process Refund
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dispute Resolution Modal */}
            {showDisputeModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Resolve Dispute</h3>
                        <p className="text-gray-600 mb-4">
                            Order ID: {selectedOrder.id}
                        </p>
                        <div className="bg-orange-50 p-3 rounded-lg mb-4">
                            <p className="text-sm text-orange-700">
                                <span className="font-medium">Dispute Reason:</span> {selectedOrder.disputeReason}
                            </p>
                        </div>
                        <div className="space-y-3 mb-4">
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="resolution"
                                    value="refund"
                                    className="w-4 h-4 text-primary"
                                />
                                <div>
                                    <span className="font-medium text-gray-900">Full Refund to Buyer</span>
                                    <p className="text-xs text-gray-500">Release payment back to buyer</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="resolution"
                                    value="release"
                                    className="w-4 h-4 text-primary"
                                />
                                <div>
                                    <span className="font-medium text-gray-900">Release to Seller</span>
                                    <p className="text-xs text-gray-500">Release payment to seller</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="resolution"
                                    value="partial"
                                    className="w-4 h-4 text-primary"
                                />
                                <div>
                                    <span className="font-medium text-gray-900">Partial Refund</span>
                                    <p className="text-xs text-gray-500">Split payment between both parties</p>
                                </div>
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDisputeModal(false);
                                    setSelectedOrder(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const selectedResolution = document.querySelector('input[name="resolution"]:checked')?.value;
                                    if (!selectedResolution) {
                                        toast.error('Please select a resolution');
                                        return;
                                    }
                                    handleResolveDispute(selectedOrder.id, selectedResolution);
                                }}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                                Resolve Dispute
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Order</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete order "{selectedOrder.id}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedOrder(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteOrder(selectedOrder.id)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Orders;