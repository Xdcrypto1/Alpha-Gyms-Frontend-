import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

const getToday = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().split("T")[0];
};

const initialForm = {
  name: "",
  email: "",
  whatsapp: "",
  sex: "",
  date_of_birth: "",
  plan: "",
  amount: 0,
  start_date: getToday(),
  payment_method: "transfer",
  payment_reference: "",
};

const AddMember = () => {
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        setPlans(res.data);
        if (res.data.length > 0) {
          setForm((f) => ({
            ...f,
            plan: res.data[0].name,
            amount: res.data[0].amount,
          }));
        }
      } catch (error) {
        toast.error("Failed to load plans");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanChange = (e) => {
    const selected = plans.find((p) => p.name === e.target.value);
    if (selected) {
      setForm((f) => ({ ...f, plan: selected.name, amount: selected.amount }));
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.plan) {
      toast.error("Please select a plan");
      return;
    }
    if (!form.start_date) {
      toast.error("Please select a membership start date");
      return;
    }

    setLoading(true);
    try {
      await api.post("/members", form);
      toast.success("Member added successfully");
      setForm({
        ...initialForm,
        plan: plans[0]?.name || "",
        amount: plans[0]?.amount || 0,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Add New Member</h1>
        <p className="text-gray-400 text-sm mb-8">
          Add a member and choose when their membership should begin.
        </p>

        <div className="bg-gray-900 rounded-2xl p-8 space-y-5 border border-gray-800">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sex</label>
              <select
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Birthday</label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email Address <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              WhatsApp Number <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="e.g. 08012345678"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Membership Plan</label>
            {plansLoading ? (
              <div className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-500">
                Loading plans...
              </div>
            ) : plans.length === 0 ? (
              <div className="w-full bg-gray-800 border border-yellow-700 rounded-xl px-4 py-3 text-sm text-yellow-400">
                No plans yet — add plans in Settings first
              </div>
            ) : (
              <select
                value={form.plan}
                onChange={handlePlanChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} — {formatNaira(p.amount)} / {p.duration_days} days
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Membership Start Date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-600 mt-1">
              The membership duration will start counting from this date.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
            <div className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200">
              Bank Transfer
            </div>
            <p className="text-xs text-gray-600 mt-1">All membership payments are recorded as bank transfer.</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Payment Reference <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="text"
              value={form.payment_reference}
              onChange={(e) => setForm({ ...form, payment_reference: e.target.value })}
              placeholder="e.g. receipt number or transfer ref"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || plans.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMember;


