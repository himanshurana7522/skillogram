'use client';
import React, { useState } from 'react';
import { X, Zap, Type, Music, Settings, Camera, Image as ImageIcon, Circle, RefreshCw, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

interface PulseCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PulseCreator({ isOpen, onClose }: PulseCreatorProps) {
  const [activeMode, setActiveMode] = useState<'Post' | 'Story' | 'Reel' | 'Live'>('Post');
  const [activeFilter, setActiveFilter] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const { user } = useAuth();

  React.useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 }, 
        audio: false 
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };

   const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleUpload = async () => {
    if (!capturedImage || !user) return;
    setIsUploading(true);

    try {
      // 1. Convert DataURL to Blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // 2. Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);

      // 4. Save to Database
      const { error: dbError } = await supabase.from('posts').insert([{
        user_id: user.id,
        media_urls: [publicUrl],
        type: 'image',
        caption: caption || `Pulse from Nebula - ${new Date().toLocaleDateString()}`,
        hashtags: ['nebula', 'pulse']
      }]);

      if (dbError) throw dbError;

      onClose();
      window.location.href = '/'; 
    } catch (err: any) {
      console.error("Upload error details:", err);
      const msg = err.message || "Unknown error";
      alert(`FAILED TO SYNC: ${msg}\n\n(Tip: Ensure bucket 'media' exists and has Public Upload policies)`);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const filters = [
    { name: 'Normal', color: 'transparent' },
    { name: 'Nebula', color: 'rgba(139, 92, 246, 0.2)' },
    { name: 'Orbit', color: 'rgba(59, 130, 246, 0.2)' },
    { name: 'Emerald', color: 'rgba(16, 185, 129, 0.2)' },
  ];

  const modes: ('Post' | 'Story' | 'Reel' | 'Live')[] = ['Post', 'Story', 'Reel', 'Live'];

  return (
    <div className="camera-fullscreen-overlay animate-fade-in">
      <div className="camera-viewport" style={{ backgroundColor: '#020205' }}>
        
        {/* Real Camera Feed or Captured Image */}
        <div className="camera-feed" style={{ background: filters[activeFilter].color }}>
          {capturedImage ? (
            <img src={capturedImage} alt="captured" className="video-preview" />
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="video-preview" 
            />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {!capturedImage && <div className="crosshair" />}
          
          {isUploading && (
            <div className="upload-overlay">
               <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
               <span>SYNCING PULSE...</span>
            </div>
          )}
        </div>

        {/* Top Controls */}
        <header className="camera-top-bar">
          <button className="cam-icon-btn" onClick={() => {
            if (capturedImage) {
              setCapturedImage(null);
              startCamera();
            } else {
              onClose();
            }
          }}>
            <X size={28} />
          </button>
          {!capturedImage && (
            <>
              <button className="cam-icon-btn" style={{ background: 'rgba(255,255,255,0.15)' }}><Zap size={22} fill="white" /></button>
              <button className="cam-icon-btn"><Settings size={28} /></button>
            </>
          )}
        </header>

        {/* Left Toolbar (Like Instagram/Tiktok) */}
        <div className="camera-side-toolbar">
          <button className="cam-tool-btn" onClick={() => alert("Text Editor Opening...")}><Type size={22} /><span>Text</span></button>
          <button className="cam-tool-btn" onClick={() => alert("Audio Library Opening...")}><Music size={22} /><span>Audio</span></button>
          <button className="cam-tool-btn" onClick={() => alert("Fetching Creator Effects...")}><Wand2 size={22} /><span>Effects</span></button>
          <button className="cam-tool-btn" onClick={() => alert("Retouch smoothing activated.")}><Sparkles size={22} /><span>Retouch</span></button>
        </div>

        {/* Bottom Controls */}
        <footer className="camera-bottom-panel">
          
          {!capturedImage ? (
            <>
              <div className="filter-carousel">
                 {filters.map((f, i) => (
                    <div key={f.name} className={`filter-blob ${i === activeFilter ? 'active' : ''}`} onClick={() => setActiveFilter(i)}>
                      <div className="blob-inner" style={{ background: f.color !== 'transparent' ? f.color : '#333' }}>
                         {i === 0 && <Camera size={14} />}
                      </div>
                      <span>{f.name}</span>
                    </div>
                 ))}
              </div>

              <div className="camera-actions">
                 <button className="gallery-btn" onClick={() => alert("Navigating to Camera Roll...")}>
                    <ImageIcon size={24} />
                 </button>

                 <div 
                   className={`shutter-btn-wrapper ${isRecording ? 'recording' : ''} ${isUploading ? 'disabled' : ''}`}
                   onClick={() => {
                     if (isUploading) return;
                     if(activeMode === 'Reel' || activeMode === 'Story' || activeMode === 'Live') {
                       setIsRecording(!isRecording);
                     } else {
                       handleCapture();
                     }
                   }}
                 >
                    <div className="shutter-outer">
                       <div className="shutter-inner" />
                    </div>
                 </div>

                 <button className="flip-btn" onClick={() => alert("Flipping to front/rear camera...")}>
                    <RefreshCw size={24} />
                 </button>
              </div>

              <div className="camera-modes">
                 {modes.map(mode => (
                   <button 
                     key={mode} 
                     className={`mode-text ${activeMode === mode ? 'active' : ''}`}
                     onClick={() => setActiveMode(mode)}
                   >
                     {mode}
                   </button>
                 ))}
              </div>
            </>
          ) : (
            <div className="review-panel animate-slide-up">
              <input 
                type="text" 
                placeholder="Write a caption..." 
                className="caption-input"
                autoFocus
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <div className="review-btns">
                <button className="btn-discard" onClick={() => { setCapturedImage(null); startCamera(); }}>Discard</button>
                <button className="btn-share" onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'Posting...' : 'Share to Nebula'}
                </button>
              </div>
            </div>
          )}
        </footer>
      </div>

      <style jsx>{`
        .camera-fullscreen-overlay {
          position: fixed; inset: 0; z-index: 6000;
          background: black;
          display: flex; justify-content: center; align-items: center;
        }
        .camera-viewport {
          width: 100%; height: 100%; max-width: 500px;
          position: relative; overflow: hidden;
          background: #111;
        }
        @media (min-width: 769px) {
          .camera-viewport { height: 90vh; border-radius: 40px; border: 1px solid var(--glass-border); }
        }
        .camera-feed {
          position: absolute; inset: 0;
          display: flex; justify-content: center; align-items: center;
          transition: background 0.3s;
        }
        .crosshair { width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; }
        
        .camera-top-bar {
          position: absolute; top: 0; left: 0; right: 0;
          padding: 20px 25px; display: flex; justify-content: space-between; align-items: center; z-index: 10;
        }
        .cam-icon-btn { background: none; border: none; color: white; cursor: pointer; border-radius: 50%; padding: 6px; }
        
        .camera-side-toolbar {
          position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 20px; z-index: 10;
        }
        .cam-tool-btn {
          background: rgba(0,0,0,0.4); border: none; color: white; border-radius: 20px;
          padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
          backdrop-filter: blur(10px);
        }
        .cam-tool-btn span { font-size: 10px; font-weight: 700; text-shadow: 0 1px 2px black; }

        .camera-bottom-panel {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          padding: 40px 0 20px; z-index: 10;
          display: flex; flex-direction: column; align-items: center; gap: 30px;
        }

        .filter-carousel {
          display: flex; gap: 15px; overflow-x: auto; padding: 0 20px; width: 100%; justify-content: center;
          scrollbar-width: none;
        }
        .filter-blob { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; opacity: 0.6; transition: 0.3s; }
        .filter-blob.active { opacity: 1; transform: scale(1.1); }
        .blob-inner { width: 50px; height: 50px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; }
        .filter-blob span { font-size: 11px; font-weight: 700; color: white; }

        .camera-actions {
          display: flex; align-items: center; justify-content: space-evenly; width: 100%; padding: 0 40px;
        }
        .gallery-btn, .flip-btn {
          background: rgba(255,255,255,0.15); border: none; color: white; width: 44px; height: 44px; border-radius: 14px;
          display: flex; justify-content: center; align-items: center; cursor: pointer; backdrop-filter: blur(10px);
        }
        
        .shutter-btn-wrapper {
          width: 80px; height: 80px; border-radius: 50%; display: flex; justify-content: center; align-items: center;
          cursor: pointer; position: relative;
        }
        .shutter-outer {
          position: absolute; inset: 0; border-radius: 50%; border: 4px solid var(--accent-primary);
          transition: all 0.3s;
        }
        .shutter-inner {
          position: absolute; inset: 6px; background: white; border-radius: 50%; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .shutter-btn-wrapper.recording .shutter-outer { border-color: #F43F5E; transform: scale(1.2); }
        .shutter-btn-wrapper.recording .shutter-inner { background: #F43F5E; border-radius: 12px; inset: 20px; }

        .camera-modes {
          display: flex; gap: 20px; background: rgba(0,0,0,0.5); padding: 10px 24px; border-radius: 30px; backdrop-filter: blur(20px);
        }
        .mode-text {
          background: none; border: none; color: var(--text-muted); font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.3s;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .mode-text.active { color: white; text-shadow: 0 0 10px white; }

        .video-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;
          z-index: 100; backdrop-filter: blur(20px);
        }
        .upload-overlay span { font-weight: 900; letter-spacing: 2px; color: white; }
        
        .shutter-btn-wrapper.disabled { opacity: 0.3; cursor: not-allowed; }

        .review-panel {
          width: 100%;
          padding: 20px;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .caption-input {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          width: 100%;
          font-size: 14px;
        }
        .review-btns {
          display: flex;
          gap: 12px;
        }
        .btn-discard {
          flex: 1;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-share {
          flex: 2;
          background: var(--accent-primary);
          border: none;
          color: white;
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
