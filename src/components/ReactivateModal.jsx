import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const getToday = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const isMonthlyPlan = (plan) => {
  if (!plan) return false;
  return String(plan.name || plan).trim().toLowerCase().includes("month") ||
    Number(plan.duration_days) === 30;
};

const getMonthlyDuration = (dateString) => {
  if (!dateString) return 0;
  const [year, month] = dateString.split("-").map(Number);
  return new Date(year, month, 0).getDate() - 1;
};

const getExpiryPreview = (startDate, duration) => {
  if (!startDate || !Number.isInteger(Number(duration)) || Number(duration) < 1) return "";
  const [year, month, day] = startDate.split("-").map(Number);
  const expiry = new Date(year, month - 1, day + Number(duration) - 1);
  return expiry.toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });
};

const ReactivateModal = ({ member, onSuccess, onClose }) => {
  const [plans, setPlans] = useState([]);
  const [mode, setMode] = useState("same"); // "same" | "change"
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [renewalStartDate, setRenewalStartDate] = useState(getToday());
  const [durationDays, setDurationDays] = useState(0);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        setPlans(res.data);
        const currentPlan = res.data.find((plan) => plan.name === member.plan);
        setDurationDays(isMonthlyPlan(currentPlan)
          ? getMonthlyDuration(getToday())
          : Number(currentPlan?.duration_days) || 0);
      } catch {
        toast.error("Failed to load plans");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, [member.plan]);

  const activePlan = mode === "same"
    ? plans.find((plan) => plan.name === member.plan)
    : selectedPlan;
  const monthlyPlan = isMonthlyPlan(activePlan);

  const handleConfirm = async () => {
    if (!renewalStartDate) {
      toast.error("Please select a renewal start date");
      return;
    }
    if (monthlyPlan && (!Number.isInteger(Number(durationDays)) || Number(durationDays) < 1 || Number(durationDays) > 366)) {
      toast.error("Enter a valid membership duration");
      return;
    }

    setLoading(true);
    try {
      const body = {
        start_date: renewalStartDate,
        ...(mode === "change" ? { plan: selectedPlan.name, amount: selectedPlan.amount } : {}),
        ...(monthlyPlan ? { duration_days: Number(durationDays) } : {}),
      };

      await api.post(`/members/${member.id}/reactivate`, body);
      toast.success(`${member.name} reactivated successfully`);
      onSuccess();
    } catch {
      toast.error("Failed to reactivate member");
    } finally {
      setLoading(false);
    }
  };

  const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start sm:items-center justify-center z-50 px-3 py-3 sm:p-4 overflow-y-auto overscroll-contain">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm max-h-[calc(100dvh-1.5rem)] sm:max-h-[90dvh] flex flex-col my-auto">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">♻️ Renew Membership</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl leading-none">✕</button>
        </div>

        <div className="px-4 sm:px-6 py-5 space-y-4 overflow-y-auto overscroll-contain">
          <p className="text-gray-400 text-sm">
            Renewing <span className="text-white font-semibold">{member.name}</span>. Choose how to renew their membership:
          </p>

          <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-3 space-y-2">
            <label className="block text-xs text-gray-400" htmlFor="renewal-start-date">Renewal Start Date</label>
            <input
              id="renewal-start-date"
              type="date"
              value={renewalStartDate}
              onChange={(e) => {
        setRenewalStartDate(e.target.value);
        if (monthlyPlan) setDurationDays(getMonthlyDuration(e.target.value));
      }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Option 1 — same plan */}
          <button
            onClick={() => {
              setMode("same");
              const currentPlan = plans.find((plan) => plan.name === member.plan);
              setDurationDays(isMonthlyPlan(currentPlan)
                ? getMonthlyDuration(renewalStartDate)
                : Number(currentPlan?.duration_days) || 0);
            }}
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
            onClick={() => {
              setMode("change");
              setSelectedPlan(null);
              setDurationDays(0);
            }}
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
                      onClick={() => {
                        setSelectedPlan(plan);
                        setDurationDays(isMonthlyPlan(plan)
                          ? getMonthlyDuration(renewalStartDate)
                          : Number(plan.duration_days) || 0);
                      }}
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
          {monthlyPlan && (
            <div className="rounded-xl border border-gray-700 bg-gray-800/70 p-4 space-y-2">
              <label className="block text-sm text-gray-300 font-medium" htmlFor="renewal-duration">
                Membership Duration (days)
              </label>
              <input
                id="renewal-duration"
                type="number"
                min="1"
                max="366"
                step="1"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500">Automatically based on the renewal month. You can adjust it if needed.</p>
              <div className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-3">
                <p className="text-xs text-gray-400">Calculated Expiry Date</p>
                <p className="text-base font-semibold text-green-400 mt-1">
                  {getExpiryPreview(renewalStartDate, durationDays) || "Enter a valid duration"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-gray-800 flex gap-3 shrink-0 bg-gray-900">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (mode === "change" && !selectedPlan)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? "Renewing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReactivateModal;



