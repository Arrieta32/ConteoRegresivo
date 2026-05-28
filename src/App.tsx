import { useState, useEffect } from 'react';
import { milestones, type Milestone } from './config';
import { MatrixBackground } from './components/MatrixBackground';
import { Countdown } from './components/Countdown';
import { TerminalConsole } from './components/TerminalConsole';
import { ReactDevLab } from './components/ReactDevLab';
import { SettingsModal } from './components/SettingsModal';
import { SyllabusPanel } from './components/SyllabusPanel';
import { calculateTimeRemaining } from './utils/timeUtils';
import { Settings, RefreshCw, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

function App() {
  // Analizar parámetros URL al iniciar
  const params = new URLSearchParams(window.location.search);
  const paramDate = params.get('date');
  const paramTitle = params.get('title');
  const paramMsg = params.get('msg');
  const paramTheme = params.get('theme');

  // Estado para hito personalizado (si se recibe por URL o configuración manual)
  const [customMilestone, setCustomMilestone] = useState<Milestone | null>(
    paramDate ? {
      id: 'custom',
      name: 'Personalizado',
      targetDate: paramDate,
      title: paramTitle || 'Hito Personalizado',
      message: paramMsg || 'Conteo personalizado activo.'
    } : null
  );

  // Determinar la lista disponible de hitos
  const availableMilestones = customMilestone 
    ? [customMilestone, ...milestones]
    : milestones;

  // Estado del hito activo (por defecto el examen si no hay custom, o proyecto)
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(
    paramDate ? 'custom' : 'proyecto'
  );

  // Obtener datos del hito activo
  const activeMilestone = availableMilestones.find(m => m.id === activeMilestoneId) || availableMilestones[0];

  // Estados principales vinculados al hito activo
  const [theme, setTheme] = useState(paramTheme || 'cyberpunk');
  const [simulatedOffsetMs, setSimulatedOffsetMs] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Obtener el tiempo restante
  const remainingTime = calculateTimeRemaining(activeMilestone.targetDate, simulatedOffsetMs);

  // Efecto para la celebración de expiración (Conteo a cero)
  useEffect(() => {
    if (remainingTime.isExpired) {
      setIsExpired(true);
    } else {
      setIsExpired(false);
    }
  }, [remainingTime.isExpired]);

  // Fuego de confeti dinámico
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    if (isExpired) {
      triggerConfetti();
      const interval = setInterval(triggerConfetti, 5000);
      return () => clearInterval(interval);
    }
  }, [isExpired]);

  // Manejo de cambios desde el modal
  const handleApplySettings = (settings: {
    targetDate: string;
    title: string;
    message: string;
    theme: string;
  }) => {
    const custom: Milestone = {
      id: 'custom',
      name: 'Personalizado',
      targetDate: settings.targetDate,
      title: settings.title,
      message: settings.message
    };
    setCustomMilestone(custom);
    setActiveMilestoneId('custom');
    setTheme(settings.theme);
    setSimulatedOffsetMs(0); // Reiniciar speedrun
  };

  // Aumentar desfase de tiempo (speedrun de terminal)
  const handleAddOffset = (offsetMs: number) => {
    setSimulatedOffsetMs((prev) => prev + offsetMs);
  };

  // Reiniciar offset / speedrun
  const handleResetSpeedrun = () => {
    setSimulatedOffsetMs(0);
  };

  return (
    <div className={`app-container theme-${theme}`}>
      {/* Fondo de Lluvia Digital en Canvas */}
      <MatrixBackground theme={theme} />

      {/* Header */}
      <header>
        <div className="logo-section">
          <GraduationCap 
            size={44} 
            style={{ 
              color: 'var(--accent-primary)', 
              marginBottom: '0.5rem',
              filter: 'drop-shadow(0 0 8px var(--glow-color))' 
            }} 
          />
          <h1>{activeMilestone.title}</h1>
          <p>{activeMilestone.message}</p>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Selector de pestañas para Hitos Académicos */}
        <div className="milestones-tab-container">
          <div className="milestones-tabs">
            {availableMilestones.map((m) => (
              <button
                key={m.id}
                className={`milestone-tab-btn ${activeMilestoneId === m.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveMilestoneId(m.id);
                  setSimulatedOffsetMs(0); // Resetear velocidad al cambiar
                }}
              >
                <span className="tab-neon-border" />
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {isExpired ? (
          <div className="glass-panel expired-panel">
            <h2 className="expired-title">¡TIEMPO FINALIZADO!</h2>
            <p className="expired-message">
              El evento de <strong>{activeMilestone.name}</strong> ha comenzado. ¡Mucho éxito en la resolución de sus algoritmos!
            </p>
            <div className="challenge-box glass-panel">
              <h3 className="challenge-title">Reto Académico para Programación III</h3>
              <p className="challenge-text">
                Implementa una cola de prioridad concurrente utilizando hilos en C# o Java, asegurando que sea libre de condiciones de carrera (Race Conditions). ¿Qué patrón de sincronización prefieres?
              </p>
              <button className="challenge-btn" onClick={triggerConfetti}>
                Celebrar con Confeti 🎉
              </button>
            </div>
            {simulatedOffsetMs > 0 && (
              <button 
                className="mode-button" 
                onClick={handleResetSpeedrun} 
                style={{ marginTop: '2rem', border: '1px solid var(--accent-primary)' }}
              >
                <RefreshCw size={14} /> Restaurar Tiempo Real
              </button>
            )}
          </div>
        ) : (
          <div className="countdown-wrapper">
            <Countdown
              targetDate={activeMilestone.targetDate}
              simulatedOffsetMs={simulatedOffsetMs}
              onExpired={() => setIsExpired(true)}
            />
            {simulatedOffsetMs > 0 && (
              <div 
                className="speedrun-notice"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  background: 'rgba(255, 0, 127, 0.1)', 
                  border: '1px solid var(--accent-primary)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-mono)',
                  marginTop: '1rem'
                }}
              >
                <span>⚠️ Simulando tiempo adelantado (+{(simulatedOffsetMs / 1000 / 60).toFixed(0)} min)</span>
                <button 
                  onClick={handleResetSpeedrun}
                  style={{ 
                    background: 'var(--accent-primary)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reiniciar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sección Interactiva: Consola y Laboratorio de React */}
        <div className="interactive-section">
          <TerminalConsole
            currentTheme={theme}
            onThemeChange={setTheme}
            onAddOffset={handleAddOffset}
            onTriggerConfetti={triggerConfetti}
          />
          <ReactDevLab
            theme={theme}
            simulatedOffsetMs={simulatedOffsetMs}
            timeRemaining={remainingTime}
            targetDate={activeMilestone.targetDate}
          />
        </div>

        {/* Sección de Temario Académico de Programación 3 */}
        <div className="syllabus-section-wrapper">
          <SyllabusPanel />
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p>
          Desarrollado para la cátedra de <strong>Programación III</strong>. 
          Desplegable en <a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer">GitHub Pages</a>.
        </p>
      </footer>

      {/* Botón flotante de configuración */}
      <button 
        className="settings-button-floating"
        onClick={() => setIsSettingsOpen(true)}
        title="Configurar fecha y tema"
        aria-label="Configurar"
      >
        <Settings size={24} />
      </button>

      {/* Modal de Configuración */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTargetDate={activeMilestone.targetDate}
        initialTitle={activeMilestone.title}
        initialMessage={activeMilestone.message}
        initialTheme={theme}
        onApplySettings={handleApplySettings}
      />
    </div>
  );
}

export default App;
