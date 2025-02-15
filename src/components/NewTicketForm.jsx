import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function NewTicketForm({ onClose, onTicketCreated }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState('email');
  const [expectedResolutionDate, setExpectedResolutionDate] = useState('');
  const [departmentAffected, setDepartmentAffected] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const ticketData = {
        title,
        description,
        priority,
        category,
        attachment: fileUrl ? { url: fileUrl } : null, // Store file URL if provided
        contactEmail,
        contactPhone,
        preferredContact,
        expectedResolutionDate: Timestamp.fromDate(new Date(expectedResolutionDate)),
        departmentAffected,
        status: 'new',
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'tickets'), ticketData);
      onTicketCreated();
      onClose();
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          className="w-full px-3 py-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Priority</label>
        <select
          className="w-full px-3 py-2 border rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700">Category</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Attachment URL (optional)</label>
        <input
          type="url"
          className="w-full px-3 py-2 border rounded"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700">Contact Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Contact Phone</label>
        <input
          type="tel"
          className="w-full px-3 py-2 border rounded"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Preferred Contact</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              className="mr-2"
              value="email"
              checked={preferredContact === 'email'}
              onChange={(e) => setPreferredContact(e.target.value)}
              required
            />
            Email
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              className="mr-2"
              value="phone"
              checked={preferredContact === 'phone'}
              onChange={(e) => setPreferredContact(e.target.value)}
              required
            />
            Phone
          </label>
        </div>
      </div>
      <div>
        <label className="block text-gray-700">Expected Resolution Date</label>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded"
          value={expectedResolutionDate}
          onChange={(e) => setExpectedResolutionDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Department Affected</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded"
          value={departmentAffected}
          onChange={(e) => setDepartmentAffected(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
}
