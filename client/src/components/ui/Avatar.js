import React from 'react';

export default function Avatar({ name, size = 8, className = '' }) {
  const colors = ['from-primary-400 to-purple-500', 'from-pink-400 to-rose-500', 'from-green-400 to-teal-500', 'from-orange-400 to-amber-500', 'from-blue-400 to-cyan-500'];
  const idx = name ? name.charCodeAt(0) % colors.length : 0;
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-semibold shrink-0 ${className}`}
      style={{ fontSize: `${size * 1.5}px`, width: `${size * 4}px`, height: `${size * 4}px` }}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}
