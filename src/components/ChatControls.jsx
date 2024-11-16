export default function ChatControls({ settings, onSettingsChange }) {
    const toneOptions = [
      'Default', 'Authoritative', 'Clinical', 'Cold', 'Confident', 'Cynical',
      'Emotional', 'Empathetic', 'Formal', 'Friendly', 'Humorous', 'Informal',
      'Ironic', 'Optimistic', 'Pessimistic', 'Playful', 'Sarcastic', 'Serious',
      'Sympathetic', 'Tentative', 'Warm'
    ];
  
    const outputFormats = [
      'Default', 'Concise', 'Step-by-step', 'Extreme Detail', 'ELI5',
      'Essay', 'Report', 'Summary', 'Table', 'FAQ', 'Listicle',
      'Interview', 'Review', 'News', 'Opinion', 'Tutorial',
      'Case Study', 'Profile', 'Blog', 'Poem', 'Script',
      'Whitepaper', 'eBook', 'Press Release', 'Infographic',
      'Webinar', 'Podcast Script', 'Email Campaign', 'Social Media Post',
      'Proposal', 'Brochure', 'Newsletter', 'Presentation',
      'Product Description', 'Research Paper', 'Speech', 'Memo',
      'Policy Document', 'User Guide', 'Technical Documentation', 'Q&A'
    ];
  
    return (
      <div className="flex items-center space-x-4 mb-2">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Output Format</label>
          <select 
            value={settings.outputFormat}
            onChange={(e) => onSettingsChange('outputFormat', e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            {outputFormats.map(format => (
              <option key={format} value={format.toLowerCase()}>
                {format}
              </option>
            ))}
          </select>
        </div>
  
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Tone</label>
          <select 
            value={settings.tone}
            onChange={(e) => onSettingsChange('tone', e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            {toneOptions.map(tone => (
              <option key={tone} value={tone.toLowerCase()}>{tone}</option>
            ))}
          </select>
        </div>
  
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Writing Style</label>
          <select 
            value={settings.writingStyle}
            onChange={(e) => onSettingsChange('writingStyle', e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="default">Default</option>
          </select>
        </div>
  
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Language</label>
          <select 
            value={settings.language}
            onChange={(e) => onSettingsChange('language', e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="default">Default</option>
          </select>
        </div>
      </div>
    );
  }