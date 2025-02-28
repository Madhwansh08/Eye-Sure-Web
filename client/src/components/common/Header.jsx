import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import LogoImage from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import ThemeToggle from "./ThemeToggle";
import {toast} from 'react-toastify'

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success("Logout successful");
      navigate("/");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const AnimatedTab = ({ children, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div
        className="relative cursor-pointer px-3 py-2 text-secondary"
        role="button"
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-md text-secondary bg-secondary z-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="relative z-10 text-sm font-semibold text-secondary"
          // animate={{ color: isHovered ? "#ffffff" : "#F2EBE3" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.span>
      </div>
    );
  };

  const AvatarDropdown = () => {
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <div
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={toggleDropdown}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleDropdown();
          }}
        >
          {user ? (
            user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span>{user.name?.[0]?.toUpperCase() || "U"}</span>
            )
          ) : (
            <span>U</span>
          )}
        </div>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-60 bg-primary rounded-md shadow-lg z-50 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                {user && user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="font-semibold text-sm text-secondary">
                    {user?.name || "Unknown User"}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <hr className="mb-3 border-gray-600" />
              <button
                aria-label="Profile Settings"
                onClick={() => {
                  navigate("/dashboard");
                  setIsDropdownOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 w-full text-sm text-secondary hover:bg-secondary"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Profile Settings</span>
              </button>
              <button
                aria-label="Logout"
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 w-full text-sm text-secondary hover:bg-[#5c60c6]"
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
              <div className="mt-2 px-4 py-2">
                <ThemeToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary bg-opacity-70 backdrop-blur-md" : "bg-primary"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex flex-1">
          <button onClick={() => navigate("/")} className="-m-1.5 p-1.5" aria-label="Navigate to home">
            <img className="h-10 w-auto hover:animate-pulse " src={LogoImage} alt="Logo" />
          </button>
        </div>
        {isDesktop ? (
          <div className="hidden lg:flex lg:gap-x-12 text-secondary items-center">
            <AnimatedTab onClick={() => navigate("/about")}>About</AnimatedTab>
            <AnimatedTab onClick={() => navigate("/upload")}>Retina Analysis</AnimatedTab>
            {user ? (
              <>
                <AnimatedTab onClick={() => navigate("/dashboard")}>Dashboard</AnimatedTab>
                <AvatarDropdown />
              </>
            ) : (
              <>
                <AnimatedTab onClick={() => navigate("/login")}>Log in</AnimatedTab>
                {/* <AnimatedTab onClick={() => navigate("/register")}>Register</AnimatedTab> */}
              </>
            )}
          </div>
        ) : (
          <button
            aria-label="Open main menu"
            type="button"
            onClick={toggleMenu}
            className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        )}
      </nav>
      <AnimatePresence>
        {isMenuOpen && !isDesktop && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm bg-primary p-6 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    navigate("/");
                    setIsMenuOpen(false);
                  }}
                  className="-m-1.5 p-1.5"
                  aria-label="Navigate to home"
                >
                  <img className="h-8 w-auto" src={LogoImage} alt="Logo" />
                </button>
                <button
                  aria-label="Close menu"
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md p-2.5 text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 mb-4">
                      {user && user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <p className="font-semibold text-sm text-white">
                          {user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-lg px-4 py-2 mb-2 text-base font-semibold text-white hover:bg-gray-700"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-lg px-4 py-2 mb-2 text-base font-semibold text-white hover:bg-gray-700"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-lg px-4 py-2 mb-2 text-base font-semibold text-white hover:bg-gray-700"
                    >
                      Log out
                    </button>
                    <hr className="mb-4 border-gray-600" />
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-lg px-4 py-2 mb-4 text-base font-semibold text-white hover:bg-gray-700"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-lg px-4 py-2 mb-4 text-base font-semibold text-white hover:bg-gray-700"
                    >
                      Register
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    navigate("/contact");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full rounded-lg px-4 py-2 mb-2 text-base font-semibold text-white hover:bg-gray-700"
                >
                  Contact
                </button>
                <button
                  onClick={() => {
                    navigate("/about");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full rounded-lg px-4 py-2 text-base font-semibold text-white hover:bg-gray-700"
                >
                  About
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
