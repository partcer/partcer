import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Shield,
    Lock,
    Bell,
    Eye,
    EyeOff,
    Check,
    X,
    Save,
    User,
    Mail,
    Globe,
    Clock,
    Calendar,
    AlertTriangle,
    Smartphone,
    Laptop,
    LogOut,
    Key,
    Fingerprint,
    Shield as ShieldIcon,
    Users,
    Settings as SettingsIcon,
    ChevronRight
} from "lucide-react";
import { AdminContainer, AdminHeader, AdminSidebar } from "../../components";

function AccountSettings() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            emailNotifications: true,
            securityAlerts: true,
            loginAlerts: true,
            marketingEmails: false,
            twoFactorAuth: false,
            sessionTimeout: "30",
            ipWhitelisting: false
        }
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("security");

    const newPassword = watch("newPassword");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setSuccessMessage("");

        // Simulate API call
        setTimeout(() => {
            console.log("Account settings updated:", data);
            setSuccessMessage("Your account settings have been updated successfully!");
            setIsLoading(false);
        }, 1500);
    };

    const tabs = [
        { id: "security", label: "Security", icon: <Lock size={18} /> },
        // { id: "preferences", label: "Preferences", icon: <SettingsIcon size={18} /> },
    ];

    const sessionTimeoutOptions = [
        { value: "15", label: "15 minutes" },
        { value: "30", label: "30 minutes" },
        { value: "60", label: "1 hour" },
        { value: "120", label: "2 hours" },
        { value: "240", label: "4 hours" },
    ];

    return (
        <section className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="w-full relative">
                <AdminHeader />

                <AdminContainer>
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 py-6 md:py-8 px-4 md:px-0 mb-6">
                        <div className="container mx-auto">
                            <div className="flex items-center justify-start">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <Shield size={28} className="text-primary" />
                                        Account Settings
                                    </h1>
                                    <p className="text-gray-600 mt-2">
                                        Manage your security, sessions, and preferences
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    {/* <div className="bg-white border-b border-gray-200 px-6 mb-6">
                        <div className="container mx-auto">
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
                    </div> */}

                    {/* Main Content */}
                    <div className="container mx-auto py-6 md:py-8 px-4 md:px-0">
                        <form id="account-settings-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Success Message */}
                            {successMessage && (
                                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Check size={20} />
                                        <span>{successMessage}</span>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === "security" && (
                                <>
                                    {/* Change Password Section */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="p-6 md:p-8">
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Lock size={20} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                                                    <p className="text-gray-600 text-sm">Update your account password</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6 max-w-full">
                                                {/* Current Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Current Password *
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            {...register("currentPassword", {
                                                                required: "Current password is required",
                                                                minLength: {
                                                                    value: 6,
                                                                    message: "Password must be at least 6 characters"
                                                                }
                                                            })}
                                                            placeholder="Enter your current password"
                                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </button>
                                                    </div>
                                                    {errors.currentPassword && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                                                    )}
                                                </div>

                                                {/* New Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        New Password *
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showNewPassword ? "text" : "password"}
                                                            {...register("newPassword", {
                                                                required: "New password is required",
                                                                minLength: {
                                                                    value: 8,
                                                                    message: "Password must be at least 8 characters"
                                                                },
                                                                pattern: {
                                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                                                    message: "Password must contain uppercase, lowercase, and numbers"
                                                                }
                                                            })}
                                                            placeholder="Enter new password"
                                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </button>
                                                    </div>
                                                    {errors.newPassword && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                                                    )}
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        Password must be at least 8 characters with uppercase, lowercase, and numbers
                                                    </div>
                                                </div>

                                                {/* Confirm Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Confirm New Password *
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            {...register("confirmPassword", {
                                                                required: "Please confirm your password",
                                                                validate: value => value === newPassword || "Passwords do not match"
                                                            })}
                                                            placeholder="Confirm your new password"
                                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </button>
                                                    </div>
                                                    {errors.confirmPassword && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                                    )}
                                                </div>

                                                {/* Update Button */}
                                                <div className="pt-4">
                                                    <button
                                                        type="submit"
                                                        name="update-password"
                                                        disabled={isLoading}
                                                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isLoading ? "Updating..." : "Update Password"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Two-Factor Authentication */}
                                    {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="p-6 md:p-8">
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Fingerprint size={20} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
                                                    <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                                                </div>
                                            </div>

                                            <div className="max-w-lg">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <ShieldIcon size={24} className="text-primary" />
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">Enable 2FA</h3>
                                                            <p className="text-sm text-gray-500">Protect your account with two-factor authentication</p>
                                                        </div>
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

                                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-blue-700">
                                                        When enabled, you'll need to enter a verification code from your authenticator app in addition to your password.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* Login Alerts */}
                                    {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="p-6 md:p-8">
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                                <div className="p-2 bg-yellow-100 rounded-lg">
                                                    <Bell size={20} className="text-yellow-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-900">Security Alerts</h2>
                                                    <p className="text-gray-600 text-sm">Get notified about important security events</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 max-w-lg">
                                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <Mail size={18} className="text-gray-500" />
                                                        <span className="text-gray-900">Email me when someone logs into my account</span>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            {...register("loginAlerts")}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </div>
                                                </label>

                                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <Shield size={18} className="text-gray-500" />
                                                        <span className="text-gray-900">Alert me about suspicious activities</span>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            {...register("securityAlerts")}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div> */}
                                </>
                            )}

                            {/* Preferences Tab */}
                            {/* {activeTab === "preferences" && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6 md:p-8">
                                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <SettingsIcon size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
                                                <p className="text-gray-600 text-sm">Customize your admin experience</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6 max-w-lg">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Dashboard</h3>
                                                <div className="space-y-3">
                                                    <label className="flex items-center gap-3">
                                                        <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                                                        <span className="text-gray-700">Show revenue graph by default</span>
                                                    </label>
                                                    <label className="flex items-center gap-3">
                                                        <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                                                        <span className="text-gray-700">Show pending approvals on dashboard</span>
                                                    </label>
                                                    <label className="flex items-center gap-3">
                                                        <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                                                        <span className="text-gray-700">Enable real-time updates</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                                                <div className="space-y-3">
                                                    <label className="flex items-center gap-3">
                                                        <input type="checkbox" {...register("emailNotifications")} className="w-4 h-4 text-primary rounded" />
                                                        <span className="text-gray-700">New user registrations</span>
                                                    </label>
                                                    <label className="flex items-center gap-3">
                                                        <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                                                        <span className="text-gray-700">New service submissions</span>
                                                    </label>
                                                    <label className="flex items-center gap-3">
                                                        <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                                                        <span className="text-gray-700">Withdrawal requests</span>
                                                    </label>
                                                    <label className="flex items-center gap-3">
                                                        <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                                                        <span className="text-gray-700">Dispute opened</span>
                                                    </label>
                                                    <label className="flex items-center gap-3">
                                                        <input type="checkbox" {...register("marketingEmails")} className="w-4 h-4 text-primary rounded" />
                                                        <span className="text-gray-700">Platform updates and announcements</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Date & Time</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Date Format
                                                        </label>
                                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                                            <option>MM/DD/YYYY</option>
                                                            <option>DD/MM/YYYY</option>
                                                            <option>YYYY-MM-DD</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Time Format
                                                        </label>
                                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                                            <option>12-hour (AM/PM)</option>
                                                            <option>24-hour</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Timezone
                                                        </label>
                                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                                            <option>America/New_York (UTC-5)</option>
                                                            <option>America/Chicago (UTC-6)</option>
                                                            <option>America/Denver (UTC-7)</option>
                                                            <option>America/Los_Angeles (UTC-8)</option>
                                                            <option>Europe/London (UTC+0)</option>
                                                            <option>Europe/Paris (UTC+1)</option>
                                                            <option>Asia/Dubai (UTC+4)</option>
                                                            <option>Asia/Singapore (UTC+8)</option>
                                                            <option>Asia/Tokyo (UTC+9)</option>
                                                            <option>Australia/Sydney (UTC+11)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button
                                                    type="submit"
                                                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
                                                >
                                                    Save Preferences
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )} */}
                        </form>
                    </div>
                </AdminContainer>
            </div>
        </section>
    );
}

export default AccountSettings;