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
      'DPMSolverMultistep',
      'DDIM',
      'HeunDiscrete',
      'KarrasDPM',
      'K_EULER_ANCESTRAL',
      'K_EULER',
      'PNDM'
    ],
    steps: [30, 40, 50, 60, 70, 80, 90, 100],
    guidanceScales: [7.5, 8, 9, 10, 11, 12, 13, 14, 15],
    refiners: [
      'expert_ensemble_refiner',
      'base_image_refiner',
      'no_refiner'
    ],
    promptStrength: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    highNoiseFrac: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    imageSizes: [
      { value: '512x512', label: '512×512' },
      { value: '576x576', label: '576×576' },
      { value: '640x640', label: '640×640' },
      { value: '704x704', label: '704×704' },
      { value: '768x768', label: '768×768' },
      { value: '832x832', label: '832×832' },
      { value: '896x896', label: '896×896' },
      { value: '960x960', label: '960×960' },
      { value: '1024x1024', label: '1024×1024' },
      { value: '1088x1088', label: '1088×1088' },
      { value: '1152x1152', label: '1152×1152' },
      { value: '1216x1216', label: '1216×1216' },
      { value: '1280x1280', label: '1280×1280' },
      { value: '1344x1344', label: '1344×1344' },
      { value: '1408x1408', label: '1408×1408' },
      { value: '1472x1472', label: '1472×1472' },
      { value: '1536x1536', label: '1536×1536' }
    ]
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

      <div className="border rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Advanced Settings</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refiner
            </label>
            <select
              value={dalleSettings.replicate?.refiner || 'expert_ensemble_refiner'}
              onChange={(e) => handleReplicateSettingChange('refiner', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {replicateSettings.refiners.map(refiner => (
                <option key={refiner} value={refiner}>{refiner}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt Strength
            </label>
            <select
              value={dalleSettings.replicate?.promptStrength || 0.8}
              onChange={(e) => handleReplicateSettingChange('promptStrength', Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {replicateSettings.promptStrength.map(strength => (
                <option key={strength} value={strength}>{strength}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              High Noise Fraction
            </label>
            <select
              value={dalleSettings.replicate?.highNoiseFrac || 0.8}
              onChange={(e) => handleReplicateSettingChange('highNoiseFrac', Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {replicateSettings.highNoiseFrac.map(frac => (
                <option key={frac} value={frac}>{frac}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Size
            </label>
            <select
              value={dalleSettings.replicate?.imageSize || '1024x1024'}
              onChange={(e) => handleReplicateSettingChange('imageSize', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {replicateSettings.imageSizes.map(size => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 