# 🚀 FASTPAGE PRO - PROTOCOLO AGÉNTICO DE DESARROLLO (V4)
# Estándar de Ingeniería: Software Limpio, Anti-Spaghetti y Cero Alucinaciones
# Instructor / Arquitecto: Ing. Fabio Herrera | FastPage Pro

================================================================================
🎛️ CONFIGURACIÓN DE EJECUCIÓN: [ MODO: CONFIRMAR | MODO: DIRECTO ]
================================================================================
(Selecciona CONFIRMAR para funcionalidades complejas, cambios en DB o refactorizaciones;
 selecciona DIRECTO únicamente para ajustes cosméticos, textos o tareas menores).

---

## 1. ESPECIFICACIÓN DEL REQUERIMIENTO

### 📌 CONTEXTO DEL PROYECTO
• Cliente / Proyecto: iTools Perú (E-commerce oficial de herramientas profesionales)
• Stack Tecnológico: Next.js 16 (App Router) / React 19 / Tailwind CSS v4 / TypeScript
• Base de Datos: Turso LibSQL Cloud (@prisma/adapter-libsql v6.19.2) + Prisma ORM
• CMS: Sanity Studio v6 (Project ID: 3qqlwuul, dataset: production)
• Integraciones: Bsale ERP (Stock/Precios) / NextAuth (Admin & Clientes)
• Entornos: Desarrollo Local (localhost:3000) / Producción (https://i-tools-steel.vercel.app)

### 🚨 PROBLEMA O NECESIDAD
• [Describe con precisión qué falla, qué falta o qué cuello de botella existe]

### 🎯 SOLUCIÓN TÉCNICA REQUERIDA
• [Indica claramente el objetivo funcional que se debe construir o refactorizar]

### 🛑 REGLAS ESTRICTAS DE ARQUITECTURA (NO HACER)
• NO reescribir archivos enteros si solo se requiere modificar una función (edición quirúrgica).
• NO borrar funciones existentes, variables de entorno ni comentarios de documentación.
• NO crear archivos monolíticos mayores a 200 líneas (aplicar modularización y separación de responsabilidades).
• NO instalar dependencias npm pesadas o redundantes sin previa autorización.
• NO inventar rutas, endpoints o esquemas de base de datos que no existan en el proyecto.
• NO usar estilos inline ni CSS puro; usar exclusivamente utilidades de Tailwind CSS.
• NO reintroducir configuraciones de Supabase/Postgres; la persistencia activa es Turso LibSQL.

### 🧩 REFERENCIA / FRAGMENTO EXISTENTE
```typescript
// Pega aquí el código actual, el schema de Prisma o el tipo TypeScript relevante
// Si es una creación desde cero, escribir: "N/A - Nueva implementación"
```

---

## 2. CRITERIOS DE ACEPTACIÓN & VALIDACIÓN (CHECKLIST)
- [ ] Tipado estricto con TypeScript (cero uso de `any`).
- [ ] Responsive Design verificado (Mobile First, Tablet y Desktop).
- [ ] Cero errores en consola y validación limpia con `npm run build`.
- [ ] Manejo explícito de estados: Carga (Loading), Error (Error state) y Éxito (Success).
- [ ] Seguridad: Cero exposición de claves privadas (API Tokens, Service Roles) en el cliente.

================================================================================
🤖 PROTOCOLO DE OBLIGATORIO CUMPLIMIENTO PARA LA IA (INSTRUCCIÓN DEL SISTEMA)
================================================================================

SI EL MODO ES "CONFIRMAR":
ALTO. ESTÁ PROHIBIDO GENERAR O EDITAR CÓDIGO DIRECTAMENTE.
Analiza los archivos y responde ÚNICAMENTE con:
1. 🎯 Diagnóstico: Resumen técnico de 3 líneas de lo que vas a ejecutar.
2. 📂 Plan de Archivos: Lista exacta de los archivos a crear o modificar.
3. ❓ Pregunta de confirmación: "¿Confirmas el plan técnico para proceder con la generación de código?"
Espera la confirmación explícita del desarrollador ("Sí", "Procede", "Confirmado") antes de tocar un solo archivo.

SI EL MODO ES "DIRECTO":
Procede de inmediato con la implementación quirúrgica, limpia y modular.

🛡️ ESTÁNDARES AGÉNTICOS DE GENERACIÓN DE CÓDIGO:
1. Edición Quirúrgica: Sustituye únicamente el bloque, función o componente necesario indicando la ruta relativa exacta.
2. Auto-Verificación: Antes de concluir, valida que todas las importaciones existan, que las variables coincidan con el contexto y que no queden referencias rotas.
3. Validación de Compilación: Ejecuta `npm run build` para asegurar que el proyecto no tenga errores de tipado ni de bundling.
4. Despliegue Limpio: Provee los comandos exactos de git y despliegue para llevar los cambios a Vercel sin fricción.
