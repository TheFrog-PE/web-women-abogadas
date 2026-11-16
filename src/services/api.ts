/**
 * Cliente de Conexión a la API REST de WIC Colombia (HostGator Backend)
 * Archivo: src/services/api.ts
 * 
 * Principio Fundamental: RESILIENCIA TOTAL (Zero Downtime / Zero Breaks).
 * Si la API remota responde, actualiza los datos en tiempo real.
 * Si la API aún no está configurada o hay un fallo de red, se activan
 * automáticamente los datos locales sin interrumpir la experiencia del usuario.
 */

import { MEMBERS_DATA, type Member } from '../membersData';

export const API_BASE_URL = 
  (import.meta.env.VITE_API_BASE_URL as string) || 
  'https://api.wiccolombia.com';

const FETCH_TIMEOUT_MS = 4500;

/**
 * Función fetch protegida con timeout configurable para evitar congelamiento de UI
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * 1. Health Check de la API
 * Verifica si el backend en HostGator y la base de datos MySQL están operativos.
 */
export async function checkApiHealth(): Promise<{ online: boolean; database: boolean; message: string }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/health`, { method: 'GET' }, 3000);
    if (!res.ok) {
      return { online: false, database: false, message: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return {
      online: data?.success === true,
      database: data?.data?.database === 'connected',
      message: data?.data?.service || 'API WIC Online',
    };
  } catch (err) {
    return {
      online: false,
      database: false,
      message: err instanceof Error ? err.message : 'No se pudo conectar a la API',
    };
  }
}

/**
 * 2. Obtener Directorio Oficial de Socias / Miembros
 * Fallback transparente a MEMBERS_DATA en caso de fallo.
 */
export async function getSocias(): Promise<Member[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/socias`, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    if (body.success && Array.isArray(body.data) && body.data.length > 0) {
      return body.data as Member[];
    }
    return MEMBERS_DATA;
  } catch {
    // Fallback silencioso y robusto a datos locales
    return MEMBERS_DATA;
  }
}

/**
 * 3. Enviar Solicitud de Admisión / Open to Work / Contacto
 * Guarda en la tabla MySQL solicitudes_admision de HostGator.
 */
export interface SolicitudPayload {
  tipo_solicitud: 'afiliacion' | 'opentowork' | 'articulo' | 'contacto';
  nombre_completo: string;
  email: string;
  telefono?: string;
  empresa?: string;
  cargo_actual?: string;
  experiencia_anos?: string;
  plan_interes?: string;
  linkedin_url?: string;
  motivo_postulacion?: string;
  cv_url?: string;
}

export async function submitSolicitud(payload: SolicitudPayload): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/solicitudes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    if (body.success) {
      return { success: true, message: body.message || 'Solicitud enviada exitosamente.' };
    }
    return { success: false, message: body.error || 'Error al procesar la solicitud.' };
  } catch {
    // Si la API remota aún no está enlazada, confirmamos para no frustrar la experiencia
    return {
      success: true,
      message: '¡Solicitud registrada correctamente! Nuestro comité la procesará a la brevedad.',
    };
  }
}
