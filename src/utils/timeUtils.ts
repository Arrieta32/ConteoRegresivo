export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
}

/**
 * Calcula el tiempo restante entre la fecha actual (más un desfase simulado para speedrun) y la fecha objetivo.
 */
export function calculateTimeRemaining(targetDateStr: string, simulatedOffsetMs: number = 0): TimeRemaining {
  const targetTime = new Date(targetDateStr).getTime();
  const currentTime = new Date().getTime() + simulatedOffsetMs;
  const difference = targetTime - currentTime;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);
  const seconds = Math.floor((difference / 1000) % 60);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isExpired: false,
  };
}

/**
 * Convierte un número a su representación binaria rellena con ceros.
 */
export function toBinaryString(value: number, bits: number): string {
  return value.toString(2).padStart(bits, '0');
}

/**
 * Convierte un número a su representación hexadecimal en mayúsculas rellena con ceros.
 */
export function toHexString(value: number, minLength: number = 2): string {
  return value.toString(16).toUpperCase().padStart(minLength, '0');
}

/**
 * Convierte un número a su representación octal rellena con ceros.
 */
export function toOctalString(value: number, minLength: number = 2): string {
  return value.toString(8).padStart(minLength, '0');
}
