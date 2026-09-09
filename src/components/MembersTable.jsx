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

const MembersTable = ({ members, onReactivate, onDelete }) => {
  return (
    <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-bold text-lg">All Members</h2>
        <span className="text-gray-500 text-sm">{members.length} total</span>
      </div>
      {members.length === 0 ? (
        <div className="p-10 text-center text-gray-500">No members yet. Add your first one.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-left border-b border-gray-800">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Expires</th>
              <th className="px-6 py-3">Days Left</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const days = daysLeft(member.expiry_date);
              return (
                <tr key={member.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-gray-400">{member.email}</td>
                  <td className="px-6 py-4">{member.plan}</td>
                  <td className="px-6 py-4 capitalize text-gray-400">{member.payment_method}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(member.expiry_date).toDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${days <= 7 ? "text-red-400" : "text-green-400"}`}>
                      {days > 0 ? `${days}d` : "Expired"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {member.status === "expired" && (
                        <button onClick={() => onReactivate(member)} className="text-green-400 hover:text-green-300 text-xs transition">
                          Reactivate
                        </button>
                      )}
                      <button onClick={() => onDelete(member)} className="text-red-400 hover:text-red-300 text-xs transition">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MembersTable;
