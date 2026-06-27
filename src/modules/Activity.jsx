import { Wallet, FileText, Ticket, MapPin } from "lucide-react";
import { useStore } from "../store.jsx";
import { Intro } from "../components/Primitives.jsx";

const kindIcon = { money: Wallet, doc: FileText, booking: Ticket, plan: MapPin };

export default function Activity() {
  const { state } = useStore();
  return (
    <div>
      <Intro kicker="Activity">
        Everything that's happened on this trip.
      </Intro>
      <div className="card" style={{ padding: "8px 4px" }}>
        {state.activity.map((a, i) => {
          const Icon = kindIcon[a.kind] || MapPin;
          return (
            <div key={i} style={{ display: "flex", gap: 13, padding: "12px 14px", borderBottom: i < state.activity.length - 1 ? "1px solid var(--lineSoft)" : "none", alignItems: "center" }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: "var(--lineSoft)", display: "grid", placeItems: "center", color: "var(--muted)", flexShrink: 0 }}><Icon size={15} /></span>
              <div style={{ flex: 1, fontSize: 13.5 }}><b style={{ fontWeight: 600 }}>{a.who}</b> <span style={{ color: "var(--muted)" }}>{a.what}</span></div>
              <span style={{ fontSize: 11.5, color: "var(--faint)", whiteSpace: "nowrap" }}>{a.when}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
