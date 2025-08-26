import React, { useEffect, useRef, useState } from 'react'
import { socket } from '../socket' // Importer le socket déjà configuré
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { Video, Mic, MicOff, VideoOff, ArrowLeft, Settings, ChevronDown, Copy, Camera, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function VideoChat() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth() // Assurez-vous d'avoir accès à l'utilisateur connecté
  const navigate = useNavigate()

  const { consultationId } = useParams()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)

  // Fonction pour initialiser le flux vidéo local
  const setupMediaStream = async () => {
    console.log('🟢 [SETUP] Démarrage de la configuration du flux local');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      console.log('✅ [SETUP] Flux local obtenu avec succès:', {
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
        trackIds: stream.getTracks().map(t => ({ kind: t.kind, id: t.id }))
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('❌ [SETUP] Erreur lors de l\'accès aux périphériques:', error);
      setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
      return null;
    }
  };

  // Assigner le flux local à la vidéo locale dès que les deux sont prêts
  React.useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      console.log('✅ [SETUP] Source vidéo locale assignée via useEffect');
      localVideoRef.current.onloadedmetadata = () => {
        localVideoRef.current?.play()
          .then(() => console.log('✅ [SETUP] Lecture de la vidéo locale démarrée'))
          .catch(e => console.error('❌ [SETUP] Erreur lors de la lecture de la vidéo locale:', e));
      };
    }
  }, [localStream, localVideoRef.current]);

  // Fonction pour nettoyer les ressources
  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    // Configurer l'authentification du socket avec l'ID de l'utilisateur authentifié
    if (user?.id) {
      socket.auth = { userId: user.id };
    }

    // Écouter l'événement pour recevoir son propre ID
    socket.on('me', (id) => {
      console.log('Socket ID:', id);
    });

    // Initialiser le flux vidéo
    setupMediaStream().then(stream => {
      if (!stream) {
        console.error('Failed to setup local stream');
      }
    });

    // Gérer le refresh de la page
    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  useEffect(() => {
    // Rejoindre la room automatiquement avec le consultationId
    if (consultationId) {
      socket.emit('join-room', consultationId)
    }

    // Écouter les événements de room
    socket.on('user-joined', async (userId) => {
      console.log('User joined room:', userId)
      // Seul l'utilisateur qui était déjà dans la room initie l'appel
      if (socket.id !== userId) {
        console.log('Initiating call as existing room member')
        // S'assurer que nous avons un flux local avant d'initier l'appel
        if (!localStream) {
          const stream = await setupMediaStream();
          if (stream) {
            initiateCall(userId);
          }
        } else {
          initiateCall(userId);
        }
      }
    })

    // Écouter les erreurs de room
    socket.on('room-error', (errorMessage: string) => {
      setError(errorMessage)
    })

    return () => {
      if (consultationId) {
        socket.emit('leave-room', consultationId)
      }
      socket.off('user-joined')
      socket.off('room-error')
    }
  }, [consultationId, localStream, user])

  useEffect(() => {
    socket.on('offer', async ({ offer, caller }) => {
      console.log('Received offer from:', caller);

      try {
        if (!localStream) {
          console.error('No local stream available when receiving offer');
          return;
        }

        const pc = createPeerConnection(caller);

        localStream.getTracks().forEach((track) => {
          const sender = pc.addTrack(track, localStream);
          console.log(`Added ${track.kind} track to peer connection`, sender);
        });

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        console.log('Remote description set for offer');

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log('Local description set for answer');

        socket.emit('answer', {
          target: caller,
          answer,
        });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    socket.on('answer', async ({ answer }) => {
      console.log('Received answer')
      try {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          )
          console.log('Set remote description from answer')
        }
      } catch (error) {
        console.error('Error handling answer:', error)
      }
    })

    socket.on('ice-candidate', async ({ candidate }) => {
      try {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          )
          console.log('Added ICE candidate')
        }
      } catch (error) {
        console.error('Error adding ICE candidate:', error)
      }
    })

    return () => {
      socket.off('offer')
      socket.off('answer')
      socket.off('ice-candidate')

      if (peerConnection.current) {
        peerConnection.current.close()
        peerConnection.current = null
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null
      }
    }
  }, [localStream])

  const createPeerConnection = (targetPeerId: string) => {
    console.log('🟢 [PEER] Création de la connexion peer pour:', targetPeerId);
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        {
          urls: [
            'turn:turn.pawmed.fr:3478?transport=udp',
            'turn:turn.pawmed.fr:3478?transport=tcp',
            'turn:turn.pawmed.fr:5349?transport=tcp'
          ],
          username: 'pawmed',
          credential: 'pawmed123'
        }
      ],
      iceTransportPolicy: 'all',
      iceCandidatePoolSize: 10,
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🟢 [ICE] Nouveau candidat ICE:', {
          type: event.candidate.type,
          protocol: event.candidate.protocol,
          address: event.candidate.address
        });
        socket.emit('ice-candidate', {
          target: targetPeerId,
          candidate: event.candidate,
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('🟢 [ICE] État de la connexion ICE:', {
        state: pc.iceConnectionState,
        connectionState: pc.connectionState,
        signalingState: pc.signalingState
      });

      if (pc.iceConnectionState === 'failed') {
        console.warn('⚠️ [ICE] Échec de la connexion ICE, redémarrage...');
        pc.restartIce();
      } else if (pc.iceConnectionState === 'disconnected') {
        console.warn('⚠️ [ICE] Connexion ICE déconnectée, tentative de reconnexion...');
        setTimeout(() => {
          if (pc.iceConnectionState === 'disconnected') {
            pc.restartIce();
          }
        }, 1000);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state change:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        console.log('Connection established, remote stream should be available');
      } else if (pc.connectionState === 'failed') {
        console.log('Connection failed, closing and recreating connection');
        setRemoteStream(null);
        pc.close();
        if (targetPeerId) {
          initiateCall(targetPeerId);
        }
      }
    };

    pc.ontrack = (event) => {
      console.log('🟢 [TRACK] Réception d\'une piste distante:', {
        kind: event.track.kind,
        id: event.track.id,
        streams: event.streams.length
      });

      if (event.streams && event.streams[0]) {
        console.log('🟢 [TRACK] Configuration du flux distant');
        const stream = event.streams[0];
        setRemoteStream(stream);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          console.log('✅ [TRACK] Source vidéo distante configurée');
        }

        stream.onaddtrack = () => {
          console.log('🟢 [TRACK] Nouvelle piste ajoutée au flux distant');
        };

        stream.onremovetrack = () => {
          console.log('🟢 [TRACK] Piste retirée du flux distant');
        };
      }
    };

    peerConnection.current = pc;
    return pc;
  }

  const initiateCall = async (targetUserId: string) => {
    console.log('🟢 [CALL] Démarrage de l\'appel vers:', targetUserId);
    if (!localStream) {
      console.error('❌ [CALL] Pas de flux local disponible');
      return;
    }

    const pc = createPeerConnection(targetUserId);

    try {
      localStream.getTracks().forEach((track) => {
        const sender = pc.addTrack(track, localStream);
        console.log('✅ [CALL] Piste ajoutée à la connexion peer:', {
          kind: track.kind,
          id: track.id,
          trackId: track.id
        });
      });

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      await pc.setLocalDescription(offer);
      console.log('✅ [CALL] Description locale définie pour l\'offre');

      socket.emit('offer', {
        target: targetUserId,
        offer,
      });
      console.log('🟢 [CALL] Offre envoyée');
    } catch (error) {
      console.error('❌ [CALL] Erreur lors de la création de l\'offre:', error);
    }
  }

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!isMuted)
      }
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!isVideoOff)
      }
    }
  }

  const copyRoomId = () => {
    if (consultationId) {
      navigator.clipboard.writeText(consultationId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#FDE7EF]/40 to-[#E6F0FD] flex flex-col relative overflow-hidden">
      {/* Bulles décoratives */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#F4A259]/20 rounded-full blur-3xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#A259F4]/20 rounded-full blur-3xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-0 left-1/3 w-[200px] h-[200px] bg-[#4F7AF4]/10 rounded-full blur-2xl z-0"
      />

      {/* Header */}
      <div className="p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-[#4F7AF4] hover:bg-[#4F7AF4]/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          <motion.img
            src="/img/logo.svg"
            alt="PawMed"
            className="h-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          />
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-[#4F7AF4] hover:bg-[#4F7AF4]/10"
              >
                <Settings className="w-5 h-5 mr-2" />
                Paramètres
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={copyRoomId} className="cursor-pointer">
                <Copy className="w-4 h-4 mr-2" />
                Copier l'ID de la consultation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {error ? (
        <div className="flex-1 flex items-center justify-center z-10">
          <Card className="bg-red-500/10 text-red-500 p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Erreur</h2>
            <p>{error}</p>
          </Card>
        </div>
      ) : (
        <div className="flex-1 relative flex items-center justify-center p-8 z-10">
          {/* Vidéo principale */}
          <Card className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white/70 border-0 backdrop-blur-xl relative">
            {!remoteStream ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-[#4F7AF4]/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-[#4F7AF4]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#4F7AF4] mb-2">En attente d'un participant</h3>
                  <p className="text-[#7A90C3] text-center max-w-md">
                    Votre vétérinaire devrait vous rejoindre bientôt.
                  </p>
                </motion.div>
              </div>
            ) : (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </Card>

          {/* Vidéo locale */}
          <div className="absolute right-8 bottom-8 w-[240px] h-[160px] rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 hover:scale-105 transition-transform duration-200 bg-white/70 backdrop-blur-xl">
            {!localStream ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-[#4F7AF4] border-t-transparent rounded-full"
                />
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Contrôles */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-12 h-12 ${isMuted ? 'bg-red-500/10 text-red-500' : 'bg-[#4F7AF4]/10 text-[#4F7AF4]'}`}
              onClick={toggleMute}
              disabled={isLoading}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-12 h-12 ${isVideoOff ? 'bg-red-500/10 text-red-500' : 'bg-[#4F7AF4]/10 text-[#4F7AF4]'}`}
              onClick={toggleVideo}
              disabled={isLoading}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoChat
