import { useMemo, useState } from "react";
import { MENU, BUSINESS, type MenuItem } from "../lib/menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Minus, Plus, ShoppingBag, X, MessageCircle } from "lucide-react";

type Cart = Record<string, number>;

export function OrderSection() {
  const [cart, setCart] = useState<Cart>({});
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () =>
      MENU.map((m) => ({ ...m, qty: cart[m.id] || 0 })).filter((m) => m.qty > 0),
    [cart]
  );
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const inc = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const n = (c[id] || 0) - 1;
      const { [id]: _, ...rest } = c;
      return n <= 0 ? rest : { ...c, [id]: n };
    });

  const sendOrder = () => {
    if (!items.length) return;
    const lines = [
      `*New Order — ${BUSINESS.name}*`,
      "",
      ...items.map((i) => `• ${i.qty} × ${i.name} — R${i.price * i.qty}`),
      "",
      `*Total: R${total}*`,
      "",
      name ? `Name: ${name}` : "",
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const url = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
  };

  const categories = ["Mains", "Snacks", "Desserts"] as const;

  return (
    <section id="menu" style={{ position: 'relative', padding: '5rem 0' }}>
      <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ marginBottom: '2rem', maxWidth: 600 }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--spice)' }}>The Menu</p>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem', fontWeight: 600 }}>Today's freshly prepared selection</h2>
          <p style={{ marginTop: '0.75rem', color: 'var(--muted-foreground)' }}>
            Tap to add items to your basket, then send your order straight to our WhatsApp.
          </p>
        </div>

        {categories.map((cat) => {
          const list = MENU.filter((m) => m.category === cat);
          if (!list.length) return null;
          return (
            <div key={cat} style={{ marginBottom: '3.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 500, color: 'rgba(0,0,0,0.8)' }}>{cat}</h3>
              <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {list.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    qty={cart[item.id] || 0}
                    onInc={() => inc(item.id)}
                    onDec={() => dec(item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating cart button */}
      {count > 0 && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderRadius: 9999,
            backgroundColor: '#3b82f6',
            padding: '12px 18px',
            color: '#fff',
            boxShadow: '0 10px 30px rgba(59,130,246,0.15)',
            cursor: 'pointer'
          }}
        >
          <ShoppingBag style={{ height: 20, width: 20 }} />
          <span style={{ fontWeight: 500 }}>{count} item{count > 1 ? 's' : ''}</span>
          <span style={{ borderRadius: 9999, background: 'var(--saffron)', padding: '6px 10px', fontWeight: 600, color: 'var(--ink)' }}>
            R{total}
          </span>
        </button>
      )}

      {/* Cart drawer */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setOpen(false)}>
          <div
            style={{ width: '100%', maxWidth: 520, borderRadius: 24, background: 'var(--card)', padding: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>Your Order</h3>
              <button onClick={() => setOpen(false)} style={{ borderRadius: 9999, padding: 8, background: 'transparent' }}>
                <X style={{ height: 18, width: 18 }} />
              </button>
            </div>

            {items.length === 0 ? (
              <p style={{ color: 'var(--muted-foreground)', padding: '2rem 0', textAlign: 'center' }}>Your basket is empty.</p>
            ) : (
              <>
                <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 16 }}>
                  {items.map((i) => (
                    <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, padding: '8px 0' }}>
                      <span style={{ fontWeight: 600, width: 28 }}>{i.qty}×</span>
                      <span style={{ flex: 1 }}>{i.name}</span>
                      <span style={{ fontWeight: 600 }}>R{(i.price * i.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 12, marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
                  <span>Total</span>
                  <span>R{total}</span>
                </div>

                <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
                  <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Textarea placeholder="Pickup time, allergies, special requests…" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                </div>

                <Button onClick={sendOrder} size="lg" style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', fontWeight: 700 }}>
                  <MessageCircle style={{ marginRight: 8, height: 18, width: 18 }} />
                  Send Order via WhatsApp
                </Button>

                <p style={{ fontSize: 12, color: 'var(--muted-foreground)', textAlign: 'center', marginTop: 10 }}>Opens WhatsApp with your order pre-filled. We'll confirm shortly.</p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function MenuCard({
  item,
  qty,
  onInc,
  onDec,
}: {
  item: MenuItem;
  qty: number;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, borderRadius: 16, background: 'var(--card)', padding: 12, border: '1px solid rgba(0,0,0,0.06)' }}>
      <img src={item.image} alt={item.name} loading="lazy" style={{ height: 112, width: 112, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h4 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>{item.name}</h4>
        </div>
        <p style={{ marginTop: 6, color: 'var(--muted-foreground)', fontSize: 13 }}>{item.description}</p>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--spice)' }}>R{item.price}</span>
            {item.unit && <span style={{ marginLeft: 8, color: 'var(--muted-foreground)', fontSize: 12 }}>{item.unit}</span>}
          </div>
          {qty === 0 ? (
            <Button size="sm" onClick={onInc} style={{ borderRadius: 9999 }}> 
              <Plus style={{ height: 14, width: 14, marginRight: 6 }} />
              Add
            </Button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 9999, padding: '6px 8px', background: '#efefef' }}>
              <button onClick={onDec} style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Minus style={{ height: 14, width: 14 }} />
              </button>
              <span style={{ width: 28, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <button onClick={onInc} style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Plus style={{ height: 14, width: 14 }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
