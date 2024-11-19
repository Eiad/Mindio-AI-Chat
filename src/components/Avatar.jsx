export default function Avatar({ name }) {
    const initials = name
      ? name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
      : 'AI';
  
    return (
      <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
        {initials}
      </div>
    );
  }