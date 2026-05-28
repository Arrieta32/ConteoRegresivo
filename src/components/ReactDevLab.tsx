import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import type { TimeRemaining } from '../utils/timeUtils';

interface ReactDevLabProps {
  theme: string;
  simulatedOffsetMs: number;
  timeRemaining: TimeRemaining;
  targetDate: string;
}

export const ReactDevLab: React.FC<ReactDevLabProps> = ({
  theme,
  simulatedOffsetMs,
  timeRemaining,
  targetDate,
}) => {
  const [activeTab, setActiveTab] = useState<'hook' | 'math' | 'state'>('hook');

  const hookCode = `// React: Manejo de Intervalos y Cleanup de Memoria
useEffect(() => {
  // 1. Iniciamos el temporizador
  const timer = setInterval(() => {
    const remaining = calculateTimeRemaining(targetDate);
    setTime(remaining);
  }, 100);

  // 2. RETORNO DE LIMPIEZA (Función Cleanup)
  // ¡Vital en SPAs para evitar memory leaks!
  return () => clearInterval(timer);
}, [targetDate]);`;

  const mathCode = `// Matemáticas de Conversión de Base Numérica
// Representación binaria a nivel de bits
export function toBinaryString(value: number, bits: number): string {
  return value.toString(2).padStart(bits, '0');
}

// Representación hexadecimal para bajo nivel
export function toHexString(value: number): string {
  return value.toString(16).toUpperCase().padStart(2, '0');
}`;

  // Estado del componente en tiempo real en formato JSON
  const liveState = {
    props: {
      targetDate,
      defaultOffsetMs: 0
    },
    state: {
      activeTheme: theme,
      simulatedOffsetMs: `${simulatedOffsetMs} ms (${(simulatedOffsetMs / 1000 / 60 / 60).toFixed(2)} horas)`,
      activeMode: 'binary | unix | human',
      currentTime: new Date(new Date().getTime() + simulatedOffsetMs).toISOString(),
    },
    timeRemainingObject: {
      days: timeRemaining.days,
      hours: timeRemaining.hours,
      minutes: timeRemaining.minutes,
      seconds: timeRemaining.seconds,
      totalSeconds: timeRemaining.totalSeconds,
      isExpired: timeRemaining.isExpired
    }
  };

  return (
    <div className="glass-panel devlab-panel">
      <div className="devlab-header">
        <div className="devlab-title">
          <Cpu size={16} />
          React Dev Lab (Aprende el código)
        </div>
        <div className="devlab-tabs">
          <button 
            className={`devlab-tab ${activeTab === 'hook' ? 'active' : ''}`}
            onClick={() => setActiveTab('hook')}
          >
            useEffect Hook
          </button>
          <button 
            className={`devlab-tab ${activeTab === 'math' ? 'active' : ''}`}
            onClick={() => setActiveTab('math')}
          >
            Bases Numéricas
          </button>
          <button 
            className={`devlab-tab ${activeTab === 'state' ? 'active' : ''}`}
            onClick={() => setActiveTab('state')}
          >
            State en Vivo (JSON)
          </button>
        </div>
      </div>
      <div className="devlab-code">
        {activeTab === 'hook' && (
          <pre className="code-block">
            <code style={{ color: 'var(--accent-secondary)' }}>{hookCode}</code>
          </pre>
        )}
        {activeTab === 'math' && (
          <pre className="code-block">
            <code style={{ color: 'var(--accent-tertiary)' }}>{mathCode}</code>
          </pre>
        )}
        {activeTab === 'state' && (
          <pre className="code-block">
            <code style={{ color: '#e0ffe0', fontSize: '0.75rem' }}>
              {JSON.stringify(liveState, null, 2)}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};
