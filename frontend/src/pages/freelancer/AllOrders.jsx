import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    Plus,
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
    TrendingUp,
    Download as ExportIcon,
    RefreshCw,
    HelpCircle,
    Send,
    Award
} from "lucide-react";
import { FreelancerSidebar, FreelancerHeader, FreelancerContainer } from '../../components';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        pending: 0,
        revenue: 0,
        avgOrderValue: 0
    });

    const navigate = useNavigate();

    // Mock data for demonstration
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // const response = await axiosInstance.get('/api/v1/freelancer/orders');

            // Mock data with freelance marketplace statuses
            // const mockOrders = [
            //     {
            //         id: "ORD-2246872",
            //         date: "2025-05-13T14:00:00",
            //         customer: {
            //             name: "Amina Al-Farooqi",
            //             avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            //             email: "amina@example.com",
            //             location: "Dubai, UAE",
            //             isVerified: true
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
            //         deliveryDate: "2025-05-20T14:00:00",
            //         completedDate: "2025-05-19T16:30:00",
            //         requirements: "Modern design with dark mode preference. Need mobile responsive design with animations.",
            //         hasReview: true,
            //         rating: 5,
            //         review: "Excellent work, delivered ahead of schedule! Very professional and great communication.",
            //         revisions: 2,
            //         messages: 8
            //     },
            //     {
            //         id: "ORD-9519785",
            //         date: "2025-05-13T14:55:00",
            //         customer: {
            //             name: "Kenji Nakamura",
            //             avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
            //             email: "kenji@example.com",
            //             location: "Tokyo, Japan",
            //             isVerified: true
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
            //         status: "active",
            //         paymentStatus: "paid",
            //         paymentMethod: "paypal",
            //         orderType: "service",
            //         deliveryDate: "2025-05-25T14:55:00",
            //         completedDate: null,
            //         requirements: "Need integration with existing inventory system and custom shipping options.",
            //         hasReview: false,
            //         revisions: 1,
            //         messages: 12
            //     },
            //     {
            //         id: "ORD-6658427",
            //         date: "2025-05-13T14:54:00",
            //         customer: {
            //             name: "Sofia Müller",
            //             avatar: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg",
            //             email: "sofia@example.com",
            //             location: "Berlin, Germany",
            //             isVerified: false
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
            //         deliveryDate: "2025-05-27T14:54:00",
            //         completedDate: null,
            //         requirements: "Business website for a bakery. Need menu display and online ordering.",
            //         hasReview: false,
            //         revisions: 2,
            //         messages: 3
            //     },
            //     {
            //         id: "ORD-9854988",
            //         date: "2025-05-13T14:46:00",
            //         customer: {
            //             name: "Amirul Hassan",
            //             avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            //             email: "amirul@example.com",
            //             location: "Kuala Lumpur, Malaysia",
            //             isVerified: true
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
            //         deliveryDate: "2025-05-18T14:46:00",
            //         completedDate: "2025-05-17T11:20:00",
            //         requirements: "Fitness app design with dark theme. Include workout tracking screens.",
            //         hasReview: true,
            //         rating: 4.5,
            //         review: "Great design work, very responsive to feedback.",
            //         revisions: 3,
            //         messages: 15
            //     },
            //     {
            //         id: "ORD-6989952",
            //         date: "2025-05-13T14:40:00",
            //         customer: {
            //             name: "Elena Petrov",
            //             avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg",
            //             email: "elena@example.com",
            //             location: "Moscow, Russia",
            //             isVerified: true
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
            //         deliveryDate: "2025-06-13T14:40:00",
            //         completedDate: null,
            //         requirements: "E-commerce website with 100+ products. Target local market.",
            //         hasReview: false,
            //         revisions: 0,
            //         messages: 6
            //     },
            //     {
            //         id: "ORD-3365479",
            //         date: "2025-05-13T14:30:00",
            //         customer: {
            //             name: "Farah Nabila",
            //             avatar: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
            //             email: "farah@example.com",
            //             location: "Jakarta, Indonesia",
            //             isVerified: false
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
            //         status: "pending",
            //         paymentStatus: "unpaid",
            //         paymentMethod: null,
            //         orderType: "custom_offer",
            //         deliveryDate: "2025-05-20T14:30:00",
            //         completedDate: null,
            //         requirements: "Need logo for a coffee shop. Prefer earthy tones.",
            //         hasReview: false,
            //         revisions: 2,
            //         messages: 2
            //     },
            //     {
            //         id: "ORD-6552589",
            //         date: "2025-05-13T13:00:00",
            //         customer: {
            //             name: "David Moretti",
            //             avatar: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg",
            //             email: "david@example.com",
            //             location: "Rome, Italy",
            //             isVerified: true
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
            //         status: "cancelled",
            //         paymentStatus: "refunded",
            //         paymentMethod: "paypal",
            //         orderType: "service",
            //         deliveryDate: "2025-05-20T13:00:00",
            //         completedDate: null,
            //         requirements: "Travel blog content about Italy",
            //         cancellationReason: "Client changed requirements",
            //         hasReview: false,
            //         revisions: 0,
            //         messages: 4
            //     },
            //     {
            //         id: "ORD-9745845",
            //         date: "2025-05-13T12:30:00",
            //         customer: {
            //             name: "Riko Tanaka",
            //             avatar: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg",
            //             email: "riko@example.com",
            //             location: "Osaka, Japan",
            //             isVerified: true
            //         },
            //         service: {
            //             id: "SVC-234",
            //             title: "Mobile App UI/UX Design",
            //             category: "Design & Creative",
            //             subcategory: "Mobile Design",
            //             image: "https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg",
            //             package: "Standard Package",
            //             features: ["5 Screens", "Wireframes", "Prototype"]
            //         },
            //         total: 185,
            //         status: "pending",
            //         paymentStatus: "unpaid",
            //         paymentMethod: null,
            //         orderType: "project",
            //         deliveryDate: "2025-05-27T12:30:00",
            //         completedDate: null,
            //         requirements: "Recipe app design with clean, minimalist style.",
            //         hasReview: false,
            //         revisions: 2,
            //         messages: 5
            //     },
            //     {
            //         id: "ORD-7891389",
            //         date: "2025-05-13T11:28:00",
            //         customer: {
            //             name: "Layla Zahra",
            //             avatar: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
            //             email: "layla@example.com",
            //             location: "Cairo, Egypt",
            //             isVerified: true
            //         },
            //         service: {
            //             id: "SVC-567",
            //             title: "SEO Optimization Service",
            //             category: "Digital Marketing",
            //             subcategory: "SEO",
            //             image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg",
            //             package: "Basic Package",
            //             features: ["Keyword Research", "On-page SEO"]
            //         },
            //         total: 45,
            //         status: "completed",
            //         paymentStatus: "paid",
            //         paymentMethod: "credit_card",
            //         orderType: "service",
            //         deliveryDate: "2025-05-18T11:28:00",
            //         completedDate: "2025-05-17T09:15:00",
            //         requirements: "Local SEO for a restaurant",
            //         hasReview: true,
            //         rating: 4,
            //         review: "Good work, improved our local search ranking.",
            //         revisions: 1,
            //         messages: 7
            //     },
            //     {
            //         id: "ORD-3669852",
            //         date: "2025-05-13T11:25:00",
            //         customer: {
            //             name: "Luca Fernandez",
            //             avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
            //             email: "luca@example.com",
            //             location: "Barcelona, Spain",
            //             isVerified: false
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
            //         total: 35,
            //         status: "pending",
            //         paymentStatus: "unpaid",
            //         paymentMethod: null,
            //         orderType: "custom_offer",
            //         deliveryDate: "2025-05-20T11:25:00",
            //         completedDate: null,
            //         requirements: "Logo for a surf shop with ocean theme.",
            //         hasReview: false,
            //         revisions: 2,
            //         messages: 1
            //     },
            //     {
            //         id: "ORD-9452687",
            //         date: "2025-05-13T11:00:00",
            //         customer: {
            //             name: "Nurul Azizah",
            //             avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
            //             email: "nurul@example.com",
            //             location: "Singapore",
            //             isVerified: true
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
            //         total: 128,
            //         status: "active",
            //         paymentStatus: "paid",
            //         paymentMethod: "bank_transfer",
            //         orderType: "service",
            //         deliveryDate: "2025-05-25T11:00:00",
            //         completedDate: null,
            //         requirements: "Online store for handmade crafts",
            //         hasReview: false,
            //         revisions: 2,
            //         messages: 9
            //     },
            //     {
            //         id: "ORD-4457996",
            //         date: "2025-05-13T10:50:00",
            //         customer: {
            //             name: "Alexei Kasimov",
            //             avatar: "https://images.pexels.com/photos/428361/pexels-photo-428361.jpeg",
            //             email: "alexei@example.com",
            //             location: "Kyiv, Ukraine",
            //             isVerified: true
            //         },
            //         service: {
            //             id: "SVC-789",
            //             title: "WordPress Website Development",
            //             category: "Development & IT",
            //             subcategory: "WordPress",
            //             image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
            //             package: "Premium Package",
            //             features: ["Theme Setup", "10 Pages", "Contact Form", "SEO Plugin", "Speed Optimization"]
            //         },
            //         total: 240,
            //         status: "cancelled",
            //         paymentStatus: "refunded",
            //         paymentMethod: "paypal",
            //         orderType: "service",
            //         deliveryDate: "2025-05-25T10:50:00",
            //         completedDate: null,
            //         cancellationReason: "Client decided to use in-house team",
            //         hasReview: false,
            //         revisions: 0,
            //         messages: 6
            //     },
            //     {
            //         id: "ORD-9856274",
            //         date: "2025-05-13T10:40:00",
            //         customer: {
            //             name: "Hana Qureshi",
            //             avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
            //             email: "hana@example.com",
            //             location: "Karachi, Pakistan",
            //             isVerified: true
            //         },
            //         service: {
            //             id: "SVC-123",
            //             title: "I will design professional website UI/UX",
            //             category: "Design & Creative",
            //             subcategory: "UI/UX Design",
            //             image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
            //             package: "Standard Package",
            //             features: ["3 Pages", "Responsive Design", "Source Files"]
            //         },
            //         total: 160,
            //         status: "completed",
            //         paymentStatus: "paid",
            //         paymentMethod: "credit_card",
            //         orderType: "service",
            //         deliveryDate: "2025-05-20T10:40:00",
            //         completedDate: "2025-05-18T14:20:00",
            //         requirements: "Portfolio website for photographer",
            //         hasReview: true,
            //         rating: 5,
            //         review: "Beautiful design, exactly what I wanted!",
            //         revisions: 2,
            //         messages: 11
            //     }
            // ];

            setTimeout(() => {
                setOrders([]);
                calculateStats([]);
                setLoading(false);
            }, 1000);

            // if (response.data.success) {
            //     setOrders(response.data.data);
            //     calculateStats(response.data.data);
            // }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
            setLoading(false);
        }
    };

    const calculateStats = (ordersData) => {
        const stats = {
            total: ordersData.length,
            active: ordersData.filter(o => o.status === 'active').length,
            completed: ordersData.filter(o => o.status === 'completed').length,
            cancelled: ordersData.filter(o => o.status === 'cancelled').length,
            pending: ordersData.filter(o => o.status === 'pending').length,
            revenue: ordersData.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
            avgOrderValue: 0
        };
        stats.avgOrderValue = stats.revenue / (stats.completed + stats.active) || 0;
        setStats(stats);
    };

    const statusConfig = {
        active: {
            label: 'Active',
            bg: 'bg-green-100',
            text: 'text-green-700',
            icon: RefreshCw,
            description: 'Order is in progress'
        },
        completed: {
            label: 'Completed',
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            icon: CheckCircle,
            description: 'Order successfully delivered'
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
            icon: Clock,
            description: 'Awaiting payment or confirmation'
        }
    };

    const paymentStatusConfig = {
        paid: { label: 'Paid', bg: 'bg-green-100', text: 'text-green-700' },
        unpaid: { label: 'Unpaid', bg: 'bg-yellow-100', text: 'text-yellow-700' },
        refunded: { label: 'Refunded', bg: 'bg-gray-100', text: 'text-gray-700' }
    };

    const orderTypeConfig = {
        service: { label: 'Service', icon: ShoppingBag, bg: 'bg-purple-100', text: 'text-purple-700' },
        custom_offer: { label: 'Custom Offer', icon: Award, bg: 'bg-indigo-100', text: 'text-indigo-700' },
        project: { label: 'Project', icon: FileText, bg: 'bg-orange-100', text: 'text-orange-700' }
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

    const getOrderTypeBadge = (type) => {
        const config = orderTypeConfig[type] || orderTypeConfig.service;
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon size={12} />
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
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
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                order.id.toLowerCase().includes(term) ||
                order.customer.name.toLowerCase().includes(term) ||
                order.service.title.toLowerCase().includes(term) ||
                order.service.category.toLowerCase().includes(term);
            if (!matchesSearch) return false;
        }

        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) return false;

        // Type filter
        if (typeFilter !== 'all' && order.orderType !== typeFilter) return false;

        // Date range filter (modified to include future dates)
        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const orderDate = new Date(order.date);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            // Only filter if order date is older than cutoff (don't filter future dates)
            if (orderDate < cutoff && orderDate < new Date()) return false;
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

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            // await axiosInstance.patch(`/api/v1/orders/${orderId}/status`, { status: newStatus });

            // Optimistic update
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            // Recalculate stats
            const updatedOrders = orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            calculateStats(updatedOrders);

            toast.success(`Order status updated to ${statusConfig[newStatus].label}`);
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const handleDeliverOrder = async (orderId) => {
        try {
            // await axiosInstance.post(`/api/v1/orders/${orderId}/deliver`);

            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'completed', completedDate: new Date().toISOString() } : order
            ));

            calculateStats(orders);
            toast.success('Order delivered successfully!');
        } catch (error) {
            toast.error('Failed to deliver order');
        }
    };

    if (loading) {
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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
                            <p className="text-gray-600 mt-1">Manage and track all your client orders</p>
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
                                to="/freelancer/services/create"
                                className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                            >
                                <Plus size={18} />
                                Create Service
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
                                    <RefreshCw size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Active</p>
                                    <p className="text-2xl font-bold">{stats.active}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CheckCircle size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold">{stats.completed}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock size={20} className="text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold">{stats.pending}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <DollarSign size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Revenue</p>
                                    <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
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
                                    placeholder="Search by order ID, customer, service..."
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
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[140px]"
                                >
                                    <option value="all">All Types</option>
                                    <option value="service">Services</option>
                                    <option value="custom_offer">Custom Offers</option>
                                    <option value="project">Projects</option>
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

                    {/* Orders Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Service
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order Details
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentOrders.length > 0 ? (
                                        currentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 max-w-xs">
                                                    <div className="flex items-start gap-2">
                                                        <img
                                                            src={order.service.image}
                                                            alt={order.service.title}
                                                            className="w-20 h-14 rounded object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={order.customer.avatar}
                                                            alt={order.customer.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-gray-900 flex items-center gap-1">
                                                                {order.customer.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">{order.customer.location}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        {/* <div className="font-medium text-gray-900">{order.id}</div> */}
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            <span>Start:</span>
                                                            <span>{formatDate(order?.date)}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            <span>End:</span>
                                                            <span>{formatDate(order?.deliveryDate)}</span>
                                                        </div>
                                                        {/* {getOrderTypeBadge(order.orderType)} */}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{formatCurrency(order.total)}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(order.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleViewOrder(order)}
                                                            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        {order.status === 'pending' && order.paymentStatus === 'paid' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, 'active')}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Start Order"
                                                            >
                                                                <RefreshCw size={18} />
                                                            </button>
                                                        )}
                                                        {order.status === 'active' && (
                                                            <button
                                                                onClick={() => handleDeliverOrder(order.id)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Deliver Order"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                        )}
                                                        <Link
                                                            to={`/messages?order=${order.id}`}
                                                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                            title="Messages"
                                                        >
                                                            <MessageCircle size={18} />
                                                            {order.messages > 0 && (
                                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                                                    {order.messages}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                                                        <ShoppingBag size={24} className="text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-500 font-medium">No orders found</p>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                                                            ? 'Try adjusting your filters'
                                                            : 'You haven\'t received any orders yet'}
                                                    </p>
                                                    {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                                                        <Link
                                                            to="/freelancer/services/all"
                                                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                                        >
                                                            View Your Services
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
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} entries
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg ${currentPage === pageNum
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <>
                                            <span>...</span>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="w-8 h-8 rounded-lg hover:bg-gray-100"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
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

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <TrendingUp size={18} className="text-primary" />
                                Performance
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Avg. Order Value</span>
                                    <span className="font-medium">{formatCurrency(stats.avgOrderValue)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Completion Rate</span>
                                    <span className="font-medium">
                                        {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Active Orders</span>
                                    <span className="font-medium">{stats.active}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Award size={18} className="text-primary" />
                                Reviews
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className={star <= 4.5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-medium">4.5</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Orders with review</span>
                                    <span className="font-medium">{orders.filter(o => o.hasReview).length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Pending reviews</span>
                                    <span className="font-medium">{orders.filter(o => o.status === 'completed' && !o.hasReview).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </FreelancerContainer>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                            <button
                                onClick={() => setShowOrderDetails(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Order Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="text-lg font-bold">{selectedOrder.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <User size={16} />
                                    Customer Information
                                </h4>
                                <div className="flex items-start gap-3">
                                    <img
                                        src={selectedOrder.customer.avatar}
                                        alt={selectedOrder.customer.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium flex items-center gap-1">
                                            {selectedOrder.customer.name}
                                        </p>
                                        <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.customer.location}</p>
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
                                    Client Requirements
                                </h4>
                                <p className="text-gray-700">{selectedOrder.requirements}</p>
                            </div>

                            {/* Timeline */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Clock size={16} />
                                    Timeline
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Order Date</span>
                                        <span className="font-medium">{formatDate(selectedOrder.date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Delivery Date</span>
                                        <span className="font-medium">{formatDate(selectedOrder.deliveryDate)}</span>
                                    </div>
                                    {selectedOrder.completedDate && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Completed Date</span>
                                            <span className="font-medium">{formatDate(selectedOrder.completedDate)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <DollarSign size={16} />
                                    Payment Information
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Subtotal</span>
                                        <span className="font-medium">{formatCurrency(selectedOrder.total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Service Fee</span>
                                        <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.total * 0.1)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="font-medium">Your Earnings</span>
                                        <span className="font-bold text-primary">{formatCurrency(selectedOrder.total * 0.9)}</span>
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

                            {/* Review */}
                            {selectedOrder.hasReview && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                        <Star size={16} className="fill-yellow-400" />
                                        Client Review
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
                                        <span className="text-sm font-medium">{selectedOrder.rating} out of 5</span>
                                    </div>
                                    <p className="text-gray-700 italic">"{selectedOrder.review}"</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                {selectedOrder.status === 'active' && (
                                    <button
                                        onClick={() => {
                                            handleDeliverOrder(selectedOrder.id);
                                            setShowOrderDetails(false);
                                        }}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                    >
                                        Deliver Order
                                    </button>
                                )}
                                <Link
                                    to={`/messages?order=${selectedOrder.id}`}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                                >
                                    Message Client
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AllOrders;