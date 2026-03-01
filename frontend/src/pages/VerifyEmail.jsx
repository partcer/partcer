import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight, Clock, Shield, X } from 'lucide-react';
import { Container } from '../components';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [verificationStatus, setVerificationStatus] = useState('verifying');
    const [countdown, setCountdown] = useState(5);
    const [errorMessage, setErrorMessage] = useState('');
    const [showResendModal, setShowResendModal] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        verifyEmailToken();
    }, [token]);

    useEffect(() => {
        let timer;
        if (verificationStatus === 'success' && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (verificationStatus === 'success' && countdown === 0) {
            navigate('/login');
        }
        return () => clearTimeout(timer);
    }, [verificationStatus, countdown, navigate]);

    const verifyEmailToken = async () => {
        try {
            const response = await axiosInstance.get(`/api/v1/users/verify-email/${token}`);

            if (response.data.success) {
                setVerificationStatus('success');
                toast.success('Email verified successfully!');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationStatus('error');
            setErrorMessage(error?.response?.data?.message || 'Failed to verify email. The link may have expired.');
            toast.error(error?.response?.data?.message || 'Verification failed');
        }
    };

    const handleResendSubmit = async (e) => {
        e.preventDefault();
        if (!resendEmail) {
            toast.error('Please enter your email address');
            return;
        }

        setIsResending(true);
        try {
            const response = await axiosInstance.post('/api/v1/users/resend-verification', {
                email: resendEmail
            });

            if (response.data.success) {
                toast.success('Verification email resent! Please check your inbox.');
                setShowResendModal(false);
                setResendEmail('');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setIsResending(false);
        }
    };

    const ResendModal = () => (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={() => setShowResendModal(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Resend Verification Email</h3>
                            <button onClick={() => setShowResendModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleResendSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-primary">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    We'll send a new verification link to this email address.
                                </p>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Mail size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-amber-800">
                                            <strong>Note:</strong> The new verification link will expire in 24 hours.
                                            Please check your spam folder if you don't see it in your inbox.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowResendModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isResending}
                                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isResending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Verification Email'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <Container>
                <div className="max-w-md mx-auto">
                    {/* Verification Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                        {/* Loading State */}
                        {verificationStatus === 'verifying' && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Loader2 size={40} className="text-primary animate-spin" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Verifying your email</h2>
                                <p className="text-gray-600 mb-6">
                                    Please wait while we verify your email address...
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <Clock size={16} />
                                    <span>This will only take a moment</span>
                                </div>
                            </div>
                        )}

                        {/* Success State */}
                        {verificationStatus === 'success' && (
                            <div className="text-center py-4">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} className="text-green-600" />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Email Verified! 🎉
                                </h2>

                                <p className="text-gray-600 mb-6">
                                    Your email has been successfully verified. You can now access your Partcer account.
                                </p>

                                <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
                                    <div className="flex items-start gap-3">
                                        <Shield size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-green-800 mb-1">
                                                Account Secured
                                            </p>
                                            <p className="text-xs text-green-700">
                                                Your email verification helps us keep your account secure and ensures you receive important notifications.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Link
                                        to="/login"
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                                    >
                                        Proceed to Login
                                        <ArrowRight size={18} />
                                    </Link>

                                    <p className="text-sm text-gray-500">
                                        Redirecting to login in <span className="font-semibold text-primary">{countdown}</span> seconds...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {verificationStatus === 'error' && (
                            <div className="text-center py-4">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <XCircle size={40} className="text-red-600" />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Verification Failed
                                </h2>

                                <p className="text-gray-600 mb-4">
                                    {errorMessage}
                                </p>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
                                    <div className="flex items-start gap-3">
                                        <Mail size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-amber-800 mb-1">
                                                Didn't receive the email?
                                            </p>
                                            <p className="text-xs text-amber-700 mb-3">
                                                Check your spam folder or request a new verification email.
                                            </p>
                                            <button
                                                onClick={() => setShowResendModal(true)}
                                                className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Resend Verification Email
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                                    >
                                        Go to Login
                                        <ArrowRight size={18} />
                                    </Link>

                                    <Link
                                        to="/"
                                        className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-300 block"
                                    >
                                        Return to Home
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Security Note - Always visible */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-3 text-xs text-gray-500 justify-center">
                                <Shield size={14} className="text-primary" />
                                <span>Secure verification powered by Partcer</span>
                            </div>
                        </div>
                    </div>
                </div>
                {showResendModal && <ResendModal />}
            </Container>
        </div>
    );
}

export default VerifyEmail;