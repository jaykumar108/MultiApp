import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit3, Trash2, Calendar, Flag, BarChart3, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { createTodo, getTodos, updateTodo, deleteTodo, toggleTodoStatus, getTodoStats } from '../../services/todoService';
import toast from 'react-hot-toast';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    dueDate: ''
  });

  // Pagination states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
    loadStats();
  }, [filters]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await getTodos(filters);
      setTodos(response.todos || []);
    } catch (error) {
      console.error('Error loading todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getTodoStats();
      setStats(response.stats || {});
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const todoData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      await createTodo(todoData);
      toast.success('Todo created successfully');

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        dueDate: ''
      });
      setDialogOpen(false);

      // Reload todos
      loadTodos();
      loadStats();
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Failed to create todo');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTodoStatus(id);
      toast.success('Todo status updated');
      loadTodos();
      loadStats();
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('Failed to update todo status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await deleteTodo(id);
      toast.success('Todo deleted successfully');
      loadTodos();
      loadStats();
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const handleUpdate = async (id, updateData) => {
    try {
      await updateTodo(id, updateData);
      toast.success('Todo updated successfully');
      setEditingId(null);
      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'shopping': return 'bg-green-100 text-green-800';
      case 'health': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionPercentage = () => {
    if (!stats.total || stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const totalPages = Math.ceil((stats.total || 0) / filters.limit);
  const startIndex = (filters.page - 1) * filters.limit;

  return (
    <div className="w-full">
      <Card>
        {/* Header */}
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl sm:text-2xl text-indigo-600">Todo App</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                {stats.total || 0} total, {stats.completed || 0} completed
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {/* Add Todo Dialog */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className='bg-indigo-600 text-white hover:bg-indigo-700 rounded-3xl'>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Todo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Todo</DialogTitle>
                    <DialogDescription>
                      Add a new task to your todo list. Fill in the details below.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter todo title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="shopping">Shopping</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter todo description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-3xl">
                        Cancel
                      </Button>
                      <Button type="submit" className="rounded-3xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Todo
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-500">{getCompletionPercentage()}%</span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4 sm:p-6 pt-0">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <Check className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">No todos found</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">Create your first todo to get started</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="w-16 font-semibold text-gray-700">S.NO</TableHead>
                      <TableHead className="w-12 font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Title</TableHead>
                      <TableHead className="font-semibold text-gray-700">Category</TableHead>
                      <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                      <TableHead className="font-semibold text-gray-700">Created Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                      <TableHead className="w-24 font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todos.map((todo, index) => (
                      <TableRow
                        key={todo._id}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50/50 transition-colors border-b border-gray-100 last:border-0`}
                      >
                        <TableCell className="font-medium text-gray-700">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggle(todo._id)}
                            className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className={`text-xs mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                                {todo.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(todo.category)}`}>
                            {todo.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(todo.priority)}`}>
                            <Flag className="w-3 h-3 inline mr-1" />
                            {todo.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {todo.dueDate ? (
                            <span className="text-sm text-gray-600 flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                              {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-indigo-100 rounded-lg"
                              onClick={() => setEditingId(todo._id)}
                            >
                              <Edit3 className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-100 rounded-lg"
                              onClick={() => handleDelete(todo._id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {todos.map((todo, index) => (
                  <Card key={todo._id} className={todo.completed ? 'bg-gray-50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="text-sm font-semibold text-gray-600">#{startIndex + index + 1}</span>
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggle(todo._id)}
                            className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                          />
                          <h3 className={`font-medium flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-indigo-600'}`}>
                            {todo.title}
                          </h3>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-3xl">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingId(todo._id)}>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(todo._id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {todo.description && (
                        <p className={`text-sm mb-3 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                          {todo.description}
                        </p>
                      )}

                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(todo.category)}`}>
                          {todo.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
                          <Flag className="w-3 h-3 inline mr-1" />
                          {todo.priority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                        </div>
                        {todo.dueDate && (
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(filters.page - 1)}
                          className={`rounded-3xl ${filters.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (page === 1 || page === totalPages || (page >= filters.page - 1 && page <= filters.page + 1)) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === filters.page}
                                className="cursor-pointer rounded-3xl"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (page === filters.page - 2 || page === filters.page + 2) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(filters.page + 1)}
                          className={`rounded-3xl ${filters.page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoApp;