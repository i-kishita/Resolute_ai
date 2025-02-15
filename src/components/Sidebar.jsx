import { useNavigate } from "react-router-dom";

export default function Sidebar({ logout }) {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
      <nav className="flex-1">
        <ul>
          <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={() => navigate('/Dashboard')}>
            Tickets
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
