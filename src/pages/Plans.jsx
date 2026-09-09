import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

const PlanModal = ({ plan, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: plan?.name || "",
    duration_days: plan?.duration_days || 30,
    amount: plan?.amount || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.duration_days || !form.amount) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    await onSave(form, plan?.id);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">{plan ? "Edit Plan" : "Add Plan"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl leading-none">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Plan Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Monthly, Premium"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Duration (days)</label>
            <input
              type="number"
              value={form.duration_days}
              onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) })}
              placeholder="e.g. 30"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount (₦)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
              placeholder="e.g. 15000"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | plan object for edit

  const fetchPlans = async () => {
    try {
      const res = await api.get("/plans");
      setPlans(res.data);
    } catch (error) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form, id) => {
    try {
      if (id) {
        await api.patch(`/plans/${id}`, form);
        toast.success("Plan updated");
      } else {
        await api.post("/plans", form);
        toast.success("Plan added");
      }
      setModal(null);
      fetchPlans();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save plan");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await api.delete(`/plans/${id}`);
      toast.success("Plan deleted");
      fetchPlans();
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      {modal && (
        <PlanModal
          plan={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Membership Plans</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your gym's subscription plans</p>
          </div>
          <button
            onClick={() => setModal("add")}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            + Add Plan
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No plans yet. Add your first plan to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {plans.map((plan) => (
                <div key={plan.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{plan.name}</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {plan.duration_days} days · {formatNaira(plan.amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setModal(plan)}
                      className="text-blue-400 hover:text-blue-300 text-xs transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-400 hover:text-red-300 text-xs transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plans;
