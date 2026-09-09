import { useState } from "react";
import toast from "react-hot-toast";

const DeleteModal = ({ member, onConfirm, onClose }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!code) { toast.error("Please enter the delete code"); return; }
    setLoading(true);
    await onConfirm(member.id, code);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">🗑️ Remove Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-gray-400 text-sm">
            You are about to remove <span className="text-white font-semibold">{member.name}</span>. This action cannot be undone.
          </p>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Enter Delete Code</label>
            <input
              type="password" value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition">Cancel</button>
          <button onClick={handleConfirm} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50">
            {loading ? "Removing..." : "Remove Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
