import React from 'react';

export default function Loading() {
  return (
    <div className="discovery-feed-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
      <div className="discovery-header" style={{ width: '100%', marginBottom: '20px' }}>
        <div className="shimmer" style={{ width: '60%', height: '30px', borderRadius: '10px', marginBottom: '10px' }} />
        <div className="shimmer" style={{ width: '40%', height: '20px', borderRadius: '10px' }} />
      </div>
      <div className="swipe-card-stack" style={{ width: '100%', maxWidth: '400px', height: '600px', position: 'relative' }}>
        <div className="shimmer" style={{ width: '100%', height: '100%', borderRadius: '30px' }} />
      </div>
    </div>
  );
}
