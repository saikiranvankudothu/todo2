import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to add tasks');
        return;
      }

      const { error } = await supabase.from('tasks').insert([{
        title: title.trim(),
        description: description.trim(),
        category,
        due_date: dueDate || null,
        is_completed: false,
        user_id: user.id
      }]);

      if (error) throw error;

      setTitle('');
      setDescription('');
      setDueDate('');
      toast.success('Task added successfully');
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error(error.message || 'Error adding task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <textarea
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent"
            rows={2}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
            </select>
          </div>
          <div className="flex-1">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 
                   rounded-lg flex items-center justify-center space-x-2 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          <PlusCircle className="w-5 h-5" />
          <span>{isSubmitting ? 'Adding...' : 'Add Task'}</span>
        </button>
      </div>
    </form>
  );
};