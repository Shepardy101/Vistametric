import { Html } from '@react-three/drei';

function CircularLabelButton({ name, color, onClick, scale = 1 }) {
  return (
    <group>
      {/* Botão HTML com tamanho fixo na tela para evitar o efeito de "borda gigante" no zoom */}
      <Html center style={{ pointerEvents: 'auto' }}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick(e);
          }}
          style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(10, 10, 15, 0.6)',
            color: color,
            fontWeight: 700,
            fontSize: 11,
            boxShadow: `0 0 15px ${color}40`,
            border: `2px solid ${color}`,
            backdropFilter: 'blur(8px)',
            userSelect: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            textAlign: 'center',
            lineHeight: '1.2'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.background = 'rgba(10, 10, 15, 0.51)';
            e.currentTarget.style.color = color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(10, 10, 15, 0.6)';
            e.currentTarget.style.color = color;
          }}
        >
          {name.includes(' ') ? name.split(' ').map((p, i) => <div key={i}>{p}</div>) : name}
        </div>
      </Html>
    </group>
  );
}

export default CircularLabelButton;
