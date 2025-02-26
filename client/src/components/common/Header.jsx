import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import LogoImage from "../../assets/logo.png";

// --- Mocks for Redux, auth, toast, theme toggle, and navigation ---

// Mock useDispatch: no-op function
const useDispatch = () => () => {};

// Mock useSelector: returns a dummy auth object
const useSelector = () => ({
  user: { name: "John Doe", email: "john.doe@example.com" },
  profilePicture: null,
});

// Mock toast: simply logs the message
const toast = {
  success: (msg) => console.log("Toast:", msg),
};

// Mock ThemeToggle component
const ThemeToggle = () => <button className="text-white">Toggle Theme</button>;

// Mock useNavigate hook from react-router-dom
const useNavigate = () => {
  return (path) => {
    console.log("Navigate to:", path);
  };
};

// --- Header Component ---

const Header = () => {
  const dispatch = useDispatch();
  const auth = useSelector();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Listen for window resize and scroll events
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

  const handleLogout = () => {
    // Mock clearing auth actions
    toast.success("User Logged Out");
    navigate("/");
    setIsDropdownOpen(false);
  };

  // Animated tab component for desktop nav links
  const AnimatedTab = ({ children, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="relative cursor-pointer px-3 py-2"
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
          className="absolute inset-0 rounded-md bg-secondary z-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="relative z-10 text-sm font-semibold text-white"
          animate={{ color: isHovered ? "#ffffff" : "#F2EBE3" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.span>
      </div>
    );
  };

  // Avatar dropdown for logged-in users
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
          {auth?.profilePicture ? (
            <img
              src={auth.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span>{auth?.user?.name?.[0]?.toUpperCase() || "U"}</span>
          )}
        </div>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-60 bg-gray-900 rounded-md shadow-lg z-50 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                {auth?.profilePicture ? (
                  <img
                    src={auth.profilePicture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white">
                    {auth?.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="font-semibold text-sm text-white">
                    {auth?.user?.name || "Unknown User"}
                  </p>
                  <p className="text-xs text-gray-400">{auth?.user?.email}</p>
                </div>
              </div>
              <hr className="mb-3 border-gray-600" />
              <button
                aria-label="Profile Settings"
                onClick={() => {
                  navigate("/dashboard");
                  setIsDropdownOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 w-full text-sm text-white hover:bg-secondary"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Profile Settings</span>
              </button>
              <button
                aria-label="Logout"
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 w-full text-sm text-white hover:bg-gray-700"
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
            <img className="h-10 w-auto hover:animate-pulse" src={LogoImage} alt="Logo" />
          </button>
        </div>
        {isDesktop ? (
          <div className="hidden lg:flex lg:gap-x-12 items-center">
            {/* Navigation items defined inline */}
            <AnimatedTab onClick={() => navigate("/about")}>About</AnimatedTab>
            <AnimatedTab onClick={() => navigate("/contact")}>Retina Analysis</AnimatedTab>
            {auth?.user ? (
              <>
                <AnimatedTab onClick={() => navigate("/dashboard")}>Dashboard</AnimatedTab>
                <AvatarDropdown />
              </>
            ) : (
              <AnimatedTab onClick={() => navigate("/login")}>Log in</AnimatedTab>
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
                {auth?.user ? (
                  <>
                    <div className="flex items-center space-x-3 mb-4">
                      {auth?.profilePicture ? (
                        <img
                          src={auth.profilePicture}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white">
                          {auth?.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <p className="font-semibold text-sm text-white">
                          {auth?.user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-400">{auth?.user?.email}</p>
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
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full rounded-lg px-4 py-2 mb-4 text-base font-semibold text-white hover:bg-gray-700"
                  >
                    Log in
                  </button>
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
