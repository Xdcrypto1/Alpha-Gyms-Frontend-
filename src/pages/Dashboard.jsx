import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import WhatsAppModal from "../components/WhatsAppModal";
import DeleteModal from "../components/DeleteModal";
import ReactivateModal from "../components/ReactivateModal";
import ExpiringSection from "../components/ExpiringSection";
import ExpiredSection from "../components/ExpiredSection";
import MembersTable from "../components/MembersTable";
import MobileView from "../components/MobileView";

const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(null);
  const [remindingAll, setRemindingAll] = useState(false);
  const [whatsappModal, setWhatsappModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [reactivateModal, setReactivateModal] = useState(null);

  const fetchData = async () => {
    try {
      const [statsRes, membersRes] = await Promise.all([
        api.get("/members/stats"),
        api.get("/members"),
      ]);
      setStats(statsRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (member) => {
    setSendingReminder(member.id);
    try {
      const res = await api.post(`/members/${member.id}/remind`);
      if (res.data.whatsappUrl) {
        setWhatsappModal({ links: [{ name: member.name, url: res.data.whatsappUrl }] });
      } else {
        toast.success(`Email reminder sent to ${member.name}`);
      }
    } catch (error) {
      toast.error("Failed to send reminder");
    } finally {
      setSendingReminder(null);
    }
  };

  const handleRemindAll = async () => {
    setRemindingAll(true);
    try {
      const res = await api.post("/members/remind-all");
      if (res.data.whatsappLinks?.length > 0) {
        setWhatsappModal({ links: res.data.whatsappLinks });
      } else {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to send reminders");
    } finally {
      setRemindingAll(false);
    }
  };

  const handleDelete = async (id, delete_code) => {
    try {
      await api.delete(`/members/${id}`, { data: { delete_code } });
      toast.success("Member removed");
      setDeleteModal(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to remove member");
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {whatsappModal && <WhatsAppModal links={whatsappModal.links} onClose={() => setWhatsappModal(null)} />}
      {deleteModal && <DeleteModal member={deleteModal} onConfirm={handleDelete} onClose={() => setDeleteModal(null)} />}
      {reactivateModal && (
        <ReactivateModal
          member={reactivateModal}
          onSuccess={() => { setReactivateModal(null); fetchData(); }}
          onClose={() => setReactivateModal(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-10">

        {/* Revenue at risk */}
        <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-6 mb-6">
          <p className="text-red-400 text-sm font-medium mb-1">⚠️ Revenue at risk this week</p>
          <p className="text-4xl md:text-5xl font-black text-white">{formatNaira(stats?.revenueAtRisk || 0)}</p>
          <p className="text-gray-400 text-sm mt-2">
            {stats?.expiringThisWeek?.length || 0} member{stats?.expiringThisWeek?.length !== 1 ? "s" : ""} expiring in the next 7 days
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-1">Active Members</p>
            <p className="text-3xl font-black text-green-400">{stats?.totalActive || 0}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-1">Lost (Last 30 Days)</p>
            <p className="text-3xl font-black text-red-400">{formatNaira(stats?.revenueLost || 0)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 col-span-2 md:col-span-1">
            <p className="text-gray-400 text-xs mb-1">Recovery Rate</p>
            <p className="text-3xl font-black text-yellow-400">{stats?.recoveryRate || 0}%</p>
          </div>
        </div>

        <ExpiringSection
          members={stats?.expiringThisWeek}
          sendingReminder={sendingReminder}
          remindingAll={remindingAll}
          onSendReminder={handleSendReminder}
          onRemindAll={handleRemindAll}
        />

        <ExpiredSection
          members={stats?.expiredMembers}
          onReactivate={setReactivateModal}
          onDelete={setDeleteModal}
        />

        <MembersTable
          members={members}
          onReactivate={setReactivateModal}
          onDelete={setDeleteModal}
        />

        <MobileView
          expiringMembers={stats?.expiringThisWeek}
          allMembers={members}
          sendingReminder={sendingReminder}
          remindingAll={remindingAll}
          onSendReminder={handleSendReminder}
          onRemindAll={handleRemindAll}
        />

      </div>
    </div>
  );
};

export default Dashboard;