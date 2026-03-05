import { jsPDF } from "jspdf";
import type { DashboardMetrics, InteractionSource, FunnelData, TopLead } from "./api";

const REPORT_COUNTER_KEY = "equine_report_daily_counter";

function getNextReportNumber(): string {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const raw = localStorage.getItem(REPORT_COUNTER_KEY);
    let data = raw ? JSON.parse(raw) : { date: today, count: 0 };

    if (data.date !== today) {
        data = { date: today, count: 1 };
    } else {
        data.count += 1;
    }

    localStorage.setItem(REPORT_COUNTER_KEY, JSON.stringify(data));
    return String(data.count).padStart(2, "0");
}

export function generateLeadReport(
    metrics: DashboardMetrics,
    interactionData: InteractionSource[],
    funnelData: FunnelData[],
    topLeads: TopLead[]
): void {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const W = 210;
    const MARGIN = 18;
    const COL = W - MARGIN * 2;
    let y = 0;

    const reportNum = getNextReportNumber();
    const todayISO = new Date().toISOString().slice(0, 10);
    const reportID = `REP-${todayISO.replace(/-/g, "")}-${reportNum}`;

    // ──────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(0, 0, W, 40, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("EQUINE LEAD CRM", MARGIN, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text(`ID: ${reportID} | REPORTE EJECUTIVO DE RENDIMIENTO`, MARGIN, 26);

    const now = new Date();
    const dateStr = now.toLocaleString("en-US", { day: "2-digit", month: "long", year: "numeric" });
    doc.text(`Fecha: ${dateStr}`, W - MARGIN, 26, { align: "right" });

    y = 52;

    // ──────────────────────────────────────────────
    // 1. RESUMEN EJECUTIVO
    // ──────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("1. Resumen Ejecutivo", MARGIN, y);
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.line(MARGIN, y, W - MARGIN, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    const summaryText = `Durante el periodo actual, el sistema Equine Lead ha mantenido una base sólida de ${metrics.totalLeads.toLocaleString()} prospectos. ` +
        `La efectividad de conversión de leads 'Hot' se sitúa en un ${metrics.effectivity}%, lo cual indica una segmentación atractiva para ` +
        `productos de alto valor. El valor total proyectado del pipeline asciende a ${formatPipelineValue(metrics.pipelineValue)}. ` +
        `Se observa un score promedio de calidad de ${metrics.averageScore}, sugiriendo una base de datos saludable pero con margen de nutrición (nurturing).`;

    const lines = doc.splitTextToSize(summaryText, COL);
    doc.text(lines, MARGIN, y);
    y += (lines.length * 5) + 8;

    // ──────────────────────────────────────────────
    // 2. TOP LEADS (OPORTUNIDADES DE ALTA PRIORIDAD)
    // ──────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("2. Oportunidades de Alta Prioridad (Top Leads)", MARGIN, y);
    y += 4;
    doc.line(MARGIN, y, W - MARGIN, y);
    y += 8;

    // Header tabla — Ajustado para evitar solapamiento
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(MARGIN, y, COL, 8, "F");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("NOMBRE DEL PROSPECTO", MARGIN + 2, y + 5.5);
    doc.text("SCORE", MARGIN + 85, y + 5.5, { align: "center" });
    doc.text("CLASIFICACIÓN", MARGIN + 120, y + 5.5, { align: "center" });
    doc.text("FECHA CAPTURA", W - MARGIN - 2, y + 5.5, { align: "right" });
    y += 8;

    // Rows
    topLeads.forEach((lead, i) => {
        if (i % 2 === 0) {
            doc.setFillColor(255, 255, 255);
        } else {
            doc.setFillColor(241, 245, 249);
        }
        doc.rect(MARGIN, y, COL, 8, "F");

        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text(lead.userName, MARGIN + 2, y + 5.5);

        doc.setFont("helvetica", "normal");
        doc.text(String(lead.score), MARGIN + 85, y + 5.5, { align: "center" });

        // Color según clasificación
        if (lead.classification.toUpperCase() === "HOT") doc.setTextColor(225, 29, 72); // rose-600
        else if (lead.classification.toUpperCase() === "WARM") doc.setTextColor(217, 119, 6); // amber-600
        else doc.setTextColor(71, 85, 105);

        doc.text(lead.classification.toUpperCase(), MARGIN + 120, y + 5.5, { align: "center" });

        doc.setTextColor(71, 85, 105);
        doc.text(new Date(lead.date).toLocaleDateString(), W - MARGIN - 2, y + 5.5, { align: "right" });
        y += 8;
    });

    y += 12;

    // ──────────────────────────────────────────────
    // 3. ANÁLISIS DE CONVERSIÓN Y LEADS PERDIDOS
    // ──────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("3. Análisis de Conversión y Fuga de Prospectos", MARGIN, y);
    y += 4;
    doc.line(MARGIN, y, W - MARGIN, y);
    y += 10;

    // Funnel Analysis + Lost Rate
    const funnelMax = Math.max(...funnelData.map(d => d.value), 1);
    const totalIn = funnelData[0]?.value || 0;
    const converted = funnelData[funnelData.length - 1]?.value || 0;
    const lostRate = totalIn > 0 ? (((totalIn - converted) / totalIn) * 100).toFixed(1) : "0";

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`Tasa de Abandono (Churn de Pipeline): ${lostRate}%`, MARGIN, y);
    y += 6;

    funnelData.forEach((d, i) => {
        const width = (d.value / funnelMax) * (COL / 2);
        doc.setFillColor(99, 102, 241);
        doc.rect(MARGIN, y, width, 5, "F");
        doc.setFontSize(9);
        doc.text(`${d.name}: ${d.value}`, MARGIN + width + 3, y + 4);
        y += 7;
    });

    y += 12;

    // ──────────────────────────────────────────────
    // 4. ESTRATEGIA Y SIGUIENTES PASOS
    // ──────────────────────────────────────────────
    if (y > 230) { doc.addPage(); y = 25; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("4. Estrategia y Plan de Acción", MARGIN, y);
    y += 4;
    doc.line(MARGIN, y, W - MARGIN, y);
    y += 8;

    const steps = [
        { t: "Recuperación de Leads Fugados:", d: `Se detecta una pérdida del ${lostRate}% entre el contacto inicial y el cierre. Se recomienda re-impactar prospectos 'Warm' que no han tenido interacción en los últimos 7 días.` },
        { t: "Priorizar Leads Hot:", d: "Asignar al equipo de ventas los leads listados en la Sección 2. Tienen una alta probabilidad de cierre inmediato." },
        { t: "Optimización de Embudo:", d: "Reforzar el seguimiento post-consulta para reducir el abandono en la etapa media del funnel." }
    ];

    steps.forEach(step => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`• ${step.t}`, MARGIN, y);
        y += 4.5;
        doc.setFont("helvetica", "normal");
        const subStr = doc.splitTextToSize(step.d, COL - 5);
        doc.text(subStr, MARGIN + 3, y);
        y += (subStr.length * 4) + 4;
    });

    // FOOTER
    const pCount = doc.getNumberOfPages();
    for (let i = 1; i <= pCount; i++) {
        doc.setPage(i);
        doc.setFillColor(30, 41, 59);
        doc.rect(0, 285, W, 12, "F");
        doc.setFontSize(8);
        doc.setTextColor(241, 245, 249);
        doc.text(`EQUINE LEAD CRM — ${reportID}`, MARGIN, 292);
        doc.text(`Página ${i} de ${pCount}`, W - MARGIN, 292, { align: "right" });
    }

    doc.save(`${reportID}.pdf`);
}

function formatPipelineValue(val: number) {
    if (val >= 1000000) return `USD $${(val / 1000000).toFixed(1)} M`;
    return `USD $${val.toLocaleString("en-US")}`;
}
