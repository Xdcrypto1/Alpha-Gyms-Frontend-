import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  email: "",
  whatsapp: "",
  sex: "",
  date_of_birth: "",
};

const EditMemberModal = ({ member, onSuccess, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!member) return;
    setForm({
      name: member.name || "",
      email: member.email || "",
      whatsapp: member.whatsapp || "",
      sex: member.sex || "",
      date_of_birth: member.date_of_birth ? String(member.date_of_birth).slice(0, 10) : "",
    });
  }, [member]);

  if (!member) return null;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/members/${member.id}/profile`, {
        name: form.name.trim(),
        email: form.email.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        sex: form.sex || null,
        date_of_birth: form.date_of_birth || null,
      });

      toast.success("Member information updated");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Edit Member</h2>
            <p className="text-xs text-gray-500 mt-1">Update contact and profile information only.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl" aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sex</label>
              <select className={inputClass} value={form.sex} onChange={(e) => updateField("sex", e.target.value)}>
                <option value="">Not specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Birthday</label>
              <input
                type="date"
                className={inputClass}
                value={form.date_of_birth}
                onChange={(e) => updateField("date_of_birth", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">WhatsApp Number</label>
            <input
              type="tel"
              className={inputClass}
              value={form.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              placeholder="e.g. 08012345678"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 font-semibold mb-1">Protected membership details</p>
            <p className="text-xs text-gray-600">
              Plan, amount, membership start date, expiry date, payment method, and status cannot be changed from this form.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;
