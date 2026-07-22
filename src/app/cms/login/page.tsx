"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/studio-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/cms");
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#E35205] flex items-center justify-center">
            <span className="text-white font-bold text-lg">i</span>
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">iTools CMS</span>
        </div>

        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-6">
          <h1 className="text-white text-lg font-semibold mb-1">Acceder al Studio</h1>
          <p className="text-gray-500 text-sm mb-6">Ingresa la contraseña para acceder al panel de edición.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full h-11 rounded-lg bg-[#1a1a1a] border border-[#333] text-white px-4 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#E35205] transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full h-11 rounded-lg bg-[#E35205] hover:bg-[#CC4400] disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Panel de administración de contenido — iTools Perú
        </p>
      </div>
    </div>
  );
}