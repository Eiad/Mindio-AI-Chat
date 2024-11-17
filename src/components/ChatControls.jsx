import { useState } from 'react';
import { FiSettings, FiChevronUp, FiChevronDown, FiX } from 'react-icons/fi';

export default function ChatControls({ settings, onSettingsChange }) {
  const [isVisible, setIsVisible] = useState(false);

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
    <div className="w-full max-w-4xl mx-auto px-4 py-2 bg-white">
      <div className="flex items-center gap-4">
        <div className="grid grid-cols-4 gap-4 flex-1">
          <div>
            <div className="text-sm text-gray-500 mb-1">Output Format</div>
            <select 
              value={settings.outputFormat}
              onChange={(e) => onSettingsChange('outputFormat', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-white"
            >
              {outputFormats.map(format => (
                <option key={format} value={format.toLowerCase()}>{format}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Tone</div>
            <select 
              value={settings.tone}
              onChange={(e) => onSettingsChange('tone', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-white"
            >
              {toneOptions.map(tone => (
                <option key={tone} value={tone.toLowerCase()}>{tone}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Writing Style</div>
            <select 
              value={settings.writingStyle}
              onChange={(e) => onSettingsChange('writingStyle', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-white"
            >
              <option value="default">Default</option>
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Language</div>
            <select 
              value={settings.language}
              onChange={(e) => onSettingsChange('language', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-white"
            >
              <option value="default">Default</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={() => onSettingsChange('showControls', false)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FiX className="w-5 h-5 text-gray-400" />
        </button>
      </div>      
    </div>
  );
}