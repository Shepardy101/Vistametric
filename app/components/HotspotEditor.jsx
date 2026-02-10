import { useState, useEffect } from 'react';

function HotspotEditor({ hotspot, idx, handleEditHotspot, handleDeleteHotspot, isDev }) {
  const [position, setPosition] = useState(hotspot.position);
  const [image, setImage] = useState(hotspot.image);
  const [name, setName] = useState(hotspot.name || "");

  const [prevHotspot, setPrevHotspot] = useState(hotspot);
  if (hotspot !== prevHotspot) {
    setPrevHotspot(hotspot);
    setPosition(hotspot.position);
    setImage(hotspot.image);
    setName(hotspot.name || "");
  }

  function handlePositionChange(i, value) {
    const newPos = [...position];
    newPos[i] = value;
    setPosition(newPos);
    handleEditHotspot(idx, 'position', newPos);
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setImage(data.url);
          handleEditHotspot(idx, 'image', data.url);
        } else {
          alert('Erro no upload: ' + data.error);
        }
      } catch {
        alert("Erro ao conectar com o servidor de upload.");
      }
    }
  }

  function handleNameChange(e) {
    setName(e.target.value);
    handleEditHotspot(idx, 'name', e.target.value);
  }

  return (
    <div className="hotspot-editor-inline">
      <div className="editor-row">
        <label className="field-label">Nome:</label>
        <input type="text" value={name} onChange={handleNameChange} className="compact-input full-width" disabled={!isDev} />
      </div>
      <div className="editor-row">
        <label className="field-label">Posição (X, Y, Z):</label>
        <div className="coord-inputs">
          <input type="number" step="0.01" value={Number(position[0]).toFixed(2)} onChange={e => handlePositionChange(0, Number(e.target.value))} className="compact-input" disabled={!isDev} />
          <input type="number" step="0.01" value={Number(position[1]).toFixed(2)} onChange={e => handlePositionChange(1, Number(e.target.value))} className="compact-input" disabled={!isDev} />
          <input type="number" step="0.01" value={Number(position[2]).toFixed(2)} onChange={e => handlePositionChange(2, Number(e.target.value))} className="compact-input" disabled={!isDev} />
        </div>
      </div>
      {isDev && (
        <div className="editor-row">
          <label className="field-label">Imagem 360º:</label>
          <div className="file-input-wrapper">
            <input type="file" accept="image/*" onChange={handleImageChange} className="compact-file-input" />
            {image && <span className="image-status-icon">✅</span>}
          </div>
        </div>
      )}

      <style jsx>{`
        .hotspot-editor-inline {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 4px 0;
        }
        .editor-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .field-label {
          color: rgba(255,255,255,0.5);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .coord-inputs {
          display: flex;
          gap: 4px;
        }
        .compact-input {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: #fff;
          padding: 6px;
          font-size: 0.8rem;
          outline: none;
          width: 60px;
        }
        .compact-input.full-width {
          width: 100%;
          color: #ffae00;
          border-color: rgba(255,174,0,0.2);
        }
        .compact-input:focus {
          border-color: #ffae00;
          background: rgba(255,174,0,0.05);
        }
        .file-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .compact-file-input {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
        }
        .image-status-icon {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

export default HotspotEditor;
