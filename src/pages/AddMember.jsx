import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

const AddMember = () => {
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "",
    amount: 0,
    payment_method: "cash",
    payment_reference: "",
    whatsapp: "",
  });
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
      setForm({ ...form, plan: selected.name, amount: selected.amount });
    }
  };

  const handleSubmit = async () => {
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
    if (!form.plan) {
      toast.error("Please select a plan");
      return;
    }

    setLoading(true);
    try {
      await api.post("/members", form);
      toast.success("Member added successfully");
      setForm({
        name: "",
        email: "",
        plan: plans[0]?.name || "",
        amount: plans[0]?.amount || 0,
        payment_method: "cash",
        payment_reference: "",
        whatsapp: "",
      });
    } catch (error) {
      toast.error("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Add New Member</h1>
        <p className="text-gray-400 text-sm mb-8">
          Manually add a member who paid cash or used another payment method
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
            <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
            <select
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="cash">Cash</option>
              <option value="transfer">Bank Transfer</option>
              <option value="paystack">Paystack</option>
              <option value="renewal">Renewal</option>
            </select>
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
