const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

const ExpiredSection = ({ members = [], onReactivate, onDelete, onEdit }) => {
  return (
    <div className="hidden md:flex min-w-0 flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-lg">❌ Expired Members</h2>
          <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">{members.length}</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">Review, edit, renew, or remove expired memberships</p>
      </div>
      <div className="divide-y divide-gray-800 flex-1">
        {members.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-500">No expired members.</div>
        ) : members.map((member) => (
          <div key={member.id} className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{member.name}</p>
              <p className="text-gray-500 text-sm truncate">{member.email}</p>
              <p className="text-xs mt-1 text-gray-600">
                {member.plan} · {formatNaira(member.amount)} · expired {new Date(member.expiry_date).toDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit?.(member)}
                className="text-blue-400 hover:text-blue-300 text-xs transition whitespace-nowrap"
              >
                Edit
              </button>
              <button onClick={() => onReactivate(member)}
                className="text-green-400 hover:text-green-300 text-xs transition whitespace-nowrap">
                Renew
              </button>
              <button onClick={() => onDelete(member)}
                className="text-red-400 hover:text-red-300 text-xs transition">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpiredSection;
