import React from 'react';

export default function Loading() {
  return (
    <div className="main-feed-container" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div className="feed-header-tabs" style={{ marginBottom: '20px' }}>
        <div className="shimmer" style={{ width: '200px', height: '40px', borderRadius: '20px' }} />
      </div>
      <div className="skillogram-feed-layout">
        <div className="posts-list">
          <div className="post-skeleton shimmer" style={{ height: '400px', borderRadius: '20px', marginBottom: '20px' }} />
          <div className="post-skeleton shimmer" style={{ height: '400px', borderRadius: '20px' }} />
        </div>
      </div>
    </div>
  );
}
