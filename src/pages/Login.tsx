import { Redirect, useHistory } from "react-router-dom";
import { useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { login, getOperador } from "@/lib/siniestros-store";
import { ArrowRight } from "lucide-react";
import logoPcz from "@/assets/logo-pcz.png";

export default function LoginPage() {
  const history = useHistory();
  const [numero, setNumero] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (typeof window !== "undefined" && getOperador()) {
    return <Redirect to="/tabs/inicio" />;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const r = login(numero.trim(), pass);
    setLoading(false);
    if (!r.ok) {
      if (r.reason === "pendiente") setError("Cuenta pendiente de aprobación");
      else setError("Verifica tu número de empleado y contraseña");
      return;
    }
    history.push("/tabs/inicio");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-[100dvh] bg-background flex justify-center relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-mesh" />
          <div className="pointer-events-none absolute -top-32 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-primary-glow/25 blur-3xl animate-float-slow" />

          <div className="w-full max-w-[480px] px-6 py-5 flex flex-col justify-center relative z-10">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="h-24 w-24 rounded-3xl bg-white shadow-[var(--shadow-elegant)] flex items-center justify-center p-2 border-2 border-border">
                <img
                  src={logoPcz}
                  alt="Productos de Consumo Z"
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mt-3">Siniestros</h1>
              <p className="text-base text-muted-foreground mt-1">
                Reporta incidentes de tu unidad
              </p>
            </div>

            <form
              onSubmit={submit}
              className="flex flex-col gap-4 bg-card/90 backdrop-blur-xl border-2 border-border rounded-3xl p-5 shadow-[var(--shadow-card)]"
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-foreground">
                  Número de empleado
                </span>
                <input
                  inputMode="numeric"
                  autoComplete="username"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="bg-input border-2 border-border rounded-2xl px-4 py-3.5 text-xl font-medium outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Ej. 10234"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-foreground">
                  Contraseña
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="bg-input border-2 border-border rounded-2xl px-4 py-3.5 text-xl font-medium outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="••••••••"
                />
              </label>

              {error && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    error.includes("pendiente")
                      ? "bg-warning/15 text-warning border-2 border-warning/40"
                      : "bg-destructive/15 text-destructive border-2 border-destructive/40"
                  }`}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 group inline-flex items-center justify-center gap-3 bg-[image:var(--gradient-primary)] hover:opacity-95 active:scale-[0.99] transition text-primary-foreground rounded-2xl py-4 text-xl font-bold shadow-[var(--shadow-elegant)]"
              >
                {loading ? "Entrando…" : "Entrar"}
                {!loading && (
                  <ArrowRight className="h-6 w-6 transition group-hover:translate-x-0.5" />
                )}
              </button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-3 px-4">
              Demo: usa cualquier número y contraseña. Usa{" "}
              <b className="text-foreground">00000</b> para ver el aviso de cuenta pendiente.
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
