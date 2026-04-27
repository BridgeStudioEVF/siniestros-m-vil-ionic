import { Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";

import "./theme/variables.css";
import "./global.css";

import LoginPage from "./pages/Login";
import MainTabs from "./pages/MainTabs";
import ReportarPage from "./pages/Reportar";
import SiniestroDetailPage from "./pages/SiniestroDetail";
import { PrivateRoute } from "./auth/PrivateRoute";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={LoginPage} />
        <PrivateRoute path="/tabs" component={MainTabs} />
        <PrivateRoute exact path="/reportar" component={ReportarPage} />
        <PrivateRoute exact path="/siniestro/:folio" component={SiniestroDetailPage} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
