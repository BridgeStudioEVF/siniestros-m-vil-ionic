import { Redirect, Route } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { home, documentText, notifications } from "ionicons/icons";
import InicioPage from "./Inicio";
import MisSiniestrosPage from "./MisSiniestros";
import NotificacionesPage from "./Notificaciones";

export default function MainTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/inicio">
          <InicioPage />
        </Route>
        <Route exact path="/tabs/mis-siniestros">
          <MisSiniestrosPage />
        </Route>
        <Route exact path="/tabs/notificaciones">
          <NotificacionesPage />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/inicio" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="inicio" href="/tabs/inicio">
          <IonIcon icon={home} />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>
        <IonTabButton tab="reportes" href="/tabs/mis-siniestros">
          <IonIcon icon={documentText} />
          <IonLabel>Reportes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="avisos" href="/tabs/notificaciones">
          <IonIcon icon={notifications} />
          <IonLabel>Avisos</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
