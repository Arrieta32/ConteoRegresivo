import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle, Circle, Award } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
}

interface Unit {
  id: string;
  title: string;
  topics: Topic[];
}

const syllabusData: Unit[] = [
  {
    id: 'unit1',
    title: 'Unidad 1: Fundamentos Avanzados de JavaScript y el DOM',
    topics: [
      { id: 'u1-1', name: '1.1 Historia y Realidad de JavaScript: Mitos sobre su origen, estandarización (ECMAScript) y su filosofía liberal y permisiva.' },
      { id: 'u1-2', name: '1.2 El Objeto Global window: Análisis del entorno de ejecución del navegador, manipulación del tamaño de la ventana (innerWidth/outerWidth) y redireccionamientos basados en la ubicación (window.location).' },
      { id: 'u1-3', name: '1.3 El Árbol del DOM: Conexión e integración eficiente de scripts para evitar el bloqueo de carga de la página (Prácticas Recomendadas).' },
      { id: 'u1-4', name: '1.4 Diálogos de Ventana Síncronos: Uso y control de flujo mediante alert(), confirm() y prompt().' },
      { id: 'u1-5', name: '1.5 Automatización Básica: Implementación de temporizadores mediante setTimeout() y ejecución cíclica interactiva con setInterval().' }
    ]
  },
  {
    id: 'unit2',
    title: 'Unidad 2: Estructuras y Colecciones de Datos en el Cliente',
    topics: [
      { id: 'u2-1', name: '2.1 Los Arrays (Arreglos): Listas indexadas de elementos, manipulación con métodos nativos (.length, .push(), .pop()) y operaciones comunes de ordenamiento.' },
      { id: 'u2-2', name: '2.2 Los Objetos Literal: Representación de entidades mediante pares "clave-valor", acceso mediante notación de punto (.) y de corchetes ([]), y la naturaleza dinámica de sus propiedades.' },
      { id: 'u2-3', name: '2.3 Colecciones Estructuradas Complejas: Modelado del mundo real mediante arrays de objetos, casos de uso prácticos en bases de datos simuladas.' },
      { id: 'u2-4', name: '2.4 Estructuras Modernas (ES6+): Introducción y optimización masiva de datos mediante el uso de objetos Set (colecciones sin duplicados) y Map.' }
    ]
  },
  {
    id: 'unit3',
    title: 'Unidad 3: Integración de Atributos de Datos y Formatos de Intercambio',
    topics: [
      { id: 'u3-1', name: '3.1 Atributos Personalizados (data-*): Almacenamiento incrustado de información directamente en la estructura semántica de HTML.' },
      { id: 'u3-2', name: '3.2 La propiedad Dataset en JS: Acceso, lectura y modificación de atributos de datos en tiempo real desde scripts de JavaScript para vincular lógica de negocios a los elementos de la interfaz.' },
      { id: 'u3-3', name: '3.3 El formato JSON (JavaScript Object Notation): Estructura, sintaxis y reglas de serialización.' },
      { id: 'u3-4', name: '3.4 Serialización e Intercambio: Métodos nativos de conversión con JSON.stringify() y análisis de datos entrantes con JSON.parse() como puente fundamental para la persistencia local y APIs.' }
    ]
  },
  {
    id: 'unit4',
    title: 'Unidad 4: UI/UX y Componentes de Interfaz Dinámicos',
    topics: [
      { id: 'u4-1', name: '4.1 Principios Críticos de UX/UI: La experiencia empática del usuario, jerarquía visual y evitar el esfuerzo de procesamiento mental ("No me hagas pensar").' },
      { id: 'u4-2', name: '4.2 Prevención de Errores e Identidad Visual: Reglas de validación visual de datos para proteger nuestras bases de datos e interactividad.' },
      { id: 'u4-3', name: '4.3 Componentes Visuales con Bootstrap: Integración práctica de frameworks de estilos modernos.' },
      { id: 'u4-4', name: '4.4 El Carrusel de Bootstrap: Configuración avanzada de sliders, transiciones automatizadas, manejo de eventos javascript del carrusel y personalización de controles multimedia dinámicos integrando imágenes realistas de productos.' }
    ]
  },
  {
    id: 'unit5',
    title: 'Unidad 5: Concurrencia y Rendimiento Avanzado en el Navegador',
    topics: [
      { id: 'u5-1', name: '5.1 El paradigma del Hilo Único (Single Thread) en JS: Límites y desafíos de la ejecución de código síncrono que bloquea la interfaz de usuario.' },
      { id: 'u5-2', name: '5.2 Introducción a Procesamiento en Segundo Plano: Separación de cargas pesadas de cómputo del hilo principal de renderizado.' },
      { id: 'u5-3', name: '5.3 window.Worker (Web Workers): Instanciación, arquitectura y ciclo de vida de un Worker independiente.' },
      { id: 'u5-4', name: '5.4 Comunicación por Paso de Mensajes: Envío y recepción de datos estructurados de forma asíncrona entre el script de la interfaz y el Worker mediante postMessage() y el evento onmessage.' }
    ]
  }
];

export const SyllabusPanel: React.FC = () => {
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    unit1: true // Dejar la unidad 1 abierta por defecto
  });
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prog3_syllabus_progress');
      if (saved) {
        setCheckedTopics(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error al cargar progreso del temario', e);
    }
  }, []);

  // Alternar unidad abierta/cerrada
  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  // Alternar checkbox de tema
  const toggleTopic = (topicId: string) => {
    setCheckedTopics(prev => {
      const updated = {
        ...prev,
        [topicId]: !prev[topicId]
      };
      // Persistir en localStorage
      try {
        localStorage.setItem('prog3_syllabus_progress', JSON.stringify(updated));
      } catch (e) {
        console.error('Error al guardar progreso del temario', e);
      }
      return updated;
    });
  };

  // Calcular métricas de progreso
  const totalTopics = syllabusData.reduce((acc, unit) => acc + unit.topics.length, 0);
  const completedTopicsCount = Object.values(checkedTopics).filter(Boolean).length;
  const progressPercent = totalTopics > 0 ? (completedTopicsCount / totalTopics) * 100 : 0;

  return (
    <div className="glass-panel syllabus-panel">
      <div className="syllabus-header">
        <div className="syllabus-title">
          <BookOpen size={18} />
          <span>Temario Académico - Programación III</span>
        </div>
        <div className="syllabus-progress-container">
          <div className="syllabus-progress-text">
            <span>Progreso de estudio: {completedTopicsCount}/{totalTopics} temas</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="syllabus-progress-bar-track">
            <div 
              className="syllabus-progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="syllabus-units-list">
        {syllabusData.map((unit) => {
          const isExpanded = expandedUnits[unit.id];
          const completedInUnit = unit.topics.filter(t => checkedTopics[t.id]).length;
          const totalInUnit = unit.topics.length;
          const isUnitCompleted = completedInUnit === totalInUnit && totalInUnit > 0;

          return (
            <div key={unit.id} className={`syllabus-unit-card ${isExpanded ? 'expanded' : ''}`}>
              <div 
                className="syllabus-unit-header" 
                onClick={() => toggleUnit(unit.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  {isUnitCompleted ? (
                    <Award className="award-glow" size={18} style={{ color: 'var(--accent-tertiary)' }} />
                  ) : (
                    <span className="unit-indicator-dot" />
                  )}
                  <h4 className="unit-title">{unit.title}</h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="unit-progress-badge">
                    {completedInUnit}/{totalInUnit}
                  </span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isExpanded && (
                <div className="syllabus-topics-list">
                  {unit.topics.map((topic) => {
                    const isChecked = !!checkedTopics[topic.id];
                    return (
                      <div 
                        key={topic.id} 
                        className={`syllabus-topic-item ${isChecked ? 'completed' : ''}`}
                        onClick={() => toggleTopic(topic.id)}
                      >
                        <button className="topic-checkbox" aria-label={`Marcar ${topic.name}`}>
                          {isChecked ? (
                            <CheckCircle size={16} className="checked-icon" />
                          ) : (
                            <Circle size={16} className="unchecked-icon" />
                          )}
                        </button>
                        <span className="topic-text">{topic.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
