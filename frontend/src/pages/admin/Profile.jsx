import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { AdminContainer, AdminHeader, AdminSidebar, LanguagesSelect } from "../../components";
import {
    User,
    Camera,
    Globe,
    X,
    Check,
    ChevronDown,
    Save,
    Shield,
    Lock,
    Loader2,
    Mail,
    Phone,
    Search,
    Eye,
    EyeOff,
    XCircle,
    CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import useCountryStates from "../../hooks/useCountryStates";

function Profile() {
    const { user, updateUserData, fetchCurrentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [activeTab, setActiveTab] = useState("profile");
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const countriesAPI = useCountryStates();
    const [countries, setCountries] = useState([]);
    const [countriesMap, setCountriesMap] = useState({});

    const { register, handleSubmit, control, setValue, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            bio: "",
            gender: "",
            tagline: "",
            country: "",
            city: "",
            address: "",
            email: "",
            phoneNumber: "",
            languages: [],
            notificationPreferences: {
                email: true,
                push: true,
                system: true
            },
            twoFactorAuth: false,
        }
    });

    // Fetch countries on mount
    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await countriesAPI();
            setCountries(countriesData);

            // Create a map for easy lookup
            const map = {};
            countriesData.forEach(country => {
                map[country.name] = country.name;
                // Also map by code if needed
                if (country.code) {
                    map[country.code] = country.name;
                }
            });
            setCountriesMap(map);
        };
        fetchCountries();
    }, []);

    // Fetch fresh user data on mount
    useEffect(() => {
        const loadUserData = async () => {
            if (user && !initialFetchDone) {
                try {
                    const freshUserData = await fetchCurrentUser();
                    if (freshUserData) {
                        populateFormFields(freshUserData);
                    }
                } catch (error) {
                    console.error('Failed to fetch fresh user data:', error);
                    // Fallback to existing user data
                    if (user) {
                        populateFormFields(user);
                    }
                } finally {
                    setInitialFetchDone(true);
                }
            } else if (user) {
                // If initial fetch already done, just populate with current user data
                populateFormFields(user);
            }
        };

        loadUserData();
    }, [user, initialFetchDone]);

    const populateFormFields = (userData) => {
        reset({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            bio: userData.bio || "",
            gender: userData.gender || "",
            tagline: userData.tagline || "",
            country: userData.country || "",
            city: userData.city || "",
            address: userData.address || "",
            email: userData.email || "",
            phoneNumber: userData.phone || "",
            notificationPreferences: userData.notificationPreferences || {
                email: true,
                push: true,
                system: true
            }
        });

        setProfileImage(userData.profileImage || "");
        setSelectedLanguages(userData.languages || []);
    };

    const genders = ["male", "female", "other"];

    const tabs = [
        { id: "profile", label: "Profile Information", icon: <User size={18} /> },
        { id: "security", label: "Security & Privacy", icon: <Lock size={18} /> },
    ];

    const handlePasswordChange = async () => {
        // Validation
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('All password fields are required');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setChangingPassword(true);
        try {
            const response = await axiosInstance.post('/api/v1/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response.data.success) {
                toast.success('Password changed successfully!');
                // Clear password fields
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Password change error:', error);
            toast.error(error?.response?.data?.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: 'No password', color: 'bg-gray-200', message: 'Enter a password', checks: {} };

        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[@$!%*?&#]/.test(password)
        };

        score = Object.values(checks).filter(Boolean).length;

        let label, color, message;
        if (score <= 2) {
            label = 'Weak';
            color = 'bg-red-500';
            message = 'Password is too weak';
        } else if (score <= 4) {
            label = 'Medium';
            color = 'bg-yellow-500';
            message = 'Password could be stronger';
        } else {
            label = 'Strong';
            color = 'bg-green-500';
            message = 'Strong password';
        }

        return { score, label, color, message, checks };
    };

    const passwordStrength = getPasswordStrength(passwordData.newPassword);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should not be more than 5MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Append all form fields
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('bio', data.bio || '');
            formData.append('tagline', data.tagline || '');
            formData.append('country', data.country || '');
            formData.append('city', data.city || '');
            formData.append('address', data.address || '');
            formData.append('phone', data.phoneNumber || '');

            if (data.gender) {
                setValue("gender", data.gender);
            }

            // Append languages as JSON string
            formData.append('languages', JSON.stringify(selectedLanguages));

            // Append notification preferences as JSON string
            formData.append('notificationPreferences', JSON.stringify(data.notificationPreferences));

            // Append image if changed
            if (imageFile) {
                formData.append('profileImage', imageFile);
            }

            const response = await axiosInstance.put('/api/v1/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                const updatedUser = response.data.data;

                // Update user in context
                updateUserData(updatedUser);

                toast.success('Profile updated successfully!');

                // Update profile image if changed
                if (response.data.data.profileImage) {
                    setProfileImage(response.data.data.profileImage);
                    setImageFile(null);
                }

                // Refresh form with updated data
                populateFormFields(updatedUser);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error(error?.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="w-full relative">
                <AdminHeader />

                <AdminContainer>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-20 md:mt-0">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary/5 to-transparent border-b border-gray-200 px-6 py-8">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    {/* Profile Section */}
                                    <div className="flex items-start gap-5">
                                        <div className="relative">
                                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-1.5 shadow-sm">
                                                {profileImage ? (
                                                    <img
                                                        src={profileImage}
                                                        alt="Profile"
                                                        className="h-full w-full rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border border-gray-200">
                                                        <User size={32} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 bg-white border border-gray-300 hover:border-primary hover:bg-primary hover:text-white text-gray-600 p-2 rounded-lg shadow-md cursor-pointer transition-all duration-200">
                                                {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                                <input
                                                    id="profile-upload"
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                    disabled={uploadingImage}
                                                />
                                            </label>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex flex-col items-start gap-3">
                                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center gap-1">
                                                    <Shield size={12} />
                                                    {user?.userType === 'admin' ? 'Administrator' : user?.userType}
                                                </span>
                                                <h1 className="text-2xl font-bold text-gray-900">
                                                    {user?.userType === 'admin' ? 'Admin Profile Settings' : 'Profile Settings'}
                                                </h1>
                                            </div>
                                            <p className="text-gray-600">
                                                Manage your personal information and preferences
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        <button
                                            type="submit"
                                            form="profile-form"
                                            disabled={loading}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 px-6">
                            <div className="flex flex-nowrap overflow-x-auto md:flex-wrap gap-2 scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 whitespace-nowrap border-b-2 ${activeTab === tab.id
                                            ? "border-primary text-primary"
                                            : "border-transparent text-gray-600 hover:text-gray-900"
                                            }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Form */}
                        <div className="py-4 md:p-8">
                            <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
                                {/* Profile Information Tab */}
                                {activeTab === "profile" && (
                                    <>
                                        {/* Personal Information Section */}
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                <User size={20} />
                                                Personal Information
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        First Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register("firstName", { required: "First name is required" })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    />
                                                    {errors.firstName && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Last Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register("lastName", { required: "Last name is required" })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    />
                                                    {errors.lastName && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                                                    )}
                                                </div>

                                                {/* Email Field */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address *
                                                    </label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="email"
                                                            {...register("email")}
                                                            disabled
                                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Phone Number - FIXED */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="tel"
                                                            {...register("phoneNumber")}
                                                            placeholder="+1 (555) 123-4567"
                                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Gender - FIXED */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Gender
                                                    </label>
                                                    <select
                                                        {...register("gender")}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent capitalize"
                                                    >
                                                        <option value="">Select Gender</option>
                                                        {genders.map(gender => (
                                                            <option key={gender} value={gender} className="capitalize">
                                                                {gender}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Tagline */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Your Tagline
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register("tagline")}
                                                        placeholder="Add your professional tagline"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    />
                                                </div>

                                                {/* Bio - Textarea */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Bio
                                                    </label>
                                                    <textarea
                                                        {...register("bio")}
                                                        rows={4}
                                                        placeholder="Tell us about yourself..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location Section */}
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                                <Globe size={20} />
                                                Location
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Country
                                                    </label>
                                                    <select
                                                        {...register("country")}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    >
                                                        <option value="">Select Country</option>
                                                        {countries.map(country => (
                                                            <option key={country.code} value={country.name}>
                                                                {country.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register("city")}
                                                        placeholder="Enter city"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Address
                                                    </label>
                                                    <textarea
                                                        {...register("address")}
                                                        rows={2}
                                                        placeholder="Enter your complete address"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Languages Section */}
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                                <Globe size={20} />
                                                Languages
                                            </h2>
                                            <LanguagesSelect
                                                selectedLanguages={selectedLanguages}
                                                onChange={setSelectedLanguages}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Security & Privacy Tab */}
                                {activeTab === "security" && (
                                    <div className="space-y-6">
                                        {/* Change Password */}
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                                <Lock size={20} />
                                                Change Password
                                            </h2>

                                            {/* Current Password */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                        name="currentPassword"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordInputChange}
                                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                                                        placeholder="Enter current password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* New Password */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordInputChange}
                                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                                                        placeholder="Enter new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Confirm New Password */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordInputChange}
                                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Password Strength Indicator - Like Register Page */}
                                            {passwordData.newPassword && (
                                                <div className="mt-4 space-y-3">
                                                    {/* Strength Bar */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-medium text-gray-600">Password Strength</span>
                                                            <span className={`text-xs font-medium ${passwordStrength.score <= 2 ? 'text-red-600' :
                                                                passwordStrength.score <= 4 ? 'text-yellow-600' :
                                                                    'text-green-600'
                                                                }`}>
                                                                {passwordStrength.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1 h-2">
                                                            {[1, 2, 3, 4, 5].map((segment) => (
                                                                <div
                                                                    key={segment}
                                                                    className={`flex-1 rounded-full transition-all duration-300 ${segment <= passwordStrength.score
                                                                        ? passwordStrength.color
                                                                        : 'bg-gray-200'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {passwordStrength.message}
                                                        </p>
                                                    </div>

                                                    {/* Password Requirements Checklist */}
                                                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                                                        <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            <div className="flex items-center gap-2">
                                                                {passwordStrength.checks?.length ? (
                                                                    <CheckCircle size={14} className="text-green-500" />
                                                                ) : (
                                                                    <XCircle size={14} className="text-gray-300" />
                                                                )}
                                                                <span className={`text-xs ${passwordStrength.checks?.length ? 'text-gray-700' : 'text-gray-400'}`}>
                                                                    At least 8 characters
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {passwordStrength.checks?.uppercase ? (
                                                                    <CheckCircle size={14} className="text-green-500" />
                                                                ) : (
                                                                    <XCircle size={14} className="text-gray-300" />
                                                                )}
                                                                <span className={`text-xs ${passwordStrength.checks?.uppercase ? 'text-gray-700' : 'text-gray-400'}`}>
                                                                    One uppercase letter
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {passwordStrength.checks?.lowercase ? (
                                                                    <CheckCircle size={14} className="text-green-500" />
                                                                ) : (
                                                                    <XCircle size={14} className="text-gray-300" />
                                                                )}
                                                                <span className={`text-xs ${passwordStrength.checks?.lowercase ? 'text-gray-700' : 'text-gray-400'}`}>
                                                                    One lowercase letter
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {passwordStrength.checks?.number ? (
                                                                    <CheckCircle size={14} className="text-green-500" />
                                                                ) : (
                                                                    <XCircle size={14} className="text-gray-300" />
                                                                )}
                                                                <span className={`text-xs ${passwordStrength.checks?.number ? 'text-gray-700' : 'text-gray-400'}`}>
                                                                    One number
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 sm:col-span-2">
                                                                {passwordStrength.checks?.special ? (
                                                                    <CheckCircle size={14} className="text-green-500" />
                                                                ) : (
                                                                    <XCircle size={14} className="text-gray-300" />
                                                                )}
                                                                <span className={`text-xs ${passwordStrength.checks?.special ? 'text-gray-700' : 'text-gray-400'}`}>
                                                                    One special character (@$!%*?&#)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-6">
                                                <button
                                                    type="button"
                                                    onClick={handlePasswordChange}
                                                    disabled={changingPassword}
                                                    className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    {changingPassword ? (
                                                        <>
                                                            <Loader2 size={18} className="animate-spin" />
                                                            Changing Password...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock size={18} />
                                                            Update Password
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Two-Factor Authentication */}
                                        {/* <div className="bg-gray-50 p-6 rounded-xl">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                                <Shield size={20} />
                                                Two-Factor Authentication (2FA)
                                            </h2>
                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Enable 2FA</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Add an extra layer of security to your account
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register("twoFactorAuth")}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div> */}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </AdminContainer>
            </div>
        </section>
    );
}

export default Profile;