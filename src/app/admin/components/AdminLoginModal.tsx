"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginModal() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@itools.pe");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [godModeLoading, setGodModeLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciales inválidas. Usa las credenciales maestras de Super Administrador.");
      } else {
        router.refresh();
        window.location.href = "/admin";
      }
    } catch {
      setError("Error de conexión al autenticar.");
    } finally {
      setLoading(false);
    }
  };

  const handleGodModeDirect = async () => {
    setError("");
    setGodModeLoading(true);

    try {
      const res = await signIn("credentials", {
        email: "admin@itools.pe",
        password: "admin123",
        redirect: false,
      });

      if (res?.error) {
        setError("No se pudo activar Modo Dios automáticamente.");
      } else {
        router.refresh();
        window.location.href = "/admin";
      }
    } catch {
      setError("Error al conectar con Modo Dios.");
    } finally {
      setGodModeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 p-[1px] shadow-2xl shadow-orange-500/20 mb-4">
            <div className="w-full h-full bg-[#0D0D0D] rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            iTools <span className="text-amber-400">Admin</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/80 mt-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Panel Super Administrador · Modo Dios
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Quick God Mode Access Button */}
          <div className="mb-6 pb-6 border-b border-[#222]">
            <p className="text-[11px] text-[#888] font-medium mb-3 text-center">
              Acceso Rápido Autorizado para Propietarios y Gerencia:
            </p>
            <button
              type="button"
              disabled={godModeLoading || loading}
              onClick={handleGodModeDirect}
              className="w-full h-12 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-black transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-lg shadow-amber-500/20"
            >
              {godModeLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>⚡ Activar Acceso Directo Modo Dios</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-[#666] mt-2">
              Inicia sesión automáticamente con permisos totales de Administrador.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1.5">
                Correo Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@itools.pe"
                  required
                  className="w-full h-11 bg-[#161616] border border-[#262626] focus:border-amber-400 rounded-xl pl-10 pr-3 text-xs text-white placeholder-[#555] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888] uppercase tracking-wider mb-1.5">
                Contraseña Maestra
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 bg-[#161616] border border-[#262626] focus:border-amber-400 rounded-xl pl-10 pr-3 text-xs text-white placeholder-[#555] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || godModeLoading}
              className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar con Credenciales</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 pt-5 border-t border-[#1F1F1F] flex items-center justify-between text-xs text-[#666]">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Volver a la Tienda
            </Link>
            <Link href="/cuenta" className="hover:text-amber-400 transition-colors">
              Panel Cliente →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
