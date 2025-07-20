import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit3, Trash2, Calendar, Flag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'medium'
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <Card>
        {/* Header */}
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl sm:text-2xl text-black">Todo App</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                {totalCount} total, {completedCount} completed
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 hidden sm:flex">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Add Todo Form */}
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1"
            />
            <Button onClick={addTodo}>
              <Plus className="w-5 h-5 mr-2" />
              <span className="text-sm sm:text-base">Add</span>
            </Button>
          </div>
        </CardContent>

        {/* Filter Tabs */}
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['all', 'active', 'completed'].map((filterType) => (
              <Button
                key={filterType}
                onClick={() => setFilter(filterType)}
                variant={filter === filterType ? "default" : "ghost"}
                className={`flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium ${
                  filter === filterType
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>

        {/* Todo List */}
        <CardContent className="p-4 sm:p-6 pt-0">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <Check className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                {filter === 'all' ? 'Add a task to get started' : `Switch to another filter to see tasks`}
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-start sm:items-center space-x-3 p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                    todo.completed
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-200 hover:shadow-md transform hover:scale-[1.02]'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 mt-1 sm:mt-0 p-0 ${
                      todo.completed
                        ? 'bg-black border-black hover:bg-gray-800'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white m-auto" />}
                  </Button>

                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1"
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button onClick={cancelEdit} size="sm" variant="outline">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className={`text-sm sm:text-base ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                          {todo.text}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 flex items-center">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {editingId !== todo.id && (
                    <div className="flex space-x-1 mt-1 sm:mt-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoApp;