import React, { useState, useEffect } from 'react';
import { 
  calculateTimeRemaining, 
  toBinaryString, 
  toHexString, 
  toOctalString, 
  type TimeRemaining 
} from '../utils/timeUtils';
import { Clock, Binary, Database, Cpu } from 'lucide-react';

interface CountdownProps {
  targetDate: string;
  startDate?: string;
  simulatedOffsetMs: number;
  onExpired: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  startDate,
  simulatedOffsetMs,
  onExpired,
}) => {
  const [time, setTime] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(targetDate, simulatedOffsetMs)
  );
  const [activeMode, setActiveMode] = useState<'human' | 'unix' | 'binary'>('human');

  // Determinar la fecha de inicio para la barra de progreso
  const getStartTime = () => {
    if (startDate) return new Date(startDate).getTime();
    // Por defecto, asumimos que el contador empezó 14 días antes del objetivo
    const targetTime = new Date(targetDate).getTime();
    return targetTime - 14 * 24 * 60 * 60 * 1000;
  };

  useEffect(() => {
    let hasNotifiedExpired = false;

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(targetDate, simulatedOffsetMs);
      setTime(remaining);

      if (remaining.isExpired && !hasNotifiedExpired) {
        hasNotifiedExpired = true;
        onExpired();
      }
    }, 100); // 100ms para actualizaciones fluidas (especialmente en Unix/Binary)

    return () => clearInterval(timer);
  }, [targetDate, simulatedOffsetMs, onExpired]);

  // Calcular porcentaje de progreso
  const startTime = getStartTime();
  const targetTime = new Date(targetDate).getTime();
  const currentTime = new Date().getTime() + simulatedOffsetMs;
  const totalDuration = targetTime - startTime;
  const elapsed = currentTime - startTime;
  const progressPercentage = Math.min(
    100,
    Math.max(0, (elapsed / totalDuration) * 100)
  );

  // Renderizador de fila binaria para el modo binario
  const renderBinaryRow = (label: string, value: number, bits: number, dotColorClass: string) => {
    const binaryStr = toBinaryString(value, bits);
    return (
      <div className="binary-row">
        <span className="binary-row-label">{label}</span>
        <span className="binary-row-value">{binaryStr}</span>
        <div className="binary-dots">
          {binaryStr.split('').map((bit, idx) => (
            <div 
              key={idx} 
              className={`binary-dot ${bit === '1' ? dotColorClass : ''}`}
              title={`${label} Bit ${bits - 1 - idx}: ${bit}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="countdown-wrapper">
      {/* Botones de Selección de Modo */}
      <div className="mode-selector">
        <button 
          className={`mode-button ${activeMode === 'human' ? 'active' : ''}`}
          onClick={() => setActiveMode('human')}
        >
          <Clock size={16} />
          Humano
        </button>
        <button 
          className={`mode-button ${activeMode === 'unix' ? 'active' : ''}`}
          onClick={() => setActiveMode('unix')}
        >
          <Database size={16} />
          Unix
        </button>
        <button 
          className={`mode-button ${activeMode === 'binary' ? 'active' : ''}`}
          onClick={() => setActiveMode('binary')}
        >
          <Binary size={16} />
          Binario
        </button>
      </div>

      {/* Renderizado Condicional del Contador */}
      {activeMode === 'human' && (
        <div className="countdown-grid">
          <div className="glass-panel time-card">
            <span className="time-val">{time.days.toString().padStart(2, '0')}</span>
            <span className="time-label">Días</span>
          </div>
          <div className="glass-panel time-card">
            <span className="time-val">{time.hours.toString().padStart(2, '0')}</span>
            <span className="time-label">Horas</span>
          </div>
          <div className="glass-panel time-card">
            <span className="time-val">{time.minutes.toString().padStart(2, '0')}</span>
            <span className="time-label">Minutos</span>
          </div>
          <div className="glass-panel time-card">
            <span className="time-val">{time.seconds.toString().padStart(2, '0')}</span>
            <span className="time-label">Segundos</span>
          </div>
        </div>
      )}

      {activeMode === 'unix' && (
        <div className="glass-panel unix-display">
          <span className="unix-label">SEGUNDOS RESTANTES DESDE EPOCH</span>
          <span className="unix-value">{time.totalSeconds.toLocaleString()}</span>
          <span className="unix-label">Tasa de refresco de CPU: ~10Hz</span>
        </div>
      )}

      {activeMode === 'binary' && (
        <div className="glass-panel binary-display">
          <div className="unix-label" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={14} /> MATRIZ DE TIEMPO EN BINARIO (BCD / Lógica Digital)
          </div>
          <div className="binary-grid-rows">
            {renderBinaryRow('Días', time.days, 9, 'active')}
            {renderBinaryRow('Horas', time.hours, 5, 'active-sec')}
            {renderBinaryRow('Minutos', time.minutes, 6, 'active')}
            {renderBinaryRow('Segundos', time.seconds, 6, 'active-sec')}
          </div>
        </div>
      )}

      {/* Barra de Progreso del Tiempo Transcurrido */}
      <div className="progress-container">
        <div className="progress-header">
          <span>Progreso de Cursada / Evento</span>
          <span>{progressPercentage.toFixed(4)}% completado</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Barra de Sistemas Numéricos Adicionales (Hexadecimal & Octal) */}
      <div className="time-systems-bar">
        <div className="system-item">
          <span className="system-name">HEX:</span>
          <span className="system-value">
            0x{toHexString(time.days)}-{toHexString(time.hours)}-{toHexString(time.minutes)}-{toHexString(time.seconds)}
          </span>
        </div>
        <div className="system-item">
          <span className="system-name">OCT:</span>
          <span className="system-value">
            o{toOctalString(time.days, 3)}-{toOctalString(time.hours)}-{toOctalString(time.minutes)}-{toOctalString(time.seconds)}
          </span>
        </div>
        <div className="system-item">
          <span className="system-name">DEC TOTAL:</span>
          <span className="system-value">{time.totalSeconds}s</span>
        </div>
      </div>
    </div>
  );
};
