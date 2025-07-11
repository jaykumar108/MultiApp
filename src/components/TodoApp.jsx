import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit3, Trash2, Calendar, Flag } from 'lucide-react';

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
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Todo App</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {totalCount} total, {completedCount} completed
              </p>
            </div>
            <div className="flex items-center space-x-2 hidden sm:flex">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="p-4 sm:p-6 border-b border-gray-200/50">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            <button
              onClick={addTodo}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm sm:text-base">Add</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="p-4 sm:p-6 border-b border-gray-200/50">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['all', 'active', 'completed'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                  filter === filterType
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="p-4 sm:p-6">
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
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 mt-1 sm:mt-0 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white m-auto" />}
                  </button>

                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1 px-3 py-1.5 sm:py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1.5 sm:py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 sm:py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className={`text-sm sm:text-base ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
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
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;