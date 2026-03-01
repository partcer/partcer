import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    Eye,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Calendar,
    DollarSign,
    User,
    FileText,
    ShoppingBag,
    MessageCircle,
    Star,
    RefreshCw,
    HelpCircle,
    Download as ExportIcon,
    Package,
    Truck,
    RotateCcw,
    ThumbsUp,
    LineChart,
    CheckSquare,
    Hourglass
} from "lucide-react";
import { BuyerSidebar, BuyerHeader, BuyerContainer } from '../../components';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        pending: 0,
        delivered: 0,
        totalSpent: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // const response = await axiosInstance.get('/api/v1/buyer/orders');

            // Mock data for buyer orders
            // const mockOrders = [
            //     {
            //         id: "ORD-2246872",
            //         date: "2025-05-13T14:00:00",
            //         seller: {
            //             name: "Amina Al-Farooqi",
            //             avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            //             email: "amina@example.com",
            //             location: "Dubai, UAE",
            //             isVerified: true,
            //             responseTime: "< 1 hour",
            //             completedOrders: 347
            //         },
            //         service: {
            //             id: "SVC-123",
            //             title: "I will design professional website UI/UX",
            //             category: "Design & Creative",
            //             subcategory: "UI/UX Design",
            //             image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
            //             package: "Premium Package",
            //             features: ["5 Pages", "Responsive Design", "Source Files", "3 Revisions"]
            //         },
            //         total: 500,
            //         status: "completed",
            //         paymentStatus: "paid",
            //         paymentMethod: "credit_card",
            //         orderType: "service",
            //         expectedDelivery: "2025-05-20T14:00:00",
            //         actualDelivery: "2025-05-19T16:30:00",
            //         requirements: "Modern design with dark mode preference. Need mobile responsive design with animations.",
            //         hasReview: true,
            //         rating: 5,
            //         review: "Excellent work, delivered ahead of schedule! Very professional and great communication.",
            //         revisions: 2,
            //         messages: 8,
            //         files: [
            //             { name: "design-mockup.fig", size: "24 MB", url: "#" },
            //             { name: "assets.zip", size: "156 MB", url: "#" }
            //         ]
            //     },
            //     {
            //         id: "ORD-9519785",
            //         date: "2025-05-13T14:55:00",
            //         seller: {
            //             name: "Kenji Nakamura",
            //             avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
            //             email: "kenji@example.com",
            //             location: "Tokyo, Japan",
            //             isVerified: true,
            //             responseTime: "< 2 hours",
            //             completedOrders: 892
            //         },
            //         service: {
            //             id: "SVC-456",
            //             title: "Custom E-commerce Development",
            //             category: "Development & IT",
            //             subcategory: "E-commerce Development",
            //             image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg",
            //             package: "Standard Package",
            //             features: ["5 Products", "Payment Gateway", "Inventory Management"]
            //         },
            //         total: 200,
            //         status: "delivered",
            //         paymentStatus: "paid",
            //         paymentMethod: "paypal",
            //         orderType: "service",
            //         expectedDelivery: "2025-05-25T14:55:00",
            //         actualDelivery: "2025-05-22T10:30:00",
            //         requirements: "Need integration with existing inventory system and custom shipping options.",
            //         hasReview: false,
            //         revisions: 1,
            //         messages: 12,
            //         files: [
            //             { name: "ecommerce-source.zip", size: "89 MB", url: "#" }
            //         ]
            //     },
            //     {
            //         id: "ORD-6658427",
            //         date: "2025-05-13T14:54:00",
            //         seller: {
            //             name: "Sofia Müller",
            //             avatar: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg",
            //             email: "sofia@example.com",
            //             location: "Berlin, Germany",
            //             isVerified: false,
            //             responseTime: "< 3 hours",
            //             completedOrders: 156
            //         },
            //         service: {
            //             id: "SVC-789",
            //             title: "WordPress Website Development",
            //             category: "Development & IT",
            //             subcategory: "WordPress",
            //             image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
            //             package: "Basic Package",
            //             features: ["Theme Setup", "5 Pages", "Contact Form"]
            //         },
            //         total: 150,
            //         status: "pending",
            //         paymentStatus: "unpaid",
            //         paymentMethod: null,
            //         orderType: "service",
            //         expectedDelivery: "2025-05-27T14:54:00",
            //         requirements: "Business website for a bakery. Need menu display and online ordering.",
            //         hasReview: false,
            //         revisions: 2,
            //         messages: 3,
            //         files: []
            //     },
            //     {
            //         id: "ORD-9854988",
            //         date: "2025-05-13T14:46:00",
            //         seller: {
            //             name: "Amirul Hassan",
            //             avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            //             email: "amirul@example.com",
            //             location: "Kuala Lumpur, Malaysia",
            //             isVerified: true,
            //             responseTime: "< 1 hour",
            //             completedOrders: 423
            //         },
            //         service: {
            //             id: "SVC-234",
            //             title: "Mobile App UI/UX Design",
            //             category: "Design & Creative",
            //             subcategory: "Mobile Design",
            //             image: "https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg",
            //             package: "Premium Package",
            //             features: ["10 Screens", "Prototype", "Source Files", "Animations"]
            //         },
            //         total: 200,
            //         status: "completed",
            //         paymentStatus: "paid",
            //         paymentMethod: "bank_transfer",
            //         orderType: "service",
            //         expectedDelivery: "2025-05-18T14:46:00",
            //         actualDelivery: "2025-05-17T11:20:00",
            //         requirements: "Fitness app design with dark theme. Include workout tracking screens.",
            //         hasReview: true,
            //         rating: 4.5,
            //         review: "Great design work, very responsive to feedback.",
            //         revisions: 3,
            //         messages: 15,
            //         files: [
            //             { name: "app-design.fig", size: "45 MB", url: "#" },
            //             { name: "prototype.mp4", size: "32 MB", url: "#" }
            //         ]
            //     },
            //     {
            //         id: "ORD-6989952",
            //         date: "2025-05-13T14:40:00",
            //         seller: {
            //             name: "Elena Petrov",
            //             avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg",
            //             email: "elena@example.com",
            //             location: "Moscow, Russia",
            //             isVerified: true,
            //             responseTime: "< 2 hours",
            //             completedOrders: 678
            //         },
            //         service: {
            //             id: "SVC-567",
            //             title: "SEO Optimization Service",
            //             category: "Digital Marketing",
            //             subcategory: "SEO",
            //             image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg",
            //             package: "Standard Package",
            //             features: ["Keyword Research", "On-page SEO", "Monthly Report"]
            //         },
            //         total: 300,
            //         status: "active",
            //         paymentStatus: "paid",
            //         paymentMethod: "credit_card",
            //         orderType: "service",
            //         expectedDelivery: "2025-06-13T14:40:00",
            //         requirements: "E-commerce website with 100+ products. Target local market.",
            //         hasReview: false,
            //         revisions: 0,
            //         messages: 6,
            //         files: []
            //     },
            //     {
            //         id: "ORD-3365479",
            //         date: "2025-05-13T14:30:00",
            //         seller: {
            //             name: "Farah Nabila",
            //             avatar: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
            //             email: "farah@example.com",
            //             location: "Jakarta, Indonesia",
            //             isVerified: false,
            //             responseTime: "< 5 hours",
            //             completedOrders: 89
            //         },
            //         service: {
            //             id: "SVC-890",
            //             title: "Logo Design Package",
            //             category: "Design & Creative",
            //             subcategory: "Logo Design",
            //             image: "https://images.pexels.com/photos/57690/pexels-photo-57690.jpeg",
            //             package: "Basic Package",
            //             features: ["3 Concepts", "Source Files", "2 Revisions"]
            //         },
            //         total: 80,
            //         status: "cancelled",
            //         paymentStatus: "refunded",
            //         paymentMethod: "credit_card",
            //         orderType: "custom_offer",
            //         expectedDelivery: "2025-05-20T14:30:00",
            //         requirements: "Need logo for a coffee shop. Prefer earthy tones.",
            //         cancellationReason: "Seller unable to meet requirements",
            //         hasReview: false,
            //         revisions: 2,
            //         messages: 2,
            //         files: []
            //     },
            //     {
            //         id: "ORD-6552589",
            //         date: "2025-05-13T13:00:00",
            //         seller: {
            //             name: "David Moretti",
            //             avatar: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg",
            //             email: "david@example.com",
            //             location: "Rome, Italy",
            //             isVerified: true,
            //             responseTime: "< 2 hours",
            //             completedOrders: 234
            //         },
            //         service: {
            //             id: "SVC-901",
            //             title: "Content Writing - Blog Posts",
            //             category: "Writing & Translation",
            //             subcategory: "Content Writing",
            //             image: "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg",
            //             package: "Standard Package",
            //             features: ["5 Blog Posts", "1000 words each", "SEO Optimized"]
            //         },
            //         total: 125,
            //         status: "active",
            //         paymentStatus: "paid",
            //         paymentMethod: "paypal",
            //         orderType: "service",
            //         expectedDelivery: "2025-05-25T13:00:00",
            //         requirements: "Travel blog content about Italy",
            //         hasReview: false,
            //         revisions: 2,
            //         messages: 8,
            //         files: []
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

    // Add this useEffect to handle clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.relative')) {
                setSelectedOrderId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const calculateStats = (ordersData) => {
        const stats = {
            total: ordersData.length,
            active: ordersData.filter(o => o.status === 'active').length,
            delivered: ordersData.filter(o => o.status === 'delivered').length,
            completed: ordersData.filter(o => o.status === 'completed').length,
            cancelled: ordersData.filter(o => o.status === 'cancelled').length,
            pending: ordersData.filter(o => o.status === 'pending').length,
            totalSpent: ordersData.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0)
        };
        setStats(stats);
    };

    const statusConfig = {
        active: {
            label: 'In Progress',
            bg: 'bg-green-100',
            text: 'text-green-700',
            icon: Clock,
            description: 'Seller is working on your order'
        },
        delivered: {
            label: 'Delivered',
            bg: 'bg-purple-100',
            text: 'text-purple-700',
            icon: Package,
            description: 'Order has been delivered, pending your review'
        },
        completed: {
            label: 'Completed',
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            icon: CheckCircle,
            description: 'Order successfully completed'
        },
        cancelled: {
            label: 'Cancelled',
            bg: 'bg-red-100',
            text: 'text-red-700',
            icon: XCircle,
            description: 'Order was cancelled'
        },
        pending: {
            label: 'Pending',
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
            icon: AlertCircle,
            description: 'Awaiting seller confirmation'
        }
    };

    const paymentStatusConfig = {
        paid: { label: 'Paid', bg: 'bg-green-100', text: 'text-green-700' },
        unpaid: { label: 'Unpaid', bg: 'bg-yellow-100', text: 'text-yellow-700' },
        refunded: { label: 'Refunded', bg: 'bg-gray-100', text: 'text-gray-700' }
    };

    const getStatusBadge = (status) => {
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon size={12} />
                {config.label}
            </span>
        );
    };

    const getPaymentBadge = (paymentStatus) => {
        const config = paymentStatusConfig[paymentStatus] || paymentStatusConfig.unpaid;
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
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
            minimumFractionDigits: 2
        }).format(amount);
    };

    const filteredOrders = orders.filter(order => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                order.id.toLowerCase().includes(term) ||
                order.seller.name.toLowerCase().includes(term) ||
                order.service.title.toLowerCase().includes(term);
            if (!matchesSearch) return false;
        }

        if (statusFilter !== 'all' && order.status !== statusFilter) return false;

        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const orderDate = new Date(order.date);
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

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleDeliveredConfirm = async (orderId) => {
        try {
            // await axiosInstance.post(`/api/v1/buyer/orders/${orderId}/confirm`);
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'completed' } : order
            ));
            calculateStats(orders);
            toast.success('Order marked as completed! Don\'t forget to leave a review.');
            setShowOrderDetails(false);
        } catch (error) {
            toast.error('Failed to confirm order');
        }
    };

    const handleRequestModification = async (orderId) => {
        try {
            toast.success('Modification request sent to seller');
        } catch (error) {
            toast.error('Failed to send request');
        }
    };

    const handleSubmitReview = async () => {
        try {
            // await axiosInstance.post(`/api/v1/buyer/orders/${selectedOrder.id}/review`, reviewData);
            setOrders(orders.map(order =>
                order.id === selectedOrder.id
                    ? { ...order, hasReview: true, rating: reviewData.rating, review: reviewData.comment }
                    : order
            ));
            toast.success('Review submitted successfully!');
            setShowReviewModal(false);
            setReviewData({ rating: 5, comment: '' });
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                // await axiosInstance.post(`/api/v1/buyer/orders/${orderId}/cancel`);
                setOrders(orders.map(order =>
                    order.id === orderId ? { ...order, status: 'cancelled' } : order
                ));
                calculateStats(orders);
                toast.success('Order cancelled successfully');
            } catch (error) {
                toast.error('Failed to cancel order');
            }
        }
    };

    const getDeliveryStatus = (expectedDelivery, actualDelivery, status) => {
        if (actualDelivery) {
            const expected = new Date(expectedDelivery);
            const actual = new Date(actualDelivery);
            if (actual < expected) {
                return { text: 'Early', color: 'text-green-600', icon: ThumbsUp };
            } else if (actual > expected) {
                return { text: 'Late', color: 'text-red-600', icon: AlertCircle };
            } else {
                return { text: 'On Time', color: 'text-blue-600', icon: CheckCircle };
            }
        }
        return null;
    };

    if (loading) {
        return (
            <section className="flex min-h-screen bg-gray-50">
                <BuyerSidebar />
                <div className="w-full relative">
                    <BuyerHeader />
                    <BuyerContainer>
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    </BuyerContainer>
                </div>
            </section>
        );
    }

    return (
        <section className="flex min-h-screen bg-gray-50">
            <BuyerSidebar />
            <div className="w-full relative">
                <BuyerHeader />
                <BuyerContainer>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-20 md:mt-0">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-gray-600 mt-1">Track and manage all your purchases</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                            <button
                                onClick={() => fetchOrders()}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <RefreshCw size={18} />
                                Refresh
                            </button>
                            <Link
                                to="/services"
                                className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                            >
                                <ShoppingBag size={18} />
                                Browse Services
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <ShoppingBag size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <LineChart size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">In Progress</p>
                                    <p className="text-2xl text-green-600 font-bold">{stats.active}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <CheckSquare size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-2xl text-purple-600 font-bold">{stats.completed}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Hourglass size={20} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-2xl text-orange-600 font-bold">{stats.pending}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-100 rounded-lg">
                                    <DollarSign size={20} className="text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                    <p className="text-2xl text-teal-600 font-bold">{formatCurrency(stats.totalSpent)}</p>
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
                                    placeholder="Search by order ID, seller, service..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[140px]"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">In Progress</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
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
                    </div>

                    {/* Orders Table - Mobile Friendly */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                        {/* Mobile View */}
                        <div className="block md:hidden">
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order) => (
                                    <div key={order.id} className="p-4 border-b border-gray-200 hover:bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                {/* <span className="text-xs text-gray-500">{order.id}</span> */}
                                                <h3 className="font-medium text-gray-900">{order.service.title}</h3>
                                            </div>
                                            {getStatusBadge(order.status)}
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <img
                                                src={order.seller.avatar}
                                                alt={order.seller.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            <span className="text-sm text-gray-600">{order.seller.name}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                            <div>
                                                <span className="text-gray-500">Amount:</span>
                                                <span className="ml-1 font-medium">{formatCurrency(order.total)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Delivery:</span>
                                                <span className="ml-1">{formatDate(order.expectedDelivery)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewOrder(order)}
                                                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <Link
                                                    to={`/buyer/messages?order=${order.id}`}
                                                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg relative"
                                                >
                                                    <MessageCircle size={18} />
                                                    {order.messages > 0 && (
                                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                            {order.messages}
                                                        </span>
                                                    )}
                                                </Link>
                                            </div>
                                            {order.status === 'delivered' && !order.hasReview && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowReviewModal(true);
                                                    }}
                                                    className="text-xs bg-primary text-white px-3 py-1 rounded-lg"
                                                >
                                                    Review
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">No orders found</p>
                                </div>
                            )}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Order</th> */}
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentOrders.length > 0 ? (
                                        currentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                {/* <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                                    <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
                                                </td> */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={order.seller.avatar}
                                                            alt={order.seller.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                                {order.seller.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">{order.seller.location}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <div className="text-sm text-gray-900 line-clamp-2">{order.service.title}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{order.service.package}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{formatCurrency(order.total)}</div>
                                                    <div className="text-xs text-gray-500">{getPaymentBadge(order.paymentStatus)}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{formatDate(order.expectedDelivery)}</div>
                                                    {order.actualDelivery && (
                                                        <div className="text-xs text-green-600">Delivered: {formatDate(order.actualDelivery)}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(order.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setSelectedOrderId(order.id === selectedOrderId ? null : order.id)}
                                                            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                                                            title="Actions"
                                                        >
                                                            <MoreVertical size={18} />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {selectedOrderId === order.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                                                <button
                                                                    onClick={() => {
                                                                        handleViewOrder(order);
                                                                        setSelectedOrderId(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                                >
                                                                    <Eye size={16} />
                                                                    View Details
                                                                </button>

                                                                <Link
                                                                    to={`/buyer/messages?order=${order.id}`}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                                >
                                                                    <MessageCircle size={16} />
                                                                    Messages
                                                                    {order.messages > 0 && (
                                                                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                            {order.messages}
                                                                        </span>
                                                                    )}
                                                                </Link>

                                                                {order.status === 'delivered' && !order.hasReview && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedOrder(order);
                                                                            setShowReviewModal(true);
                                                                            setSelectedOrderId(null);
                                                                        }}
                                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                                    >
                                                                        <Star size={16} />
                                                                        Leave Review
                                                                    </button>
                                                                )}

                                                                {order.status === 'active' && (
                                                                    <button
                                                                        onClick={() => {
                                                                            handleRequestModification(order.id);
                                                                            setSelectedOrderId(null);
                                                                        }}
                                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                                    >
                                                                        <RotateCcw size={16} />
                                                                        Request Changes
                                                                    </button>
                                                                )}

                                                                {order.status === 'pending' && (
                                                                    <button
                                                                        onClick={() => {
                                                                            handleCancelOrder(order.id);
                                                                            setSelectedOrderId(null);
                                                                        }}
                                                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                    >
                                                                        <XCircle size={16} />
                                                                        Cancel Order
                                                                    </button>
                                                                )}

                                                                {order.files && order.files.length > 0 && (
                                                                    <button
                                                                        onClick={() => {
                                                                            // Handle download all files
                                                                            setSelectedOrderId(null);
                                                                        }}
                                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                                    >
                                                                        <Download size={16} />
                                                                        Download Files
                                                                    </button>
                                                                )}

                                                                <hr className="my-1 border-gray-200" />

                                                                <button
                                                                    onClick={() => {
                                                                        // Handle report issue
                                                                        setSelectedOrderId(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                                                                >
                                                                    <AlertCircle size={16} />
                                                                    Report Issue
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <ShoppingBag size={40} className="text-gray-300 mb-3" />
                                                    <p className="text-gray-500 font-medium">No orders found</p>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {searchTerm || statusFilter !== 'all'
                                                            ? 'Try adjusting your filters'
                                                            : 'You haven\'t placed any orders yet'}
                                                    </p>
                                                    {!searchTerm && statusFilter === 'all' && (
                                                        <Link
                                                            to="/buyer/services"
                                                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                                        >
                                                            Browse Services
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
                        {filteredOrders.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-500">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </BuyerContainer>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                                <p className="text-sm text-gray-500">{selectedOrder.id}</p>
                            </div>
                            <button
                                onClick={() => setShowOrderDetails(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status and Delivery */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>{getStatusBadge(selectedOrder.status)}</div>
                                {selectedOrder.status === 'delivered' && (
                                    <button
                                        onClick={() => handleDeliveredConfirm(selectedOrder.id)}
                                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Confirm Delivery
                                    </button>
                                )}
                            </div>

                            {/* Seller Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <User size={16} />
                                    Seller Information
                                </h4>
                                <div className="flex items-start gap-3">
                                    <img
                                        src={selectedOrder.seller.avatar}
                                        alt={selectedOrder.seller.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium flex items-center gap-1">
                                            {selectedOrder.seller.name}
                                        </p>
                                        <p className="text-sm text-gray-600">{selectedOrder.seller.location}</p>
                                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">Response Time</span>
                                                <p className="font-medium">{selectedOrder.seller.responseTime}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Completed Orders</span>
                                                <p className="font-medium">{selectedOrder.seller.completedOrders}+</p>
                                            </div>
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
                                <div className="flex gap-3">
                                    <img
                                        src={selectedOrder.service.image}
                                        alt={selectedOrder.service.title}
                                        className="w-16 h-16 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{selectedOrder.service.title}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.service.category} • {selectedOrder.service.subcategory}</p>
                                        <p className="text-sm text-gray-600">Package: {selectedOrder.service.package}</p>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {selectedOrder.service.features.map((feature, idx) => (
                                                <span key={idx} className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <FileText size={16} />
                                    Your Requirements
                                </h4>
                                <p className="text-gray-700">{selectedOrder.requirements}</p>
                            </div>

                            {/* Delivery Timeline */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Truck size={16} />
                                    Delivery Timeline
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Order Placed</span>
                                        <span className="font-medium">{formatDateTime(selectedOrder.date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Expected Delivery</span>
                                        <span className="font-medium">{formatDateTime(selectedOrder.expectedDelivery)}</span>
                                    </div>
                                    {selectedOrder.actualDelivery && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Actual Delivery</span>
                                            <span className="font-medium text-green-600">{formatDateTime(selectedOrder.actualDelivery)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delivered Files */}
                            {selectedOrder.files && selectedOrder.files.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Package size={16} />
                                        Delivered Files
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedOrder.files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-gray-400" />
                                                    <span className="text-sm">{file.name}</span>
                                                    <span className="text-xs text-gray-500">({file.size})</span>
                                                </div>
                                                <a
                                                    href={file.url}
                                                    download
                                                    className="p-1 text-primary hover:bg-primary/10 rounded"
                                                >
                                                    <Download size={16} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payment Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <DollarSign size={16} />
                                    Payment Information
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Amount</span>
                                        <span className="font-bold">{formatCurrency(selectedOrder.total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Payment Status</span>
                                        <span>{getPaymentBadge(selectedOrder.paymentStatus)}</span>
                                    </div>
                                    {selectedOrder.paymentMethod && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Payment Method</span>
                                            <span className="font-medium capitalize">{selectedOrder.paymentMethod.replace('_', ' ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Review Section */}
                            {selectedOrder.hasReview && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Star size={16} className="fill-yellow-400" />
                                        Your Review
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
                                    </div>
                                    <p className="text-gray-700 italic">"{selectedOrder.review}"</p>
                                </div>
                            )}

                            {/* Cancellation Reason */}
                            {selectedOrder.status === 'cancelled' && selectedOrder.cancellationReason && (
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        <strong>Cancellation Reason:</strong> {selectedOrder.cancellationReason}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Link
                                    to={`/buyer/messages?order=${selectedOrder.id}`}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                                >
                                    Message Seller
                                </Link>
                                {selectedOrder.status === 'active' && (
                                    <button
                                        onClick={() => handleRequestModification(selectedOrder.id)}
                                        className="flex-1 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                                    >
                                        Request Changes
                                    </button>
                                )}
                                {selectedOrder.status === 'delivered' && !selectedOrder.hasReview && (
                                    <button
                                        onClick={() => {
                                            setShowReviewModal(true);
                                            setShowOrderDetails(false);
                                        }}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                    >
                                        Leave a Review
                                    </button>
                                )}
                                {selectedOrder.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancelOrder(selectedOrder.id)}
                                        className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Leave a Review</h3>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                size={24}
                                                className={star <= reviewData.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Review
                                </label>
                                <textarea
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    rows={4}
                                    placeholder="Share your experience with this seller..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AllOrders;