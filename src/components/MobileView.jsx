import { useState } from "react";

const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

const daysLeft = (expiry_date) => {
  const today = new Date();
  const expiry = new Date(expiry_date);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const MobileView = ({
  expiringMembers,
  expiredMembers,
  sendingReminder,
  remindingAll,
  onSendReminder,
  onRemindAll,
  onReactivate,
}) => {
  const [tab, setTab] = useState("expiring");

  return (
    <div className="md:hidden">
      <div className="flex bg-gray-900 border border-gray-800 rounded-2xl p-1 mb-4">
        <button
          onClick={() => setTab("expiring")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
            tab === "expiring" ? "bg-red-600 text-white" : "text-gray-400"
          }`}
        >
          Expiring Soon
        </button>
        <button
          onClick={() => setTab("expired")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
            tab === "expired" ? "bg-red-600 text-white" : "text-gray-400"
          }`}
        >
          Expired
        </button>
      </div>

      {tab === "expiring" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {!expiringMembers?.length ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No members expiring this week 🎉
            </div>
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
                            {days <= 0 ? "Expires today" : `${days}d left`}
                          </span>
                          <span className="text-gray-600 ml-2">
                            {member.plan} · {formatNaira(member.amount)}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onReactivate(member)}
                          className="text-green-400 hover:text-green-300 text-xs px-2 py-2 rounded-xl font-semibold transition whitespace-nowrap"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => onSendReminder(member)}
                          disabled={sendingReminder === member.id}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-xl font-semibold transition disabled:opacity-50 whitespace-nowrap"
                        >
                          {sendingReminder === member.id ? "..." : "Remind"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-4 border-t border-gray-800">
                <button
                  onClick={onRemindAll}
                  disabled={remindingAll}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                >
                  {remindingAll ? "Loading..." : `📲 Remind All ${expiringMembers.length} Members`}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "expired" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {!expiredMembers?.length ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No expired members 🎉
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {expiredMembers.map((member) => (
                <div key={member.id} className="px-4 py-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {member.plan} · {formatNaira(member.amount)}
                    </p>
                    <p className="text-xs text-red-400 mt-1">
                      Expired {new Date(member.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onReactivate(member)}
                    className="text-green-400 hover:text-green-300 text-xs px-2 py-2 rounded-xl font-semibold transition whitespace-nowrap"
                  >
                    Renew
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

   </div>
  );
};

export default MobileView;

