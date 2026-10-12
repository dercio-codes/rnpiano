import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { BookingRecord } from "@/lib/demo-bookings";
import { BUSINESS, VAT_RATE, computeTotals, eventTitle, formatDate, formatZar, type InvoiceDraft } from "@/lib/invoice";

const s = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", color: "#15141a" },
  head: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
  logo: { width: 130, height: 31, marginBottom: 6 },
  sub: { color: "#5e5c67", marginTop: 2 },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", textAlign: "right", color: "#a98b57" },
  right: { textAlign: "right" },
  muted: { color: "#5e5c67" },
  label: { fontSize: 8, color: "#5e5c67", textTransform: "uppercase", marginBottom: 4 },
  cols: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  th: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#15141a", paddingBottom: 6, fontFamily: "Helvetica-Bold" },
  tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e8e6e1", paddingVertical: 8 },
  cDesc: { flex: 1, paddingRight: 8 },
  cQty: { width: 40, textAlign: "right" },
  cPrice: { width: 80, textAlign: "right" },
  cAmt: { width: 90, textAlign: "right" },
  totals: { marginTop: 14, marginLeft: "auto", width: 230 },
  tRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  tTotal: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, marginTop: 4, borderTopWidth: 1, borderTopColor: "#15141a", fontFamily: "Helvetica-Bold", fontSize: 12 },
  foot: { marginTop: 32 },
  footTitle: { fontFamily: "Helvetica-Bold", marginBottom: 4 },
});

export default function InvoicePdf({ draft, booking, logo }: { draft: InvoiceDraft; booking: BookingRecord; logo: string }) {
  const t = computeTotals(draft.items, draft.vat, draft.depositPct);
  return (
    <Document title={eventTitle(booking)} author={BUSINESS.name}>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View>
            {/* react-pdf Image has no alt prop */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={s.logo} src={logo} />
            <Text style={s.sub}>{BUSINESS.trading}</Text>
            {BUSINESS.lines.map((l) => (
              <Text key={l} style={s.muted}>{l}</Text>
            ))}
            {BUSINESS.email ? <Text style={s.muted}>{BUSINESS.email}</Text> : null}
          </View>
          <View>
            <Text style={s.title}>INVOICE</Text>
            <Text style={s.right}>{draft.number}</Text>
            <Text style={[s.right, s.muted]}>Issued {formatDate(draft.issueDate)}</Text>
            <Text style={[s.right, s.muted]}>Due {formatDate(draft.dueDate)}</Text>
          </View>
        </View>

        <View style={s.cols}>
          <View>
            <Text style={s.label}>Billed to</Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{booking.name}</Text>
            <Text style={s.muted}>{booking.email}</Text>
            {booking.phone ? <Text style={s.muted}>{booking.phone}</Text> : null}
          </View>
          <View>
            <Text style={[s.label, s.right]}>Event</Text>
            <Text style={[s.right, { fontFamily: "Helvetica-Bold" }]}>{booking.eventName}</Text>
            <Text style={s.right}>{booking.performance} – {booking.eventType}</Text>
            <Text style={[s.right, s.muted]}>{formatDate(booking.date)}</Text>
            <Text style={[s.right, s.muted]}>{booking.venue}</Text>
          </View>
        </View>

        <View style={s.th}>
          <Text style={s.cDesc}>Description</Text>
          <Text style={s.cQty}>Qty</Text>
          <Text style={s.cPrice}>Unit price</Text>
          <Text style={s.cAmt}>Amount</Text>
        </View>
        {draft.items.map((i) => (
          <View key={i.id} style={s.tr} wrap={false}>
            <Text style={s.cDesc}>{i.description}</Text>
            <Text style={s.cQty}>{i.qty}</Text>
            <Text style={s.cPrice}>{formatZar(i.unitPrice)}</Text>
            <Text style={s.cAmt}>{formatZar(i.qty * i.unitPrice)}</Text>
          </View>
        ))}

        <View style={s.totals} wrap={false}>
          <View style={s.tRow}><Text style={s.muted}>Subtotal</Text><Text>{formatZar(t.subtotal)}</Text></View>
          {draft.vat && (
            <View style={s.tRow}><Text style={s.muted}>VAT ({VAT_RATE * 100}%)</Text><Text>{formatZar(t.vat)}</Text></View>
          )}
          <View style={s.tTotal}><Text>Total</Text><Text>{formatZar(t.total)}</Text></View>
          {t.deposit > 0 && (
            <>
              <View style={s.tRow}><Text style={s.muted}>Deposit due now ({draft.depositPct}%)</Text><Text>{formatZar(t.deposit)}</Text></View>
              <View style={s.tRow}><Text style={s.muted}>Balance</Text><Text>{formatZar(t.balance)}</Text></View>
            </>
          )}
        </View>

        <View style={s.foot} wrap={false}>
          <Text style={s.footTitle}>Payment details</Text>
          {BUSINESS.bank.map((l) => (
            <Text key={l} style={s.muted}>{l}</Text>
          ))}
          <Text style={s.muted}>Payment reference: {draft.number}</Text>
          {draft.notes ? (
            <>
              <Text style={[s.footTitle, { marginTop: 14 }]}>Notes</Text>
              <Text style={s.muted}>{draft.notes}</Text>
            </>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
