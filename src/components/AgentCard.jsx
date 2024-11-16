export default function AgentCard({ icon, title, description }) {
    return (
      <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  }