import React from 'react';
import { Calendar, Flag, Clock, User, Tag, FileText, CheckCircle, Circle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

const ViewModal = ({ todo, isOpen, onClose, onToggle, onEdit, onDelete }) => {
  if (!todo) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = () => {
    return todo.completed ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <Circle className="w-5 h-5 text-gray-400" />
    );
  };

  const getStatusText = () => {
    return todo.completed ? 'Completed' : 'Pending';
  };

  const getStatusColor = () => {
    return todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-left">
                {todo.title}
              </DialogTitle>
              <DialogDescription className="text-left mt-2">
                Detailed view of your todo item
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {getStatusIcon()}
              <Badge variant="outline" className={getStatusColor()}>
                {getStatusText()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {todo.description && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-4 h-4 text-gray-500" />
                <h3 className="font-medium text-gray-900">Description</h3>
              </div>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {todo.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Status Toggle */}
          <div className="flex items-center justify-center">
            <Button
              onClick={() => onToggle(todo._id)}
              variant={todo.completed ? "outline" : "default"}
              className="w-full max-w-xs"
            >
              {todo.completed ? (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Mark as Pending
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Category</span>
              </div>
              <Badge className={getCategoryColor(todo.category)}>
                {todo.category}
              </Badge>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Flag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Priority</span>
              </div>
              <Badge variant="outline" className={getPriorityColor(todo.priority)}>
                {todo.priority}
              </Badge>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Due Date</span>
              </div>
              <p className="text-sm text-gray-600">
                {formatDate(todo.dueDate)}
              </p>
              {todo.dueDate && (
                <p className="text-xs text-gray-500">
                  {formatTime(todo.dueDate)}
                </p>
              )}
            </div>

            {/* Created Date */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Created</span>
              </div>
              <p className="text-sm text-gray-600">
                {formatDate(todo.createdAt)}
              </p>
              <p className="text-xs text-gray-500">
                {formatTime(todo.createdAt)}
              </p>
            </div>
          </div>

          {/* User Info */}
          {todo.user && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Created By</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {todo.user.name ? todo.user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {todo.user.name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {todo.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Additional Info */}
          {(todo.ip || todo.userAgent) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Additional Information</h3>
                {todo.ip && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">IP Address:</span> {todo.ip}
                  </div>
                )}
                {todo.userAgent && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">User Agent:</span> {todo.userAgent}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <Separator />
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onEdit(todo._id);
                onClose();
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this todo?')) {
                  onDelete(todo._id);
                  onClose();
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal; 