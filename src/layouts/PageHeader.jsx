import { FaSearch } from "react-icons/fa";

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search task..."
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        </div>

        <button className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm hover:opacity-90">
          + Add Task
        </button>
      </div>
    </div>
  );
}