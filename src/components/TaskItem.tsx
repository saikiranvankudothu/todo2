import React from 'react';
import { format } from 'date-fns';
import { Check, Trash2, Edit, Calendar } from 'lucide-react';
import { Task } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const toggleComplete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !task.is_completed })
        .eq('id', task.id);

      if (error) throw error;
      toast.success(task.is_completed ? 'Task uncompleted' : 'Task completed');
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  const deleteTask = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 transition-all ${
      task.is_completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleComplete}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${task.is_completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 dark:border-gray-600'
              }`}
          >
            {task.is_completed && <Check className="w-4 h-4 text-white" />}
          </button>
          <div>
            <h3 className={`font-medium ${
              task.is_completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {task.due_date && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(task.due_date), 'MMM d')}
            </div>
          )}
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={deleteTask}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};