import React, { useEffect, useState } from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { EditTaskModal } from './EditTaskModal';
import { supabase } from '../lib/supabase';
import { ListFilter, SortAsc, SortDesc } from 'lucide-react';

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (filter === 'active') {
        query = query.eq('is_completed', false);
      } else if (filter === 'completed') {
        query = query.eq('is_completed', true);
      }

      const { data } = await query;
      if (data) setTasks(data);
    };

    fetchTasks();

    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filter, sortBy, sortOrder]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <ListFilter className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md"
          >
            <option value="created_at">Created Date</option>
            <option value="due_date">Due Date</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="w-5 h-5 text-gray-500" />
            ) : (
              <SortDesc className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onEdit={() => setEditingTask(task)} 
          />
        ))}
      </div>
      <EditTaskModal 
        task={editingTask} 
        onClose={() => setEditingTask(null)} 
      />
    </div>
  );
};