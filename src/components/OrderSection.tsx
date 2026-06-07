import { useMemo, useState } from "react";
import { MENU, BUSINESS, type MenuItem } from "@/lib/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, ShoppingBag, X, MessageCircle } from "lucide-react";

type Cart = Record<string, number>;

export function OrderSection() {
  const [cart, setCart] = useState<Cart>({});
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () => MENU.map((m) => ({ ...m, qty: cart[m.id] || 0 })).filter((m) => m.qty > 0),
    [cart],
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
    <section id="menu" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--spice)]">The Menu</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold text-foreground">
            Today's freshly prepared selection
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tap to add items to your basket, then send your order straight to our WhatsApp.
          </p>
        </div>

        {categories.map((cat) => {
          const list = MENU.filter((m) => m.category === cat);
          if (!list.length) return null;
          return (
            <div key={cat} className="mb-14">
              <h3 className="mb-6 text-2xl font-medium text-foreground/80">{cat}</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
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
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-primary px-5 py-4 text-primary-foreground shadow-2xl shadow-primary/30 transition-transform hover:scale-105"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="font-medium">{count} item{count > 1 ? "s" : ""}</span>
          <span className="rounded-full bg-[var(--saffron)] px-3 py-1 text-sm font-semibold text-[var(--ink)]">
            R{total}
          </span>
        </button>
      )}

      {/* Cart drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg rounded-t-3xl md:rounded-3xl bg-card p-6 md:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Your Order</h3>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">Your basket is empty.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                  {items.map((i) => (
                    <div key={i.id} className="flex items-center gap-3 text-sm">
                      <span className="font-medium w-6">{i.qty}×</span>
                      <span className="flex-1">{i.name}</span>
                      <span className="font-semibold">R{i.price * i.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-border pt-4 mb-6 text-lg font-semibold">
                  <span>Total</span>
                  <span>R{total}</span>
                </div>
                <div className="space-y-3 mb-6">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Pickup time, allergies, special requests…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={sendOrder} size="lg" className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Send Order via WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Opens WhatsApp with your order pre-filled. We'll confirm shortly.
                </p>
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
    <div className="group flex gap-4 rounded-2xl bg-card p-4 border border-border/60 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        className="h-28 w-28 md:h-32 md:w-32 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-lg leading-tight">{item.name}</h4>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2 flex-1">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-[var(--spice)]">R{item.price}</span>
            {item.unit && <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>}
          </div>
          {qty === 0 ? (
            <Button size="sm" onClick={onInc} className="rounded-full">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-primary text-primary-foreground">
              <button onClick={onDec} className="p-2 hover:opacity-80">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-medium">{qty}</span>
              <button onClick={onInc} className="p-2 hover:opacity-80">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
