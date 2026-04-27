import { Link, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { AppBrandHeader } from "@/components/AppBrandHeader";
import { getOperador, listSiniestros } from "@/lib/siniestros-store";
import {
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  FileText,
  Phone,
  BookOpen,
  Sparkles,
} from "lucide-react";

function saludo() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function InicioPage() {
  const op = getOperador();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(listSiniestros().length);
  }, []);

  if (!op) return <Redirect to="/" />;

  const deducibleColor =
    op.deducible === 0
      ? "text-success"
      : op.deducible === 30
        ? "text-info"
        : op.deducible === 50
          ? "text-warning"
          : "text-destructive";

  const deducibleRing =
    op.deducible === 0
      ? "ring-success/30 bg-success/10"
      : op.deducible === 30
        ? "ring-info/30 bg-info/10"
        : op.deducible === 50
          ? "ring-warning/30 bg-warning/10"
          : "ring-destructive/30 bg-destructive/10";

  const estadoStyle =
    op.estadoCuenta === "Activo"
      ? "bg-success/15 text-success border-success/30"
      : "bg-destructive/15 text-destructive border-destructive/30";

  const initials = op.nombre
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <IonPage>
      <AppBrandHeader />
      <IonContent className="ion-padding">
        <section className="mt-1 flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground flex items-center justify-center font-bold text-xl shadow-[var(--shadow-elegant)]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground text-base">{saludo()},</p>
            <h1 className="text-2xl font-bold tracking-tight truncate">{op.nombre}</h1>
          </div>
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full border-2 ${estadoStyle}`}>
            ● {op.estadoCuenta}
          </span>
        </section>

        <Link
          to="/reportar"
          className="mt-4 relative block overflow-hidden rounded-3xl p-5 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.99] transition"
        >
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <ShieldAlert className="h-9 w-9" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" /> Acción rápida
              </span>
              <h2 className="text-2xl font-bold mt-1 leading-tight">Reportar siniestro</h2>
              <p className="text-sm opacity-95">Te guiamos paso a paso</p>
            </div>
            <ChevronRight className="h-7 w-7 shrink-0" />
          </div>
        </Link>

        <section className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card border-2 border-border p-4 shadow-[var(--shadow-card)]">
            <div
              className={`h-10 w-10 rounded-xl ring-4 flex items-center justify-center ${deducibleRing}`}
            >
              <TrendingUp className={`h-5 w-5 ${deducibleColor}`} />
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-2">Mi deducible</p>
            <p className={`text-3xl font-bold ${deducibleColor}`}>{op.deducible}%</p>
          </div>
          <div className="rounded-2xl bg-card border-2 border-border p-4 shadow-[var(--shadow-card)]">
            <div className="h-10 w-10 rounded-xl ring-4 ring-primary/15 bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-2">Reportes</p>
            <p className="text-3xl font-bold">{count}</p>
          </div>
        </section>

        <section className="mt-3 grid grid-cols-2 gap-3 pb-24">
          <a
            href="tel:911"
            className="rounded-2xl bg-card border-2 border-destructive/30 p-4 flex items-center gap-3 hover:bg-destructive/5 transition shadow-[var(--shadow-card)] min-w-0"
          >
            <div className="h-11 w-11 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-base leading-tight truncate">Emergencia</p>
              <p className="text-xs text-muted-foreground truncate">Llamar 911</p>
            </div>
          </a>
          <button
            type="button"
            className="rounded-2xl bg-card border-2 border-border p-4 flex items-center gap-3 hover:bg-accent/40 transition text-left shadow-[var(--shadow-card)] min-w-0"
          >
            <div className="h-11 w-11 rounded-xl bg-info/15 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-info" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-base leading-tight truncate">Ayuda</p>
              <p className="text-xs text-muted-foreground truncate">Qué hacer</p>
            </div>
          </button>
        </section>
      </IonContent>
    </IonPage>
  );
}
