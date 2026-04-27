import { Link, Redirect } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import { AppBrandHeader } from "@/components/AppBrandHeader";
import {
  listSiniestros,
  getOperador,
  type Estatus,
  type TipoSiniestro,
} from "@/lib/siniestros-store";
import { ChevronRight, FileText, Car, ShieldAlert, Wrench, HelpCircle } from "lucide-react";

function chipClass(e: Estatus) {
  switch (e) {
    case "Enviado":
      return "bg-info/15 text-info border-info/30";
    case "En revisión":
      return "bg-warning/15 text-warning border-warning/30";
    case "Resuelto":
      return "bg-success/15 text-success border-success/30";
    case "Enviado a seguro":
      return "bg-primary/15 text-primary border-primary/30";
  }
}

function tipoIcon(t: TipoSiniestro) {
  switch (t) {
    case "Choque":
      return Car;
    case "Robo":
      return ShieldAlert;
    case "Vandalismo":
      return Wrench;
    case "Otro":
      return HelpCircle;
  }
}

export default function MisSiniestrosPage() {
  if (!getOperador()) return <Redirect to="/" />;

  const list = typeof window !== "undefined" ? listSiniestros() : [];

  return (
    <IonPage>
      <AppBrandHeader />
      <IonContent className="ion-padding">
        <div className="mt-1 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              Historial
            </p>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">Mis siniestros</h1>
          </div>
          <span className="text-xs text-muted-foreground bg-card border border-border rounded-full px-3 py-1">
            {list.length} {list.length === 1 ? "reporte" : "reportes"}
          </span>
        </div>

        {list.length === 0 ? (
          <div className="mt-12 flex flex-col items-center text-center bg-card border border-border rounded-3xl p-8 shadow-[var(--shadow-card)]">
            <div className="h-16 w-16 rounded-2xl bg-primary-soft flex items-center justify-center">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <p className="mt-4 font-semibold">Aún no tienes reportes</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Cuando reportes un siniestro aparecerá aquí.
            </p>
          </div>
        ) : (
          <ul className="mt-5 grid gap-3 pb-24">
            {list.map((s) => {
              const Icon = tipoIcon(s.tipo);
              return (
                <li key={s.folio}>
                  <Link
                    to={`/siniestro/${encodeURIComponent(s.folio)}`}
                    className="group block rounded-2xl bg-card border border-border p-4 hover:bg-accent/40 transition shadow-[var(--shadow-card)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-primary-soft flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">{s.tipo}</p>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${chipClass(
                              s.estatus,
                            )}`}
                          >
                            {s.estatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                          {s.folio} ·{" "}
                          {new Date(s.fecha).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {s.descripcion || "Sin descripción"}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1 group-hover:translate-x-0.5 transition" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </IonContent>
    </IonPage>
  );
}
