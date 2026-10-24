const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

const daysLeft = (expiry_date) => {
  const today = new Date();
  const expiry = new Date(expiry_date);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const ExpiringSection = ({ members = [], sendingReminder, remindingAll, onSendReminder, onRemindAll, onReactivate }) => {
  return (
    <div className="hidden md:flex min-w-0 flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-lg">⚡ Expiring Soon</h2>
          <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-400">{members.length}</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">Members whose subscriptions are nearing expiry</p>
      </div>
      <div className="divide-y divide-gray-800 flex-1">
        {members.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-500">No members expiring soon.</div>
        ) : members.map((member) => {
          const days = daysLeft(member.expiry_date);
          return (
            <div key={member.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{member.name}</p>
                <p className="text-gray-500 text-sm truncate">{member.email}</p>
                <p className="text-xs mt-1">
                  <span className={`font-bold ${days <= 3 ? "text-red-400" : "text-yellow-400"}`}>
                    {days === 0 ? "Expires today" : `${days} day${days !== 1 ? "s" : ""} left`}
                  </span>
                  <span className="text-gray-600 ml-2">{member.plan} · {formatNaira(member.amount)}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onReactivate(member)}
                  className="text-green-400 hover:text-green-300 text-xs font-semibold transition whitespace-nowrap"
                >
                  Renew
                </button>
                <button onClick={() => onSendReminder(member)} disabled={sendingReminder === member.id}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50 whitespace-nowrap">
                  {sendingReminder === member.id ? "Loading..." : "Send Reminder"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {members.length > 0 && <div className="px-6 py-4 border-t border-gray-800">
        <button onClick={onRemindAll} disabled={remindingAll}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50">
          {remindingAll ? "Loading..." : `📲 Send Reminder to All ${members.length} Members`}
        </button>
      </div>}
    </div>
  );
};

export default ExpiringSection;

