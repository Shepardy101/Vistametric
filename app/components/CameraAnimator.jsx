import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useRef } from 'react';

function CameraAnimator({ orbitRef, animTarget, animCamera, setAnimTarget, setAnimCamera, setCameraLocked }) {
  const animatingRef = useRef(false);
  useFrame(() => {
    if (orbitRef.current && animTarget && animCamera) {
      if (!animatingRef.current) {
        setCameraLocked && setCameraLocked(true);
        animatingRef.current = true;
      }
      orbitRef.current.target.lerp(new THREE.Vector3(...animTarget), 0.08);
      orbitRef.current.object.position.lerp(new THREE.Vector3(...animCamera), 0.08);
      orbitRef.current.update();
      if (
        orbitRef.current.target.distanceTo(new THREE.Vector3(...animTarget)) < 0.01 &&
        orbitRef.current.object.position.distanceTo(new THREE.Vector3(...animCamera)) < 0.01
      ) {
        orbitRef.current.target.set(...animTarget);
        orbitRef.current.object.position.set(...animCamera);
        if (setAnimTarget) setAnimTarget(null);
        if (setAnimCamera) setAnimCamera(null);
        setCameraLocked && setCameraLocked(false);
        animatingRef.current = false;
      }
    } else {
      // If animation is not running, ensure animatingRef is reset
      animatingRef.current = false;
    }
  });
  return null;
}

export default CameraAnimator;
