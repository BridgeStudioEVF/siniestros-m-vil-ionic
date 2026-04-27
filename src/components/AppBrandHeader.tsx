import { IonButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { logout } from "@/lib/siniestros-store";

export function AppBrandHeader() {
  const history = useHistory();

  return (
    <IonHeader className="ion-no-border">
      <IonToolbar className="bg-transparent [--background:transparent] px-2 pt-2">
        <IonButtons slot="start" className="flex items-center gap-3 pl-2">
          <div className="relative h-12 w-12 rounded-2xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elegant)] flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-white" />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-success border-2 border-background" />
          </div>
          <div className="leading-tight">
            <span className="block font-bold tracking-tight text-lg">Siniestros</span>
            <span className="block text-xs font-medium text-muted-foreground">
              Flotilla segura
            </span>
          </div>
        </IonButtons>
        <IonButton
          slot="end"
          fill="outline"
          className="font-semibold text-sm min-h-[48px]"
          onClick={() => {
            logout();
            history.replace("/");
          }}
        >
          <LogOut className="h-5 w-5 mr-1" />
          Salir
        </IonButton>
      </IonToolbar>
    </IonHeader>
  );
}
