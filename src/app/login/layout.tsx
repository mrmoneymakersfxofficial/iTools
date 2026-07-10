"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerUser } from "@/lib/actions/auth";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight, Wrench, ShieldCheck,
  ArrowLeft, CheckCircle2,
} from "lucide-react";

function InputField({
  label, type = "text", placeholder, value, onChange, icon: Icon, showToggle, onToggle, error,
}: {
  label: string; type?: string; placeholder: string; value: string; onChange: (v: string) => void;
  icon?: React.ElementType; showToggle?: boolean; onToggle?: () => void; error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          type={showToggle ? (value ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-11 rounded-xl bg-muted/50 border ${
            error ? "border-destructive" : "border-input focus:border-primary"
          } pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {value ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function AuthForm({ mode }: { mode: "login" | "register" | "recover" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"comprador" | "proveedor">("comprador");

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isRecover = mode === "recover";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegister && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    if (isRecover) {
      setTimeout(() => { setSent(true); setLoading(false); }, 1200);
      return;
    }
    if (isLogin) {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
        setLoading(false);
      } else {
        router.push("/");
      }
      return;
    }
    if (isRegister) {
      const regResult = await registerUser(name, email, password);
      if (!regResult.success) {
        setError(regResult.error || "Error al crear la cuenta.");
        setLoading(false);
        return;
      }
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signInResult?.error) {
        setError("Cuenta creada pero hubo un error al iniciar sesión. Intenta ingresar manualmente.");
        setLoading(false);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar with theme area */}
      <div className="h-12" />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}>
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                i<span className="text-[#E35205]">Tools</span>.pe
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Title */}
            <h1 className="text-xl font-bold text-foreground text-center mb-1">
              {isLogin && "Iniciar Sesión"}
              {isRegister && "Crear Cuenta"}
              {isRecover && "Recuperar Contraseña"}
            </h1>
            <p className="text-xs text-muted-foreground text-center mb-6">
              {isLogin && "Accede a tu cuenta de iTools Perú"}
              {isRegister && "Regístrate para comprar herramientas profesionales"}
              {isRecover && "Te enviaremos un enlace para restablecer tu contraseña"}
            </p>

            {sent ? (
              /* Success state for recover */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">Correo Enviado</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Revisa tu bandeja de entrada en <strong>{email}</strong>. Sigue las instrucciones para restablecer tu contraseña.
                </p>
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Volver a Iniciar Sesión
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role selector for register */}
                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Tipo de Cuenta
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole("comprador")}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          role === "comprador"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input bg-muted/30 text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <User className="h-4 w-4" />
                        Comprador
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("proveedor")}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          role === "proveedor"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input bg-muted/30 text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Proveedor
                      </button>
                    </div>
                  </div>
                )}

                {/* Name (register) */}
                {isRegister && (
                  <InputField
                    label="Nombre Completo"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={setName}
                    icon={User}
                  />
                )}

                {/* Email */}
                <InputField
                  label="Correo Electrónico"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={setEmail}
                  icon={Mail}
                  error={error && !email.includes("@") ? "Ingresa un correo válido" : ""}
                />

                {/* Password (login/register) */}
                {!isRecover && (
                  <InputField
                    label="Contraseña"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={setPassword}
                    icon={Lock}
                    showToggle
                    onToggle={() => setShowPass(!showPass)}
                  />
                )}

                {/* Confirm Password (register) */}
                {isRegister && (
                  <InputField
                    label="Confirmar Contraseña"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    icon={Lock}
                    showToggle
                    onToggle={() => setShowConfirm(!showConfirm)}
                    error={confirmPassword && password !== confirmPassword ? "Las contraseñas no coinciden" : ""}
                  />
                )}

                {/* Forgot password link (login) */}
                {isLogin && (
                  <div className="text-right">
                    <Link href="/recuperar-password" className="text-xs text-primary hover:underline font-medium">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-wider text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin && "Iniciar Sesión"}
                      {isRegister && "Crear Cuenta"}
                      {isRecover && "Enviar Enlace de Recuperación"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Google OAuth */}
                {!isRecover && (
                  <>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-3 text-muted-foreground">o continúa con</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => signIn("google", { callbackUrl: "/" })}
                      className="w-full h-11 rounded-xl border border-input bg-card hover:bg-muted/50 flex items-center justify-center gap-3 text-sm font-medium text-foreground transition-all active:scale-[0.98]"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.22-2.25-.42l-5.09-5.09a7.53 7.53 0 0 0-2.25-.42c-.78.2-1.53.52-2.25.42l-5.09 5.09c-.95.95-2.27.38-3.18-.53-4.91-.42-6.35-1.87-7.78-5.39-1.42-3.52.38-4.97 2.15-7.79 8.09-8.12 12.08-.32 3.82 2.87 7.78 8.12 7.79 0 .32-.05.63-.14.92l-5.09 5.09c-.95.95-2.27.38-3.18.53-4.91.42-6.35 1.87-7.78 5.39-1.42 3.52.38 4.97-2.15 7.79z" fill="#4285F4"/>
                        <path d="M12.26 15.68c.32-.78.52-1.64.52-2.56 0-.78.2-1.53.52-2.25.42l-5.09-5.09a7.53 7.53 0 0 0-2.25-.42c-.78.2-1.53.52-2.25.42l-5.09 5.09c-.95.95-2.27.38-3.18.53-4.91.42-6.35 1.87-7.78 5.39-1.42 3.52.38 4.97 2.15 7.79 8.09 8.12 12.08.32 3.82-2.87 7.78-8.12 7.79" fill="#34A853"/>
                        <path d="M22.56 12.25c0-.78-.07-1.53-.22-2.25-.42l-5.09-5.09" fill="none" stroke="#FBBC05" strokeWidth="3"/>
                      </svg>
                      {isLogin ? "Iniciar con Google" : "Registrarse con Google"}
                    </button>

                    {/* Proveedor Google */}
                    {isRegister && role === "proveedor" && (
                      <button
                        type="button"
                        className="w-full h-11 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 flex items-center justify-center gap-2 text-sm font-medium text-primary transition-all active:scale-[0.98]"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.22-2.25-.42l-5.09-5.09a7.53 7.53 0 0 0-2.25-.42c-.78.2-1.53.52-2.25.42l-5.09 5.09c-.95.95-2.27.38-3.18-.53-4.91-.42-6.35-1.87-7.78-5.39-1.42-3.52.38-4.97 2.15-7.79 8.09-8.12 12.08-.32 3.82 2.87 7.78 8.12 7.79 0 .32-.05.63-.14.92l-5.09 5.09c-.95.95-2.27.38-3.18.53-4.91.42-6.35 1.87-7.78 5.39-1.42 3.52.38 4.97-2.15 7.79z" fill="#4285F4"/>
                          <path d="M12.26 15.68c.32-.78.52-1.64.52-2.56 0-.78.2-1.53.52-2.25.42l-5.09-5.09a7.53 7.53 0 0 0-2.25-.42c-.78.2-1.53.52-2.25.42l-5.09 5.09c-.95.95-2.27.38-3.18.53-4.91.42-6.35 1.87-7.78 5.39-1.42 3.52.38 4.97 2.15 7.79 8.09 8.12 12.08.32 3.82-2.87 7.78-8.12 7.79" fill="#34A853"/>
                          <path d="M22.56 12.25c0-.78-.07-1.53-.22-2.25-.42l-5.09-5.09" fill="none" stroke="#FBBC05" strokeWidth="3"/>
                        </svg>
                        Registrarse como Proveedor con Google
                      </button>
                    )}
                  </>
                )}

                {error && !email.includes("@") && (
                  <p className="text-xs text-destructive text-center">{error}</p>
                )}
              </form>
            )}

            {/* Bottom links */}
            <div className="mt-6 text-center text-xs text-muted-foreground">
              {isLogin && (
                <span>
                  ¿No tienes cuenta?{" "}
                  <Link href="/registro" className="text-primary font-semibold hover:underline">Regístrate</Link>
                </span>
              )}
              {isRegister && (
                <span>
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="text-primary font-semibold hover:underline">Inicia Sesión</Link>
                </span>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
              Datos seguros
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-primary" />
              Encriptación SSL
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              RUC: 20610613749
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}