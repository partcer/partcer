import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from '../components';
import {
    Lock,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    ArrowRight,
    Shield
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { useEffect } from 'react';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    useEffect(() => {
        if (!token) {
            toast.error('Invalid password reset link');
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(`/api/v1/users/reset-password/${token}`, {
                password: data.password,
                confirm: data.confirm
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Password reset successfully!');
                // Redirect to login after 1 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        } catch (error) {
            console.error('Reset password error:', error);

            // Handle specific error cases
            if (error.response?.status === 400) {
                if (error.response?.data?.message?.includes('expired')) {
                    toast.error('Password reset link has expired. Please request a new one.');
                } else {
                    toast.error(error.response?.data?.message || 'Invalid reset link');
                }
            } else if (error.response?.status === 404) {
                toast.error('Invalid or expired reset token. Please request a new password reset.');
            } else {
                toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Password strength checker
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: 'No password' };

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.match(/[a-z]+/)) strength += 1;
        if (password.match(/[A-Z]+/)) strength += 1;
        if (password.match(/[0-9]+/)) strength += 1;
        if (password.match(/[$@#&!]+/)) strength += 1;

        return {
            strength,
            label: strength <= 2 ? 'Weak' : strength <= 4 ? 'Medium' : 'Strong',
            color: strength <= 2 ? 'bg-red-500' : strength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
        };
    };

    const passwordStrength = getPasswordStrength(password);

    return (
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
            <Container>
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} className="text-primary" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                            Create New <span className="text-primary">Password</span>
                        </h1>
                        <p className="text-gray-600">
                            Your new password must be different from previously used passwords.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white border border-gray-200 shadow rounded-xl p-6 lg:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* New Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password <span className="text-primary">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters',
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                                            },
                                        })}
                                        className={`w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors`}
                                        placeholder="Enter new password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-medium ${passwordStrength.strength <= 2 ? 'text-red-600' :
                                                passwordStrength.strength <= 4 ? 'text-yellow-600' :
                                                    'text-green-600'
                                                }`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <ul className="text-xs text-gray-500 space-y-1">
                                            <li className="flex items-center gap-1">
                                                <CheckCircle size={12} className={password?.length >= 8 ? 'text-green-500' : 'text-gray-300'} />
                                                At least 8 characters
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle size={12} className={password?.match(/[A-Z]/) ? 'text-green-500' : 'text-gray-300'} />
                                                One uppercase letter
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle size={12} className={password?.match(/[a-z]/) ? 'text-green-500' : 'text-gray-300'} />
                                                One lowercase letter
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle size={12} className={password?.match(/[0-9]/) ? 'text-green-500' : 'text-gray-300'} />
                                                One number
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle size={12} className={password?.match(/[@$!%*?&]/) ? 'text-green-500' : 'text-gray-300'} />
                                                One special character
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password <span className="text-primary">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register('confirm', {
                                            required: 'Please confirm your password',
                                            validate: value => value === password || 'Passwords do not match',
                                        })}
                                        className={`w-full pl-10 pr-10 py-3 border ${errors.confirm ? 'border-red-300' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors`}
                                        placeholder="Confirm new password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirm && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.confirm.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            {/* Back to Login */}
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors inline-flex items-center gap-1"
                                >
                                    <ArrowRight size={16} className="rotate-180" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Security Note */}
                    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Shield size={18} className="text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Password Security Tips</h4>
                                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                                    <li>Use a mix of letters, numbers, and special characters</li>
                                    <li>Avoid using personal information like your name or birthdate</li>
                                    <li>Don't use the same password across multiple websites</li>
                                    <li>Consider using a password manager</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ResetPassword;