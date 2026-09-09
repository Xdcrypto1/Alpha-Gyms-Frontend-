const formatNaira = (amount) => `₦${Number(amount).toLocaleString()}`;

const ExpiredSection = ({ members, onReactivate, onDelete }) => {
  if (!members?.length) return null;

  return (
    <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl mb-8">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="font-bold text-lg">❌ Expired Members</h2>
        <p className="text-gray-500 text-sm">Reactivate members who have renewed</p>
      </div>
      <div className="divide-y divide-gray-800">
        {members.map((member) => (
          <div key={member.id} className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{member.name}</p>
              <p className="text-gray-500 text-sm truncate">{member.email}</p>
              <p className="text-xs mt-1 text-gray-600">
                {member.plan} · {formatNaira(member.amount)} · expired {new Date(member.expiry_date).toDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => onReactivate(member)}
                className="text-green-400 hover:text-green-300 text-xs transition whitespace-nowrap">
                Reactivate
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
