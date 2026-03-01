import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components';
import {
    Mail,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Lock,
    Send,
    HelpCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

const ForgotPassword = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm();

    const forgotPasswordHandler = async (data) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/v1/users/forgot-password', {
                email: data.email
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Password reset email sent!');
                setSubmittedEmail(data.email);
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error('Forgot password error:', error);

            // Handle specific error cases
            if (error.response?.status === 404) {
                toast.error('No account found with this email address');
            } else if (error.response?.status === 400) {
                toast.error(error.response?.data?.message || 'Invalid request');
            } else {
                toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/v1/users/forgot-password', {
                email: submittedEmail
            });

            if (response.data.success) {
                toast.success('Reset instructions resent! Please check your email.');
            }
        } catch (error) {
            toast.error('Failed to resend. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
            <Container>
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={32} className="text-primary" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                            Forgot <span className="text-primary">Password?</span>
                        </h1>
                        <p className="text-gray-600">
                            No worries! Enter your email address and we'll send you reset instructions.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white border border-gray-200 shadow rounded-xl p-6 lg:p-8">
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit(forgotPasswordHandler)} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address <span className="text-primary">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Please enter a valid email address',
                                                },
                                            })}
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors`}
                                            placeholder="Enter your email"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.email.message}
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
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Instructions
                                            <Send size={18} />
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
                        ) : (
                            <div className="text-center space-y-6">
                                {/* Success Icon */}
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle size={32} className="text-green-600" />
                                </div>

                                {/* Success Message */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Check Your Email
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Reset password link has been sent to{' '}
                                        <span className="font-medium text-gray-900">{submittedEmail}</span>
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Check your spam and promotions folder if it doesn't appear in your inbox.
                                    </p>
                                </div>

                                {/* Resend Option */}
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-3">
                                        Didn't receive the reset instructions?
                                    </p>
                                    <button
                                        onClick={handleResend}
                                        className="text-primary hover:text-primary/80 font-medium text-sm transition-colors inline-flex items-center gap-1"
                                    >
                                        <HelpCircle size={16} />
                                        Resend Email
                                    </button>
                                </div>

                                {/* Back to Login */}
                                <div>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm"
                                    >
                                        <ArrowRight size={16} className="rotate-180" />
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Help Tips */}
                    <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <HelpCircle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-orange-800 mb-1">Need help?</h4>
                                <p className="text-xs text-orange-700">
                                    If you're having trouble resetting your password, please{' '}
                                    <Link to="/contact" className="underline hover:no-underline">
                                        contact our support team
                                    </Link>
                                    {' '}for assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ForgotPassword;