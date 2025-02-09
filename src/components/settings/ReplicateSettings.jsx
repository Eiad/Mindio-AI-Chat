export default function ReplicateSettings({
  replicateApiKey,
  setReplicateApiKey,
  showReplicateKey,
  setShowReplicateKey,
  dalleSettings,
  handleReplicateSettingChange
}) {
  const replicateSettings = {
    schedulers: [
      'DDIM',
      'DPMSolverMultistep',
      'HeunDiscrete',
      'KarrasDPM',
      'K_EULER_ANCESTRAL',
      'K_EULER',
      'PNDM'
    ],
    steps: [20, 25, 30, 35, 40, 45, 50],
    guidanceScales: [1, 3, 5, 7, 7.5, 8, 10]
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Replicate Settings</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Replicate API Key
        </label>
        <div className="flex">
          <input
            type={showReplicateKey ? 'text' : 'password'}
            value={replicateApiKey}
            onChange={(e) => setReplicateApiKey(e.target.value)}
            className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="r8_..."
          />
          <button
            onClick={() => setShowReplicateKey(!showReplicateKey)}
            className="px-4 py-2 border-t border-r border-b rounded-r-lg bg-gray-50"
          >
            {showReplicateKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Stability Diffusion 3</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduler
            </label>
            <select
              value={dalleSettings.replicate?.scheduler || 'DPMSolverMultistep'}
              onChange={(e) => handleReplicateSettingChange('scheduler', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {replicateSettings.schedulers.map(scheduler => (
                <option key={scheduler} value={scheduler}>{scheduler}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inference Steps
            </label>
            <select
              value={dalleSettings.replicate?.steps || 30}
              onChange={(e) => handleReplicateSettingChange('steps', Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {replicateSettings.steps.map(step => (
                <option key={step} value={step}>{step}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guidance Scale
            </label>
            <select
              value={dalleSettings.replicate?.guidanceScale || 7.5}
              onChange={(e) => handleReplicateSettingChange('guidanceScale', Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {replicateSettings.guidanceScales.map(scale => (
                <option key={scale} value={scale}>{scale}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 