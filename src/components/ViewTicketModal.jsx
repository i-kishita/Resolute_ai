export default function ViewTicketModal({ isOpen, onClose, ticket }) {
  if (!ticket) return null;

  // Helper function to check if a file is an image
  const isImageFile = (fileType) => {
    return fileType.startsWith('image/');
  };

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Ticket Details</h2>
        </div>
        <div className="space-y-4">
          {/* Ticket Title */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Title</h3>
            <p className="mt-1">{ticket.title}</p>
          </div>

          {/* Ticket Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1">{ticket.description}</p>
          </div>

          {/* Grid for Ticket Details */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
              <p className="mt-1">{ticket.priority}</p>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">{ticket.status}</p>
            </div>

            {/* Created By */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <p className="mt-1">{ticket.createdByEmail}</p>
            </div>

            {/* Assigned To */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
              <p className="mt-1">{ticket.assignedToEmail || 'Unassigned'}</p>
            </div>

            {/* Category */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1">{ticket.category}</p>
            </div>

            {/* Impact Level */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Impact Level</h3>
              <p className="mt-1">{ticket.impactLevel}</p>
            </div>

            {/* Preferred Contact */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Preferred Contact</h3>
              <p className="mt-1">{ticket.preferredContact}</p>
            </div>

            {/* Expected Resolution Date */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Expected Resolution Date</h3>
              <p className="mt-1">{ticket.expectedResolutionDate}</p>
            </div>

            {/* Department Affected */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Department Affected</h3>
              <p className="mt-1">{ticket.departmentAffected}</p>
            </div>
          </div>

          {/* Attachments Section */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Attachments</h3>
              <div className="mt-1 space-y-2">
                {ticket.attachments.map((attachment, index) => (
                  <div key={index}>
                    {isImageFile(attachment.type) ? (
                      // Display image files using <img> tag
                      <div className="mt-2">
                        <img
                          src={attachment.url}
                          alt={`Attachment ${index + 1}`}
                          className="max-w-full h-auto rounded shadow-sm"
                        />
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 block mt-1"
                        >
                          Open Image in New Tab
                        </a>
                      </div>
                    ) : (
                      // Display non-image files as downloadable links
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 block"
                      >
                        {attachment.originalName || `Attachment ${index + 1}`}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes Section */}
          {ticket.additionalNotes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
              <p className="mt-1">{ticket.additionalNotes}</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}