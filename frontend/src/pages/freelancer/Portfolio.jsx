// pages/Portfolio.jsx (Updated version with API integration)
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Briefcase,
    Plus,
    Edit2,
    Trash2,
    X,
    Link as LinkIcon,
    Globe,
    Image as ImageIcon,
    Calendar,
    Check,
    ExternalLink,
    Tag,
    Star,
    Loader2
} from "lucide-react";
import { Container, FreelancerContainer, FreelancerHeader, FreelancerSidebar } from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useRef } from "react";

function Portfolio() {
    const { user } = useAuth();
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

    // Fetch portfolios on mount
    useEffect(() => {
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/v1/portfolio`);
            if (response.data.success) {
                setPortfolios(response.data.data.portfolios);
            }
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            toast.error('Failed to load portfolios');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            // Append all fields
            formData.append('title', data.title);
            formData.append('description', data.description);
            if (data.link) formData.append('link', data.link);
            if (data.tags) formData.append('tags', data.tags);
            if (data.completionDate) formData.append('completionDate', data.completionDate);
            formData.append('featured', data.featured || false);

            const fileInput = fileInputRef.current;
            if (fileInput && fileInput.files && fileInput.files[0]) {
                formData.append('portfolioImage', fileInput.files[0]);
            } else if (!editingPortfolio) {
                toast.error('Please select an image');
                setIsSubmitting(false);
                return;
            }

            let response;
            if (editingPortfolio) {
                response = await axiosInstance.patch(`/api/v1/portfolio/${editingPortfolio._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await axiosInstance.post('/api/v1/portfolio', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data.success) {
                toast.success(editingPortfolio ? 'Portfolio updated successfully!' : 'Portfolio added successfully!');
                await fetchPortfolios();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving portfolio:', error);
            toast.error(error?.response?.data?.message || 'Failed to save portfolio');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleFeatured = async (portfolioId) => {
        try {
            const response = await axiosInstance.patch(`/api/v1/portfolio/${portfolioId}/toggle-featured`);
            if (response.data.success) {
                await fetchPortfolios();
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error('Error toggling featured:', error);
            toast.error(error?.response?.data?.message || 'Failed to toggle featured status');
        }
    };

    const handleDelete = async (portfolioId) => {
        if (window.confirm("Are you sure you want to delete this portfolio item?")) {
            try {
                const response = await axiosInstance.delete(`/api/v1/portfolio/${portfolioId}`);
                if (response.data.success) {
                    await fetchPortfolios();
                    toast.success('Portfolio deleted successfully!');
                }
            } catch (error) {
                console.error('Error deleting portfolio:', error);
                toast.error(error?.response?.data?.message || 'Failed to delete portfolio');
            }
        }
    };

    const handleEdit = (portfolio) => {
        setEditingPortfolio(portfolio);
        // Format date for input
        const formattedData = {
            ...portfolio,
            completionDate: portfolio.completionDate ? portfolio.completionDate.split('T')[0] : '',
            tags: portfolio.tags?.join(', ')
        };
        reset(formattedData);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setEditingPortfolio(null);
        reset({});
    };

    // Portfolio Modal Component
    const PortfolioModal = ({ isOpen, title, onSubmit, isSubmitting }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal}></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Title *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("title", { required: "Title is required" })}
                                        placeholder="Enter project title"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        {...register("description", { required: "Description is required" })}
                                        placeholder="Describe your project"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                    )}
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Portfolio Image *
                                    </label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    if (file.size > 5 * 1024 * 1024) {
                                                        toast.error("File size should not be more than 5MB");
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                }
                                            }}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Upload image (max 5MB, JPG, PNG, GIF, WEBP)</p>
                                </div>

                                {/* Project Link */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project URL
                                    </label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="url"
                                            {...register("link")}
                                            placeholder="https://example.com/project"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags (comma separated)
                                    </label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            {...register("tags")}
                                            placeholder="Web Design, UI/UX, Mobile App"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Completion Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            {...register("completionDate")}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Featured Toggle */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register("featured")}
                                        id="featured"
                                        className="w-4 h-4 text-primary rounded border-gray-300"
                                    />
                                    <label htmlFor="featured" className="text-sm text-gray-700">
                                        Mark as featured project
                                    </label>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                {editingPortfolio ? "Updating..." : "Saving..."}
                                            </>
                                        ) : (
                                            editingPortfolio ? "Update Portfolio" : "Add Portfolio"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <section className="flex min-h-screen">
                <FreelancerSidebar />
                <div className="w-full relative">
                    <FreelancerHeader />
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <Loader2 size={40} className="animate-spin text-primary" />
                    </div>
                </div>
            </section>
        );
    }

    // Calculate stats
    const totalProjects = portfolios.length;
    const featuredProjects = portfolios.filter(p => p.featured).length;
    const uniqueTags = new Set(portfolios.flatMap(p => p.tags || [])).size;
    const liveProjects = portfolios.filter(p => p.link).length;

    return (
        <section className="flex min-h-screen">
            <FreelancerSidebar />

            <div className="w-full relative">
                <FreelancerHeader />

                <FreelancerContainer>
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 py-6 md:py-8 mt-20 md:mt-0">
                        <div className="container mx-auto px-4 md:px-0">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <Briefcase size={28} className="text-primary" />
                                        Portfolio Management
                                    </h1>
                                    <p className="text-gray-600 mt-2">
                                        Showcase your best work to attract more clients
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingPortfolio(null);
                                        reset({});
                                        setIsAddModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold"
                                >
                                    <Plus size={20} />
                                    Add Portfolio Item
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="container mx-auto py-6 md:py-8 px-4 md:px-0">
                        {/* Stats Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
                                <div className="text-sm text-gray-600">Total Projects</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{featuredProjects}</div>
                                <div className="text-sm text-gray-600">Featured Projects</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{uniqueTags}</div>
                                <div className="text-sm text-gray-600">Unique Skills</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{liveProjects}</div>
                                <div className="text-sm text-gray-600">Live Projects</div>
                            </div>
                        </div>

                        {/* Featured Projects */}
                        {portfolios.filter(p => p.featured).length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Projects</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {portfolios
                                        .filter(p => p.featured)
                                        .map(portfolio => (
                                            <div key={portfolio._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={portfolio.image}
                                                        alt={portfolio.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                        }}
                                                    />
                                                    <div className="absolute top-3 right-3">
                                                        <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                                                            Featured
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-semibold text-gray-900 mb-2">{portfolio.title}</h3>
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {portfolio.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {portfolio.tags?.map((tag, index) => (
                                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-xs text-gray-500">
                                                            {portfolio.completionDate ? new Date(portfolio.completionDate).toLocaleDateString() : 'No date'}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleEdit(portfolio)}
                                                                className="p-1.5 text-gray-400 hover:text-blue-600"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            {portfolio.link && (
                                                                <a
                                                                    href={portfolio.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-1.5 text-gray-400 hover:text-primary"
                                                                    title="View Project"
                                                                >
                                                                    <ExternalLink size={16} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* All Projects */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">All Portfolio Items</h2>
                                <div className="text-sm text-gray-600">
                                    Showing {portfolios.length} projects
                                </div>
                            </div>

                            {portfolios.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                                    <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">No portfolio items yet</h3>
                                    <p className="text-gray-500 mb-6">Add your first project to showcase your work</p>
                                    <button
                                        onClick={() => {
                                            setEditingPortfolio(null);
                                            reset({});
                                            setIsAddModalOpen(true);
                                        }}
                                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
                                    >
                                        Add Your First Project
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {portfolios.map(portfolio => (
                                        <div key={portfolio._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
                                            <div className="relative h-40 overflow-hidden">
                                                <img
                                                    src={portfolio.image}
                                                    alt={portfolio.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                                            </div>
                                            <div className="p-5">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="font-semibold text-gray-900">{portfolio.title}</h3>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleToggleFeatured(portfolio._id)}
                                                            className={`p-1.5 rounded ${portfolio.featured ? 'text-amber-500 hover:text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                            title={portfolio.featured ? "Remove from featured" : "Mark as featured"}
                                                        >
                                                            <Star size={16} className={portfolio.featured ? "fill-amber-500" : ""} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(portfolio)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(portfolio._id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {portfolio.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {portfolio.tags?.map((tag, index) => (
                                                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        <span>{portfolio.completionDate ? new Date(portfolio.completionDate).toLocaleDateString() : 'No date'}</span>
                                                    </div>
                                                    {portfolio.link && (
                                                        <a
                                                            href={portfolio.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-primary hover:text-primary-dark"
                                                        >
                                                            <Globe size={14} />
                                                            <span>View Live</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modals */}
                    <PortfolioModal
                        isOpen={isAddModalOpen}
                        title="Add Portfolio Item"
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                    />

                    <PortfolioModal
                        isOpen={isEditModalOpen}
                        title="Edit Portfolio Item"
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                    />
                </FreelancerContainer>
            </div>
        </section>
    );
}

export default Portfolio;

{/* Privacy & Notification Section */}
                            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Bell size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Privacy & Notification</h2>
                                            <p className="text-gray-600 text-sm">Control your privacy and notification settings</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                                            <div className="space-y-4">
                                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-100 rounded-lg">
                                                            <Mail size={18} className="text-green-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">Email Notifications</div>
                                                            <div className="text-sm text-gray-500">Receive updates about your account via email</div>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            {...register("emailNotifications")}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </div>
                                                </label>

                                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-purple-100 rounded-lg">
                                                            <Bell size={18} className="text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">Project Updates</div>
                                                            <div className="text-sm text-gray-500">Get notified about new projects and bids</div>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            {...register("projectNotifications")}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </div>
                                                </label>

                                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-orange-100 rounded-lg">
                                                            <Mail size={18} className="text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">Marketing Emails</div>
                                                            <div className="text-sm text-gray-500">Receive newsletters and promotional offers</div>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            {...register("marketingEmails")}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-100">
                                            <button
                                                type="submit"
                                                name="update-privacy"
                                                disabled={isLoading}
                                                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? "Updating..." : "Update Privacy Settings"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}