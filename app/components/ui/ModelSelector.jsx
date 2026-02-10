"use client";

/**
 * Seletor de modelos com funcionalidade de upload.
 */
export default function ModelSelector({ models, selectedModel, onSelect, onUpload, isDev }) {
    return (
        <div className="tab-pane">
            <div className="control-group">
                <label className="field-label">Modelo 3D Ativo:</label>
                <select
                    value={selectedModel}
                    onChange={e => onSelect(e.target.value)}
                    className="glass-select"
                >
                    {models.map((model) => (
                        <option key={model.url} value={model.url}>
                            {model.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedModel && isDev && (
                <div className="control-group" style={{ marginTop: '12px' }}>
                    <label className="field-label">Multiplicador de Escala (1un = X metros):</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0.001"
                        className="glass-select"
                        value={models.find(m => m.url === selectedModel)?.realScale || 1}
                        onChange={e => onSelect(selectedModel, parseFloat(e.target.value) || 1)}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                        Ajuste este valor se o terreno parecer muito pequeno ou grande.
                    </span>
                </div>
            )}

            {isDev && (
                <div className="control-group" style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                    <label className="field-label">Importar Novo Modelo (.glb):</label>
                    <div className="import-wrapper">
                        <input
                            type="file"
                            accept=".glb,.gltf"
                            onChange={onUpload}
                            id="model-upload"
                            hidden
                        />
                        <label htmlFor="model-upload" className="glass-btn primary full-width" style={{ textAlign: 'center', display: 'block' }}>
                            📂 Selecionar Arquivo
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}
