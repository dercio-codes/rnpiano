"use client";

import { useState } from "react";
import type { BookingRecord } from "@/lib/demo-bookings";
import { computeTotals, draftFor, eventTitle, formatZar, safeFilename, type InvoiceDraft, type LineItem } from "@/lib/invoice";

export default function InvoiceBuilder({ booking }: { booking: BookingRecord }) {
  const [draft, setDraft] = useState<InvoiceDraft>(() => draftFor(booking));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const totals = computeTotals(draft.items, draft.vat, draft.depositPct);
  const patch = (p: Partial<InvoiceDraft>) => setDraft((d) => ({ ...d, ...p }));
  const patchItem = (id: string, p: Partial<LineItem>) =>
    patch({ items: draft.items.map((i) => (i.id === id ? { ...i, ...p } : i)) });

  const addItem = () =>
    patch({ items: [...draft.items, { id: `item-${Date.now()}`, description: "", qty: 1, unitPrice: 0 }] });
  const removeItem = (id: string) => patch({ items: draft.items.filter((i) => i.id !== id) });

  async function download() {
    setError("");
    if (!draft.items.length || draft.items.some((i) => !i.description.trim())) {
      return setError("Every line item needs a description.");
    }
    if (totals.total <= 0) return setError("Enter a fee above zero before creating the invoice.");
    setBusy(true);
    try {
      const [{ pdf }, { default: InvoicePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./InvoicePdf"),
      ]);
      const blob = await pdf(<InvoicePdf draft={draft} booking={booking} logo={`${window.location.origin}/rnpiano-wordmark.png`} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeFilename(eventTitle(booking))}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Couldn't generate the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="adm-card" aria-labelledby="inv-title">
      <h3 id="inv-title">Create invoice</h3>

      <div className="adm-grid3">
        <label className="field"><span>Invoice no.</span>
          <input value={draft.number} onChange={(e) => patch({ number: e.target.value })} />
        </label>
        <label className="field"><span>Issue date</span>
          <input type="date" value={draft.issueDate} onChange={(e) => patch({ issueDate: e.target.value })} />
        </label>
        <label className="field"><span>Due date</span>
          <input type="date" value={draft.dueDate} onChange={(e) => patch({ dueDate: e.target.value })} />
        </label>
      </div>

      <div className="adm-items">
        {draft.items.map((i, n) => (
          <div className="adm-item" key={i.id}>
            <label className="field adm-desc"><span>Description</span>
              <input value={i.description} onChange={(e) => patchItem(i.id, { description: e.target.value })} />
            </label>
            <label className="field"><span>Qty</span>
              <input type="number" min={1} step={1} value={i.qty} onChange={(e) => patchItem(i.id, { qty: Math.max(1, Number(e.target.value) || 1) })} />
            </label>
            <label className="field"><span>Unit price (R)</span>
              <input type="number" min={0} step="0.01" value={i.unitPrice || ""} placeholder="0.00" onChange={(e) => patchItem(i.id, { unitPrice: Math.max(0, Number(e.target.value) || 0) })} />
            </label>
            <button type="button" className="adm-link" onClick={() => removeItem(i.id)} aria-label={`Remove line ${n + 1}`}>Remove</button>
          </div>
        ))}
        <button type="button" className="adm-link" onClick={addItem}>+ Add line item</button>
      </div>

      <div className="adm-grid3">
        <label className="adm-check"><input type="checkbox" checked={draft.vat} onChange={(e) => patch({ vat: e.target.checked })} /> Add VAT (15%)</label>
        <label className="field"><span>Deposit (%)</span>
          <input type="number" min={0} max={100} value={draft.depositPct} onChange={(e) => patch({ depositPct: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })} />
        </label>
      </div>

      <label className="field"><span>Notes</span>
        <textarea rows={3} value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} />
      </label>

      <dl className="adm-totals">
        <div><dt>Subtotal</dt><dd>{formatZar(totals.subtotal)}</dd></div>
        {draft.vat && <div><dt>VAT</dt><dd>{formatZar(totals.vat)}</dd></div>}
        <div className="adm-total"><dt>Total</dt><dd>{formatZar(totals.total)}</dd></div>
        {totals.deposit > 0 && <div><dt>Deposit due now</dt><dd>{formatZar(totals.deposit)}</dd></div>}
      </dl>

      <div role="alert" className="field-error">{error}</div>
      <button type="button" className="btn" onClick={download} disabled={busy}>
        {busy ? "Generating…" : "Download PDF invoice"}
      </button>
    </section>
  );
}
