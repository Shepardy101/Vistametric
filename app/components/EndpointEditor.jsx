"use client";
import { useState, useEffect } from 'react';

function EndpointEditor({ endpoint, idx, handleEditEndpoint, focusCameraOn, captureCurrentView, expanded, isDev }) {
  let ep = endpoint;
  if (Array.isArray(ep)) {
    const cameraPos = [ep[0] + 3, ep[1] + 2, ep[2] + 3];
    ep = { target: ep, camera: cameraPos, name: `Endpoint ${idx + 1}` };
  }
  const [target, setTarget] = useState(ep.target);
  const [camera, setCamera] = useState(ep.camera);
  const [name, setName] = useState(ep.name || `Endpoint ${idx + 1}`);

  const [prevEp, setPrevEp] = useState(ep);
  if (ep !== prevEp) {
    setPrevEp(ep);
    setTarget(ep.target);
    setCamera(ep.camera);
    setName(ep.name || `Endpoint ${idx + 1}`);
  }
  function handleTargetChange(i, value) {
    const newTarget = [...target];
    newTarget[i] = value;
    setTarget(newTarget);
    handleEditEndpoint(idx, 'target', newTarget);
  }
  function handleCameraChange(i, value) {
    const newCamera = [...camera];
    newCamera[i] = value;
    setCamera(newCamera);
    handleEditEndpoint(idx, 'camera', newCamera);
  }
  function handleNameChange(e) {
    setName(e.target.value);
    handleEditEndpoint(idx, 'name', e.target.value);
  }
  return (
    <div className="endpoint-editor-inline">
      <div className="editor-row">
        <label className="field-label">Nome:</label>
        <input
          className="compact-input full-width"
          type="text"
          value={name}
          onChange={handleNameChange}
          maxLength={32}
          disabled={!isDev}
        />
      </div>

      {expanded && (
        <>
          <div className="editor-row">
            <label className="field-label">Alvo (X, Y, Z):</label>
            <div className="coord-inputs">
              <input type="number" step="0.1" value={Number(target[0]).toFixed(2)} onChange={e => handleTargetChange(0, Number(e.target.value))} className="compact-input" disabled={!isDev} />
              <input type="number" step="0.1" value={Number(target[1]).toFixed(2)} onChange={e => handleTargetChange(1, Number(e.target.value))} className="compact-input" disabled={!isDev} />
              <input type="number" step="0.1" value={Number(target[2]).toFixed(2)} onChange={e => handleTargetChange(2, Number(e.target.value))} className="compact-input" disabled={!isDev} />
            </div>
          </div>
          <div className="editor-row">
            <label className="field-label">Câmera (X, Y, Z):</label>
            <div className="coord-inputs">
              <input type="number" step="0.1" value={Number(camera[0]).toFixed(2)} onChange={e => handleCameraChange(0, Number(e.target.value))} className="compact-input" disabled={!isDev} />
              <input type="number" step="0.1" value={Number(camera[1]).toFixed(2)} onChange={e => handleCameraChange(1, Number(e.target.value))} className="compact-input" disabled={!isDev} />
              <input type="number" step="0.1" value={Number(camera[2]).toFixed(2)} onChange={e => handleCameraChange(2, Number(e.target.value))} className="compact-input" disabled={!isDev} />
            </div>
          </div>
          {isDev && (
            <button className="glass-btn-inline capture-btn" onClick={() => captureCurrentView(idx)}>
              📸 Capturar Visão Atual
            </button>
          )}
        </>
      )}

      <style jsx>{`
        .endpoint-editor-inline {
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
          color: #00ffe7;
          border-color: rgba(0,255,231,0.2);
        }
        .compact-input:focus {
          border-color: #00ffe7;
          background: rgba(0,255,231,0.05);
        }
        .glass-btn-inline {
          background: rgba(0,255,231,0.1);
          border: 1px solid rgba(0,255,231,0.3);
          color: #00ffe7;
          padding: 8px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 4px;
        }
        .glass-btn-inline:hover {
          background: rgba(0,255,231,0.2);
          color: #fff;
        }
      `}</style>
    </div>
  );
}

export default EndpointEditor;
