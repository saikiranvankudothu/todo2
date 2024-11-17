import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileDropdownProps {
  onProfileClick: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onProfileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    onProfileClick();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 
                 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 
                     flex items-center justify-center">
          <span className="text-primary-700 dark:text-primary-100 font-medium">
            {user.email?.[0].toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">
          {user.email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg 
                     shadow-lg py-1 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.email}
            </p>
          </div>
          
          <button
            onClick={handleProfileClick}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm 
                    text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                    dark:hover:bg-gray-700 text-left"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 
                     hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
};