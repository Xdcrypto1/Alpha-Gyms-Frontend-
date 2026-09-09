const WhatsAppModal = ({ links, onClose }) => {
  if (!links || links.length === 0) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white text-lg">📲 Send Reminders</h2>
            <p className="text-gray-500 text-sm">{links.length} member{links.length !== 1 ? "s" : ""} expiring this week</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl leading-none">✕</button>
        </div>
        <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
          {links.map((link, index) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between gap-4">
              <p className="font-medium text-white truncate">{link.name}</p>
              <a href={link.url} target="_blank" rel="noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-xl font-semibold transition whitespace-nowrap">
                Open WhatsApp
              </a>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-800">
          <button onClick={onClose} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition">Done</button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;
