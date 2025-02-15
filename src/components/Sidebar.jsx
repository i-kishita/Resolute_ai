import { useState } from "react";
import { Menu, X } from 'lucide-react';

export default function Sidebar({ logout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:w-80 w-full md:h-screen bg-gray-100 shadow-xl text-white">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#7C7CF8]">Dashboard</h2>
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <nav className="px-4 py-2">
          <ul className="space-y-2">
            <button 
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={logout}
          >
            Logout
          </button>
          </ul>
        </nav>
      </div>
    </div>
  );
}
