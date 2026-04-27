import { Redirect, useHistory } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { AppBrandHeader } from "@/components/AppBrandHeader";
import { addSiniestro, getOperador, type TipoSiniestro } from "@/lib/siniestros-store";
import {
  Camera,
  Car,
  ShieldAlert,
  Wrench,
  HelpCircle,
  MapPin,
  Check,
  ArrowLeft,
  Loader2,
  X,
  Plus,
  Mic,
  MicOff,
  PhoneCall,
} from "lucide-react";

const tipos: { tipo: TipoSiniestro; icon: typeof Car; desc: string }[] = [
  { tipo: "Choque", icon: Car, desc: "Colisión con otro vehículo u objeto" },
  { tipo: "Robo", icon: ShieldAlert, desc: "Robo total o parcial" },
  { tipo: "Vandalismo", icon: Wrench, desc: "Daños intencionales" },
  { tipo: "Otro", icon: HelpCircle, desc: "Otro tipo de incidente" },
];

// Número del operador de flotilla (demo)
const OPERADOR_TEL = "+525555555555";

// Tipos mínimos de Web Speech API
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export default function ReportarPage() {
  const history = useHistory();
  const [paso, setPaso] = useState(1);
  const [fotos, setFotos] = useState<string[]>([]);
  const [tipo, setTipo] = useState<TipoSiniestro | null>(null);
  const [ubic, setUbic] = useState<{ lat: number; lng: number } | null>(null);
  const [ubicError, setUbicError] = useState<string | null>(null);
  const [obteniendo, setObteniendo] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [folio, setFolio] = useState<string | null>(null);
  const [grabando, setGrabando] = useState(false);
  const [errorVoz, setErrorVoz] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => {
      const r = new FileReader();
      r.onload = () => setFotos((prev) => [...prev, r.result as string]);
      r.readAsDataURL(f);
    });
  };

  const obtenerUbicacion = () => {
    setUbicError(null);
    setObteniendo(true);
    if (!navigator.geolocation) {
      setUbicError("GPS no disponible en este dispositivo");
      setObteniendo(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbic({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setObteniendo(false);
      },
      () => {
        setUbicError("No se pudo obtener tu ubicación. Verifica permisos.");
        setObteniendo(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Captura GPS automáticamente al entrar al paso 3
  useEffect(() => {
    if (paso === 3 && !ubic && !obteniendo) {
      obtenerUbicacion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso]);

  // Dictado por voz
  const toggleDictado = () => {
    setErrorVoz(null);
    if (grabando) {
      recognitionRef.current?.stop();
      return;
    }
    const W = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) {
      setErrorVoz("Tu dispositivo no permite dictado por voz.");
      return;
    }
    const rec = new SR();
    rec.lang = "es-MX";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (event) => {
      let texto = "";
      for (let i = 0; i < event.results.length; i++) {
        texto += event.results[i][0].transcript;
      }
      setDescripcion((prev) => (prev ? prev.trim() + " " : "") + texto.trim());
    };
    rec.onerror = () => {
      setErrorVoz("No se pudo iniciar el micrófono.");
      setGrabando(false);
    };
    rec.onend = () => setGrabando(false);
    recognitionRef.current = rec;
    rec.start();
    setGrabando(true);
  };

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* noop */
      }
    };
  }, []);

  if (!getOperador()) return <Redirect to="/" />;

  const enviar = async () => {
    if (!tipo) return;
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 700));
    const nuevo = addSiniestro({
      tipo,
      descripcion,
      ubicacion: ubic ?? { lat: 0, lng: 0 },
      fotos,
    });
    setFolio(nuevo.folio);
    setEnviando(false);
  };

  if (folio) {
    return (
      <IonPage>
        <AppBrandHeader />
        <IonContent className="ion-padding">
        <div className="flex flex-col items-center text-center mt-6 pb-4">
          <div className="relative h-24 w-24 rounded-3xl bg-[image:var(--gradient-primary)] flex items-center justify-center mb-5 shadow-[var(--shadow-glow)] rotate-3">
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-success border-4 border-background" />
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest bg-success/15 text-success px-3 py-1 rounded-full border-2 border-success/30">
            Reporte enviado
          </span>
          <h1 className="text-3xl font-bold mt-3">¡Listo, gracias!</h1>
          <p className="text-muted-foreground mt-2 text-base max-w-xs">
            Guarda este folio para dar seguimiento.
          </p>
          <div className="mt-5 w-full bg-card border-2 border-border rounded-3xl p-5 shadow-[var(--shadow-card)]">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Tu folio</p>
            <p className="text-3xl font-bold tracking-wider mt-1 text-gradient-primary">{folio}</p>
          </div>

          {/* CTA muy visual: Llamar a operador */}
          <a
            href={`tel:${OPERADOR_TEL}`}
            className="mt-6 w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-destructive to-[oklch(0.55_0.22_25)] text-white py-6 px-5 shadow-[0_12px_40px_-8px_oklch(0.55_0.22_25/0.55)] active:scale-[0.99] transition flex items-center gap-4"
          >
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
            <div className="h-16 w-16 rounded-2xl bg-white/25 backdrop-blur flex items-center justify-center shrink-0 animate-pulse">
              <PhoneCall className="h-8 w-8" />
            </div>
            <div className="text-left flex-1 relative">
              <p className="text-xs font-bold uppercase tracking-widest opacity-90">Recomendado</p>
              <p className="text-xl font-bold leading-tight mt-0.5">Llamar a un operador ahora</p>
              <p className="text-sm opacity-95">Te ayudará en este momento</p>
            </div>
          </a>

          <button
            type="button"
            onClick={() => history.push("/tabs/mis-siniestros")}
            className="mt-3 w-full border-2 border-border bg-card rounded-2xl py-4 font-semibold text-base"
          >
            Ver mis siniestros
          </button>
          <button
            type="button"
            onClick={() => history.push("/tabs/inicio")}
            className="mt-2 w-full text-muted-foreground rounded-2xl py-3 font-medium text-base"
          >
            Volver al inicio
          </button>
        </div>
        </IonContent>
      </IonPage>
    );
  }

  const puedeAvanzar =
    (paso === 1 && fotos.length > 0) ||
    (paso === 2 && tipo !== null) ||
    (paso === 3 && ubic !== null) ||
    (paso === 4 && descripcion.trim().length > 0) ||
    paso === 5;

  return (
    <IonPage>
      <AppBrandHeader />
      <IonContent className="ion-padding">
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => (paso > 1 ? setPaso(paso - 1) : history.push("/tabs/inicio"))}
          className="p-2 -ml-2 rounded-md hover:bg-accent"
          aria-label="Atrás"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Paso {paso} de 5</p>
          <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(paso / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {paso === 1 && (
        <section>
          <h2 className="text-2xl font-bold">Toma fotos o video</h2>
          <p className="text-muted-foreground mt-1 text-base">
            Captura los daños, placas y el lugar. Puedes agregar varias.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            multiple
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
            className="hidden"
          />

          {fotos.length === 0 ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-5 w-full border-4 border-dashed border-primary/50 bg-primary/5 rounded-3xl py-14 flex flex-col items-center gap-3 hover:bg-primary/10 active:scale-[0.99] transition shadow-[var(--shadow-card)]"
            >
              <div className="h-20 w-20 rounded-3xl bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Camera className="h-10 w-10 text-white" />
              </div>
              <span className="font-bold text-xl mt-1">Tomar foto o video</span>
              <span className="text-sm text-muted-foreground">Toca aquí para abrir la cámara</span>
            </button>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                {fotos.map((f, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-muted border-2 border-border"
                  >
                    <img src={f} alt={`Evidencia ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setFotos(fotos.filter((_, idx) => idx !== i))}
                      className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md"
                      aria-label="Eliminar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-2xl border-4 border-dashed border-primary/50 bg-primary/5 flex flex-col items-center justify-center gap-1 hover:bg-primary/10 active:scale-[0.97] transition"
                >
                  <Plus className="h-8 w-8 text-primary" />
                  <span className="text-xs font-bold text-primary">Agregar</span>
                </button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {fotos.length} archivo{fotos.length === 1 ? "" : "s"} agregado{fotos.length === 1 ? "" : "s"}
              </p>
            </div>
          )}
        </section>
      )}

      {paso === 2 && (
        <section>
          <h2 className="text-2xl font-bold">¿Qué tipo de siniestro?</h2>
          <p className="text-muted-foreground mt-1">Selecciona una opción.</p>
          <div className="mt-5 grid gap-3">
            {tipos.map(({ tipo: t, icon: Icon, desc }) => {
              const sel = tipo === t;
              return (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition ${
                    sel
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:bg-accent/40"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      sel ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  {sel && <Check className="h-5 w-5 text-primary" />}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {paso === 3 && (
        <section>
          <h2 className="text-2xl font-bold">Ubicación del incidente</h2>
          <p className="text-muted-foreground mt-1">Se obtiene automáticamente con GPS.</p>

          <div className="mt-5 rounded-3xl border-2 border-border bg-card p-6 flex flex-col items-center text-center shadow-[var(--shadow-card)]">
            <div
              className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
                ubic ? "bg-success/15" : "bg-primary/10"
              }`}
            >
              {obteniendo ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : (
                <MapPin className={`h-8 w-8 ${ubic ? "text-success" : "text-primary"}`} />
              )}
            </div>

            {obteniendo && !ubic && (
              <>
                <p className="mt-4 font-bold text-lg">Obteniendo tu ubicación…</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Acepta el permiso si tu teléfono lo pide.
                </p>
              </>
            )}

            {ubic && (
              <>
                <p className="mt-4 font-bold text-lg text-success">Ubicación capturada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Lat: {ubic.lat.toFixed(5)} · Lng: {ubic.lng.toFixed(5)}
                </p>
                <button
                  onClick={obtenerUbicacion}
                  className="mt-4 text-sm text-primary font-semibold underline underline-offset-4"
                >
                  Volver a capturar
                </button>
              </>
            )}

            {!obteniendo && !ubic && ubicError && (
              <>
                <p className="mt-4 text-base text-destructive font-medium">{ubicError}</p>
                <button
                  onClick={obtenerUbicacion}
                  className="mt-4 bg-primary text-primary-foreground rounded-xl px-6 py-3 font-semibold inline-flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" /> Reintentar
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {paso === 4 && (
        <section>
          <h2 className="text-2xl font-bold">Describe lo ocurrido</h2>
          <p className="text-muted-foreground mt-1">
            Escribe o usa el micrófono para dictar.
          </p>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={7}
            placeholder="Ej. Iba en la avenida principal y otro vehículo me impactó por detrás al frenar en un alto..."
            className="mt-5 w-full bg-input border-2 border-border rounded-2xl p-4 text-base outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary resize-none"
          />

          <button
            type="button"
            onClick={toggleDictado}
            className={`mt-3 w-full rounded-2xl py-4 font-bold inline-flex items-center justify-center gap-3 border-2 transition ${
              grabando
                ? "bg-destructive text-destructive-foreground border-destructive shadow-[var(--shadow-elegant)] animate-pulse"
                : "bg-card text-foreground border-primary/40 hover:bg-primary/5"
            }`}
          >
            {grabando ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6 text-primary" />}
            {grabando ? "Detener dictado" : "Dictar por voz"}
          </button>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{descripcion.length} caracteres</span>
            {errorVoz && <span className="text-destructive font-medium">{errorVoz}</span>}
          </div>
        </section>
      )}

      {paso === 5 && (
        <section>
          <h2 className="text-2xl font-bold">Confirma tu reporte</h2>
          <p className="text-muted-foreground mt-1">Revisa los datos antes de enviar.</p>

          <div className="mt-5 rounded-2xl border-2 border-border bg-card divide-y divide-border">
            <Resumen titulo="Tipo" valor={tipo ?? "—"} />
            <Resumen titulo="Fotos / videos" valor={`${fotos.length} archivo(s)`} />
            <Resumen
              titulo="Ubicación"
              valor={ubic ? `${ubic.lat.toFixed(4)}, ${ubic.lng.toFixed(4)}` : "—"}
            />
            <Resumen titulo="Descripción" valor={descripcion || "—"} multiline />
          </div>
        </section>
      )}

      {/* CTA inline (no fixed) — separado del bottom nav */}
      <div className="mt-8 mb-6">
        {paso < 5 ? (
          <button
            onClick={() => setPaso(paso + 1)}
            disabled={!puedeAvanzar}
            className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground rounded-2xl py-5 text-xl font-bold disabled:opacity-40 shadow-[var(--shadow-elegant)] inline-flex items-center justify-center gap-2"
          >
            Continuar
            <ArrowLeft className="h-5 w-5 rotate-180" />
          </button>
        ) : (
          <button
            onClick={enviar}
            disabled={enviando}
            className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground rounded-2xl py-5 text-xl font-bold inline-flex items-center justify-center gap-2 shadow-[var(--shadow-elegant)]"
          >
            {enviando && <Loader2 className="h-5 w-5 animate-spin" />}
            {enviando ? "Enviando…" : "Confirmar y enviar"}
          </button>
        )}
        <p className="text-xs text-muted-foreground text-center mt-3">
          {paso < 5 ? "Avanza al siguiente paso" : "Se enviará a tu operador de flotilla"}
        </p>
      </div>
      </IonContent>
    </IonPage>
  );
}

function Resumen({
  titulo,
  valor,
  multiline,
}: {
  titulo: string;
  valor: string;
  multiline?: boolean;
}) {
  return (
    <div className="p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{titulo}</p>
      <p className={`mt-1 ${multiline ? "" : "font-medium"}`}>{valor}</p>
    </div>
  );
}
