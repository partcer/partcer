import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    MapPin,
    Briefcase,
    Calendar,
    ChevronRight,
    Star,
    Mail,
    Phone,
    Globe,
    Award,
    BookOpen,
    CheckCircle,
    Clock,
    DollarSign,
    Users,
    ThumbsUp,
    MessageCircle,
    Share2,
    Bookmark,
    Flag,
    ExternalLink,
    Building,
    GraduationCap,
    Languages,
    Wrench,
    Heart,
    Download
} from "lucide-react";
import { Container, StartChatButton } from "../components";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { dummyUserImg } from "../assets";

const FreelancerProfile = () => {
    const { freelancerId } = useParams();
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("about");
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [portfolioLoading, setPortfolioLoading] = useState(false);

    const fetchPortfolioItems = async () => {
        if (!freelancerId) return;

        try {
            setPortfolioLoading(true);
            const response = await axiosInstance.get(`/api/v1/portfolio/public/${freelancerId}`);

            if (response.data.success) {
                setPortfolioItems(response.data.data.portfolios);
            }
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            // Don't show toast error, just show empty state
        } finally {
            setPortfolioLoading(false);
        }
    };

    // Call it when component mounts or freelancerId changes
    useEffect(() => {
        if (freelancerId) {
            fetchPortfolioItems();
        }
    }, [freelancerId]);

    useEffect(() => {
        fetchFreelancerProfile();
    }, [freelancerId]);

    const fetchFreelancerProfile = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/v1/users/freelancers/${freelancerId}`);

            if (response.data.success) {
                setFreelancer(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching freelancer profile:', error);
            toast.error('Failed to load freelancer profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <div className="min-h-screen pt-32 pb-16">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </Container>
        );
    }

    if (!freelancer) {
        return (
            <Container>
                <div className="min-h-screen pt-32 pb-16">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Freelancer not found</h2>
                    </div>
                </div>
            </Container>
        );
    }

    const fullName = `${freelancer.firstName || ''} ${freelancer.lastName || ''}`.trim();
    const location = [freelancer.city, freelancer.country].filter(Boolean).join(', ');
    const experience = freelancer.experience?.length || 0;
    const experienceText = experience > 0 ? `${experience}+ years` : 'Entry level';
    const rating = freelancer.rating || 0;
    const reviews = freelancer.reviews || 0;
    const hired = freelancer.hired || 0;
    const projectsCompleted = freelancer.projectsCompleted || 0;

    return (
        <Container>
            <div className="min-h-screen pt-32 md:pt-32 pb-16 bg-gray-50">
                <div className="max-w-7xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                                {/* Profile Header */}
                                <div className="p-6 text-center border-b border-gray-100">
                                    <div className="relative inline-block">
                                        <img
                                            src={freelancer.profileImage || dummyUserImg}
                                            alt={fullName}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                                        />
                                        {freelancer.isVerified && (
                                            <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-1 rounded-full">
                                                <CheckCircle size={16} />
                                            </div>
                                        )}
                                    </div>

                                    <h1 className="text-2xl font-bold text-gray-900 mt-4">{fullName}</h1>
                                    <p className="text-gray-600 mt-1">{freelancer.tagline || 'Not Provided'}</p>

                                    <div className="flex items-center justify-center gap-1 mt-2">
                                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{rating}</span>
                                        <span className="text-gray-500">({reviews} reviews)</span>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span>{location || 'Location not specified'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Briefcase size={16} className="text-gray-400" />
                                            <span>{experienceText}</span>
                                        </div>
                                    </div>

                                    {/* Availability Badge */}
                                    <div className="mt-4">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                            <Clock size={14} />
                                            Available for job
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                {/* <div className="p-6 border-b border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">{projectsCompleted}</div>
                                            <div className="text-sm text-gray-500">Projects</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">{hired}</div>
                                            <div className="text-sm text-gray-500">Hired</div>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="p-6 border-b border-gray-100">
                                    <div className="space-y-4">
                                        {/* Freelancer Type */}
                                        <div className="flex items-start gap-3">
                                            <Briefcase size={18} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Freelancer type</p>
                                                <p className="text-gray-900 capitalize">{freelancer.freelancerType || 'Independent'}</p>
                                            </div>
                                        </div>

                                        {/* Languages */}
                                        {freelancer.languages?.length > 0 && (
                                            <div className="flex items-start gap-3">
                                                <Languages size={18} className="text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Languages</p>
                                                    <p className="text-gray-900">{freelancer.languages.join(', ')}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* English Level */}
                                        {freelancer.englishLevel && (
                                            <div className="flex items-start gap-3">
                                                <Globe size={18} className="text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">English level</p>
                                                    <p className="text-gray-900 capitalize">{freelancer.englishLevel}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Skills */}
                                {freelancer.skills?.length > 0 && (
                                    <div className="p-6 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Wrench size={16} />
                                            Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {freelancer.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="p-6">
                                    {/* <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg mb-3 flex items-center justify-center gap-2">
                                        <MessageCircle size={18} />
                                        Message Me
                                    </button> */}
                                    {/* <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                                        <Heart size={18} />
                                        Save to favorites
                                    </button> */}
                                    <StartChatButton userId={freelancer?._id} userName={freelancer?.displayName || freelancer?.firstName} />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Main Content */}
                        <div className="lg:col-span-2">
                            {/* Tabs */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                                <div className="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab("about")}
                                        className={`flex-1 py-4 px-6 text-sm font-medium ${activeTab === "about"
                                            ? "text-primary border-b-2 border-primary"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        About Me
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("portfolio")}
                                        className={`flex-1 py-4 px-6 text-sm font-medium ${activeTab === "portfolio"
                                            ? "text-primary border-b-2 border-primary"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        Portfolio
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("reviews")}
                                        className={`flex-1 py-4 px-6 text-sm font-medium ${activeTab === "reviews"
                                            ? "text-primary border-b-2 border-primary"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        Reviews
                                    </button>
                                </div>

                                {/* About Tab */}
                                {activeTab === "about" && (
                                    <div className="p-6">
                                        {/* About Me */}
                                        <div className="mb-8">
                                            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
                                            <p className="text-gray-600 leading-relaxed">
                                                {freelancer.bio || `Not Provided`}
                                            </p>
                                        </div>

                                        {/* Experience */}
                                        {freelancer.experience?.length > 0 && (
                                            <div className="mb-8">
                                                <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
                                                {freelancer.experience.map((exp, index) => (
                                                    <div key={index} className="mb-6">
                                                        <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                                                        <p className="text-gray-600">{exp.companyName} • {exp.location}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                                                        </p>
                                                        <p className="text-gray-600 mt-2">{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Education */}
                                        {freelancer.education?.length > 0 && (
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
                                                {freelancer.education.map((edu, index) => (
                                                    <div key={index} className="mb-4">
                                                        <h3 className="font-semibold text-gray-900">{edu.degreeTitle}</h3>
                                                        <p className="text-gray-600">{edu.instituteName}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(edu.startDate).getFullYear()} - {edu.current ? 'Present' : new Date(edu.endDate).getFullYear()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Portfolio Tab */}
                                {activeTab === "portfolio" && (
                                    <div className="p-6">
                                        {portfolioLoading ? (
                                            <div className="flex justify-center items-center h-64">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        ) : portfolioItems.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {portfolioItems.map((item) => (
                                                    <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                                        <div className="relative h-48 overflow-hidden">
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                                                            {item.tags && item.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mb-3">
                                                                    {item.tags.map((tag, idx) => (
                                                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {item.link && (
                                                                <a
                                                                    href={item.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium"
                                                                >
                                                                    View Project <ExternalLink size={14} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                                <Briefcase size={48} className="mx-auto text-gray-300 mb-3" />
                                                <h3 className="text-lg font-medium text-gray-700 mb-2">No portfolio items yet</h3>
                                                <p className="text-sm text-gray-500">This freelancer hasn't added any portfolio items.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Reviews Tab */}
                                {activeTab === "reviews" && (
                                    <div className="p-6">
                                        {/* Rating Summary */}
                                        <div className="flex items-center gap-8 mb-8">
                                            <div className="text-center">
                                                <div className="text-5xl font-bold text-gray-900">{rating}</div>
                                                <div className="flex items-center justify-center gap-1 mt-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{reviews} reviews</p>
                                            </div>
                                            <div className="flex-1">
                                                {/* Rating bars would go here */}
                                            </div>
                                        </div>

                                        {/* Review List */}
                                        <div className="space-y-6">
                                            <div className="border-b border-gray-100 pb-6">
                                                <div className="flex items-start gap-4">
                                                    <img src={dummyUserImg} className="w-10 h-10 rounded-full" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                                                            <span className="text-sm text-gray-500">2 months ago</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                                            ))}
                                                        </div>
                                                        <p className="text-gray-600 mt-2">
                                                            Excellent work! Delivered beyond expectations and was very professional throughout.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default FreelancerProfile;