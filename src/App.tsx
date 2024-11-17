import React, { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Toaster } from 'react-hot-toast';
import { Moon, Sun, CheckSquare } from 'lucide-react';
import { supabase } from './lib/supabase';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ProfileDropdown } from './components/ProfileDropdown';
import { ProfilePage } from './components/ProfilePage';

function App() {
  const [session, setSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <CheckSquare className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to TaskMaster
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to manage your tasks efficiently
            </p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0ea5e9',
                    brandAccent: '#0284c7',
                  },
                },
              },
            }}
            providers={['google', 'github']}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
      <div className="max-w-4xl mx-auto p-4">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-3">
            <CheckSquare className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              TaskMaster
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 
                       transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <ProfileDropdown onProfileClick={() => setShowProfile(true)} />
          </div>
        </header>

        <main className="py-8">
          {showProfile ? (
            <ProfilePage onBack={() => setShowProfile(false)} />
          ) : (
            <>
              <TaskForm />
              <TaskList />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;