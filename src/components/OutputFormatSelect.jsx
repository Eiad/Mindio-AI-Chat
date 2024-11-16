export default function OutputFormatSelect({ value, onChange }) {
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
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded-lg px-3 py-1.5 text-sm appearance-none bg-white"
        >
          {outputFormats.map(format => (
            <option key={format} value={format.toLowerCase()}>
              {format}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <span className="text-gray-400">▼</span>
        </div>
      </div>
    );
  }