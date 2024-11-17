import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface EditTaskModalProps {
  task: Task | null;
  onClose: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category);
      setDueDate(task.due_date?.split('T')[0] || '');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title,
          description,
          category,
          due_date: dueDate || null,
        })
        .eq('id', task.id);

      if (error) throw error;
      toast.success('Task updated successfully');
      onClose();
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                         dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 
                       rounded-lg transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                       font-medium py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                       transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};