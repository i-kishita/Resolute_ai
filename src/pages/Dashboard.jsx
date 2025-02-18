import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { Eye, Edit2, Trash } from 'lucide-react';
import NewTicketModal from '../components/NewTicketModal';
import EditTicketModal from '../components/EditTicketModal';
import ViewTicketModal from '../components/ViewTicketModal';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar'; // Import Sidebar

export default function Dashboard() {
  const { currentUser, userRole, logout } = useAuth(); // Add logout to useAuth
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [currentUser, userRole]);

  async function fetchTickets() {
    try {
      let ticketsQuery;
      if (userRole === 'customer') {
        // Simple query without ordering
        ticketsQuery = query(
          collection(db, 'tickets'),
          where('createdBy', '==', currentUser.uid)
        );
      } else {
        ticketsQuery = query(
          collection(db, 'tickets'),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(ticketsQuery);
      const ticketList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toLocaleDateString() || '',
          expectedResolutionDate: data.expectedResolutionDate?.toDate().toLocaleDateString() || ''
        };
      });
      setTickets(ticketList);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  }

  async function handleDelete(ticketId) {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteDoc(doc(db, 'tickets', ticketId));
        await fetchTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  }

  const columns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'title', label: 'Title' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'preferredContact', label: 'Preferred Contact' },
    { key: 'expectedResolutionDate', label: 'Expected Resolution Date' },
    { key: 'departmentAffected', label: 'Department Affected' },
    { key: 'actions', label: 'Actions' }
  ];

  const renderActions = (ticket) => (
    <div className="flex gap-2">
      <button
        className="text-blue-500"
        onClick={() => {
          setSelectedTicket(ticket);
          setIsViewOpen(true);
        }}
      >
        <Eye size={20} />
      </button>
      
      {(userRole === 'agent' || ticket.createdBy === currentUser?.uid) && (
        <button
          className="text-yellow-500"
          onClick={() => {
            setSelectedTicket(ticket);
            setIsEditOpen(true);
          }}
        >
          <Edit2 size={20} />
        </button>
      )}
      
      {(userRole === 'customer' && ticket.createdBy === currentUser?.uid) && (
        <button
          className="text-red-500"
          onClick={() => handleDelete(ticket.id)}
        >
          <Trash size={20} />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar logout={logout} /> {/* Add Sidebar component */}
      <div className="p-6 flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#7C7CF8]">Support Tickets</h1>
          {userRole === 'customer' && (
            <button
              onClick={() => setIsNewOpen(true)}
              className="bg-[#7C7CF8] hover:bg-[#6b6bf0] text-white font-bold py-2 px-4 rounded-lg shadow-md flex items-center"
            >
              <span className="mr-2">+</span>
              Create New Ticket
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="py-2 px-4 border-b border-gray-200">{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.title}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.priority}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.status}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.createdByEmail}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.assignedToEmail || 'Unassigned'}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.preferredContact}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.expectedResolutionDate}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.departmentAffected}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {renderActions(ticket)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isNewOpen && (
          <NewTicketModal
            isOpen={isNewOpen}
            onClose={() => setIsNewOpen(false)}
            onTicketCreated={fetchTickets}
          />
        )}

        {isEditOpen && selectedTicket && (
          <EditTicketModal
            isOpen={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setSelectedTicket(null);
            }}
            ticket={selectedTicket}
            onTicketUpdated={fetchTickets}
          />
        )}

        {isViewOpen && selectedTicket && (
          <ViewTicketModal
            isOpen={isViewOpen}
            onClose={() => {
              setIsViewOpen(false);
              setSelectedTicket(null);
            }}
            ticket={selectedTicket}
          />
        )}
      </div>
    </div>
  );
}