# 📄 Estándar de Minutas Técnicas (Escudería EquineLead)

Para asegurar que la "telemetría" de las reuniones sea útil en el siguiente sprint, utilizaremos una estructura de **"Estado de Pits"**.

## 1. Nomenclatura de Archivos
Usa el formato `ISO-8601` seguido de un slug descriptivo:
`YYYY-MM-DD-tipo-asunto.md`

**Ejemplos:**
- `2026-02-17-sprint-sync-mvp-leads.md` (Reunión de sincronización de sprint)
- `2026-02-18-daily-status-devops.md` (Reunión diaria)
- `2026-02-19-tech-review-db-v2.md` (Revisión técnica específica)

---

## 2. Plantilla Estandarizada (Ejemplo Aplicado)

```markdown
# 🏁 Minuta de Sincronización: [Nombre de la Reunión]
**Fecha:** 2026-02-17 | **Tipo:** Sprint Sync 01
**Responsable del Acta:** @dzapatasal (DevOps Lead)

---

## 📊 Resumen Ejecutivo (Contexto Rápido)
Breve párrafo que explique el "Norte Técnico" de esta reunión. Ej: *Sincronización de avances del motor de scoring y validación del esquema final de base de datos para el MVP.*

---

## 🏎️ Estado de la Pista (Lo que se hizo)
Basado en las áreas de responsabilidad:
- ✅ **Data Science (Leandro)**: Completado el generador de dataset sintético y lógica rule-based.
- ✅ **Backend (Isabel)**: Entregado diseño final de esquema DB v2 (PostgreSQL).
- ✅ **DevOps (Diego)**: Jenkins estable y configurado para CI en ramas feature.

---

## 🚧 Bloqueos en Boxes (Lo que nos detiene)
| Componente | Bloqueo Detectado | Impacto |
|------------|-------------------|---------|
| Frontend   | Falta de código en rama | Impide validación en Jenkins |
| Backend    | Esperando JSON de Scrapper | Retrasa integración de la API |

---

## 📋 Próxima Vuelta (Tareas Pendientes)
Lista accionable con responsables claros para el siguiente encuentro:
- [ ] **Data Science**: Generar salida JSON oficial para integración.
- [ ] **Frontend**: Subir prototipo de dashboard a la rama `feature/frontend-web`.
- [ ] **Backend**: Iniciar implementación de controladores C# según esquema v2.

---

## 📎 Recursos y Enlaces
- Rama: `feature/scoring-intelligence` (Commit `ae6790e`)
- Documento: [Esquema DB v2 Final](file:///docs/meetings/...)
- Issue: #11 (Auditoría Técnica)
```

---

## 💡 Ventajas de este Formato
1. **Lectura Rápida**: Un lead puede leer solo el "Resumen Ejecutivo" y los "Bloqueos".
2. **Histórico Accionable**: Al empezar la siguiente reunión, se revisa la sección "Próxima Vuelta" del acta anterior.
3. **Consistencia**: Al no usar nombres propios como títulos principales, el sistema es profesional y escalable.
