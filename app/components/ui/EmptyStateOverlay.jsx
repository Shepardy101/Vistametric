"use client";

/**
 * Overlay exibido quando não há modelos importados no projeto.
 */
export default function EmptyStateOverlay({ onUpload, show }) {
    if (!show) return null;
    return (
        <div className="empty-project-overlay">
            <div className="empty-card glass-panel">
                <div className="empty-icon">🏗️</div>
                <h2 className="empty-title">Bem-vindo ao Project Mapping</h2>
                <p className="empty-text">
                    Parece que você ainda não tem nenhum modelo 3D no seu projeto.
                    Comece importando um arquivo abaixo.
                </p>

                <div className="import-action-zone">
                    <input
                        type="file"
                        accept=".glb,.gltf"
                        onChange={onUpload}
                        id="first-model-upload"
                        hidden
                    />
                    <label htmlFor="first-model-upload" className="glass-btn primary big-btn">
                        📂 Importar Meu Primeiro Modelo (.glb)
                    </label>
                </div>
                <p className="empty-footerText">
                    O arquivo será salvo fisicamente na pasta do seu projeto.
                </p>
            </div>
        </div>
    );
}
