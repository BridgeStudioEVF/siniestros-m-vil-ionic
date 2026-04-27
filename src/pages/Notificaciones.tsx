import { Redirect } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import { AppBrandHeader } from "@/components/AppBrandHeader";
import { listNotificaciones, getOperador } from "@/lib/siniestros-store";
import { Bell, BellRing } from "lucide-react";

export default function NotificacionesPage() {
  if (!getOperador()) return <Redirect to="/" />;

  const list = typeof window !== "undefined" ? listNotificaciones() : [];
  const unread = list.filter((n) => !n.leido).length;

  return (
    <IonPage>
      <AppBrandHeader />
      <IonContent className="ion-padding">
        <div className="mt-1 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              Bandeja
            </p>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">Notificaciones</h1>
          </div>
          {unread > 0 && (
            <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/30 rounded-full px-3 py-1">
              {unread} sin leer
            </span>
          )}
        </div>

        {list.length === 0 ? (
          <div className="mt-12 flex flex-col items-center text-center bg-card border border-border rounded-3xl p-8 shadow-[var(--shadow-card)]">
            <div className="h-16 w-16 rounded-2xl bg-primary-soft flex items-center justify-center">
              <Bell className="h-7 w-7 text-primary" />
            </div>
            <p className="mt-4 font-semibold">Sin notificaciones</p>
            <p className="text-sm text-muted-foreground mt-1">
              Te avisaremos cuando haya novedades.
            </p>
          </div>
        ) : (
          <ul className="mt-5 grid gap-3 pb-24">
            {list.map((n) => (
              <li
                key={n.id}
                className={`relative rounded-2xl border p-4 flex gap-3 shadow-[var(--shadow-card)] ${
                  n.leido ? "bg-card border-border" : "bg-card border-primary/30"
                }`}
              >
                {!n.leido && (
                  <span className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-[image:var(--gradient-primary)]" />
                )}
                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    n.leido ? "bg-muted" : "bg-primary-soft ring-4 ring-primary/10"
                  }`}
                >
                  {n.leido ? (
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <BellRing className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm">{n.titulo}</p>
                    {!n.leido && <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.mensaje}</p>
                  <p className="text-[11px] text-muted-foreground mt-2 font-medium">
                    {new Date(n.fecha).toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </IonContent>
    </IonPage>
  );
}
