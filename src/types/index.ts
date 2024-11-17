export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  category: string;
  due_date?: string;
  created_at: string;
  user_id: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}