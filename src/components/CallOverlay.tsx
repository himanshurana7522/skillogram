import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import './CallOverlay.css';

interface CallOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  isVideoCall: boolean;
}

export function CallOverlay({ isOpen, onClose, contactName, isVideoCall }: CallOverlayProps) {
  const { socket, userProfile } = useAppContext();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVidOff, setIsVidOff] = useState(!isVideoCall);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      startCall();
    } else {
      setCallDuration(0);
      endCall();
    }
    return () => {
      clearInterval(timer);
      endCall();
    };
  }, [isOpen]);

  const startCall = async () => {
    if (!socket) return;

    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId: 'call-room', candidate: event.candidate });
      }
    };

    pc.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: isVideoCall,
        audio: true
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      localStream.current.getTracks().forEach(track => {
        pc.current?.addTrack(track, localStream.current!);
      });

      // Simple implementation: first one to join emits offer
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.emit('offer', { roomId: 'call-room', offer });

    } catch (err) {
      console.error('Failed to get local stream', err);
    }

    socket.on('offer', async (offer) => {
      if (!pc.current) return;
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.emit('answer', { roomId: 'call-room', answer });
    });

    socket.on('answer', async (answer) => {
      if (!pc.current) return;
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async (candidate) => {
      if (!pc.current) return;
      await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  const endCall = () => {
    localStream.current?.getTracks().forEach(track => track.stop());
    pc.current?.close();
    pc.current = null;
    if (socket) {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    }
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="call-overlay animate-slide">
      <div className="call-video-bg">
        <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
        <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
        
        <div className="call-header">
          <h2>{contactName}</h2>
          <p>{callDuration > 0 ? formatTime(callDuration) : 'Connecting...'}</p>
        </div>

        {(!isVideoCall || isVidOff) && (
          <div className="caller-avatar">
            {contactName.charAt(0)}
            <div className="pulse-ring"></div>
          </div>
        )}
      </div>

      <div className="call-controls">
        <button className="control-btn" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
        </button>
        <button className="control-btn" onClick={() => setIsVidOff(!isVidOff)}>
          {isVidOff ? <VideoOff size={28} /> : <Video size={28} />}
        </button>
        <button className="control-btn"><Volume2 size={28} /></button>
        <button className="control-btn end-call" onClick={onClose}>
          <PhoneOff size={28} />
        </button>
      </div>
    </div>
  );
}
