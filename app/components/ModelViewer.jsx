"use client";

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useProgress } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';

// Hooks Customizados
import { useProjectStorage } from '../hooks/useProjectStorage';
import { useModelNavigation } from '../hooks/useModelNavigation';
import { useAssetManagement } from '../hooks/useAssetManagement';

// Componentes da Cena 3D
import DroneModel from './DroneModel';
import CameraAnimator from './CameraAnimator';

// Componentes de Edição e Modal
import EndpointEditor from './EndpointEditor';
import HotspotEditor from './HotspotEditor';
import HotspotModal from './HotspotModal';

// Componentes de UI (Refatorados)
import EmptyStateOverlay from './ui/EmptyStateOverlay';
import ToolTabs from './ui/ToolTabs';
import ModelSelector from './ui/ModelSelector';

// Estilos
import './ModelViewer.css';

/**
 * Componente Principal: Visualizador e Editor de Modelos 3D.
 * Gerencia a composição da cena e a interface de ferramentas.
 */
function ModelViewer() {
    const orbitRef = useRef();
    const isDev = process.env.NODE_ENV === 'development';

    // 1. Estados de Dados e Persistência
    const {
        models, setModels,
        selectedModel, setSelectedModel,
        endpoints, setEndpoints,
        hotspots, setHotspots,
        loading, setLoading,
        saveToProject
    } = useProjectStorage();

    // 2. Estados de Navegação e Câmera
    const {
        animTarget, setAnimTarget,
        animCamera, setAnimCamera,
        cameraLocked, setCameraLocked,
        modelSize,
        handleModelLoad,
        focusCameraOn,
        captureCurrentView
    } = useModelNavigation(orbitRef, endpoints, setEndpoints);

    // 3. Gestão de Assets e Arquivos
    const { uploadModel, deletePhysicalFile } = useAssetManagement(setLoading);

    // 4. Estados da Interface Local
    const [autoRotate, setAutoRotate] = useState(false);
    const [addingEndpoint, setAddingEndpoint] = useState(false);
    const [addingHotspot, setAddingHotspot] = useState(false);
    const [toolsCollapsed, setToolsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('geral');
    const [expandedEndpoints, setExpandedEndpoints] = useState([]);
    const [expandedHotspots, setExpandedHotspots] = useState([]);
    const [hotspotModalOpen, setHotspotModalOpen] = useState(false);
    const [hotspotModalImage, setHotspotModalImage] = useState(null);

    // Sincronia de progresso de carregamento real
    const { progress: realProgress } = useProgress();

    // --- Handlers de Ações ---

    const handleModelSelect = (url, newScale) => {
        if (newScale !== undefined) {
            setModels(prev => prev.map(m => m.url === url ? { ...m, realScale: newScale } : m));
        }
        setSelectedModel(url);
        setActiveTab('cameras');
    };

    const handleModelUpload = async (e) => {
        const file = e.target.files[0];
        const newModel = await uploadModel(file);
        if (newModel) {
            const updatedModels = [...models, newModel];
            setModels(updatedModels);
            setSelectedModel(newModel.url);
            // Salva a lista de modelos atualizada
            saveToProject(updatedModels, endpoints, hotspots);
        }
    };

    const handleModelClick = (e) => {
        if (!isDev) return; // Bloqueia criação de pontos em produção
        if (e.delta > 2) return;
        const { point } = e;

        if (addingEndpoint) {
            const cameraPos = [point.x + 3, point.y + 2, point.z + 3];
            setEndpoints([...endpoints, { target: [point.x, point.y, point.z], camera: cameraPos }]);
            setAddingEndpoint(false);
        } else if (addingHotspot) {
            setHotspots([...hotspots, { position: [point.x, point.y, point.z], image: null }]);
            setAddingHotspot(false);
        }
    };

    const handleDeleteHotspot = async (idx) => {
        const hotspotToDelete = hotspots[idx];
        if (hotspotToDelete?.image) await deletePhysicalFile(hotspotToDelete.image);
        const filtered = hotspots.filter((_, i) => i !== idx);
        setHotspots(filtered);
        saveToProject(models, endpoints, filtered);
    };

    const handleDeleteEndpoint = (idx) => {
        const filtered = endpoints.filter((_, i) => i !== idx);
        setEndpoints(filtered);
        saveToProject(models, filtered, hotspots);
    };

    const handleSaveClick = async () => {
        const result = await saveToProject();
        if (result.success) alert("✅ Dados salvos com sucesso no servidor!");
    };

    // --- Renderização de Auxiliares ---

    const toggleExpansion = (setFn, list, id) => {
        setFn(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
    };

    return (
        <div className="model-viewer-container">

            <EmptyStateOverlay onUpload={handleModelUpload} models={models} show={!loading && models.length === 0} />

            {loading && (
                <div className="progress-bar-container">
                    <div className="progress-bar-bg">
                        <div className="progress-bar" style={{ width: `${Math.round(realProgress)}%` }} />
                    </div>
                    <span className="progress-label">Sincronizando realidade 3D... {Math.round(realProgress)}%</span>
                </div>
            )}

            <div className={`glass-overlay ${toolsCollapsed ? 'collapsed' : ''}`}>
                <div className="panel-header">
                    <h2 className="glass-title" onClick={() => setToolsCollapsed(!toolsCollapsed)}>Ferramentas</h2>
                    <button className="tools-toggle-btn" onClick={() => setToolsCollapsed(!toolsCollapsed)}>
                        {toolsCollapsed ? '⏵' : '⏷'}
                    </button>
                </div>

                {!toolsCollapsed && (
                    <>
                        <ToolTabs activeTab={activeTab} onTabChange={setActiveTab} isDev={isDev} />

                        <div className="tab-content">
                            {/* ABA GERAL */}
                            {activeTab === 'geral' && (
                                <>
                                    <ModelSelector
                                        models={models}
                                        selectedModel={selectedModel}
                                        onSelect={handleModelSelect}
                                        onUpload={handleModelUpload}
                                        isDev={isDev}
                                    />
                                    <button className={`glass-btn full-width ${autoRotate ? 'active' : ''}`} onClick={() => setAutoRotate(!autoRotate)}>
                                        {autoRotate ? '⏹ Parar Rotação' : '🔄 Rotação Automática'}
                                    </button>
                                    {isDev && (
                                        <button className="save-project-btn" onClick={handleSaveClick}>💾 Salvar no Projeto</button>
                                    )}
                                </>
                            )}

                            {/* ABA CÂMERAS */}
                            {activeTab === 'cameras' && (
                                <div className="tab-pane">
                                    {isDev && (
                                        <button className={`glass-btn full-width secondary ${addingEndpoint ? 'active' : ''}`} onClick={() => setAddingEndpoint(!addingEndpoint)} disabled={cameraLocked}>
                                            {addingEndpoint ? '📍 Clique no Modelo...' : '➕ Nova Câmera'}
                                        </button>
                                    )}
                                    <div className="items-list">
                                        {endpoints.map((ep, idx) => (
                                            <div key={idx} className="item-row">
                                                <div
                                                    className="item-info"
                                                    onClick={isDev ? () => toggleExpansion(setExpandedEndpoints, expandedEndpoints, idx) : undefined}
                                                    style={{ cursor: isDev ? 'pointer' : 'default' }}
                                                >
                                                    <span className="item-icon">📹</span>
                                                    <span className="item-name">{ep.name || `Câmera ${idx + 1}`}</span>
                                                </div>
                                                <div className="item-actions">
                                                    <button className="icon-btn" onClick={() => focusCameraOn(idx)}>👁️</button>
                                                    {isDev && (
                                                        <>
                                                            <button className={`icon-btn ${expandedEndpoints.includes(idx) ? 'active' : ''}`} onClick={() => toggleExpansion(setExpandedEndpoints, expandedEndpoints, idx)}>✏️</button>
                                                            <button className="icon-btn delete" onClick={() => handleDeleteEndpoint(idx)}>🗑️</button>
                                                        </>
                                                    )}
                                                </div>
                                                {expandedEndpoints.includes(idx) && (
                                                    <div className="item-details">
                                                        <EndpointEditor
                                                            endpoint={ep} idx={idx} expanded
                                                            handleEditEndpoint={(idx, f, v) => setEndpoints(prev => prev.map((e, i) => i === idx ? { ...e, [f]: v } : e))}
                                                            focusCameraOn={focusCameraOn}
                                                            captureCurrentView={(id) => captureCurrentView(id, (idx, f, v) => setEndpoints(prev => prev.map((e, i) => i === idx ? { ...e, [f]: v } : e)))}
                                                            isDev={isDev}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ABA IMAGENS */}
                            {activeTab === 'Imagens' && (
                                <div className="tab-pane">
                                    {isDev && (
                                        <button className={`glass-btn full-width secondary ${addingHotspot ? 'active' : ''}`} onClick={() => setAddingHotspot(!addingHotspot)} disabled={cameraLocked}>
                                            {addingHotspot ? '📍 Clique no Modelo...' : '➕ Novo Hotspot'}
                                        </button>
                                    )}
                                    <div className="items-list">
                                        {hotspots.map((h, idx) => (
                                            <div key={idx} className="item-row">
                                                <div
                                                    className="item-info"
                                                    onClick={isDev ? () => toggleExpansion(setExpandedHotspots, expandedHotspots, idx) : undefined}
                                                    style={{ cursor: isDev ? 'pointer' : 'default' }}
                                                >
                                                    <span className="item-icon">🎯</span>
                                                    <span className="item-name">{h.name || `Ponto ${idx + 1}`}</span>
                                                </div>
                                                <div className="item-actions">
                                                    {isDev && (
                                                        <>
                                                            <button className={`icon-btn ${expandedHotspots.includes(idx) ? 'active' : ''}`} onClick={() => toggleExpansion(setExpandedHotspots, expandedHotspots, idx)}>✏️</button>
                                                            <button className="icon-btn delete" onClick={() => handleDeleteHotspot(idx)}>🗑️</button>
                                                        </>
                                                    )}
                                                </div>
                                                {expandedHotspots.includes(idx) && (
                                                    <div className="item-details">
                                                        <HotspotEditor
                                                            hotspot={h} idx={idx}
                                                            handleEditHotspot={(idx, f, v) => setHotspots(prev => prev.map((e, i) => i === idx ? { ...e, [f]: v } : e))}
                                                            isDev={isDev}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="tab-actions">
                                        {isDev && (
                                            <button className="glass-btn full-width primary" onClick={handleSaveClick}>
                                                💾 Salvar Projeto
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {hotspotModalOpen && hotspotModalImage && (
                <HotspotModal image={hotspotModalImage} onClose={() => { setHotspotModalOpen(false); setHotspotModalImage(null); }} />
            )}

            {modelSize > 0 && (
                <div className="scale-legend">
                    📐 Escala do Modelo: ~<b>{Math.round(modelSize)}m</b>
                </div>
            )}

            <Canvas camera={{ position: [5, 5, 5], fov: 50, near: 0.1, far: 5000 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="city" />
                {selectedModel && (
                    <DroneModel
                        endpoints={hotspotModalOpen && hotspotModalImage ? [] : endpoints}
                        hotspots={hotspotModalOpen && hotspotModalImage ? [] : hotspots}
                        gltfUrl={selectedModel}
                        realScale={models.find(m => m.url === selectedModel)?.realScale || 1}
                        onEndpointClick={focusCameraOn}
                        onHotspotClick={(idx) => {
                            if (hotspots[idx].image) {
                                setHotspotModalImage(hotspots[idx].image);
                                setHotspotModalOpen(true);
                            }
                        }}
                        onModelClick={handleModelClick}
                        onLoad={handleModelLoad}
                    />
                )}


                <OrbitControls
                    ref={orbitRef}
                    makeDefault
                    enableDamping
                    dampingFactor={0.15}
                    rotateSpeed={1.2}
                    zoomSpeed={3.0}
                    panSpeed={1.5}
                    screenSpacePanning={true}
                    autoRotate={autoRotate}
                    autoRotateSpeed={2}
                    enablePan={!cameraLocked}
                    enableRotate={!cameraLocked}
                    enableZoom={!cameraLocked}
                    minDistance={0.01}
                    maxDistance={2000}
                />


                <CameraAnimator
                    orbitRef={orbitRef}
                    animTarget={animTarget}
                    animCamera={animCamera}
                    setAnimTarget={setAnimTarget}
                    setAnimCamera={setAnimCamera}
                    setCameraLocked={setCameraLocked}
                />


            </Canvas>
        </div>
    );
}

export default ModelViewer;
