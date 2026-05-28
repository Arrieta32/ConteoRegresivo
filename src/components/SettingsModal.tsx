import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTargetDate: string;
  initialTitle: string;
  initialMessage: string;
  initialTheme: string;
  onApplySettings: (settings: { targetDate: string; title: string; message: string; theme: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTargetDate,
  initialTitle,
  initialMessage,
  initialTheme,
  onApplySettings,
}) => {
  const [targetDate, setTargetDate] = useState(initialTargetDate);
  const [title, setTitle] = useState(initialTitle);
  const [message, setMessage] = useState(initialMessage);
  const [theme, setTheme] = useState(initialTheme);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generar URL para compartir
  const generateShareUrl = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const dateParam = encodeURIComponent(targetDate);
    const titleParam = encodeURIComponent(title);
    const msgParam = encodeURIComponent(message);
    const themeParam = encodeURIComponent(theme);
    return `${origin}${pathname}?date=${dateParam}&title=${titleParam}&msg=${msgParam}&theme=${themeParam}`;
  };

  const handleCopy = async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar URL', err);
    }
  };

  const handleSave = () => {
    onApplySettings({ targetDate, title, message, theme });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
          <X size={20} />
        </button>
        <h2 className="modal-title">Configurar Cuenta Regresiva</h2>

        <div className="form-group">
          <label htmlFor="title-input">Título del Evento</label>
          <input
            id="title-input"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Examen Final - Programación III"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date-input">Fecha y Hora Límite</label>
          <input
            id="date-input"
            type="datetime-local"
            className="form-input"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="msg-input">Mensaje de Motivación / Instrucciones</label>
          <textarea
            id="msg-input"
            className="form-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Ej: ¡A codificar! Recuerden liberar los timers en useEffect..."
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label>Tema Predeterminado</label>
          <div className="theme-options">
            {['cyberpunk', 'matrix', 'dracula', 'nord'].map((themeName) => (
              <button
                key={themeName}
                type="button"
                className={`theme-opt-btn ${theme === themeName ? 'active' : ''}`}
                onClick={() => setTheme(themeName)}
              >
                {themeName.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="copy-url-section">
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            ENLACE COMPARTIBLE PARA TUS ALUMNOS
          </label>
          <button className="copy-url-btn" onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? '¡Copiado!' : 'Copiar Enlace'}
          </button>
          {copied && <span className="copy-success-msg">El enlace de la cuenta regresiva está en tu portapapeles.</span>}
        </div>

        <button 
          className="copy-url-btn" 
          onClick={handleSave} 
          style={{ width: '100%', marginTop: '1.5rem', background: 'var(--accent-secondary)', color: '#050505' }}
        >
          Aplicar Cambios
        </button>
      </div>
    </div>
  );
};
