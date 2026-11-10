import { useMemo, useState } from "react";

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

const MembersTable = ({ members, onView, onReactivate, onDelete, onEdit }) => {
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) =>
      [member.name, member.whatsapp, member.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [members, search]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-gray-800 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg">Full Members List</h2>
            <span className="text-gray-500 text-sm">{filteredMembers.length} of {members.length} members</span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            aria-expanded={isExpanded}
            aria-controls="all-members-table-content"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700 transition"
          >
            {isExpanded ? "Collapse list" : "Expand list"}
            <span aria-hidden="true" className="text-gray-400">{isExpanded ? "⌃" : "⌄"}</span>
          </button>
        </div>

        {isExpanded && (
          <div className="relative w-full md:max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member name..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}
      </div>

      {isExpanded && <div id="all-members-table-content" className="border-t border-gray-800">
      {filteredMembers.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          {search ? `No members found for “${search}”.` : "No active members yet. Add your first one."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[620px] w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left border-b border-gray-800">
                <th className="px-5 md:px-6 py-3 font-medium">Member</th>
                <th className="px-5 md:px-6 py-3 font-medium">Status</th>
                <th className="px-5 md:px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const days = daysLeft(member.expiry_date);
                return (
                  <tr
                    key={member.id}
                    className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/40 transition"
                  >
                    <td className="px-5 md:px-6 py-4">
                      <p className="font-semibold text-white">{member.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Member #{member.id}</p>
                    </td>
                    <td className="px-5 md:px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor(member.status)}`}>
                        {member.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-5 md:px-6 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onView(member)}
                          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-gray-700 transition whitespace-nowrap"
                        >
                          View info
                        </button>
                        <button onClick={() => onEdit(member)} className="text-blue-400 hover:text-blue-300 text-xs transition px-1">
                          Edit
                        </button>
                        {days >= 0 && days <= 7 && (
                          <button onClick={() => onReactivate(member)} className="text-green-400 hover:text-green-300 text-xs transition px-1">
                            Renew
                          </button>
                        )}
                        <button onClick={() => onDelete(member)} className="text-red-400 hover:text-red-300 text-xs transition px-1">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>}
    </div>
  );
};

export default MembersTable;

