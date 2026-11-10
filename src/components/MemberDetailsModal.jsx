const formatDate = (value) => {
  if (!value) return "Not available";
  const datePart = String(value).slice(0, 10);
  const parsed = new Date(`${datePart}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Not available";
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatNaira = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "Not available";
  return `₦${Number(amount).toLocaleString()}`;
};

const Detail = ({ label, value }) => (
  <div className="min-w-0 rounded-xl bg-gray-800/60 border border-gray-800 p-3">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm text-gray-100 break-words">{value || "Not provided"}</p>
  </div>
);

const statusColor = (status) => {
  if (status === "active") return "bg-green-500/10 text-green-400 border-green-500/20";
  if (status === "expired") return "bg-red-500/10 text-red-400 border-red-500/20";
  return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
};

const MemberDetailsModal = ({ member, onClose, onEdit }) => {
  if (!member) return null;

  const registrationDate = member.created_at || member.registered_at;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-end sm:items-center justify-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-details-title"
        className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl"
      >
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-5 sm:px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-gray-500">Member profile</p>
            <h2 id="member-details-title" className="text-xl font-bold mt-1 truncate">{member.name}</h2>
            <p className="text-xs text-gray-500 mt-1">Member #{member.id}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`px-3 py-1 rounded-full border text-xs font-semibold capitalize ${statusColor(member.status)}`}>
              {member.status || "Unknown"}
            </span>
            <button type="button" onClick={onClose} aria-label="Close member details" className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-white mb-3">Personal information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Detail label="WhatsApp number" value={member.whatsapp} />
              <Detail label="Email address" value={member.email} />
              <Detail label="Sex" value={member.sex ? String(member.sex).replace(/^./, (letter) => letter.toUpperCase()) : "Not provided"} />
              <Detail label="Date of birth" value={formatDate(member.date_of_birth)} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white mb-3">Membership information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Detail label="Plan" value={member.plan} />
              <Detail label="Membership amount" value={formatNaira(member.amount)} />
              <Detail label="Membership start date" value={formatDate(member.start_date)} />
              <Detail label="Expiry date" value={formatDate(member.expiry_date)} />
              <Detail label="Payment method" value={member.payment_method} />
              <Detail label="Payment reference" value={member.payment_reference} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white mb-3">Registration information</h3>
            <div className="rounded-xl border border-gray-800 bg-gray-800/40 p-4">
              <p className="text-xs text-gray-500 mb-1">Date registered</p>
              <p className="text-sm font-semibold text-white">{formatDate(registrationDate)}</p>
              {!registrationDate && (
                <p className="text-xs text-yellow-500/80 mt-2">
                  A registration timestamp is not available for this record.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 sm:px-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-gray-800 hover:bg-gray-700 text-white py-3 text-sm font-semibold transition">
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(member)}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white py-3 text-sm font-semibold transition"
          >
            Edit member
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;
