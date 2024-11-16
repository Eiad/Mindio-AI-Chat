export default function Header() {
    return (
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <img 
            src="https://placehold.co/200x100/EEE/31343C.jpg" 
            alt="mindio" 
            className="h-8 w-8"
          />
          <h1 className="text-xl font-semibold">Mindio</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <select className="px-3 py-1.5 border rounded-lg text-sm">
              <option>GPT-4o</option>
            </select>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <span role="img" aria-label="settings">⚙️</span>
          </button>
        </div>
      </div>
    );
  }