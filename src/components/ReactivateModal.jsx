import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const ReactivateModal = ({ member, onSuccess, onClose }) => {
  const [plans, setPlans] = useState([]);
  const [mode, setMode] = useState("same"); // "same" | "change"
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        setPlans(res.data);
      } catch (error) {
        toast.error("Failed to load plans");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const body = mode === "same"
        ? {} // backend uses existing plan
        : { plan: selectedPlan.name, amount: selectedPlan.amount };

      await api.post(`/members/${member.id}/reactivate`, body);
      toast.success(`${member.name} reactivated successfully`);
      onSuccess();
    } catch (error) {
      toast.error("Failed to reactivate member");
    } finally {
      setLoading(false);
    }
  };

  const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">♻️ Reactivate Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl leading-none">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-gray-400 text-sm">
            Reactivating <span className="text-white font-semibold">{member.name}</span>. Choose how to renew their membership:
          </p>

          {/* Option 1 — same plan */}
          <button
            onClick={() => setMode("same")}
            className={`w-full text-left px-4 py-3 rounded-xl border transition ${
              mode === "same"
                ? "border-green-500 bg-green-500/10 text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            <p className="font-semibold text-sm">Continue with current plan</p>
            <p className="text-xs mt-0.5 text-gray-500">
              {member.plan} · {formatNaira(member.amount)}
            </p>
          </button>

          {/* Option 2 — change plan */}
          <button
            onClick={() => setMode("change")}
            className={`w-full text-left px-4 py-3 rounded-xl border transition ${
              mode === "change"
                ? "border-green-500 bg-green-500/10 text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            <p className="font-semibold text-sm">Change plan</p>
            <p className="text-xs mt-0.5 text-gray-500">Select a different membership plan</p>
          </button>

          {/* Plan selector — shown when change is selected */}
          {mode === "change" && (
            <div>
              {plansLoading ? (
                <p className="text-gray-500 text-sm">Loading plans...</p>
              ) : plans.length === 0 ? (
                <p className="text-yellow-400 text-sm">No plans found. Add plans in Settings first.</p>
              ) : (
                <div className="space-y-2 mt-1">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                        selectedPlan?.id === plan.id
                          ? "border-green-500 bg-green-500/10 text-white"
                          : "border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      <p className="font-semibold text-sm">{plan.name}</p>
                      <p className="text-xs text-gray-500">{plan.duration_days} days · {formatNaira(plan.amount)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (mode === "change" && !selectedPlan)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? "Reactivating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReactivateModal;
