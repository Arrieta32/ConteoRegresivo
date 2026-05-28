export interface AppConfig {
  defaultTargetDate: string;
  defaultTitle: string;
  defaultMessage: string;
}

export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  title: string;
  message: string;
}

export const config: AppConfig = {
  defaultTargetDate: '2026-06-08T19:00:00',
  defaultTitle: 'Conteo Regresivo - Programación III',
  defaultMessage: '¡El tiempo límite se acerca! Prepárense para el gran desafío de codificación.',
};

export const milestones: Milestone[] = [
  {
    id: 'examen',
    name: 'Examen de Cátedra',
    targetDate: '2026-06-01T19:00:00',
    title: 'Examen Final - Programación III',
    message: 'Examen teórico-práctico de programación reactiva, concurrencia y DOM. ¡Prepárate!'
  },
  {
    id: 'proyecto',
    name: 'Proyecto Integrador',
    targetDate: '2026-06-08T19:00:00',
    title: 'Proyecto Integrador - Programación III',
    message: 'Entrega final y defensa del Proyecto Integrador. ¡Asegura tus commits!'
  }
];
