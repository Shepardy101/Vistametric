import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar navegação 3D, animações de câmera e enquadramento automático.
 * @param {Object} orbitRef - Referência para o componente OrbitControls.
 * @param {Array} endpoints - Lista de endpoints para foco.
 * @param {Function} setEndpoints - Setter para a lista de endpoints.
 */
export function useModelNavigation(orbitRef, endpoints, setEndpoints) {
    const [animTarget, setAnimTarget] = useState(null);
    const [animCamera, setAnimCamera] = useState(null);
    const [cameraLocked, setCameraLocked] = useState(false);
    const [modelSize, setModelSize] = useState(0);

    /**
     * Ajusta automaticamente a câmera para enquadrar o modelo recém-carregado.
     */
    const handleModelLoad = useCallback((data) => {
        const { size, realScale = 1 } = data;
        setModelSize(size * realScale);
        if (orbitRef.current) {
            const distance = Math.max(size * 1.2, 5);
            orbitRef.current.object.position.set(distance, distance, distance);
            orbitRef.current.target.set(0, 0, 0);
            orbitRef.current.maxDistance = distance * 5;
            orbitRef.current.update();
        }
    }, [orbitRef]);

    /**
     * Inicia a animação da câmera para um endpoint específico.
     */
    const focusCameraOn = useCallback((idx) => {
        if (!orbitRef.current) return;
        const endpoint = endpoints[idx];

        // Suporte para converter formato antigo (array) para novo (objeto)
        if (Array.isArray(endpoint)) {
            const cameraPos = [endpoint[0] + 3, endpoint[1] + 2, endpoint[2] + 3];
            const fixed = { target: endpoint, camera: cameraPos };
            setEndpoints(prev => prev.map((ep, i) => i === idx ? fixed : ep));
            setAnimTarget(fixed.target);
            setAnimCamera(fixed.camera);
        } else {
            setAnimTarget(endpoint.target);
            setAnimCamera(endpoint.camera);
        }

        setCameraLocked(true);
    }, [orbitRef, endpoints, setEndpoints]);

    /**
     * Captura a visão atual do OrbitControls para um endpoint.
     */
    const captureCurrentView = useCallback((idx, onEdit) => {
        if (!orbitRef.current) return;
        const currentTarget = [
            orbitRef.current.target.x,
            orbitRef.current.target.y,
            orbitRef.current.target.z
        ];
        const currentCamera = [
            orbitRef.current.object.position.x,
            orbitRef.current.object.position.y,
            orbitRef.current.object.position.z
        ];

        if (onEdit) {
            onEdit(idx, 'camera', currentCamera);
        }
    }, [orbitRef]);

    return {
        animTarget, setAnimTarget,
        animCamera, setAnimCamera,
        cameraLocked, setCameraLocked,
        modelSize,
        handleModelLoad,
        focusCameraOn,
        captureCurrentView
    };
}
