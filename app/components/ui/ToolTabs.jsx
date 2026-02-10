"use client";

/**
 * Navegador de abas para o painel de ferramentas.
 */
export default function ToolTabs({ activeTab, onTabChange, isDev }) {
    const tabs = [
        { id: 'geral', label: 'Geral' },
        { id: 'cameras', label: 'Câmeras' },
        ...(isDev ? [{ id: 'Imagens', label: 'Imagens' }] : [])
    ];

    return (
        <div className="tabs-header">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
