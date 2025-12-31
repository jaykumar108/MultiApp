import React from 'react';
import { User, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import LogoutButton from './LogoutButton';
import LogoutModal from './modals/logoutModal';

const Navbar = ({ tabs, activeTab, setActiveTab, user, handleLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    handleLogout();
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-indigo-600">
                  Task Manager
                </h1>
              </div>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 ${activeTab === tab.id
                      ? 'bg-white text-gray-800 shadow-md border border-gray-200 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 font-normal'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Side - User Menu */}
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/60 rounded-full border border-gray-200">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>

              {/* Logout Button with Purple Theme */}
              <div className="hidden sm:block">
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  <span className="text-sm">Logout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden rounded-full hover:bg-indigo-50"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-4 space-y-2">
              {/* Mobile User Info */}
              <div className="flex items-center space-x-2 px-4 py-3 bg-indigo-50 rounded-2xl border border-indigo-200 mb-3">
                <User className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>

              {/* Mobile Navigation */}
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}

              {/* Mobile Logout Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogoutClick();
                }}
                className="w-full flex items-center justify-center space-x-2 px-5 py-3.5 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 transition-all duration-300 shadow-lg font-medium mt-4"
              >
                <span>Logout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

export default Navbar; 