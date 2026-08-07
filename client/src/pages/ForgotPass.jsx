import React, { useState } from 'react';
import { Mail, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { useNavigate, Link, Await } from 'react-router-dom';
import api from '../config/api';
import toast from 'react-hot-toast';


const ForgotPass = () => {

    const navigate = useNavigate();

    // State management
    const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/api/users/forgot-password', { email });
            toast.success(data.message || "OTP Sent to your email!");
            setStep(2);

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
        setLoading(false);
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/api/users/reset-password', { email, otp, newPassword });
            toast.success(data.message || "Password Reset Successfully");
            navigate('/app');
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-8 bg-white shadow-sm">

                {step === 1 ? (
                    // --- STEP 1: EMAIL FORM ---
                    <form onSubmit={handleSendOTP}>
                        <h1 className="text-gray-900 text-3xl font-medium">Forgot Password</h1>
                        <p className="text-gray-500 text-sm mt-2">Enter your email to receive a 6-digit OTP code</p>

                        <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <Mail size={16} color="#6B7280" />
                            <input
                                type="email"
                                placeholder="Email address"
                                className="border-none outline-none ring-0 w-full text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    // --- STEP 2: OTP & NEW PASSWORD FORM ---
                    <form onSubmit={handleResetPassword}>
                        <h1 className="text-gray-900 text-3xl font-medium">Reset Password</h1>
                        <p className="text-gray-500 text-sm mt-2">Enter the OTP sent to <b>{email}</b></p>

                        {/* OTP Input */}
                        <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <KeyRound size={16} color="#6B7280" />
                            <input
                                type="text"
                                placeholder="6-Digit OTP"
                                className="border-none outline-none ring-0 w-full text-sm"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        {/* New Password Input */}
                        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <Lock size={16} color="#6B7280" />
                            <input
                                type="password"
                                placeholder="New Password"
                                className="border-none outline-none ring-0 w-full text-sm"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {/* Back to Login Link */}
                <div className="mt-6 flex items-center justify-center gap-1 text-sm text-gray-500">
                    <ArrowLeft size={16} />
                    <Link to="/app" className="text-green-500 hover:underline">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;
