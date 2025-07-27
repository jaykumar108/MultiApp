import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit3, Trash2, Calendar, Flag, Filter, Search, BarChart3, MoreHorizontal, ChevronLeft, ChevronRight, Settings, Download, Upload, Eye } from 'lucide-react';
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
import { Separator } from '../ui/separator';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { createTodo, getTodos, updateTodo, deleteTodo, toggleTodoStatus, getTodoStats } from '../../services/todoService';
import ViewModal from './ViewModal';
import toast from 'react-hot-toast';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    dueDate: '' 
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    category: '',
    priority: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, card, calendar

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

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
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
    updateFilter('page', page);
  };

  const totalPages = Math.ceil((stats.total || 0) / filters.limit);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-0">
      <Card>
        {/* Header */}
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl sm:text-2xl text-black">Todo App</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                {stats.total || 0} total, {stats.completed || 0} completed
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {/* View Mode Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {viewMode === 'table' ? 'Table' : viewMode === 'card' ? 'Cards' : 'Calendar'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>View Mode</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setViewMode('table')}>
                    Table View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('card')}>
                    Card View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('calendar')}>
                    Calendar View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden sm:flex"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              {/* Add Todo Dialog */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className='bg-black text-white hover:bg-black/80'>
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
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Enter todo title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter todo description"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
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
                          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
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

        {/* Filters */}
        {showFilters && (
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Priority</Label>
                <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Search</Label>
                <Input
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search todos..."
                />
              </div>
            </div>
          </CardContent>
        )}

        {/* Content based on view mode */}
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
          ) : viewMode === 'table' ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todos.map((todo) => (
                      <TableRow 
                        key={todo._id}
                        className={todo.completed ? 'bg-gray-50' : ''}
                      >
                        <TableCell>
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggle(todo._id)}
                            className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                {todo.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(todo.category)}`}>
                            {todo.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
                            <Flag className="w-3 h-3 inline mr-1" />
                            {todo.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          {todo.dueDate ? (
                            <span className="text-sm text-gray-600 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">No due date</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(filters.page - 1)}
                          className={filters.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                                className="cursor-pointer"
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
                          className={filters.page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todos.map((todo) => (
                <Card key={todo._id} className={todo.completed ? 'bg-gray-50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => handleToggle(todo._id)}
                          className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                        />
                        <CardTitle className={`text-sm ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.title}
                        </CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
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
                  </CardHeader>
                  <CardContent className="pt-0">
                    {todo.description && (
                      <p className={`text-sm mb-3 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(todo.category)}`}>
                        {todo.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
                        <Flag className="w-3 h-3 inline mr-1" />
                        {todo.priority}
                      </span>
                    </div>
                    {todo.dueDate && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Calendar View
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Calendar View</h3>
                <Button variant="outline" onClick={() => setShowCalendar(!showCalendar)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                </Button>
              </div>
              
              {showCalendar && (
                <Card>
                  <CardContent className="p-4">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              )}
              
              <Separator />
              
              <div className="space-y-2">
                {todos.map((todo) => (
                  <Card key={todo._id} className={todo.completed ? 'bg-gray-50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggle(todo._id)}
                            className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                          />
                          <div>
                            <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                {todo.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoApp;