import { useState } from "react";

const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

const daysLeft = (expiry_date) => {
  const today = new Date();
  const expiry = new Date(expiry_date);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const statusColor = (status) => {
  if (status === "active") return "bg-green-500/10 text-green-400 border border-green-500/20";
  if (status === "expired") return "bg-red-500/10 text-red-400 border border-red-500/20";
  return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
};

const MobileView = ({ expiringMembers, allMembers, sendingReminder, remindingAll, onSendReminder, onRemindAll }) => {
  const [tab, setTab] = useState("expiring");

  return (
    <div className="md:hidden">
      <div className="flex bg-gray-900 border border-gray-800 rounded-2xl p-1 mb-4">
        <button onClick={() => setTab("expiring")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${tab === "expiring" ? "bg-red-600 text-white" : "text-gray-400"}`}>
          Expiring Soon
        </button>
        <button onClick={() => setTab("all")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${tab === "all" ? "bg-red-600 text-white" : "text-gray-400"}`}>
          All Members
        </button>
      </div>

      {tab === "expiring" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {!expiringMembers?.length ? (
            <div className="p-8 text-center text-gray-500 text-sm">No members expiring this week 🎉</div>
          ) : (
            <>
              <div className="divide-y divide-gray-800">
                {expiringMembers.map((member) => {
                  const days = daysLeft(member.expiry_date);
                  return (
                    <div key={member.id} className="px-4 py-4 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name}</p>
                        <p className="text-xs mt-0.5">
                          <span className={`font-bold ${days <= 3 ? "text-red-400" : "text-yellow-400"}`}>
                            {days === 0 ? "Expires today" : `${days}d left`}
                          </span>
                          <span className="text-gray-600 ml-2">{member.plan} · {formatNaira(member.amount)}</span>
                        </p>
                      </div>
                      <button onClick={() => onSendReminder(member)} disabled={sendingReminder === member.id}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-xl font-semibold transition disabled:opacity-50 whitespace-nowrap">
                        {sendingReminder === member.id ? "..." : "📲 Remind"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-4 border-t border-gray-800">
                <button onClick={onRemindAll} disabled={remindingAll}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50">
                  {remindingAll ? "Loading..." : `📲 Remind All ${expiringMembers.length} Members`}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "all" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {allMembers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No members yet.</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {allMembers.map((member) => {
                const days = daysLeft(member.expiry_date);
                return (
                  <div key={member.id} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name}</p>
                        <p className="text-gray-500 text-xs truncate mt-0.5">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(member.status)}`}>
                            {member.status}
                          </span>
                          <span className="text-gray-600 text-xs">{member.plan}</span>
                          <span className={`text-xs font-bold ${days <= 7 ? "text-red-400" : "text-green-400"}`}>
                            {days > 0 ? `${days}d left` : "Expired"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <p className="text-white text-sm font-semibold">{formatNaira(member.amount)}</p>
                        <button onClick={() => onSendReminder(member)} disabled={sendingReminder === member.id}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-xl font-semibold transition disabled:opacity-50">
                          {sendingReminder === member.id ? "..." : "📲"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileView;
