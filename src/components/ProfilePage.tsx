import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export const ProfilePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);

        if (tasks) {
          setStats({
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.is_completed).length,
            pendingTasks: tasks.filter(t => !t.is_completed).length
          });
        }
      }
    };
    getUser();
  }, []);

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 
                   dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tasks
        </button>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 
                         flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-100">
                {user.email[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
                Total Tasks
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalTasks}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 dark:text-green-100">
                Completed
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.completedTasks}
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100">
                Pending
              </h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pendingTasks}
              </p>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              Member since {format(new Date(user.created_at), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};