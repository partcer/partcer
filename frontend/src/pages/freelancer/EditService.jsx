// EditService.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText,
    Tag,
    Package,
    Image as ImageIcon,
    Video,
    HelpCircle,
    ArrowLeft,
    ArrowRight,
    X,
    Plus,
    MapPin,
    Clock,
    DollarSign,
    Star,
    Upload,
    CheckCircle,
    Settings,
    Grid,
    Link as LinkIcon
} from "lucide-react";
import { RTE, FreelancerSidebar, FreelancerHeader, FreelancerContainer } from '../../components';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import useCountryStates from '../../hooks/useCountryStates';

const EditService = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [packages, setPackages] = useState([]);
    const [extraOffers, setExtraOffers] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const countriesAPI = useCountryStates();
    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [pendingSubCategory, setPendingSubCategory] = useState('');

    const { serviceId } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        getValues,
        reset,
        control,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            title: '',
            category: '',
            subCategory: '',
            location: 'remote',
            description: '',
            videoLink: '',
            tags: [],
            requirements: ''
        }
    });

    // Fetch countries on component mount - use useCallback for the fetch function
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoadingCountries(true);
                const data = await countriesAPI();
                // Sort countries alphabetically by name
                const sortedCountries = data.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(sortedCountries);
            } catch (error) {
                console.error('Error fetching countries:', error);
                toast.error('Failed to load countries');
            } finally {
                setLoadingCountries(false);
            }
        };

        fetchCountries();
    }, []);

    // Format date for datetime-local input
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toISOString().slice(0, 16);
    };

    // Fetch service data - Replace the mock data section
    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                setIsLoading(true);

                // Fetch service details
                const response = await axiosInstance.get(`/api/v1/services/${serviceId}`);

                if (response.data?.success) {
                    const service = response.data.data.service;

                    // Set form values
                    reset({
                        title: service.title,
                        category: service.category?._id || service.category,
                        subCategory: service.subCategory?._id || service.subCategory || '',
                        location: service.location || 'remote',
                        description: service.description,
                        videoLink: service.videoLink || '',
                        requirements: service.requirements || ''
                    });

                    // Set category for subcategory loading
                    setSelectedCategory(service.category?._id || service.category);
                    setPendingSubCategory(service.subCategory?._id || service.subCategory || '');

                    // Set tags/skills
                    setSelectedTags(service.tags || service.skills || []);

                    // Set packages with featureInput empty
                    setPackages(service.packages?.map(pkg => ({
                        ...pkg,
                        id: pkg._id || Math.random(),
                        featureInput: ''
                    })) || []);

                    // Set extra offers
                    setExtraOffers(service.extraOffers?.map(offer => ({
                        ...offer,
                        id: offer._id || Math.random()
                    })) || []);

                    // Set FAQs
                    setFaqs(service.faqs?.map(faq => ({
                        ...faq,
                        id: faq._id || Math.random()
                    })) || []);

                    // Set existing gallery images
                    setExistingGalleryImages(service.gallery?.map(img => ({
                        ...img,
                        id: img._id || img.publicId || Math.random(),
                        isExisting: true
                    })) || []);
                }
            } catch (error) {
                console.error('Error fetching service:', error);
                toast.error(error.response?.data?.message || 'Failed to load service data');
                navigate('/freelancer/services/all');
            } finally {
                setIsLoading(false);
            }
        };

        if (serviceId) {
            fetchServiceData();
            fetchCategories();
            // fetchTags();
        }
    }, [serviceId]);

    useEffect(() => {
        if (pendingSubCategory && subCategories.length > 0) {
            setValue('subCategory', pendingSubCategory);
            setPendingSubCategory(''); // Clear after setting
        }
    }, [subCategories, pendingSubCategory, setValue]);

    // Fetch subcategories when category changes
    useEffect(() => {
        if (selectedCategory) {
            fetchSubCategories(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await axiosInstance.get('/api/v1/categories/public/parents');

            if (response.data?.success) {
                setCategories(Array.isArray(response.data.data) ? response.data.data : []);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            toast.error('Failed to load categories');
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try {
            setSubCategories([]);

            const response = await axiosInstance.get(`/api/v1/categories/public/${categoryId}/subcategories`);

            if (response.data?.success) {
                // Your API returns { parent, subcategories } structure
                const subCats = response.data.data?.subcategories || [];
                setSubCategories(Array.isArray(subCats) ? subCats : []);
            } else {
                console.log('Success false, setting empty array');
                setSubCategories([]);
            }
        } catch (err) {
            console.error('Error fetching subcategories:', err);
            console.log('Error response:', err.response?.data);
            console.log('Error status:', err.response?.status);
            setSubCategories([]);

            if (err.response?.status !== 404) {
                toast.error('Failed to load subcategories');
            }
        }
    };

    // const fetchTags = async () => {
    //     try {
    //         const response = await axiosInstance.get('/api/v1/skills/public');
    //         if (response.data?.success) {
    //             setTags(Array.isArray(response.data.data) ? response.data.data : []);
    //         }
    //     } catch (err) {
    //         console.error('Error fetching skills:', err);
    //         setTags([]);
    //     }
    // };

    const nextStep = async () => {
        let isValid = true;

        if (step === 1) {
            const fieldsToValidate = ['title', 'category', 'description'];
            isValid = await trigger(fieldsToValidate);

            if (!selectedCategory) {
                toast.error('Please select a category');
                isValid = false;
            }
        }

        if (step === 2) {
            if (packages.length === 0) {
                toast.error('Please add at least one service package');
                isValid = false;
            } else {
                for (const pkg of packages) {
                    if (!pkg.title || !pkg.description || !pkg.deliveryTime || !pkg.price) {
                        toast.error('Please fill all required fields in packages');
                        isValid = false;
                        break;
                    }
                }
            }
        }

        if (!isValid) return;
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = existingGalleryImages.length + galleryImages.length + files.length;

        if (totalImages > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }
        setGalleryImages([...galleryImages, ...files]);
    };

    const removeExistingImage = (index) => {
        const imageToRemove = existingGalleryImages[index];
        setRemovedImages([...removedImages, imageToRemove.id]);
        setExistingGalleryImages(existingGalleryImages.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    const addPackage = () => {
        const newPackage = {
            id: packages.length + 1,
            title: '',
            description: '',
            deliveryTime: 3,
            price: 0,
            isFeatured: false,
            features: [],
            featureInput: ''
        };
        setPackages([...packages, newPackage]);
    };

    const updatePackage = (index, field, value) => {
        const updatedPackages = [...packages];
        updatedPackages[index] = {
            ...updatedPackages[index],
            [field]: value
        };

        if (field === 'isFeatured' && value) {
            updatedPackages.forEach((pkg, i) => {
                if (i !== index) {
                    updatedPackages[i].isFeatured = false;
                }
            });
        }
        setPackages(updatedPackages);
    };

    const removePackage = (index) => {
        if (packages.length === 1) {
            toast.error('At least one package is required');
            return;
        }
        setPackages(packages.filter((_, i) => i !== index));
    };

    const addExtraOffer = () => {
        const newOffer = {
            id: extraOffers.length + 1,
            title: '',
            description: '',
            price: 0,
            deliveryTime: 1
        };
        setExtraOffers([...extraOffers, newOffer]);
    };

    const updateExtraOffer = (index, field, value) => {
        const updatedOffers = [...extraOffers];
        updatedOffers[index][field] = value;
        setExtraOffers(updatedOffers);
    };

    const removeExtraOffer = (index) => {
        setExtraOffers(extraOffers.filter((_, i) => i !== index));
    };

    const addFaq = () => {
        const newFaq = {
            id: faqs.length + 1,
            question: '',
            answer: ''
        };
        setFaqs([...faqs, newFaq]);
    };

    const updateFaq = (index, field, value) => {
        const updatedFaqs = [...faqs];
        updatedFaqs[index][field] = value;
        setFaqs(updatedFaqs);
    };

    const removeFaq = (index) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const toggleTag = (tagName) => {
        if (selectedTags.includes(tagName)) {
            setSelectedTags(selectedTags.filter(t => t !== tagName));
        } else {
            if (selectedTags.length >= 5) {
                toast.error('Maximum 5 tags allowed');
                return;
            }
            setSelectedTags([...selectedTags, tagName]);
        }
    };

    const updateServiceHandler = async (formData) => {
        try {
            setIsSubmitting(true);

            // Prepare the data
            const serviceData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                subCategory: formData.subCategory || undefined,
                location: formData.location || 'remote',
                videoLink: formData.videoLink || '',
                requirements: formData.requirements || '',
                tags: selectedTags,
                packages: packages.map(({ id, featureInput, ...pkg }) => ({
                    ...pkg,
                    price: Number(pkg.price),
                    deliveryTime: Number(pkg.deliveryTime),
                    revisions: pkg.revisions ? Number(pkg.revisions) : 0
                })),
                extraOffers: extraOffers.map(({ id, ...offer }) => ({
                    ...offer,
                    price: Number(offer.price),
                    deliveryTime: Number(offer.deliveryTime)
                })),
                faqs: faqs.map(({ id, ...faq }) => faq),
                removedImages: removedImages // Send IDs of images to delete
            };

            const formDataObj = new FormData();
            formDataObj.append('data', JSON.stringify(serviceData));

            // Append new gallery images
            galleryImages.forEach((image) => {
                formDataObj.append('gallery', image);
            });

            const response = await axiosInstance.put(`/api/v1/services/${serviceId}`, formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data?.success) {
                toast.success('Service updated successfully!');
                navigate('/freelancer/services/all');
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Failed to update service';
            toast.error(errorMessage);
            console.error('Update error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { number: 1, label: 'Basic Info', icon: FileText },
        { number: 2, label: 'Pricing', icon: DollarSign },
        { number: 3, label: 'Gallery & FAQ', icon: ImageIcon }
    ];

    if (isLoading) {
        return (
            <section className="flex min-h-screen">
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
        <section className="flex min-h-screen">
            <FreelancerSidebar />
            <div className="w-full relative">
                <FreelancerHeader />
                <FreelancerContainer>
                    {/* Header */}
                    <div className="mb-8 mt-20 md:mt-0">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Edit Service
                        </h1>
                        <p className="text-gray-600">
                            Update your service details and offerings
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            {steps.map((stepItem) => (
                                <div key={stepItem.number} className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 
                                        ${step >= stepItem.number ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
                                        {step > stepItem.number ? (
                                            <CheckCircle size={20} />
                                        ) : (
                                            <stepItem.icon size={20} />
                                        )}
                                    </div>
                                    <span className={`text-sm mt-2 font-medium ${step >= stepItem.number ? 'text-primary' : 'text-gray-500'}`}>
                                        {stepItem.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
                            <div
                                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300"
                                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(updateServiceHandler)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <FileText className="mr-2" size={24} />
                                        Service Information
                                    </h2>

                                    {/* Title */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Title *
                                        </label>
                                        <input
                                            {...register('title', {
                                                required: 'Title is required',
                                                minLength: { value: 10, message: 'Title must be at least 10 characters' }
                                            })}
                                            type="text"
                                            placeholder="e.g., I will design professional website UI/UX"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                        )}
                                    </div>

                                    {/* Category & Subcategory */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category *
                                            </label>
                                            <select
                                                {...register('category', { required: 'Category is required' })}
                                                onChange={(e) => {
                                                    const categoryId = e.target.value;
                                                    setSelectedCategory(categoryId);
                                                    setValue('category', categoryId);
                                                    setValue('subCategory', '');
                                                    if (categoryId) {
                                                        fetchSubCategories(categoryId);
                                                    } else {
                                                        setSubCategories([]);
                                                    }
                                                }}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                disabled={loadingCategories}
                                            >
                                                <option value="">Select Category</option>
                                                {Array.isArray(categories) && categories.map((category) => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && (
                                                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                            )}
                                        </div>

                                        {/* Subcategory */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Sub-category
                                            </label>
                                            <select
                                                {...register('subCategory')}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                disabled={!selectedCategory || !Array.isArray(subCategories) || subCategories.length === 0}
                                            >
                                                <option value="">Select Subcategory</option>
                                                {Array.isArray(subCategories) && subCategories.map((subCategory) => (
                                                    <option key={subCategory._id} value={subCategory._id}>
                                                        {subCategory.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Location
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <select
                                                {...register('location')}
                                                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                disabled={loadingCountries}
                                            >
                                                <option value="remote">🌍 Remote (Worldwide)</option>
                                                <optgroup label="Popular Countries">
                                                    <option value="US">🇺🇸 United States</option>
                                                    <option value="GB">🇬🇧 United Kingdom</option>
                                                    <option value="CA">🇨🇦 Canada</option>
                                                    <option value="AU">🇦🇺 Australia</option>
                                                    <option value="IN">🇮🇳 India</option>
                                                </optgroup>

                                                {countries.length > 0 && (
                                                    <optgroup label="All Countries">
                                                        {countries.map((country) => (
                                                            <option key={country.code} value={country.name}>
                                                                {country.flag} {country.name}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}

                                                {loadingCountries && (
                                                    <option disabled>Loading countries...</option>
                                                )}
                                            </select>

                                            {loadingCountries && (
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Description *
                                        </label>
                                        <RTE
                                            name="description"
                                            control={control}
                                            label="Description:"
                                            defaultValue={getValues('description') || ''}
                                            placeholder="Describe your service in detail. What will the client get? What makes you the best choice?"
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tags (Max 5)
                                        </label>

                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                placeholder="Type a tag and press Enter or comma"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ',') {
                                                        e.preventDefault();
                                                        const tag = e.target.value.trim();
                                                        if (tag && selectedTags.length < 5) {
                                                            if (!selectedTags.some(t => t.toLowerCase() === tag.toLowerCase())) {
                                                                setSelectedTags([...selectedTags, tag]);
                                                            }
                                                            e.target.value = '';
                                                        }
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const tag = e.target.value.trim();
                                                    if (tag && selectedTags.length < 5) {
                                                        if (!selectedTags.some(t => t.toLowerCase() === tag.toLowerCase())) {
                                                            setSelectedTags([...selectedTags, tag]);
                                                        }
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Press Enter or comma to add tags. You can add up to 5 tags.
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {selectedTags.map((tag, index) => (
                                                <div
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-white text-sm"
                                                >
                                                    <Tag size={14} />
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedTags(selectedTags.filter((_, i) => i !== index))}
                                                        className="ml-1 hover:text-red-200"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* {selectedTags.length < 5 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <p className="text-xs text-gray-500 w-full">Suggestions:</p>
                                                    {tags
                                                        .filter(tag => !selectedTags.includes(tag.name))
                                                        .slice(0, 10)
                                                        .map((tag) => (
                                                            <button
                                                                type="button"
                                                                key={tag.id}
                                                                onClick={() => toggleTag(tag.name)}
                                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm border border-gray-300 hover:bg-gray-200"
                                                            >
                                                                <Tag size={12} />
                                                                {tag.name}
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            )} */}
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Client Requirements
                                        </label>
                                        <textarea
                                            {...register('requirements')}
                                            rows={4}
                                            placeholder="What information or materials do you need from the client to get started?"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Pricing & Packages */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <DollarSign className="mr-2" size={24} />
                                        Pricing & Packages
                                    </h2>

                                    {/* Service Packages */}
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Service Packages *
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addPackage}
                                                className="flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium"
                                            >
                                                <Plus size={16} />
                                                Add Package
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {packages.map((pkg, index) => (
                                                <div key={pkg.id} className="border border-gray-200 rounded-lg p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg font-semibold text-gray-900">
                                                                Package {index + 1}
                                                            </span>
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={pkg.isFeatured}
                                                                    onChange={(e) => updatePackage(index, 'isFeatured', e.target.checked)}
                                                                    className="mr-2"
                                                                />
                                                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                                                    <Star size={14} />
                                                                    Featured Package
                                                                </span>
                                                            </label>
                                                        </div>
                                                        {packages.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removePackage(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X size={20} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Package Title *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={pkg.title}
                                                                onChange={(e) => updatePackage(index, 'title', e.target.value)}
                                                                placeholder="e.g., Basic, Standard, Premium"
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Price ($) *
                                                            </label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                                <input
                                                                    type="number"
                                                                    value={pkg.price}
                                                                    onChange={(e) => updatePackage(index, 'price', parseFloat(e.target.value) || 0)}
                                                                    min="0"
                                                                    step="0.01"
                                                                    className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Delivery Time (Days) *
                                                            </label>
                                                            <div className="relative">
                                                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                                <input
                                                                    type="number"
                                                                    value={pkg.deliveryTime}
                                                                    onChange={(e) => updatePackage(index, 'deliveryTime', parseInt(e.target.value) || 1)}
                                                                    min="1"
                                                                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Number of Revisions
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={pkg.revisions || ''}
                                                                onChange={(e) => updatePackage(index, 'revisions', parseInt(e.target.value) || 0)}
                                                                min="0"
                                                                placeholder="Unlimited"
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Description *
                                                        </label>
                                                        <textarea
                                                            value={pkg.description}
                                                            onChange={(e) => updatePackage(index, 'description', e.target.value)}
                                                            rows={3}
                                                            placeholder="What's included in this package?"
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Features
                                                        </label>

                                                        <div className="mb-3">
                                                            <div className="flex gap-2 mb-2">
                                                                <input
                                                                    type="text"
                                                                    value={pkg.featureInput || ''}
                                                                    onChange={(e) => {
                                                                        const updatedPackages = [...packages];
                                                                        updatedPackages[index].featureInput = e.target.value;
                                                                        setPackages(updatedPackages);
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' && pkg.featureInput?.trim()) {
                                                                            e.preventDefault();
                                                                            const updatedPackages = [...packages];
                                                                            const newFeatures = [...(updatedPackages[index].features || []), pkg.featureInput.trim()];
                                                                            updatedPackages[index].features = newFeatures;
                                                                            updatedPackages[index].featureInput = '';
                                                                            setPackages(updatedPackages);
                                                                        }
                                                                    }}
                                                                    placeholder="Add a feature and press Enter or click Add"
                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (pkg.featureInput?.trim()) {
                                                                            const updatedPackages = [...packages];
                                                                            const newFeatures = [...(updatedPackages[index].features || []), pkg.featureInput.trim()];
                                                                            updatedPackages[index].features = newFeatures;
                                                                            updatedPackages[index].featureInput = '';
                                                                            setPackages(updatedPackages);
                                                                        }
                                                                    }}
                                                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>

                                                            {pkg.features && pkg.features.length > 0 && (
                                                                <div className="space-y-2">
                                                                    {pkg.features.map((feature, featureIndex) => (
                                                                        <div key={featureIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-green-500">✓</span>
                                                                                <span>{feature}</span>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const updatedPackages = [...packages];
                                                                                    updatedPackages[index].features = updatedPackages[index].features.filter((_, i) => i !== featureIndex);
                                                                                    setPackages(updatedPackages);
                                                                                }}
                                                                                className="text-red-500 hover:text-red-700"
                                                                            >
                                                                                <X size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Extra Offers */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Extra Offers & Add-ons
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addExtraOffer}
                                                className="flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium"
                                            >
                                                <Plus size={16} />
                                                Add Extra Offer
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {extraOffers.map((offer, index) => (
                                                <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="font-medium">Extra Offer {index + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExtraOffer(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <input
                                                            type="text"
                                                            value={offer.title}
                                                            onChange={(e) => updateExtraOffer(index, 'title', e.target.value)}
                                                            placeholder="Offer title"
                                                            className="px-3 py-2 border border-gray-300 rounded"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={offer.description}
                                                            onChange={(e) => updateExtraOffer(index, 'description', e.target.value)}
                                                            placeholder="Description"
                                                            className="px-3 py-2 border border-gray-300 rounded"
                                                        />
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                            <input
                                                                type="number"
                                                                value={offer.price}
                                                                onChange={(e) => updateExtraOffer(index, 'price', parseFloat(e.target.value) || 0)}
                                                                placeholder="Price"
                                                                className="w-full pl-8 px-3 py-2 border border-gray-300 rounded"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Gallery & FAQ */}
                        {step === 3 && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <Grid className="mr-2" size={24} />
                                        Gallery & FAQ
                                    </h2>

                                    {/* Gallery */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            Gallery Images (Max 10)
                                        </label>

                                        {/* Existing Images */}
                                        {existingGalleryImages.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                    {existingGalleryImages.map((image, index) => (
                                                        <div key={image.id} className="relative group">
                                                            <img
                                                                src={image.url}
                                                                alt={`Existing ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg border-2 border-blue-200"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                            <div className="absolute bottom-0 left-0 right-0 bg-blue-500 bg-opacity-70 text-white text-xs px-2 py-1 rounded-b-lg">
                                                                Existing
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload New Images */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleGalleryUpload}
                                                className="hidden"
                                                id="gallery-upload"
                                            />
                                            <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center">
                                                <Upload size={48} className="text-gray-400 mb-3" />
                                                <p className="text-gray-600 mb-2">
                                                    Drag & drop new images or click to browse
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Add more high-quality images showcasing your work
                                                </p>
                                            </label>
                                        </div>

                                        {/* New Images Preview */}
                                        {galleryImages.length > 0 && (
                                            <div className="mt-6">
                                                <p className="text-sm text-gray-600 mb-2">New Images:</p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                    {galleryImages.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={URL.createObjectURL(image)}
                                                                alt={`New ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                            <div className="absolute bottom-0 left-0 right-0 bg-green-500 bg-opacity-70 text-white text-xs px-2 py-1 rounded-b-lg">
                                                                New
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Video Link */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Video Link (Optional)
                                        </label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                {...register('videoLink', {
                                                    pattern: {
                                                        value: /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                                                        message: 'Please enter a valid YouTube URL'
                                                    }
                                                })}
                                                type="url"
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>
                                        {errors.videoLink && (
                                            <p className="text-red-500 text-sm mt-1">{errors.videoLink.message}</p>
                                        )}
                                    </div>

                                    {/* FAQ */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Frequently Asked Questions
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addFaq}
                                                className="flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium"
                                            >
                                                <Plus size={16} />
                                                Add FAQ
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {faqs.map((faq, index) => (
                                                <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="font-medium">FAQ {index + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFaq(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Question
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={faq.question}
                                                                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                                                placeholder="What clients usually ask?"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Answer
                                                            </label>
                                                            <textarea
                                                                value={faq.answer}
                                                                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                                                rows={2}
                                                                placeholder="Provide a clear and helpful answer"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {faqs.length === 0 && (
                                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                                <HelpCircle className="mx-auto text-gray-300 mb-2" size={32} />
                                                <p className="text-gray-500">No FAQs added yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-8 border-t border-gray-200">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    <ArrowLeft size={18} />
                                    Previous
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                                >
                                    Continue
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                                Updating...
                                            </span>
                                        ) : (
                                            'Update Service'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </FreelancerContainer>
            </div>
        </section>
    );
};

export default EditService;