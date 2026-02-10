import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import CircularLabelButton from './CircularLabelButton';

function DroneModel({ endpoints, hotspots = [], gltfUrl, realScale = 1, onEndpointClick, onHotspotClick, onModelClick, onLoad }) {
  const groupRef = useRef();
  const centeredModelRef = useRef(null);
  const gltf = useGLTF(gltfUrl || "");

  useEffect(() => {
    if (gltf && gltf.scene && centeredModelRef.current !== gltfUrl) {
      const { scene } = gltf;
      // Centralização manual estável: resetamos a posição antes de calcular o novo box
      scene.position.set(0, 0, 0);
      scene.updateMatrixWorld();

      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      // Calculamos a maior dimensão para o enquadramento da câmera
      const maxDim = Math.max(size.x, size.y, size.z);

      // Aplicamos o offset fixo
      // eslint-disable-next-line react-hooks/immutability
      scene.position.set(-center.x, -center.y, -center.z);
      scene.updateMatrixWorld();

      centeredModelRef.current = gltfUrl;
      if (onLoad) onLoad({ gltf, size: maxDim, realScale });
    }
  }, [gltf, onLoad, gltfUrl, realScale]);

  // Proteção: se não houver URL, não tentamos renderizar nada
  if (!gltfUrl || !gltf) return null;

  const { scene } = gltf;

  // Cálculo de escala dinâmica para os pontos: 4% da maior dimensão
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const pointScale = maxDim * 0.15;

  return (
    <group ref={groupRef}>
      <group>
        <primitive
          key={gltfUrl}
          object={scene}
          scale={1}
          onClick={e => {
            if (onModelClick) onModelClick(e);
            e.stopPropagation();
          }}
        />
        {hotspots.map((hotspot, idx) => (
          <group key={"hotspot-" + idx} position={hotspot.position}>
            <CircularLabelButton
              name={hotspot.name || `Hotspot ${idx + 1}`}
              color="#ffae00"
              scale={pointScale}
              onClick={e => {
                e.stopPropagation();
                if (onHotspotClick) onHotspotClick(idx);
              }}
            />
          </group>
        ))}
        {endpoints.map((ep, idx) => (
          <group key={"endpoint-" + idx} position={ep.target}>
            <CircularLabelButton
              name={ep.name || `Endpoint ${idx + 1}`}
              color="#00ffe7"
              scale={pointScale}
              onClick={e => {
                e.stopPropagation();
                if (onEndpointClick) onEndpointClick(idx);
              }}
            />
          </group>
        ))}
      </group>
    </group>
  );
}

export default DroneModel;
