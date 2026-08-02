import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice.js'
import { useTheme } from "../context/ThemeContext.jsx";
import { Sun, Moon } from "lucide-react";


const Navbar = () => {

    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const LogoutUser = () => {
        navigate('/');
        dispatch(logout());
    }

    return (
        <div className="shadow bg-white dark:bg-slate-900 border-b border-transparent dark:border-slate-800 transition-colors duration-200">
            <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 dark:text-slate-100 transition-all">
                <Link to='/'>
                    <img src="/assets/logo.svg" alt="logo" className="h-11 w-auto" />
                </Link>
                <div className="flex items-center gap-4 text-sm">
                    <p className="max-sm:hidden">Hi, {user?.name}</p>
                    <button onClick={LogoutUser} className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-slate-700 px-7 py-1.5 rounded-full active:scale-95 transition-all">Logout</button>
                    <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-yellow-400 transition-colors">
                        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                </div>
            </nav>
        </div>
    )

}

export default Navbar