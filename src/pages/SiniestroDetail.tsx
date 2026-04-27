import { Redirect, useHistory, useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import { AppBrandHeader } from "@/components/AppBrandHeader";
import { getOperador, getSiniestro, type Estatus } from "@/lib/siniestros-store";
import { ArrowLeft, MapPin, Calendar, FileText } from "lucide-react";

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

export default function SiniestroDetailPage() {
  const history = useHistory();
  const { folio } = useParams<{ folio: string }>();
  const s =
    typeof window !== "undefined" && folio ? getSiniestro(decodeURIComponent(folio)) : undefined;

  if (!getOperador()) return <Redirect to="/" />;

  if (!s) {
    return (
      <IonPage>
        <AppBrandHeader />
        <IonContent className="ion-padding">
          <div className="mt-10 text-center">
            <p className="text-muted-foreground">No encontramos este reporte.</p>
            <button
              type="button"
              className="text-primary mt-4 inline-block underline"
              onClick={() => history.push("/tabs/mis-siniestros")}
            >
              Volver
            </button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppBrandHeader />
      <IonContent className="ion-padding">
        <button
          type="button"
          onClick={() => history.push("/tabs/mis-siniestros")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Mis siniestros
        </button>

        <div className="mt-4">
          <h1 className="text-2xl font-bold">{s.tipo}</h1>
          <p className="text-sm text-muted-foreground mt-1">Folio {s.folio}</p>
          <span
            className={`inline-block mt-3 text-xs px-2.5 py-1 rounded-full border ${chipClass(
              s.estatus,
            )}`}
          >
            {s.estatus}
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-card border border-border divide-y divide-border">
          <Row icon={Calendar} label="Fecha">
            {new Date(s.fecha).toLocaleString("es-MX", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </Row>
          <Row icon={MapPin} label="Ubicación">
            {s.ubicacion.direccion ??
              `${s.ubicacion.lat.toFixed(5)}, ${s.ubicacion.lng.toFixed(5)}`}
          </Row>
          <Row icon={FileText} label="Descripción">
            {s.descripcion || "—"}
          </Row>
        </div>

        <div className="mt-6 pb-8">
          <p className="text-sm font-semibold mb-3">Evidencia ({s.fotos.length})</p>
          {s.fotos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sin fotos adjuntas
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {s.fotos.map((f, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img src={f} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Calendar;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 flex gap-3">
      <Icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm">{children}</p>
      </div>
    </div>
  );
}
