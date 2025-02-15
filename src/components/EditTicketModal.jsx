// src/components/EditTicketModal.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function EditTicketModal({ isOpen, onClose, ticket, onTicketUpdated }) {
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    assignedToEmail: '',
    impactLevel: '',
    departmentAffected: ''
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || '',
        description: ticket.description || '',
        priority: ticket.priority || '',
        status: ticket.status || '',
        assignedToEmail: ticket.assignedToEmail || '',
        impactLevel: ticket.impactLevel || '',
        departmentAffected: ticket.departmentAffected || ''
      });
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const ticketRef = doc(db, 'tickets', ticket.id);
      
      const updateData = {
        title: formData.title,
        description: formData.description,
        updatedAt: Timestamp.now(),
        updatedBy: userRole
      };

      await updateDoc(ticketRef, updateData);
      onTicketUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}