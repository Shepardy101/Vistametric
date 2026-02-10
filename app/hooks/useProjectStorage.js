import { useState, useEffect, useRef } from 'react';

/**
 * Hook para gerenciar a persistência de dados do projeto (JSON e LocalStorage).
 */
export function useProjectStorage() {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [endpoints, setEndpoints] = useState([]);
    const [hotspots, setHotspots] = useState([]);
    const [loading, setLoading] = useState(true);
    const prevModelRef = useRef(null);

    // Carrega dados iniciais
    useEffect(() => {
        async function loadInitialData() {
            setLoading(true);
            try {
                const response = await fetch('/data/project_config.json');
                if (response.ok) {
                    const projectData = await response.json();
                    if (projectData.models && projectData.models.length > 0) {
                        const sanitizedModels = projectData.models.map(m => ({
                            ...m,
                            realScale: m.realScale || 1
                        }));
                        setModels(sanitizedModels);

                        const currentModelUrl = selectedModel || sanitizedModels[0].url;
                        if (!selectedModel) setSelectedModel(currentModelUrl);

                        const modelData = projectData.data ? projectData.data[currentModelUrl] : projectData[currentModelUrl];
                        if (modelData) {
                            setEndpoints(modelData.endpoints || []);
                            setHotspots(modelData.hotspots || []);
                            setLoading(false);
                            return;
                        }
                    }
                }
            } catch (err) {
                console.warn("Project config não encontrado, tentando localStorage...");
            }

            // Fallback para localStorage
            const saved = localStorage.getItem('drone_app_data');
            if (saved) {
                const data = JSON.parse(saved);
                if (data[selectedModel]) {
                    setEndpoints(data[selectedModel].endpoints || []);
                    setHotspots(data[selectedModel].hotspots || []);
                    setLoading(false);
                    return;
                }
            }

            setEndpoints([]);
            setHotspots([]);
            setLoading(false);
        }

        loadInitialData();
    }, [selectedModel]);

    // Auto-save no LocalStorage
    useEffect(() => {
        if (loading || !selectedModel) return;

        if (prevModelRef.current !== selectedModel) {
            prevModelRef.current = selectedModel;
            return;
        }

        const saved = localStorage.getItem('drone_app_data') || "{}";
        const data = JSON.parse(saved);
        data[selectedModel] = { endpoints, hotspots };

        try {
            localStorage.setItem('drone_app_data', JSON.stringify(data));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error("Erro de cota excedida no localStorage.");
            }
        }
    }, [endpoints, hotspots, selectedModel, loading]);

    /**
     * Salva as configurações atuais no servidor (project_config.json).
     */
    async function saveToProject(customModels = models, customEndpoints = endpoints, customHotspots = hotspots) {
        const saved = localStorage.getItem('drone_app_data') || "{}";
        const allData = JSON.parse(saved);

        const projectConfig = {
            models: customModels,
            data: allData
        };
        projectConfig.data[selectedModel] = { endpoints: customEndpoints, hotspots: customHotspots };

        try {
            const response = await fetch('/api/save-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectConfig)
            });
            return await response.json();
        } catch (err) {
            console.error("Erro ao salvar no projeto:", err);
            return { success: false, error: "Erro de conexão" };
        }
    }

    return {
        models, setModels,
        selectedModel, setSelectedModel,
        endpoints, setEndpoints,
        hotspots, setHotspots,
        loading, setLoading,
        saveToProject
    };
}
