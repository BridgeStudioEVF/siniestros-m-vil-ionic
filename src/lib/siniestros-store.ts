// Simple in-memory + localStorage mock store for the demo
export type Estatus = "Enviado" | "En revisión" | "Resuelto" | "Enviado a seguro";
export type TipoSiniestro = "Choque" | "Robo" | "Vandalismo" | "Otro";

export interface Siniestro {
  folio: string;
  tipo: TipoSiniestro;
  fecha: string;
  descripcion: string;
  ubicacion: { lat: number; lng: number; direccion?: string };
  fotos: string[]; // data URLs
  estatus: Estatus;
}

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export interface Operador {
  numeroEmpleado: string;
  nombre: string;
  deducible: 0 | 30 | 50 | 100;
  estadoCuenta: "Activo" | "Suspendido" | "Pendiente";
}

const KEY_USER = "siniestros_user";
const KEY_LIST = "siniestros_list";
const KEY_NOTIF = "siniestros_notif";

export const mockOperador: Operador = {
  numeroEmpleado: "10234",
  nombre: "Juan Pérez",
  deducible: 30,
  estadoCuenta: "Activo",
};

export function login(numeroEmpleado: string, password: string):
  | { ok: true; operador: Operador }
  | { ok: false; reason: "pendiente" | "credenciales" } {
  if (numeroEmpleado === "00000") return { ok: false, reason: "pendiente" };
  if (!numeroEmpleado || !password) return { ok: false, reason: "credenciales" };
  const op = { ...mockOperador, numeroEmpleado };
  if (typeof window !== "undefined") localStorage.setItem(KEY_USER, JSON.stringify(op));
  return { ok: true, operador: op };
}

export function getOperador(): Operador | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY_USER);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY_USER);
}

export function listSiniestros(): Siniestro[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY_LIST);
  if (raw) return JSON.parse(raw);
  // seed
  const seed: Siniestro[] = [
    {
      folio: "SN-2025-0001",
      tipo: "Choque",
      fecha: new Date(Date.now() - 86400000 * 4).toISOString(),
      descripcion: "Impacto trasero en alto.",
      ubicacion: { lat: 19.4326, lng: -99.1332, direccion: "Av. Reforma, CDMX" },
      fotos: [],
      estatus: "Enviado a seguro",
    },
    {
      folio: "SN-2025-0002",
      tipo: "Vandalismo",
      fecha: new Date(Date.now() - 86400000 * 2).toISOString(),
      descripcion: "Rayón en costado derecho.",
      ubicacion: { lat: 20.6597, lng: -103.3496, direccion: "Guadalajara, JAL" },
      fotos: [],
      estatus: "En revisión",
    },
  ];
  localStorage.setItem(KEY_LIST, JSON.stringify(seed));
  return seed;
}

export function addSiniestro(s: Omit<Siniestro, "folio" | "fecha" | "estatus">): Siniestro {
  const list = listSiniestros();
  const folio = `SN-${new Date().getFullYear()}-${String(list.length + 1).padStart(4, "0")}`;
  const nuevo: Siniestro = { ...s, folio, fecha: new Date().toISOString(), estatus: "Enviado" };
  list.unshift(nuevo);
  localStorage.setItem(KEY_LIST, JSON.stringify(list));
  // notificación
  const notifs = listNotificaciones();
  notifs.unshift({
    id: crypto.randomUUID(),
    titulo: "Reporte recibido",
    mensaje: `Tu reporte ${folio} fue recibido correctamente.`,
    fecha: new Date().toISOString(),
    leido: false,
  });
  localStorage.setItem(KEY_NOTIF, JSON.stringify(notifs));
  return nuevo;
}

export function getSiniestro(folio: string): Siniestro | undefined {
  return listSiniestros().find((s) => s.folio === folio);
}

export function listNotificaciones(): Notificacion[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY_NOTIF);
  if (raw) return JSON.parse(raw);
  const seed: Notificacion[] = [
    {
      id: "n1",
      titulo: "Bienvenido a Siniestros",
      mensaje: "Tu cuenta fue activada. Ya puedes reportar incidentes.",
      fecha: new Date(Date.now() - 86400000 * 5).toISOString(),
      leido: true,
    },
    {
      id: "n2",
      titulo: "Reporte SN-2025-0001 actualizado",
      mensaje: "Tu reporte fue enviado a la aseguradora.",
      fecha: new Date(Date.now() - 86400000 * 1).toISOString(),
      leido: false,
    },
  ];
  localStorage.setItem(KEY_NOTIF, JSON.stringify(seed));
  return seed;
}
