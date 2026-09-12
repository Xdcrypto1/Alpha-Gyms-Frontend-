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
import EditMemberModal from "../components/EditMemberModal";

const daysLeft = (expiry_date) => {
  const today = new Date();
  const expiry = new Date(expiry_date);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(null);
  const [remindingAll, setRemindingAll] = useState(false);
  const [whatsappModal, setWhatsappModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [reactivateModal, setReactivateModal] = useState(null);
  const [editMember, setEditMember] = useState(null);

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
        setWhatsappModal({
          links: [{ name: member.name, url: res.data.whatsappUrl }],
        });
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
        setWhatsappModal({
          links: res.data.whatsappLinks,
        });
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
      await api.delete(`/members/${id}`, {
        data: { delete_code },
      });

      toast.success("Member removed");
      setDeleteModal(null);
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to remove member"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  // Use the member list as the source of truth
  // for both mobile and desktop sections.
  const expiredMembers = members.filter(
    (member) => member.status === "expired"
  );

  const expiringMembers = members.filter((member) => {
    if (member.status !== "active") return false;

    const days = daysLeft(member.expiry_date);

    return days >= 0 && days <= 7;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* WhatsApp Modal */}
      {whatsappModal && (
        <WhatsAppModal
          links={whatsappModal.links}
          onClose={() => setWhatsappModal(null)}
        />
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          member={deleteModal}
          onConfirm={handleDelete}
          onClose={() => setDeleteModal(null)}
        />
      )}

      {/* Renew Modal */}
      {reactivateModal && (
        <ReactivateModal
          member={reactivateModal}
          onSuccess={() => {
            setReactivateModal(null);
            fetchData();
          }}
          onClose={() => setReactivateModal(null)}
        />
      )}

      {/* Edit Member Modal */}
      {editMember && (
        <EditMemberModal
          member={editMember}
          onSuccess={() => {
            setEditMember(null);
            fetchData();
          }}
          onClose={() => setEditMember(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-10">

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* Active Members */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-1">
              Active Members
            </p>

            <p className="text-3xl font-black text-green-400">
              {stats?.totalActive || 0}
            </p>
          </div>

          {/* Recovery Rate */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-1">
              Recovery Rate
            </p>

            <p className="text-3xl font-black text-yellow-400">
              {stats?.recoveryRate || 0}%
            </p>
          </div>

        </div>

        {/* Expiring Members */}
        <ExpiringSection
          members={expiringMembers}
          sendingReminder={sendingReminder}
          remindingAll={remindingAll}
          onSendReminder={handleSendReminder}
          onRemindAll={handleRemindAll}
          onReactivate={setReactivateModal}
        />

        {/* Expired Members */}
        <ExpiredSection
          members={expiredMembers}
          onReactivate={setReactivateModal}
          onDelete={setDeleteModal}
          onEdit={setEditMember}
        />

        {/* All Members */}
        <MembersTable
          members={members}
          onReactivate={setReactivateModal}
          onDelete={setDeleteModal}
          onEdit={setEditMember}
        />

        {/* Mobile Quick View */}
        <MobileView
          expiringMembers={expiringMembers}
          expiredMembers={expiredMembers}
          sendingReminder={sendingReminder}
          remindingAll={remindingAll}
          onSendReminder={handleSendReminder}
          onRemindAll={handleRemindAll}
          onReactivate={setReactivateModal}
        />

      </div>
    </div>
  );
};

export default Dashboard;