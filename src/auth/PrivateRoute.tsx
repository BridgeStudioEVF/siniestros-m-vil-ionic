import type { ComponentType } from "react";
import { Redirect, Route } from "react-router-dom";
import type { RouteComponentProps } from "react-router";
import { getOperador } from "@/lib/siniestros-store";

export function PrivateRoute<P extends RouteComponentProps>({
  component: Component,
  ...rest
}: { component: ComponentType<P> } & Record<string, unknown>) {
  return (
    <Route
      {...rest}
      render={(props) =>
        getOperador() ? <Component {...(props as P)} /> : <Redirect to="/" />
      }
    />
  );
}
