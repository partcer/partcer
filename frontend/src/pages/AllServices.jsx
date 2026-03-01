import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X, Grid, List, ChevronDown, Filter, Loader } from "lucide-react";
import { Container } from "../components";
import ServiceCard from "../components/ServiceCard";
import axiosInstance from "../utils/axiosInstance";
import useCountryStates from "../hooks/useCountryStates";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

// FiltersSection Component
const FiltersSection = ({
    filters,
    handleFilterChange,
    handleCheckboxChange,
    resetFilters,
    toggleFilterSection,
    activeFilterSections,
    setShowMobileFilters,
    selectedTags,
    setSelectedTags,
    selectedCategories,
    setSelectedCategories,
    categories,
    skills,
    countries,
    deliveryTimes,
    loadingCategories,
    loadingSkills
}) => {
    const toggleTag = (tagValue) => {
        setSelectedTags(prev =>
            prev.includes(tagValue)
                ? prev.filter(t => t !== tagValue)
                : [...prev, tagValue]
        );
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
    };

    return (
        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-200 h-fit">
            <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Services
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="What service are you looking for?"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <button
                        onClick={() => toggleFilterSection('categories')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
                    >
                        <span>Categories</span>
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform ${activeFilterSections.categories ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <div className={`space-y-2 max-h-48 overflow-y-auto ${activeFilterSections.categories ? 'block' : 'hidden'}`}>
                        {loadingCategories ? (
                            <div className="flex justify-center py-2">
                                <Loader size={20} className="animate-spin text-primary" />
                            </div>
                        ) : (
                            categories.slice(0, 10).map(category => (
                                <label key={category._id} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category._id)}
                                        onChange={() => toggleCategory(category._id)}
                                        className="w-4 h-4 text-primary rounded focus:ring-primary focus:ring-offset-0"
                                    />
                                    <span className="text-gray-600">{category.name}</span>
                                </label>
                            ))
                        )}
                        {categories.length > 10 && (
                            <p className="text-xs text-gray-500 mt-1">Showing 10 of {categories.length} categories</p>
                        )}
                    </div>
                </div>

                {/* Skills/Tags */}
                <div>
                    <button
                        onClick={() => toggleFilterSection('tags')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
                    >
                        <span>Skills</span>
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform ${activeFilterSections.tags ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <div className={`space-y-2 max-h-48 overflow-y-auto ${activeFilterSections.tags ? 'block' : 'hidden'}`}>
                        {loadingSkills ? (
                            <div className="flex justify-center py-2">
                                <Loader size={20} className="animate-spin text-primary" />
                            </div>
                        ) : (
                            skills.slice(0, 10).map(skill => (
                                <label key={skill._id} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(skill.name)}
                                        onChange={() => toggleTag(skill.name)}
                                        className="w-4 h-4 text-primary rounded focus:ring-primary focus:ring-offset-0"
                                    />
                                    <span className="text-gray-600">{skill.name}</span>
                                </label>
                            ))
                        )}
                        {skills.length > 10 && (
                            <p className="text-xs text-gray-500 mt-1">Showing 10 of {skills.length} skills</p>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <button
                        onClick={() => toggleFilterSection('location')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
                    >
                        <span>Location</span>
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform ${activeFilterSections.location ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <div className={`${activeFilterSections.location ? 'block' : 'hidden'}`}>
                        <select
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">All Locations</option>
                            <option value="remote">🌍 Remote (Worldwide)</option>
                            {countries.map(country => (
                                <option key={country.code} value={country.name}>
                                    {country.flag} {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Delivery Time */}
                <div>
                    <button
                        onClick={() => toggleFilterSection('deliveryTime')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
                    >
                        <span>Delivery Time</span>
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform ${activeFilterSections.deliveryTime ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <div className={`space-y-2 ${activeFilterSections.deliveryTime ? 'block' : 'hidden'}`}>
                        {deliveryTimes.map(time => (
                            <label key={time.id} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={time.value}
                                    checked={filters.delivery_time?.includes(time.value)}
                                    onChange={(e) => handleCheckboxChange('delivery_time', e.target.value, e.target.checked)}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary focus:ring-offset-0"
                                />
                                <span className="text-gray-600">{time.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <button
                        onClick={() => toggleFilterSection('priceRange')}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
                    >
                        <span>Price Range ($)</span>
                        <ChevronDown
                            size={16}
                            className={`transform transition-transform ${activeFilterSections.priceRange ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <div className={`space-y-3 ${activeFilterSections.priceRange ? 'block' : 'hidden'}`}>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                min="0"
                                value={filters.min_price}
                                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <span className="self-center text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                min="0"
                                value={filters.max_price}
                                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-col gap-3 mt-8">
                <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                    Apply Filters
                </button>
                <button
                    onClick={resetFilters}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Clear all filters
                </button>
            </div>
        </div>
    );
};

function AllServices() {
    const [filters, setFilters] = useState({
        search: "",
        delivery_time: [],
        location: "",
        min_price: "",
        max_price: ""
    });

    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortBy, setSortBy] = useState("newest");
    const [allServices, setAllServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [activeFilterSections, setActiveFilterSections] = useState({
        categories: false,
        tags: false,
        location: false,
        deliveryTime: false,
        priceRange: false
    });
    const [viewMode, setViewMode] = useState("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Data states
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingSkills, setLoadingSkills] = useState(false);
    const [searchParams] = useSearchParams();

    const countriesAPI = useCountryStates();

    // Delivery times
    const deliveryTimes = [
        { id: 1, value: "1", label: "1 Day Delivery" },
        { id: 2, value: "3", label: "3 Days Delivery" },
        { id: 3, value: "7", label: "7 Days Delivery" },
        { id: 4, value: "14", label: "14 Days Delivery" },
        { id: 5, value: "30", label: "30 Days Delivery" }
    ];

    // Fetch countries on mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await countriesAPI();
                setCountries(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, [countriesAPI]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await axiosInstance.get('/api/v1/categories/public/parents');
                if (response.data?.success) {
                    setCategories(Array.isArray(response.data.data) ? response.data.data : []);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch skills
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoadingSkills(true);
                const response = await axiosInstance.get('/api/v1/skills/public');
                if (response.data?.success) {
                    setSkills(Array.isArray(response.data.data) ? response.data.data : []);
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
                toast.error('Failed to load skills');
            } finally {
                setLoadingSkills(false);
            }
        };
        fetchSkills();
    }, []);

    // Fetch services on mount only
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();
            params.append('page', 1);
            params.append('limit', 50);

            const response = await axiosInstance.get(`/api/v1/services?limit=100`);

            if (response.data?.success) {
                setAllServices(response.data.data.services || []);
                setFilteredServices(response.data.data.services || []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    // Handle search from URL on initial load (if any)
    useEffect(() => {
        const searchFromURL = searchParams.get('search');
        const categorySlugFromURL = searchParams.get('category');

        if (searchFromURL) {
            setFilters(prev => ({
                ...prev,
                search: searchFromURL
            }));
        }

        if (categorySlugFromURL && categories.length > 0) {
            // Find category by slug to get its ID
            const category = categories.find(c => c.slug === categorySlugFromURL);
            if (category) {
                setSelectedCategories([category._id]);
            }
        }
    }, [searchParams, categories]); // Now depends on both searchParams and categories

    // Filter function
    const filterServices = () => {
        if (!allServices.length) return [];

        return allServices.filter(service => {
            // 1. Search filter
            if (filters.search && filters.search.trim() !== "") {
                const searchTerm = filters.search.toLowerCase().trim();
                const searchString = `
                    ${service.title || ''} 
                    ${service.description || ''}
                    ${service.location || ''}
                    ${service.seller?.displayName || ''}
                    ${(service.tags || []).join(' ')}
                `.toLowerCase();

                if (!searchString.includes(searchTerm)) {
                    return false;
                }
            }

            // 2. Categories filter
            if (selectedCategories.length > 0) {
                const categoryId = service.category?._id || service.category;
                if (!selectedCategories.includes(categoryId)) {
                    return false;
                }
            }

            // 3. Skills filter (based on seller.skills)
            if (selectedTags.length > 0) {
                if (!service.seller || !service.seller.skills) {
                    return false;
                }

                const sellerSkills = service.seller.skills.map(skill =>
                    skill.toLowerCase()
                );

                const hasMatchingSkill = selectedTags.some(selectedSkill =>
                    sellerSkills.includes(selectedSkill.toLowerCase())
                );

                if (!hasMatchingSkill) return false;
            }

            // 4. Location filter
            if (filters.location && filters.location.trim() !== "") {
                if (service.location !== filters.location) {
                    return false;
                }
            }

            // 5. Delivery time filter
            if (filters.delivery_time.length > 0) {
                const minDeliveryTime = Math.min(...service.packages.map(p => p.deliveryTime));
                const matchesDeliveryTime = filters.delivery_time.some(time => {
                    const maxDays = parseInt(time);
                    return minDeliveryTime <= maxDays;
                });
                if (!matchesDeliveryTime) return false;
            }

            // 6. Price filter
            if (filters.min_price || filters.max_price) {
                const minPrice = Math.min(...service.packages.map(p => p.price));

                if (filters.min_price && minPrice < parseFloat(filters.min_price)) {
                    return false;
                }
                if (filters.max_price && minPrice > parseFloat(filters.max_price)) {
                    return false;
                }
            }

            return true;
        });
    };

    // Sort function
    const sortServices = (servicesToSort) => {
        const sorted = [...servicesToSort];

        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'price-low':
                return sorted.sort((a, b) => {
                    const priceA = Math.min(...a.packages.map(p => p.price));
                    const priceB = Math.min(...b.packages.map(p => p.price));
                    return priceA - priceB;
                });
            case 'price-high':
                return sorted.sort((a, b) => {
                    const priceA = Math.min(...a.packages.map(p => p.price));
                    const priceB = Math.min(...b.packages.map(p => p.price));
                    return priceB - priceA;
                });
            case 'rating-high':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'delivery-fast':
                return sorted.sort((a, b) => {
                    const deliveryA = Math.min(...a.packages.map(p => p.deliveryTime));
                    const deliveryB = Math.min(...b.packages.map(p => p.deliveryTime));
                    return deliveryA - deliveryB;
                });
            default:
                return sorted;
        }
    };

    // Apply filters and sorting whenever dependencies change
    useEffect(() => {
        if (allServices.length > 0) {
            const filtered = filterServices();
            const sorted = sortServices(filtered);
            setFilteredServices(sorted);
            setCurrentPage(1);
        }
    }, [allServices, filters, selectedCategories, selectedTags, sortBy]);

    // Filter change handlers
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name, value, checked) => {
        setFilters(prev => {
            const currentArray = prev[name] || [];
            if (checked) {
                return { ...prev, [name]: [...currentArray, value] };
            } else {
                return { ...prev, [name]: currentArray.filter(item => item !== value) };
            }
        });
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            delivery_time: [],
            location: "",
            min_price: "",
            max_price: ""
        });
        setSelectedTags([]);
        setSelectedCategories([]);
        setSortBy("newest");
    };

    const toggleFilterSection = (section) => {
        setActiveFilterSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    const sortOptions = [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "price-high", label: "Price: High to Low" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "rating-high", label: "Rating: High to Low" },
        { value: "delivery-fast", label: "Fastest Delivery" }
    ];

    return (
        <Container>
            <div className="min-h-screen pt-24 md:pt-32 pb-16 bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6 md:py-8">
                    <div className="container mx-auto">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Browse Services</h1>
                        <p className="text-gray-600 mt-2">
                            {loading ? "Loading services..." : `${filteredServices.length} services available`}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto py-6 md:py-8 px-4 md:px-0">
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                        {/* Filters Sidebar */}
                        <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
                            <FiltersSection
                                filters={filters}
                                handleFilterChange={handleFilterChange}
                                handleCheckboxChange={handleCheckboxChange}
                                resetFilters={resetFilters}
                                toggleFilterSection={toggleFilterSection}
                                activeFilterSections={activeFilterSections}
                                setShowMobileFilters={setShowMobileFilters}
                                selectedTags={selectedTags}
                                selectedCategories={selectedCategories}
                                setSelectedTags={setSelectedTags}
                                setSelectedCategories={setSelectedCategories}
                                categories={categories}
                                skills={skills}
                                countries={countries}
                                deliveryTimes={deliveryTimes}
                                loadingCategories={loadingCategories}
                                loadingSkills={loadingSkills}
                            />
                        </div>

                        {/* Content Area */}
                        <div className="w-full lg:w-3/4 xl:w-4/5">
                            {/* Mobile Filter Toggle */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6 lg:hidden">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 md:w-auto font-medium"
                                >
                                    <SlidersHorizontal size={20} />
                                    <span>Filters</span>
                                </button>
                            </div>

                            {/* Results Count and Sort */}
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                                <p className="text-gray-600 text-sm md:text-base">
                                    {loading ? "Loading..." : `Showing ${currentServices.length} of ${filteredServices.length} services`}
                                </p>

                                <div className="flex items-center gap-3">
                                    {/* View Mode Toggle */}
                                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-1.5 md:p-2 rounded transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                                            title="Grid View"
                                        >
                                            <Grid size={16} className={viewMode === "grid" ? "text-primary" : "text-gray-500"} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-1.5 md:p-2 rounded transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                                            title="List View"
                                        >
                                            <List size={16} className={viewMode === "list" ? "text-primary" : "text-gray-500"} />
                                        </button>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600 text-sm hidden md:inline">Sort by:</span>
                                        <select
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                            onChange={handleSortChange}
                                            value={sortBy}
                                        >
                                            {sortOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Services Grid/List */}
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                                            <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                                            <div className="h-10 bg-gray-200 rounded-lg"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : currentServices.length > 0 ? (
                                <>
                                    {viewMode === "grid" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                            {currentServices.map(service => (
                                                <ServiceCard key={service._id} service={service} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {currentServices.map(service => (
                                                <div key={service._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                                    {/* Your list view design here */}
                                                    <ServiceCard key={service._id} service={service} />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-8">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                                            >
                                                Previous
                                            </button>
                                            <span className="px-3 py-1">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 md:py-12">
                                    <Filter size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">No services found</h3>
                                    <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                                    <button
                                        onClick={resetFilters}
                                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Filters Overlay */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}></div>
                        <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white overflow-y-auto p-4 md:p-6">
                            <FiltersSection
                                filters={filters}
                                handleFilterChange={handleFilterChange}
                                handleCheckboxChange={handleCheckboxChange}
                                resetFilters={resetFilters}
                                toggleFilterSection={toggleFilterSection}
                                activeFilterSections={activeFilterSections}
                                setShowMobileFilters={setShowMobileFilters}
                                selectedTags={selectedTags}
                                selectedCategories={selectedCategories}
                                setSelectedTags={setSelectedTags}
                                setSelectedCategories={setSelectedCategories}
                                categories={categories}
                                skills={skills}
                                countries={countries}
                                deliveryTimes={deliveryTimes}
                                loadingCategories={loadingCategories}
                                loadingSkills={loadingSkills}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default AllServices;