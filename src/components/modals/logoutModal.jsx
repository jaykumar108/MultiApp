import React from 'react';
import { LogOut, X } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md border-purple-200">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <LogOut className="w-6 h-6 text-purple-600" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-indigo-600">
                                Confirm Logout
                            </DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-gray-600 pt-4">
                        Are you sure you want to logout? You will need to sign in again to access your account.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LogoutModal;
