import React, { useEffect, Suspense, useState, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import storageManager from '../utils/ImageStorageManager';

// Error Boundary para capturar falhas no carregamento da textura 3D
class TextureErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error("Erro ao carregar textura 360:", error);
    if (this.props.onError) this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function Panorama({ url }) {
  const texture = useTexture(url);
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: '#00ffe7', whiteSpace: 'nowrap', fontWeight: 'bold', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
        Carregando Panorama...
      </div>
    </Html>
  );
}

function HotspotModal({ image, onClose }) {
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImg, setLoadingImg] = useState(true);

  useEffect(() => {
    async function loadImage() {
      if (!image) {
        setLoadingImg(false);
        return;
      }

      // CRÍTICO: Adicionado check para caminhos que começam com / (uploads físicos)
      if (image.startsWith('/') || image.startsWith('data:') || image.startsWith('blob:') || image.startsWith('http')) {
        setImageUrl(image);
        setLoadingImg(false);
        return;
      }

      // Se não for URL, tentamos buscar no IndexedDB como um ID
      try {
        const storedImageData = await storageManager.getImage(image);
        if (storedImageData) {
          setImageUrl(storedImageData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erro ao carregar do IndexedDB:", err);
        setError(true);
      } finally {
        setLoadingImg(false);
      }
    }

    loadImage();

    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, image]);

  return (
    <div className="hotspot-modal-overlay" onClick={onClose}>
      <div className="hotspot-modal-content" onClick={e => e.stopPropagation()}>
        <div className="hotspot-360-view">
          {loadingImg ? (
            <div className="loading-container">
              <p>Preparando imagem 360º...</p>
            </div>
          ) : error || !imageUrl ? (
            <div className="error-container">
              <span className="error-icon">⚠️</span>
              <p>Não foi possível carregar a imagem 360º.</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>A imagem pode ter expirado ou exige um novo upload.</p>
            </div>
          ) : (
            <Canvas camera={{ position: [0, 0, 0.1] }}>
              <Suspense fallback={<Loader />}>
                <TextureErrorBoundary onError={() => setError(true)}>
                  <Panorama url={imageUrl} />
                </TextureErrorBoundary>
              </Suspense>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableDamping
                dampingFactor={0.1}
                rotateSpeed={-0.5}
              />
            </Canvas>
          )}
        </div>
        <button className="hotspot-modal-close" onClick={onClose} title="Fechar">✖</button>
        <div className="hotspot-instructions">Arraste para girar a visualização 360º</div>
      </div>
      <style jsx>{`
        .hotspot-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        .hotspot-modal-content {
          background: #181820;
          border-radius: 24px;
          box-shadow: 0 0 60px rgba(0, 255, 231, 0.4);
          padding: 8px;
          width: 90vw;
          height: 85vh;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(0, 255, 231, 0.3);
        }
        .hotspot-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.6);
          color: #00ffe7;
          border: 1px solid rgba(0,255,231,0.5);
          border-radius: 50%;
          font-size: 1.2rem;
          width: 40px;
          height: 40px;
          cursor: pointer;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .hotspot-modal-close:hover {
          background: #00ffe7;
          color: #181820;
          transform: rotate(90deg);
        }
        .hotspot-360-view {
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 16px;
          overflow: hidden;
        }
        .hotspot-instructions {
          position: absolute;
          bottom: 16px;
          color: rgba(255,255,255,0.4);
          font-size: 0.7rem;
          pointer-events: none;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: bold;
        }
        .error-container, .loading-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ff4d4d;
          text-align: center;
          padding: 40px;
        }
        .loading-container {
          color: #00ffe7;
        }
        .error-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          filter: drop-shadow(0 0 10px rgba(255,0,0,0.3));
        }
      `}</style>
    </div>
  );
}

export default HotspotModal;
