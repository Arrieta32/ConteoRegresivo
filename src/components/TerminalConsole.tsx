import React, { useState, useRef, useEffect } from 'react';

interface TerminalConsoleProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  onAddOffset: (offsetMs: number) => void;
  onTriggerConfetti: () => void;
}

interface CommandLog {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  currentTheme,
  onThemeChange,
  onAddOffset,
  onTriggerConfetti,
}) => {
  const [history, setHistory] = useState<CommandLog[]>([
    { text: 'SISTEMA INICIALIZADO - CONSOLE EMULATOR v1.0', type: 'success' },
    { text: 'Escribe "help" para ver la lista de comandos disponibles para Programación III.', type: 'output' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const autoScroll = () => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    autoScroll();
  }, [history]);

  // Lista de retos de programación
  const challenges = [
    {
      question: 'Reto 1: En JS, ¿qué retorna: typeof null ?',
      answer: 'object',
      hint: 'Pista: Es un error de diseño histórico en JS.',
    },
    {
      question: 'Reto 2: ¿Cuál es el resultado de la expresión: 2 + "2" ?',
      answer: '22',
      hint: 'Pista: Coerción de tipos en JavaScript.',
    },
    {
      question: 'Reto 3: Completa el nombre del método para liberar un setInterval en React: clear______(timerId)',
      answer: 'interval',
      hint: 'Pista: Comienza con mayúscula en JS nativo (Interval).',
    },
  ];

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newLogs: CommandLog[] = [...history, { text: `prog3@root:~$ ${trimmed}`, type: 'input' }];
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Si hay un reto activo, capturar la respuesta
    if (activeChallenge !== null) {
      const challenge = challenges[activeChallenge];
      if (trimmed.toLowerCase() === challenge.answer.toLowerCase()) {
        newLogs.push({ text: '>> ¡RESPUESTA CORRECTA! Desbloqueaste una celebración de código.', type: 'success' });
        onTriggerConfetti();
        setActiveChallenge(null);
      } else if (trimmed.toLowerCase() === 'exit') {
        newLogs.push({ text: '>> Reto cancelado.', type: 'output' });
        setActiveChallenge(null);
      } else {
        newLogs.push({ text: `>> Incorrecto. Intentalo de nuevo o escribe "exit" para salir. ${challenge.hint}`, type: 'error' });
      }
      setHistory(newLogs);
      setInputValue('');
      return;
    }

    switch (command) {
      case 'help':
        newLogs.push({
          text: 'Comandos disponibles:\n' +
               '  help               - Muestra esta lista de ayuda.\n' +
               '  theme --set <name> - Cambia el tema (cyberpunk, matrix, dracula, nord).\n' +
               '  speedrun <tiempo>  - Adelanta el conteo (ej: "speedrun 5m", "speedrun 2h", "speedrun 1d").\n' +
               '  challenge          - Inicia un reto aleatorio de JS para tus alumnos.\n' +
               '  clear              - Limpia la pantalla.\n' +
               '  info               - Muestra info del entorno de ejecución.',
          type: 'output'
        });
        break;

      case 'clear':
        setHistory([]);
        setInputValue('');
        return;

      case 'theme':
        if (args[0] === '--set' && args[1]) {
          const targetTheme = args[1].toLowerCase();
          if (['cyberpunk', 'matrix', 'dracula', 'nord'].includes(targetTheme)) {
            onThemeChange(targetTheme);
            newLogs.push({ text: `>> Tema cambiado con éxito a: ${targetTheme}`, type: 'success' });
          } else {
            newLogs.push({ text: `>> Error: Tema "${targetTheme}" no reconocido. Temas: cyberpunk, matrix, dracula, nord.`, type: 'error' });
          }
        } else {
          newLogs.push({ text: 'Uso correcto: theme --set <nombre_tema> (Ejemplo: theme --set matrix)', type: 'error' });
        }
        break;

      case 'speedrun':
        if (args[0]) {
          const timeVal = args[0];
          const unit = timeVal.slice(-1).toLowerCase();
          const amount = parseInt(timeVal.slice(0, -1));

          if (isNaN(amount) || !['s', 'm', 'h', 'd'].includes(unit)) {
            newLogs.push({ text: '>> Formato inválido. Usa por ejemplo: "speedrun 30s", "speedrun 15m", "speedrun 2h", "speedrun 1d".', type: 'error' });
          } else {
            let offsetMs = 0;
            if (unit === 's') offsetMs = amount * 1000;
            if (unit === 'm') offsetMs = amount * 60 * 1000;
            if (unit === 'h') offsetMs = amount * 60 * 60 * 1000;
            if (unit === 'd') offsetMs = amount * 24 * 60 * 60 * 1000;

            onAddOffset(offsetMs);
            newLogs.push({ text: `>> ¡SPEEDRUN ACTIVADO! Se adelantó la línea de tiempo por ${timeVal}.`, type: 'success' });
          }
        } else {
          newLogs.push({ text: 'Uso correcto: speedrun <cantidad><unidad> (Ej: "speedrun 1h")', type: 'error' });
        }
        break;

      case 'challenge':
        const randomIndex = Math.floor(Math.random() * challenges.length);
        setActiveChallenge(randomIndex);
        newLogs.push({ text: '==== RETO DE PROGRAMACIÓN INICIADO ====', type: 'success' });
        newLogs.push({ text: challenges[randomIndex].question, type: 'output' });
        newLogs.push({ text: 'Escribe tu respuesta aquí abajo en la consola:', type: 'output' });
        break;

      case 'info':
        newLogs.push({
          text: `Sistema: React SPA / GitHub Pages ready\nTema Activo: ${currentTheme.toUpperCase()}\nZona Horaria: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\nAgente de renderizado: V8 Engine compatible`,
          type: 'output'
        });
        break;

      default:
        newLogs.push({ text: `>> Comando no encontrado: "${command}". Escribe "help" para asistencia.`, type: 'error' });
        break;
    }

    setHistory(newLogs);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
    }
  };

  return (
    <div className="glass-panel terminal-panel">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="term-dot red" />
          <div className="term-dot yellow" />
          <div className="term-dot green" />
        </div>
        <div className="terminal-title">bash - prog3@student-console</div>
        <div style={{ width: 42 }}></div>
      </div>
      <div className="terminal-body" onClick={() => document.getElementById('term-input-focus')?.focus()}>
        <div className="terminal-output">
          {history.map((log, index) => (
            <div 
              key={index} 
              className={`term-line ${
                log.type === 'input' ? 'term-input-line-text' : 
                log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-green-400' : 'text-slate-300'
              }`}
              style={{
                color: log.type === 'error' ? 'var(--accent-primary)' : 
                       log.type === 'success' ? 'var(--accent-tertiary)' : 
                       log.type === 'input' ? 'var(--accent-secondary)' : 'var(--text-primary)',
                whiteSpace: 'pre-line'
              }}
            >
              {log.text}
            </div>
          ))}
        </div>
        <div className="term-input-line">
          <span className="term-prompt">
            {activeChallenge !== null ? 'challenge? ' : 'prog3@root:~$'}
          </span>
          <input
            id="term-input-focus"
            type="text"
            className="term-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoFocus
          />
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
