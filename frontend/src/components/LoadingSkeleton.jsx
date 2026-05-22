import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
            <div className="h-8 bg-white/10 rounded w-2/3 mb-2" />
            <div className="h-3 bg-white/5 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="glass-card p-6 animate-pulse space-y-4">
        <div className="h-6 bg-white/10 rounded w-1/4 mb-6" />
        {skeletons.map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="h-4 bg-white/5 rounded flex-1" />
            <div className="h-4 bg-white/5 rounded w-24" />
            <div className="h-4 bg-white/5 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="glass-card p-8 animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/10 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-white/10 rounded w-1/3" />
            <div className="h-3 bg-white/5 rounded w-1/4" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-white/5 rounded w-full" />
          <div className="h-3 bg-white/5 rounded w-5/6" />
          <div className="h-3 bg-white/5 rounded w-4/6" />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
