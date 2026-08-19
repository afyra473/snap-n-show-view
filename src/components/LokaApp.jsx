import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus, ArrowLeft, Check, X, Coins, Gift, ShoppingBag, Heart, MessageCircle, Ticket,
  Home, User, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, CreditCard, ChevronRight, Wallet, Smartphone, Wifi,
  QrCode, Landmark, PiggyBank, ArrowDownToLine, ArrowUpFromLine, ScanLine, MapPin, Bell, Users, Store, Search, BadgeCheck, Lock, Menu,
  Shield, HelpCircle, Bike, Building2, Mic2, Footprints, BedDouble, Sofa, Hotel, Utensils, PartyPopper, Waves
} from "lucide-react";

/**
 * LOKA — mockup interactif (fichier unique)
 * ------------------------------------------------------------------------
 * Structure du fichier, dans l'ordre :
 *   1. Design tokens & données mock          (constantes, initialPots, marketplaceListings...)
 *   2. Fonctions utilitaires                 (computeCollected, fmt, catIcon...)
 *   3. Composants partagés                   (ScreenHeader, SuccessScreen, AmountInput, PrimaryButton)
 *   4. Écrans de service                     (transfert, QR, agent, recharge, épargne...)
 *   5. Écrans principaux                     (Accueil, Activités, Marketplace, Profil)
 *   6. Composant racine <App/>               (navigation, état global, rendu)
 *
 * Toute donnée (soldes, écots, annonces...) vit en mémoire via useState — il
 * n'y a pas de backend réel. Voir le cahier des charges pour la spec complète.
 * ------------------------------------------------------------------------
 */

// ---------- Tokens (Revolut-like minimal) ----------
const BG = "#FFFFFF";
const INK = "#12151A";       // near-black, primary text & dark surfaces
const CARD = "#F4F4F6";      // light gray surface
const LINE = "#EAEAEE";
const ACCENT = "#0A5EFF";    // single accent blue
const GREEN = "#00B876";
const RED = "#E8483F";
const TEXT = "#12151A";
const MUTED = "#8A8F98";
const AVATAR_COLORS = ["#0A5EFF", "#00B876", "#E8483F", "#8A8F98", "#12151A"];

const FONT = "'Inter', -apple-system, sans-serif";

// ---------- Mock data ----------
const initialPots = [
  {
    id: "p1", title: "Sarah fête son anniversaire", type: "event", icon: "🎂", amount: 150000,
    creator: "Sarah", createdAgo: "il y a 2 h",
    participants: [
      { name: "Sarah", choice: null, color: AVATAR_COLORS[0] },
      { name: "Nadia", choice: null, color: AVATAR_COLORS[1] },
      { name: "Tom", choice: null, color: AVATAR_COLORS[2] },
      { name: "Yanis", choice: null, color: AVATAR_COLORS[3] },
      { name: "Chloé", choice: null, color: AVATAR_COLORS[1] },
      { name: "Nina", choice: null, color: AVATAR_COLORS[0] },
      { name: "Moi", choice: null, color: AVATAR_COLORS[4] },
    ],
    extraContributions: [105000],
    comments: 3, likes: 5,
  },
  {
    id: "p2", title: "Casque audio partagé", type: "product", icon: "🎧", amount: 65000,
    creator: "Yanis", createdAgo: "il y a 5 h",
    participants: [
      { name: "Yanis", choice: "share", color: AVATAR_COLORS[3] },
      { name: "Moi", choice: null, color: AVATAR_COLORS[4] },
      { name: "Chloé", choice: "declined", color: AVATAR_COLORS[1] },
    ],
    comments: 1, likes: 2,
  },
  {
    id: "p3", title: "Concert — places de groupe", type: "event", icon: "🎟️", amount: 150000,
    creator: "Nadia", createdAgo: "hier",
    participants: [
      { name: "Nadia", choice: "share", color: AVATAR_COLORS[1] },
      { name: "Sami", choice: "share", color: AVATAR_COLORS[0] },
      { name: "Tom", choice: "share", color: AVATAR_COLORS[2] },
      { name: "Moi", choice: "share", color: AVATAR_COLORS[4] },
    ],
    comments: 7, likes: 9,
  },
  {
    id: "p4", title: "Soutien à l'équipe féminine", type: "event", icon: "🎁", amount: 200000,
    creator: "Club Étoile", createdAgo: "il y a 1 j", neighborhood: "Akwa",
    participants: [
      { name: "Yanis", choice: null, color: AVATAR_COLORS[3] },
      { name: "Chloé", choice: null, color: AVATAR_COLORS[1] },
      { name: "Tom", choice: null, color: AVATAR_COLORS[2] },
      { name: "Nina", choice: null, color: AVATAR_COLORS[0] },
      { name: "Moi", choice: null, color: AVATAR_COLORS[4] },
    ],
    extraContributions: [86000],
    comments: 5, likes: 14,
  },
];

const contacts = [
  { name: "Sami", color: AVATAR_COLORS[0] },
  { name: "Nadia", color: AVATAR_COLORS[1] },
  { name: "Tom", color: AVATAR_COLORS[2] },
  { name: "Yanis", color: AVATAR_COLORS[3] },
  { name: "Chloé", color: AVATAR_COLORS[1] },
];

const agents = [
  { name: "Agent Sandaga", zone: "Dakar Plateau" },
  { name: "Agent Liberté 6", zone: "Dakar" },
  { name: "Agent Sacré-Cœur", zone: "Dakar" },
  { name: "Agent Almadies", zone: "Dakar" },
];

const initialStories = [
  { name: "Sami", color: AVATAR_COLORS[0], seen: false, slides: [
    { emoji: "🎂", caption: "A lancé l'écot Anniversaire de Léa", sub: "100 000 FCFA à répartir" },
    { emoji: "✅", caption: "A réglé sa part en entier", sub: "Merci Sami" },
  ]},
  { name: "Nadia", color: AVATAR_COLORS[1], seen: false, slides: [
    { emoji: "🎟️", caption: "A ajouté 2 amis au Concert", sub: "150 000 FCFA · 4 participants" },
  ]},
  { name: "Tom", color: AVATAR_COLORS[2], seen: false, slides: [
    { emoji: "💳", caption: "A payé sa part du concert", sub: "37 500 FCFA réglés" },
    { emoji: "🎉", caption: "Écot complété à 100%", sub: "Objectif atteint" },
  ]},
  { name: "Yanis", color: AVATAR_COLORS[3], seen: true, slides: [
    { emoji: "🎧", caption: "A lancé Casque audio partagé", sub: "65 000 FCFA à répartir" },
  ]},
  { name: "Chloé", color: AVATAR_COLORS[1], seen: true, slides: [
    { emoji: "🙅", caption: "A décliné le casque audio", sub: "Pas de souci" },
  ]},
];

// ---------- Helpers ----------
function computeCollected(pot) {
  const shareCount = pot.participants.filter((p) => p.choice === "share").length || 1;
  let collected = 0;
  pot.participants.forEach((p) => {
    if (p.choice === "full") collected += pot.amount;
    else if (p.choice === "share") collected += pot.amount / shareCount;
  });
  if (pot.extraContributions) collected += pot.extraContributions.reduce((a, b) => a + b, 0);
  return Math.min(collected, pot.amount);
}
function myShareAmount(pot) {
  const shareCount = pot.participants.filter((p) => p.choice === "share" || p.choice === null).length || 1;
  return pot.amount / shareCount;
}
function fmt(n) { return Math.round(n).toLocaleString("fr-FR"); }

const CAT_ICON_MAP = {
  "📱": Smartphone, "🏠": Home, "🎉": PartyPopper, "🚲": Bike, "🏢": Building2,
  "🎤": Mic2, "👟": Footprints, "🛏️": BedDouble, "🛋️": Sofa, "🏨": Hotel,
  "🍔": Utensils, "🍲": Utensils, "🍛": Utensils, "🏖️": Waves, "🏊": Waves,
  "🎧": Smartphone, "🧺": Store,
};
function catIcon(emoji, size = 18, color) {
  const Cmp = CAT_ICON_MAP[emoji] || Store;
  return <Cmp size={size} color={color} />;
}

// ---------- Atoms ----------
// Deterministic "random" photo for a given name, so the same person always
// gets the same face across the app. Falls back to colored initials if the
// image fails to load (e.g. no network) — see Avatar below.
// Deterministic "random" face for a given name, so the same person always
// looks the same across the app — generated fully in SVG (no network calls,
// so it never depends on external image hosts being reachable).
function nameSeed(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

const SKIN_TONES = ["#F1C27D", "#E0AC69", "#C68642", "#8D5524", "#FFDBAC", "#D8A272"];
const HAIR_SHAPES = [
  "M4 30 a28 28 0 0 1 56 0 v-4 a28 28 0 0 0 -56 0 z",           // full short hair
  "M4 26 a28 28 0 0 1 56 0 q-6 -12 -28 -8 q-22 -4 -28 8 z",      // side-parted
  "M2 24 a30 30 0 0 1 60 0 q-4 4 -12 2 q-4 -8 -18 -6 q-14 -2 -18 6 q-8 2 -12 -2 z", // curly/voluminous
  null,                                                          // bald
];

function FaceAvatar({ seed, size }) {
  const skin = SKIN_TONES[seed % SKIN_TONES.length];
  const hair = HAIR_SHAPES[Math.floor(seed / 7) % HAIR_SHAPES.length];
  const hairColor = ["#2B2118", "#4A3222", "#1C1C1C", "#6B4423", "#3B3024"][Math.floor(seed / 3) % 5];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: "block" }}>
      <circle cx="32" cy="32" r="32" fill={skin} />
      {hair && <path d={hair} fill={hairColor} />}
      <circle cx="22" cy="35" r="2.6" fill="#2B2118" />
      <circle cx="42" cy="35" r="2.6" fill="#2B2118" />
      <path d="M23 46 q9 7 18 0" stroke="#2B2118" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Avatar({ name, color, size = 32, ring }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", overflow: "hidden",
      boxShadow: ring ? `0 0 0 2px ${BG}, 0 0 0 3.5px ${ACCENT}` : "none",
      background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <FaceAvatar seed={nameSeed(name)} size={size} />
    </div>
  );
}

function StatusPill({ choice }) {
  const map = {
    full: { label: "règle tout", bg: `${ACCENT}14`, fg: ACCENT },
    share: { label: "sa part", bg: `${GREEN}14`, fg: GREEN },
    declined: { label: "passe", bg: `${RED}14`, fg: RED },
    null: { label: "en attente", bg: CARD, fg: MUTED },
  };
  const s = map[choice ?? "null"];
  return (
    <span style={{
      background: s.bg, color: s.fg, fontFamily: FONT, fontSize: 11.5, letterSpacing: "0",
      padding: "4px 9px", borderRadius: 8, fontWeight: 600, whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}

function ScreenHeader({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px 8px" }}>
      {onBack && (
        <button onClick={onBack} style={{ background: CARD, border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: TEXT, marginLeft: -4 }}>
          <ArrowLeft size={16} />
        </button>
      )}
      <span style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, color: TEXT, letterSpacing: "-0.01em" }}>{title}</span>
    </div>
  );
}

// Confirmation screen shown after any wallet operation succeeds (payment, transfer,
// recharge, contribution...). Centralized so every flow shares the same look & feel.
function SuccessScreen({ title, subtitle, onBack, backLabel = "Retour à l'accueil" }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "70px 20px", textAlign: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: `${GREEN}14`, color: GREEN, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Check size={26} />
      </div>
      <div style={{ fontFamily: FONT, fontSize: 19, color: TEXT, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.01em" }}>
        {title}
      </div>
      <div style={{ color: MUTED, fontFamily: FONT, fontSize: 15, marginBottom: 32, fontVariantNumeric: "tabular-nums" }}>
        {subtitle}
      </div>
      <button onClick={onBack} style={{
        padding: "13px 26px", borderRadius: 14, border: "none", background: INK, color: "#fff",
        fontFamily: FONT, fontWeight: 600, fontSize: 14, cursor: "pointer",
      }}>{backLabel}</button>
    </div>
  );
}

// Full-width amount field with a trailing "FCFA" unit label. Used by every screen
// that asks the person to type or preview a monetary amount.
function AmountInput({ value, onChange, placeholder = "0", autoFocus = false }) {
  return (
    <div style={{ position: "relative", margin: "8px 0 28px" }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: "100%", background: CARD, border: "none", borderRadius: 14, padding: "13px 60px 13px 14px",
          color: TEXT, fontFamily: FONT, fontSize: 17, fontWeight: 600, outline: "none", boxSizing: "border-box", fontVariantNumeric: "tabular-nums",
        }}
      />
      <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: MUTED, fontFamily: FONT, fontSize: 13 }}>FCFA</span>
    </div>
  );
}

// Full-width primary call-to-action button. Automatically renders a disabled state
// (muted colors, no pointer) whenever `disabled` is true.
function PrimaryButton({ disabled, onClick, children }) {
  return (
    <button disabled={disabled} onClick={onClick} style={{
      width: "100%", padding: "15px 0", borderRadius: 16, border: "none",
      background: disabled ? LINE : ACCENT, color: disabled ? "#B7BAC0" : "#fff",
      fontFamily: FONT, fontWeight: 600, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer",
    }}>{children}</button>
  );
}

// ---------- Pot card ----------
function PotCard({ pot, onOpen }) {
  const collected = computeCollected(pot);
  const pct = Math.round((collected / pot.amount) * 100);
  const me = pot.participants.find((p) => p.name === "Moi");

  return (
    <div onClick={() => onOpen(pot.id)} className="lk-pressable" style={{
      background: CARD, borderRadius: 20, border: `1px solid ${LINE}`, padding: "18px 18px 16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            {pot.icon}
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 15.5, color: TEXT, fontWeight: 600, marginBottom: 2, letterSpacing: "-0.01em" }}>{pot.title}</div>
            <div style={{ fontSize: 12.5, color: MUTED, fontFamily: FONT }}>{pot.creator} · {pot.createdAgo}</div>
          </div>
        </div>
        {me && <StatusPill choice={me.choice} />}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: FONT, fontSize: 22, color: TEXT, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
          {fmt(collected)} FCFA
        </span>
        <span style={{ fontFamily: FONT, fontSize: 13, color: MUTED, fontVariantNumeric: "tabular-nums" }}>sur {fmt(pot.amount)} FCFA</span>
      </div>
      <div style={{ height: 4, background: BG, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 999 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
        <div style={{ display: "flex" }}>
          {pot.participants.slice(0, 4).map((p, i) => (
            <div key={p.name} style={{ marginLeft: i === 0 ? 0 : -8 }}>
              <Avatar name={p.name} color={p.color} size={24} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, color: MUTED, fontSize: 12.5, fontFamily: FONT }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Heart size={13} /> {pot.likes}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={13} /> {pot.comments}</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Pot detail ----------
function PotDetail({ pot, onBack, onChoose }) {
  const collected = computeCollected(pot);
  const pct = Math.round((collected / pot.amount) * 100);
  const me = pot.participants.find((p) => p.name === "Moi");
  const share = myShareAmount(pot);

  const choices = [
    { key: "share", label: "Ma part", sub: `${fmt(share)} FCFA`, icon: <Coins size={18} />, color: GREEN },
    { key: "full", label: "Je règle tout", sub: `${fmt(pot.amount)} FCFA`, icon: <Gift size={18} />, color: ACCENT },
    { key: "declined", label: "Je passe", sub: "0 FCFA", icon: <X size={18} />, color: RED },
  ];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <ScreenHeader title="Écot" onBack={onBack} />

      <div style={{ margin: "8px 20px 22px", background: INK, borderRadius: 24, padding: "26px 22px", textAlign: "center" }}>
        <div style={{ fontSize: 34, marginBottom: 10 }}>{pot.icon}</div>
        <div style={{ fontFamily: FONT, fontSize: 19, color: "#fff", fontWeight: 700, marginBottom: 3, letterSpacing: "-0.01em" }}>{pot.title}</div>
        <div style={{ fontSize: 12.5, color: "#9BA1AB", fontFamily: FONT, marginBottom: 20 }}>
          {pot.type === "event" ? "Événement" : "Produit"} · {pot.creator}
        </div>
        <div style={{ fontFamily: FONT, fontSize: 32, color: "#fff", fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
          {collected.toFixed(0)} <span style={{ color: "#9BA1AB", fontSize: 18, fontWeight: 500 }}>/ {fmt(pot.amount)} FCFA</span>
        </div>
        <div style={{ height: 5, background: "#ffffff22", borderRadius: 999, overflow: "hidden", marginTop: 14 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 999 }} />
        </div>
      </div>

      <div style={{ margin: "0 20px 22px" }}>
        <div style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: MUTED, marginBottom: 10 }}>Ton choix</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {choices.map((c) => {
            const active = me?.choice === c.key;
            return (
              <button key={c.key} onClick={() => onChoose(pot.id, c.key)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px",
                borderRadius: 16, border: active ? `1.5px solid ${c.color}` : "1.5px solid transparent",
                background: active ? `${c.color}0F` : CARD, cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: c.color }}>{c.icon}</div>
                  <span style={{ color: TEXT, fontFamily: FONT, fontSize: 14.5, fontWeight: 500 }}>{c.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{c.sub}</span>
                  {active && <Check size={16} color={c.color} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ margin: "0 20px 30px" }}>
        <div style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: MUTED, marginBottom: 10 }}>
          Participants ({pot.participants.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {pot.participants.map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={p.name} color={p.color} size={30} />
                <span style={{ color: TEXT, fontFamily: FONT, fontSize: 14 }}>{p.name}</span>
              </div>
              <StatusPill choice={p.choice} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Create pot ----------
function CreatePot({ onCreate, onCancel, initial }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [amount, setAmount] = useState(initial?.amount ? String(initial.amount) : "");
  const [type, setType] = useState(initial?.type || "product");
  const [icon, setIcon] = useState(initial?.icon || "🎉");
  const icons = ["🎉", "🎂", "🎧", "🎟️", "🍕", "✈️", "🏠", "🎮"];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Nouvel écot" onBack={onCancel} />
      <div style={{ fontSize: 13.5, color: MUTED, fontFamily: FONT, margin: "0 0 24px" }}>
        Chacun choisit ensuite comment il contribue.
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {icons.map((ic) => (
          <button key={ic} onClick={() => setIcon(ic)} style={{
            width: 44, height: 44, fontSize: 20, borderRadius: 14, border: "none",
            background: icon === ic ? INK : CARD, cursor: "pointer",
          }}>{ic}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ k: "event", label: "Événement", icon: <Ticket size={14} /> }, { k: "product", label: "Produit", icon: <ShoppingBag size={14} /> }].map((t) => (
          <button key={t.k} onClick={() => setType(t.k)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0",
            borderRadius: 14, border: "none", background: type === t.k ? INK : CARD,
            color: type === t.k ? "#fff" : MUTED, fontFamily: FONT, fontSize: 13.5, fontWeight: 500, cursor: "pointer",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <label style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT }}>Titre</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Week-end à Deauville" style={{
        width: "100%", background: CARD, border: "none", borderRadius: 14, padding: "13px 14px",
        color: TEXT, fontFamily: FONT, fontSize: 15, margin: "8px 0 18px", outline: "none", boxSizing: "border-box",
      }} />

      <label style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT }}>Montant total</label>
      <AmountInput value={amount} onChange={setAmount} />

      <PrimaryButton disabled={!title || !amount} onClick={() => onCreate({ title, amount: parseFloat(amount), type, icon })}>Lancer l'écot</PrimaryButton>
    </div>
  );
}

// ---------- Services sheet (opened by the "+") ----------
function ServicesSheet({ onClose, onPick }) {
  const services = [
    { key: "transfer", label: "Transfert d'argent", sub: "envoyer ou recevoir", icon: <ArrowLeftRight size={19} /> },
    { key: "qr", label: "Code QR", sub: "payer ou recevoir en scannant", icon: <QrCode size={19} /> },
    { key: "agent", label: "Dépôt & retrait", sub: "chez un agent Loka", icon: <Landmark size={19} /> },
    { key: "recharge", label: "Crédit téléphonique & internet", sub: "recharger un forfait", icon: <Smartphone size={19} /> },
    { key: "savings", label: "Épargne", sub: "mettre de côté", icon: <PiggyBank size={19} /> },
    { key: "purchase", label: "Autres achats", sub: "payer un commerçant", icon: <ShoppingBag size={19} /> },
    { key: "pot", label: "Nouvel écot", sub: "à plusieurs", icon: <Ticket size={19} /> },
  ];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#12151A66", zIndex: 40, display: "flex", alignItems: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 480, margin: "0 auto", background: BG, borderRadius: "28px 28px 0 0",
        padding: "12px 20px 30px", animation: "slideUp 0.2s ease", maxHeight: "80vh", overflowY: "auto",
        boxShadow: "0 -8px 30px rgba(18,21,26,0.16)",
      }}>
        <div style={{ width: 36, height: 4, background: LINE, borderRadius: 999, margin: "6px auto 20px" }} />
        <div style={{ fontFamily: FONT, fontSize: 17, color: TEXT, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.01em" }}>
          Services
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {services.map((a) => (
            <button key={a.key} onClick={() => onPick(a.key)} style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, padding: "18px 16px",
              borderRadius: 18, border: "none", background: CARD, cursor: "pointer", textAlign: "left",
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {a.icon}
              </div>
              <div>
                <div style={{ color: TEXT, fontFamily: FONT, fontSize: 14.5, fontWeight: 600, lineHeight: 1.25 }}>{a.label}</div>
                <div style={{ color: MUTED, fontFamily: FONT, fontSize: 11.5, marginTop: 2 }}>{a.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- QR code (payer / recevoir) ----------
function QRFlow({ onBack, onConfirm }) {
  const [mode, setMode] = useState("scan");
  const [amount, setAmount] = useState("");
  const [scanned, setScanned] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return <SuccessScreen title="Paiement effectué" subtitle={`${fmt(parseFloat(amount))} FCFA · Code QR`} onBack={onBack} />;
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Code QR" onBack={onBack} />
      <div style={{ display: "flex", gap: 8, margin: "10px 0 22px" }}>
        {[{ k: "scan", label: "Scanner" }, { k: "show", label: "Mon code" }].map((t) => (
          <button key={t.k} onClick={() => { setMode(t.k); setScanned(false); }} style={{
            flex: 1, padding: "12px 0", borderRadius: 14, border: "none",
            background: mode === t.k ? INK : CARD, color: mode === t.k ? "#fff" : MUTED,
            fontFamily: FONT, fontSize: 13.5, fontWeight: 500, cursor: "pointer",
          }}>{t.label}</button>
        ))}
      </div>

      {mode === "scan" ? (
        !scanned ? (
          <>
            <div style={{
              aspectRatio: "1", background: CARD, borderRadius: 20, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 22, border: `2px dashed ${LINE}`,
            }}>
              <ScanLine size={40} color={MUTED} />
              <span style={{ color: MUTED, fontFamily: FONT, fontSize: 12.5, textAlign: "center", padding: "0 30px" }}>
                Vise le code QR d'un commerçant ou d'un ami
              </span>
            </div>
            <button onClick={() => setScanned(true)} style={{
              width: "100%", padding: "15px 0", borderRadius: 16, border: "none", background: ACCENT, color: "#fff",
              fontFamily: FONT, fontWeight: 600, fontSize: 15, cursor: "pointer",
            }}>Simuler un scan</button>
          </>
        ) : (
          <>
            <div style={{ background: CARD, borderRadius: 18, border: `1px solid ${LINE}`, padding: "16px 18px", marginBottom: 22, display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name="Boutique Kandé" color={AVATAR_COLORS[0]} size={38} />
              <div>
                <div style={{ fontFamily: FONT, fontSize: 14.5, color: TEXT, fontWeight: 600 }}>Boutique Kandé</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED }}>Code marchand vérifié</div>
              </div>
            </div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT }}>Montant</label>
            <AmountInput value={amount} onChange={setAmount} />
            <PrimaryButton disabled={!amount} onClick={() => { onConfirm(parseFloat(amount), "Paiement QR · Boutique Kandé"); setDone(true); }}>Payer</PrimaryButton>
          </>
        )
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "100%", aspectRatio: "1", background: CARD, borderRadius: 20, border: `1px solid ${LINE}`, display: "grid",
            gridTemplateColumns: "repeat(9, 1fr)", gap: 3, padding: 24, marginBottom: 18, boxSizing: "border-box",
          }}>
            {Array.from({ length: 81 }).map((_, i) => (
              <div key={i} style={{ background: (i * 47 + i * i) % 5 === 0 || i % 11 === 0 ? INK : "transparent", borderRadius: 1 }} />
            ))}
          </div>
          <div style={{ fontFamily: FONT, fontSize: 15, color: TEXT, fontWeight: 600, marginBottom: 4 }}>Moi</div>
          <div style={{ fontFamily: FONT, fontSize: 12.5, color: MUTED }}>Présente ce code pour recevoir un paiement</div>
        </div>
      )}
    </div>
  );
}

// ---------- Agent (dépôt / retrait) ----------
function AgentFlow({ onBack, onConfirm }) {
  const [op, setOp] = useState("deposit");
  const [agent, setAgent] = useState(null);
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const canConfirm = agent && amount;

  if (done) {
    return <SuccessScreen title={op === "deposit" ? "Dépôt effectué" : "Retrait effectué"} subtitle={`${fmt(parseFloat(amount))} FCFA · ${agent?.name}`} onBack={onBack} />;
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Dépôt & retrait" onBack={onBack} />
      <div style={{ display: "flex", gap: 8, margin: "10px 0 22px" }}>
        {[{ k: "deposit", label: "Dépôt", icon: <ArrowDownToLine size={14} /> }, { k: "withdraw", label: "Retrait", icon: <ArrowUpFromLine size={14} /> }].map((t) => (
          <button key={t.k} onClick={() => setOp(t.k)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0",
            borderRadius: 14, border: "none", background: op === t.k ? INK : CARD,
            color: op === t.k ? "#fff" : MUTED, fontFamily: FONT, fontSize: 13.5, fontWeight: 500, cursor: "pointer",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT, marginBottom: 10 }}>Agent le plus proche</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 26 }}>
        {agents.map((ag) => (
          <button key={ag.name} onClick={() => setAgent(ag)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 16,
            border: agent?.name === ag.name ? `1.5px solid ${ACCENT}` : "1.5px solid transparent",
            background: agent?.name === ag.name ? `${ACCENT}0F` : CARD, cursor: "pointer", textAlign: "left",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Landmark size={16} />
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 600 }}>{ag.name}</div>
              <div style={{ fontFamily: FONT, fontSize: 11.5, color: MUTED }}>{ag.zone}</div>
            </div>
          </button>
        ))}
      </div>

      <label style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT }}>Montant</label>
      <AmountInput value={amount} onChange={setAmount} />

      <PrimaryButton disabled={!canConfirm} onClick={() => { onConfirm(op, parseFloat(amount), agent); setDone(true); }}>{op === "deposit" ? "Déposer" : "Retirer"}</PrimaryButton>
    </div>
  );
}

// ---------- Épargne ----------
function SavingsFlow({ savings, onBack, onAdd }) {
  const [amount, setAmount] = useState("");
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Épargne" onBack={onBack} />
      <div style={{ background: INK, borderRadius: 24, padding: "26px 22px", margin: "10px 0 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10, color: "#9BA1AB", fontSize: 13, fontFamily: FONT }}>
          <PiggyBank size={14} /> Épargne Loka
        </div>
        <div style={{ fontFamily: FONT, fontSize: 32, color: "#fff", fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
          {fmt(savings)} <span style={{ fontSize: 18, color: "#9BA1AB", fontWeight: 500 }}>FCFA</span>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: GREEN, marginTop: 10 }}>Rémunérée à 5 % par an</div>
      </div>

      <label style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT }}>Ajouter à l'épargne</label>
      <AmountInput value={amount} onChange={setAmount} />
      <div style={{ fontSize: 12, color: MUTED, fontFamily: FONT, marginBottom: 22 }}>Prélevé sur ton solde disponible</div>

      <PrimaryButton disabled={!amount} onClick={() => { onAdd(parseFloat(amount)); setAmount(""); }}>Mettre de côté</PrimaryButton>
    </div>
  );
}

// ---------- Transfer choice (Envoyer / Recevoir) ----------
function TransferChoice({ onBack, onPick }) {
  const options = [
    { key: "send", label: "Envoyer", sub: "à un contact", icon: <ArrowUpRight size={20} /> },
    { key: "receive", label: "Recevoir", sub: "demander de l'argent", icon: <ArrowDownLeft size={20} /> },
  ];
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Transfert d'argent" onBack={onBack} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        {options.map((o) => (
          <button key={o.key} onClick={() => onPick(o.key)} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "18px 16px", borderRadius: 18,
            border: "none", background: CARD, cursor: "pointer", textAlign: "left",
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {o.icon}
            </div>
            <div>
              <div style={{ color: TEXT, fontFamily: FONT, fontSize: 15, fontWeight: 600 }}>{o.label}</div>
              <div style={{ color: MUTED, fontFamily: FONT, fontSize: 12 }}>{o.sub}</div>
            </div>
            <ChevronRight size={16} color={MUTED} style={{ marginLeft: "auto" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Recharge (crédit téléphonique & internet) ----------
function RechargeFlow({ onBack, onConfirm }) {
  const [category, setCategory] = useState("phone");
  const [operator, setOperator] = useState(null);
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState(null);
  const [done, setDone] = useState(false);

  const operators = [
    { name: "Orange", color: "#FF7900" },
    { name: "Free", color: "#CD0067" },
    { name: "Expresso", color: "#00A651" },
    { name: "MTN", color: "#FFCB05" },
  ];
  const presets = [500, 1000, 2000, 5000];
  const canConfirm = operator && number && amount;

  if (done) {
    return <SuccessScreen title="Recharge effectuée" subtitle={`${fmt(amount)} FCFA · ${operator?.name} · ${number}`} onBack={onBack} />;
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Crédit téléphonique & internet" onBack={onBack} />

      <div style={{ display: "flex", gap: 8, margin: "10px 0 22px" }}>
        {[{ k: "phone", label: "Téléphone", icon: <Smartphone size={14} /> }, { k: "internet", label: "Internet", icon: <Wifi size={14} /> }].map((t) => (
          <button key={t.k} onClick={() => setCategory(t.k)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0",
            borderRadius: 14, border: "none", background: category === t.k ? INK : CARD,
            color: category === t.k ? "#fff" : MUTED, fontFamily: FONT, fontSize: 13.5, fontWeight: 500, cursor: "pointer",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT, marginBottom: 10 }}>Opérateur</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
        {operators.map((op) => (
          <button key={op.name} onClick={() => setOperator(op)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14,
            border: operator?.name === op.name ? `1.5px solid ${op.color}` : "1.5px solid transparent",
            background: operator?.name === op.name ? `${op.color}0F` : CARD, cursor: "pointer",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: op.color }} />
            <span style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 500 }}>{op.name}</span>
          </button>
        ))}
      </div>

      <label style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT }}>
        {category === "phone" ? "Numéro de téléphone" : "Numéro de box / abonné"}
      </label>
      <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder={category === "phone" ? "77 123 45 67" : "Ex. AB123456"} style={{
        width: "100%", background: CARD, border: "none", borderRadius: 14, padding: "13px 14px",
        color: TEXT, fontFamily: FONT, fontSize: 15, margin: "8px 0 22px", outline: "none", boxSizing: "border-box",
      }} />

      <div style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT, marginBottom: 10 }}>Montant</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 28 }}>
        {presets.map((p) => (
          <button key={p} onClick={() => setAmount(p)} style={{
            padding: "14px 0", borderRadius: 14, border: amount === p ? `1.5px solid ${ACCENT}` : "1.5px solid transparent",
            background: amount === p ? `${ACCENT}0F` : CARD, color: TEXT, fontFamily: FONT, fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontVariantNumeric: "tabular-nums",
          }}>{fmt(p)} FCFA</button>
        ))}
      </div>

      <PrimaryButton disabled={!canConfirm} onClick={() => { onConfirm(amount, `${category === "phone" ? "Recharge" : "Internet"} ${operator?.name}`); setDone(true); }}>Recharger</PrimaryButton>
    </div>
  );
}

// ---------- Send / Receive / Pay flow ----------
function TransactionFlow({ mode, onBack, onConfirm }) {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [done, setDone] = useState(false);

  const config = {
    send: { title: "Envoyer de l'argent", verb: "Envoyer", needsContact: true },
    receive: { title: "Demander de l'argent", verb: "Demander", needsContact: true },
    pay: { title: "Payer un commerçant", verb: "Payer", needsContact: false },
  }[mode];

  const canConfirm = amount && (config.needsContact ? selected : merchant);

  if (done) {
    return <SuccessScreen title={`${config.verb} effectué`} subtitle={`${fmt(parseFloat(amount))} FCFA ${config.needsContact ? `· ${selected?.name}` : `· ${merchant}`}`} onBack={onBack} />;
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title={config.title} onBack={onBack} />

      {config.needsContact ? (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT, margin: "10px 0 10px" }}>Contact</div>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6, marginBottom: 24 }}>
            {contacts.map((c) => (
              <button key={c.name} onClick={() => setSelected(c)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", flexShrink: 0,
              }}>
                <div style={{ boxShadow: selected?.name === c.name ? `0 0 0 2.5px ${ACCENT}` : "none", borderRadius: "50%" }}>
                  <Avatar name={c.name} color={c.color} size={50} />
                </div>
                <span style={{ fontSize: 11.5, color: selected?.name === c.name ? TEXT : MUTED, fontFamily: FONT, fontWeight: selected?.name === c.name ? 600 : 400 }}>{c.name}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT }}>Commerçant</label>
          <input value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="Ex. Boulangerie Martin" style={{
            width: "100%", background: CARD, border: "none", borderRadius: 14, padding: "13px 14px",
            color: TEXT, fontFamily: FONT, fontSize: 15, margin: "8px 0 24px", outline: "none", boxSizing: "border-box",
          }} />
        </>
      )}

      <label style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT }}>Montant</label>
      <AmountInput value={amount} onChange={setAmount} />

      <PrimaryButton disabled={!canConfirm} onClick={() => { onConfirm(mode, parseFloat(amount)); setDone(true); }}>{config.verb}</PrimaryButton>
    </div>
  );
}

// ---------- Story bar + viewer ----------
function StoryBar({ stories, onOpen }) {
  return (
    <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "10px 20px 20px" }}>
      {stories.map((s, i) => (
        <button key={s.name} onClick={() => onOpen(i)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", flexShrink: 0,
        }}>
          <div style={{ opacity: s.seen ? 0.4 : 1 }}>
            <Avatar name={s.name} color={s.color} size={54} ring={!s.seen} />
          </div>
          <span style={{ fontSize: 11.5, color: s.seen ? MUTED : TEXT, fontFamily: FONT, fontWeight: s.seen ? 400 : 500 }}>{s.name}</span>
        </button>
      ))}
    </div>
  );
}

function StoryViewer({ stories, startIndex, onClose, onSeen }) {
  const [userIdx, setUserIdx] = useState(startIndex);
  const [slideIdx, setSlideIdx] = useState(0);
  const timerRef = useRef(null);
  const DURATION = 3500;
  const user = stories[userIdx];
  const slide = user.slides[slideIdx];

  useEffect(() => {
    onSeen(userIdx);
    timerRef.current = setTimeout(() => advance(1), DURATION);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdx, slideIdx]);

  function advance(dir) {
    clearTimeout(timerRef.current);
    if (dir === 1) {
      if (slideIdx < user.slides.length - 1) setSlideIdx(slideIdx + 1);
      else if (userIdx < stories.length - 1) { setUserIdx(userIdx + 1); setSlideIdx(0); }
      else onClose();
    } else {
      if (slideIdx > 0) setSlideIdx(slideIdx - 1);
      else if (userIdx > 0) { setUserIdx(userIdx - 1); setSlideIdx(0); }
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: INK, zIndex: 50, display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 480, width: "100%", margin: "0 auto", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ display: "flex", gap: 4, padding: "14px 14px 0" }}>
          {user.slides.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, background: "#ffffff2E", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "#fff", borderRadius: 999,
                width: i < slideIdx ? "100%" : i > slideIdx ? "0%" : "100%",
                animation: i === slideIdx ? `growBar ${DURATION}ms linear forwards` : "none",
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px" }}>
          <Avatar name={user.name} color={user.color} size={30} />
          <span style={{ color: "#fff", fontFamily: FONT, fontWeight: 600, fontSize: 14 }}>{user.name}</span>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "#9BA1AB", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, position: "relative" }}>
          <div style={{ fontSize: 76, marginBottom: 24 }}>{slide.emoji}</div>
          <div style={{ fontFamily: FONT, fontSize: 20, color: "#fff", fontWeight: 700, textAlign: "center", marginBottom: 8, letterSpacing: "-0.01em" }}>
            {slide.caption}
          </div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: "#9BA1AB" }}>{slide.sub}</div>
          <div style={{ position: "absolute", inset: 0, display: "flex" }}>
            <div onClick={() => advance(-1)} style={{ flex: 1, cursor: "pointer" }} />
            <div onClick={() => advance(1)} style={{ flex: 1, cursor: "pointer" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Home ----------
function HomeScreen({ balance, activity, pots, onOpenActions, onOpenPot, onOpenHistory }) {
  const topEcots = [...pots].sort((a, b) => computeCollected(b) / b.amount - computeCollected(a) / a.amount).slice(0, 2);
  const topActivities = [...nearbyPlaces].sort((a, b) => b.interest - a.interest).slice(0, 2);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 110px" }}>
      <div style={{
        background: INK, borderRadius: 18, padding: "14px 18px", margin: "14px 0 18px", boxShadow: "0 4px 14px rgba(18,21,26,0.14)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#9BA1AB", fontSize: 11.5, fontFamily: FONT }}>
          <Wallet size={12} /> Solde disponible
        </div>
        <div style={{ fontFamily: FONT, fontSize: 21, color: "#fff", fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
          {fmt(balance)} <span style={{ fontSize: 13, color: "#9BA1AB", fontWeight: 500 }}>FCFA</span>
        </div>
      </div>

      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: TEXT, margin: "0 2px 1px", letterSpacing: "-0.01em" }}>
        À découvrir
      </div>
      <div style={{ fontFamily: FONT, fontSize: 11.5, color: MUTED, margin: "0 2px 10px" }}>
        Écots et activités intéressantes
      </div>
      <div className="hscroll" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "0 -20px 22px", padding: "0 20px 4px" }}>
        {topEcots.map((pot) => {
          const collected = computeCollected(pot);
          const pct = Math.round((collected / pot.amount) * 100);
          return (
            <button key={pot.id} onClick={() => onOpenPot(pot.id)} style={{
              flexShrink: 0, width: 128, textAlign: "left", background: CARD, border: "none", borderRadius: 14,
              padding: "10px 10px 11px", cursor: "pointer",
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                {pot.participants.slice(0, 3).map((part, i) => (
                  <div key={part.name} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}>
                    <Avatar name={part.name} color={part.color} size={20} />
                  </div>
                ))}
                {pot.participants.length > 3 && (
                  <div style={{
                    marginLeft: -8, width: 20, height: 20, borderRadius: "50%", background: BG,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: FONT, fontSize: 8.5, fontWeight: 700, color: MUTED,
                  }}>+{pot.participants.length - 3}</div>
                )}
              </div>
              <div style={{
                fontFamily: FONT, fontSize: 12, color: TEXT, fontWeight: 600, marginBottom: 7, lineHeight: 1.2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{pot.title}</div>
              <div style={{ height: 3, background: BG, borderRadius: 999, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 999 }} />
              </div>
              <div style={{ fontFamily: FONT, fontSize: 9.5, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{pct}% financé</div>
            </button>
          );
        })}
        {topActivities.map((p) => (
          <div key={p.id} style={{
            flexShrink: 0, width: 128, textAlign: "left", background: CARD, borderRadius: 14, border: `1px solid ${LINE}`, padding: "10px 10px 11px",
          }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", background: BG,
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
              }}>{catIcon(p.emoji, 12)}</div>
              <div style={{
                marginLeft: -7, width: 22, height: 22, borderRadius: "50%", background: "#9C6FC9",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              }}><Users size={11} /></div>
            </div>
            <div style={{
              fontFamily: FONT, fontSize: 12, color: TEXT, fontWeight: 600, marginBottom: 4, lineHeight: 1.2,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{p.name}</div>
            <div style={{
              fontFamily: FONT, fontSize: 9.5, color: MUTED,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{p.distance} · {p.date}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 2px 10px" }}>
        <span style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: MUTED }}>Activité récente</span>
        {activity.length > 0 && (
          <button onClick={onOpenHistory} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontFamily: FONT, fontSize: 12, fontWeight: 600, color: ACCENT,
          }}>Voir tout</button>
        )}
      </div>
      <button
        onClick={activity.length > 0 ? onOpenHistory : undefined}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: CARD, borderRadius: 14, border: `1px solid ${LINE}`,
          border: "none", padding: "12px 12px", cursor: activity.length > 0 ? "pointer" : "default", textAlign: "left",
        }}
      >
        {activity.length === 0 ? (
          <span style={{ color: MUTED, fontFamily: FONT, fontSize: 13, lineHeight: 1.4 }}>
            Rien pour l'instant — utilise le bouton + pour envoyer, recevoir ou payer.
          </span>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: BG,
                color: activity[0].type === "in" ? GREEN : TEXT, flexShrink: 0,
              }}>
                {activity[0].type === "in" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: TEXT, fontFamily: FONT, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activity[0].label}</div>
                <div style={{ color: MUTED, fontFamily: FONT, fontSize: 11 }}>{activity[0].when}</div>
              </div>
            </div>
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: activity[0].type === "in" ? GREEN : TEXT, fontVariantNumeric: "tabular-nums", flexShrink: 0, marginLeft: 8 }}>
              {activity[0].type === "in" ? "+" : "−"}{fmt(activity[0].amount)} FCFA
            </span>
          </>
        )}
      </button>

      <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 0" }}>
        <button onClick={onOpenActions} aria-label="Actions" style={{
          width: 56, height: 56, borderRadius: "50%", background: INK, border: "none", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          boxShadow: "0 10px 24px #12151A40",
        }}>
          <Plus size={26} />
        </button>
      </div>
    </div>
  );
}

// ---------- Activité (à proximité) ----------
const nearbyPlaces = [
  { id: "n1", name: "Terrou-Bi Beach Club", category: "divertissement", emoji: "🏖️", distance: "1,2 km", date: "Ce soir · 20h00", daysFromNow: 0, interest: 92 },
  { id: "n2", name: "Concert Youssou Ndour", category: "evenement", emoji: "🎤", distance: "3,5 km", date: "Sam. 16 août", daysFromNow: 5, interest: 88 },
  { id: "n3", name: "Chez Loutcha", category: "restaurant", emoji: "🍲", distance: "800 m", date: "Ouvert maintenant", daysFromNow: 0, interest: 81 },
  { id: "n4", name: "Nuit Afro-Beats", category: "divertissement", emoji: "🎧", distance: "2 km", date: "Ven. 15 août", daysFromNow: 4, interest: 76 },
  { id: "n5", name: "Le Djembé", category: "restaurant", emoji: "🍛", distance: "1,5 km", date: "Ouvert maintenant", daysFromNow: 0, interest: 70 },
  { id: "n6", name: "Foire artisanale", category: "evenement", emoji: "🧺", distance: "4,1 km", date: "Dim. 17 août", daysFromNow: 6, interest: 65 },
  { id: "n7", name: "Piscine olympique", category: "divertissement", emoji: "🏊", distance: "2,8 km", date: "Demain · 9h00", daysFromNow: 1, interest: 58 },
];

const groupBuys = [
  { id: "gb1", title: "iPhone 13 en achat groupé", emoji: "📱", joined: 4, total: 5, unitPrice: 220000, savings: 80000 },
];

const rentals = [
  { id: "rt1", title: "Villa Paradise", location: "Kribi", emoji: "🏨", pricePerNight: 150000 },
];

const localFeed = [
  { id: "loc1", kind: "restaurant", neighborhood: "Bastos", name: "@saveurs", offer: "Offre déjeuner", price: 4500, emoji: "🍔" },
  { id: "loc2", kind: "stay", neighborhood: "Bonapriso", title: "Appartement disponible ce week-end", price: 35000, unit: "/nuit", emoji: "🏠" },
];

function fmtK(n) {
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function FeedDivider() {
  return <div style={{ height: 1, background: LINE, margin: "14px 0" }} />;
}

function ActivityScreen({ pots, stories, onOpenStory, onQuickAction, onWantIt, onGroupBuyItem, onContribute }) {
  const [audience, setAudience] = useState("forYou");
  const [locationEnabled, setLocationEnabled] = useState(false);

  const topEcots = [...pots].sort((a, b) => computeCollected(b) / b.amount - computeCollected(a) / a.amount).slice(0, audience === "forYou" ? 2 : 3);
  const featuredProducts = marketplaceListings.filter((l) => l.seller).slice(0, audience === "forYou" ? 1 : 0);
  const shownGroupBuys = audience === "forYou" ? groupBuys : [];
  const shownRentals = audience === "forYou" ? rentals : [];
  const localEcots = pots.filter((p) => p.neighborhood);

  const feed = [
    ...topEcots.map((pot) => ({ kind: "ecot", data: pot })),
    ...featuredProducts.map((p) => ({ kind: "product", data: p })),
    ...shownGroupBuys.map((g) => ({ kind: "groupbuy", data: g })),
    ...shownRentals.map((r) => ({ kind: "rental", data: r })),
  ];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 0 110px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "18px 20px 4px" }}>
        <Bell size={18} color={TEXT} />
        <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: TEXT, letterSpacing: "-0.01em" }}>Activités</span>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "12px 20px 16px" }}>
        {[{ k: "forYou", label: "Pour toi" }, { k: "following", label: "Abonnements" }].map((f) => (
          <button key={f.k} onClick={() => setAudience(f.k)} style={{
            padding: "8px 14px", borderRadius: 999, border: "none",
            background: audience === f.k ? INK : CARD, color: audience === f.k ? "#fff" : MUTED,
            fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>{f.label}</button>
        ))}
      </div>

      <StoryBar stories={stories} onOpen={onOpenStory} />

      <div style={{ padding: "6px 20px 0" }}>
        {feed.map((item, i) => (
          <div key={`${item.kind}-${item.data.id}`}>
            {i > 0 && <FeedDivider />}
            {item.kind === "ecot" && (() => {
              const pot = item.data;
              const collected = computeCollected(pot);
              const pct = Math.min(100, Math.round((collected / pot.amount) * 100));
              return (
                <div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                    <Avatar name={pot.creator} color={AVATAR_COLORS[0]} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: FONT, fontSize: 14.5, color: TEXT, fontWeight: 700, marginBottom: 2 }}>
                        {pot.icon} {pot.title}
                      </div>
                      <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED }}>
                        Objectif : {fmt(pot.amount)} FCFA
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: CARD, borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: INK, borderRadius: 999 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontFamily: FONT, fontSize: 12.5, color: TEXT, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {fmt(collected)} FCFA
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: 12, color: MUTED }}>
                      {pot.participants.length} participants
                    </span>
                  </div>
                  <button onClick={() => onContribute(pot.id)} style={{
                    width: "100%", padding: "10px 0", borderRadius: 12, border: "none", background: INK, color: "#fff",
                    fontFamily: FONT, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                  }}>Participer</button>
                </div>
              );
            })()}

            {item.kind === "product" && (() => {
              const p = item.data;
              return (
                <div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: CARD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{catIcon(p.emoji, 20)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: FONT, fontSize: 14.5, color: TEXT, fontWeight: 700, marginBottom: 3 }}>{p.title}</div>
                      <div style={{ fontFamily: FONT, fontSize: 13, color: TEXT, fontWeight: 600, fontVariantNumeric: "tabular-nums", marginBottom: 2 }}>{fmt(p.price)} FCFA</div>
                      <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED }}>{p.location}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => onWantIt({
                        emoji: p.emoji, title: p.title, subtitle: p.seller, amount: p.price,
                        confirmLabel: "Confirmer l'achat", activityLabel: `Achat · ${p.title}`,
                      })} aria-label="Je le veux" style={{
                        width: 40, height: 40, borderRadius: "50%", border: "none", background: INK, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                      }}><Heart size={17} /></button>
                      <button onClick={() => onGroupBuyItem({ title: p.title, amount: p.price, icon: p.emoji })} aria-label="Acheter en groupe" style={{
                        width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${LINE}`, background: BG, color: TEXT,
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                      }}><Users size={17} /></button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {item.kind === "groupbuy" && (() => {
              const g = item.data;
              return (
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: CARD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{catIcon(g.emoji, 19)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED, marginBottom: 2 }}>Achat collectif</div>
                    <div style={{ fontFamily: FONT, fontSize: 14.5, color: TEXT, fontWeight: 700, marginBottom: 3 }}>{g.title}</div>
                    <div style={{ fontFamily: FONT, fontSize: 12.5, color: MUTED, marginBottom: 2 }}>{g.joined} / {g.total} personnes</div>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: GREEN, fontWeight: 600 }}>Économisez {fmt(g.savings)} FCFA</div>
                  </div>
                  <button onClick={() => onQuickAction({
                    emoji: g.emoji, title: g.title, subtitle: `${g.joined}/${g.total} personnes`, amount: g.unitPrice,
                    confirmLabel: "Rejoindre l'achat", activityLabel: `Achat collectif · ${g.title}`,
                  })} style={{
                    flexShrink: 0, padding: "9px 16px", borderRadius: 12, border: "none", background: INK, color: "#fff",
                    fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>Rejoindre</button>
                </div>
              );
            })()}

            {item.kind === "rental" && (() => {
              const r = item.data;
              return (
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: CARD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{catIcon(r.emoji, 19)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED, marginBottom: 2 }}>{r.location}</div>
                    <div style={{ fontFamily: FONT, fontSize: 14.5, color: TEXT, fontWeight: 700, marginBottom: 3 }}>{r.title}</div>
                    <div style={{ fontFamily: FONT, fontSize: 12.5, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{fmt(r.pricePerNight)} FCFA/nuit</div>
                  </div>
                  <button onClick={() => onQuickAction({
                    emoji: r.emoji, title: r.title, subtitle: `${r.location} · 1 nuit`, amount: r.pricePerNight,
                    confirmLabel: "Réserver", activityLabel: `Réservation · ${r.title}`,
                  })} style={{
                    flexShrink: 0, padding: "9px 16px", borderRadius: 12, border: "none", background: INK, color: "#fff",
                    fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>Réserver</button>
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ height: 1, background: LINE, marginBottom: 20 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <MapPin size={15} color={TEXT} />
          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: TEXT, letterSpacing: "-0.01em" }}>Près de toi</span>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 11.5, color: MUTED, marginBottom: 14 }}>
          Ce qui se passe autour de toi, selon ta position
        </div>

        {!locationEnabled ? (
          <div style={{ background: CARD, borderRadius: 18, border: `1px solid ${LINE}`, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontSize: 13, color: TEXT, marginBottom: 12, lineHeight: 1.4 }}>
              Active ta position pour découvrir les offres, écots et lieux autour de toi.
            </div>
            <button onClick={() => setLocationEnabled(true)} style={{
              padding: "10px 20px", borderRadius: 12, border: "none", background: INK, color: "#fff",
              fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>Activer la localisation</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontFamily: FONT, fontSize: 11.5, color: MUTED }}>Douala, à proximité</span>
              <button onClick={() => setLocationEnabled(false)} style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                fontFamily: FONT, fontSize: 11.5, fontWeight: 600, color: MUTED, textDecoration: "underline",
              }}>Désactiver</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {localFeed.map((l) => (
                <div key={l.id} style={{ display: "flex", gap: 12, alignItems: "center", background: CARD, borderRadius: 16, border: `1px solid ${LINE}`, padding: "12px 14px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{catIcon(l.emoji, 19)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 10.5, color: MUTED, marginBottom: 2 }}>À {l.neighborhood}</div>
                    {l.kind === "restaurant" ? (
                      <>
                        <div style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 700 }}>Restaurant {l.name}</div>
                        <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{l.offer} : {fmt(l.price)} FCFA</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 700 }}>{l.title}</div>
                        <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{fmt(l.price)} FCFA{l.unit}</div>
                      </>
                    )}
                  </div>
                  <button onClick={() => onQuickAction({
                    emoji: l.emoji, title: l.kind === "restaurant" ? `${l.offer} · ${l.name}` : l.title, amount: l.price,
                    confirmLabel: l.kind === "restaurant" ? "J'en profite" : "Réserver",
                    activityLabel: l.kind === "restaurant" ? `Offre déjeuner · ${l.name}` : `Réservation · ${l.title}`,
                  })} style={{
                    flexShrink: 0, padding: "8px 14px", borderRadius: 11, border: "none", background: INK, color: "#fff",
                    fontFamily: FONT, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{l.kind === "restaurant" ? "J'en profite" : "Réserver"}</button>
                </div>
              ))}

              {localEcots.map((pot) => {
                const collected = computeCollected(pot);
                const pct = Math.min(100, Math.round((collected / pot.amount) * 100));
                return (
                  <div key={pot.id} style={{ background: CARD, borderRadius: 16, border: `1px solid ${LINE}`, padding: "14px 14px" }}>
                    <div style={{ fontFamily: FONT, fontSize: 10.5, color: MUTED, marginBottom: 6 }}>Écot populaire près de toi · {pot.neighborhood}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{pot.icon}</span>
                      <span style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 700 }}>« {pot.title} »</span>
                    </div>
                    <div style={{ height: 5, background: BG, borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: INK, borderRadius: 999 }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: FONT, fontSize: 11.5, color: MUTED, fontVariantNumeric: "tabular-nums" }}>
                        {fmt(collected)} / {fmt(pot.amount)} FCFA
                      </span>
                      <button onClick={() => onContribute(pot.id)} style={{
                        padding: "7px 14px", borderRadius: 10, border: "none", background: INK, color: "#fff",
                        fontFamily: FONT, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}>Participer</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Quick action (achat/réservation via le solde LOKA) ----------
function QuickActionScreen({ item, balance, onBack, onConfirm }) {
  const [done, setDone] = useState(false);
  const insufficient = balance < item.amount;

  if (done) {
    return <SuccessScreen title="Paiement confirmé" subtitle={`${fmt(item.amount)} FCFA · ${item.title}`} onBack={onBack} backLabel="Retour" />;
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Confirmer" onBack={onBack} />

      <div style={{ background: CARD, borderRadius: 20, border: `1px solid ${LINE}`, padding: "20px 18px", margin: "10px 0 20px", textAlign: "center" }}>
        <div style={{ marginBottom: 10 }}>{catIcon(item.emoji, 34)}</div>
        <div style={{ fontFamily: FONT, fontSize: 16, color: TEXT, fontWeight: 700, marginBottom: 3 }}>{item.title}</div>
        <div style={{ fontFamily: FONT, fontSize: 12.5, color: MUTED, marginBottom: 14 }}>{item.subtitle}</div>
        <div style={{ fontFamily: FONT, fontSize: 26, color: TEXT, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
          {fmt(item.amount)} <span style={{ fontSize: 15, color: MUTED, fontWeight: 500 }}>FCFA</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, background: BG, border: `1.5px solid ${LINE}`, borderRadius: 14, padding: "12px 14px", marginBottom: 20 }}>
        <Wallet size={16} color={MUTED} />
        <span style={{ fontFamily: FONT, fontSize: 13, color: MUTED }}>Débité depuis ton solde LOKA</span>
        <span style={{ marginLeft: "auto", fontFamily: FONT, fontSize: 13, color: insufficient ? "#E8483F" : TEXT, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          {fmt(balance)} FCFA
        </span>
      </div>

      {insufficient && (
        <div style={{ fontFamily: FONT, fontSize: 12.5, color: "#E8483F", marginBottom: 16 }}>
          Ton solde ne couvre pas ce montant.
        </div>
      )}

      <PrimaryButton disabled={insufficient} onClick={() => { onConfirm(item); setDone(true); }}>{item.confirmLabel}</PrimaryButton>
    </div>
  );
}

// ---------- Comment veux-tu l'obtenir ? (Seul / Avec d'autres) ----------
function ObtainChoiceScreen({ item, onBack, onSolo, onGroup }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Comment veux-tu l'obtenir ?" onBack={onBack} />

      <div style={{ background: CARD, borderRadius: 20, border: `1px solid ${LINE}`, padding: "20px 18px", margin: "10px 0 26px", textAlign: "center" }}>
        <div style={{ marginBottom: 8 }}>{catIcon(item.emoji, 30)}</div>
        <div style={{ fontFamily: FONT, fontSize: 15.5, color: TEXT, fontWeight: 700, marginBottom: 3 }}>{item.title}</div>
        <div style={{ fontFamily: FONT, fontSize: 20, color: TEXT, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
          {fmt(item.amount)} <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>FCFA</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onSolo} style={{
          display: "flex", alignItems: "center", gap: 14, padding: "18px 16px", borderRadius: 18,
          border: "none", background: CARD, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={18} />
          </div>
          <div>
            <div style={{ color: TEXT, fontFamily: FONT, fontSize: 15, fontWeight: 600 }}>Seul</div>
            <div style={{ color: MUTED, fontFamily: FONT, fontSize: 12 }}>Tu payes directement via ton wallet</div>
          </div>
          <ChevronRight size={16} color={MUTED} style={{ marginLeft: "auto" }} />
        </button>
        <button onClick={onGroup} style={{
          display: "flex", alignItems: "center", gap: 14, padding: "18px 16px", borderRadius: 18,
          border: "none", background: CARD, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={18} />
          </div>
          <div>
            <div style={{ color: TEXT, fontFamily: FONT, fontSize: 15, fontWeight: 600 }}>Avec d'autres</div>
            <div style={{ color: MUTED, fontFamily: FONT, fontSize: 12 }}>Lance un écot pour l'acheter à plusieurs</div>
          </div>
          <ChevronRight size={16} color={MUTED} style={{ marginLeft: "auto" }} />
        </button>
      </div>
    </div>
  );
}

// ---------- Participer à un Écot — montant rapide ----------
function EcotQuickContribute({ pot, balance, onBack, onConfirm }) {
  const [amount, setAmount] = useState(null);
  const [custom, setCustom] = useState("");
  const [done, setDone] = useState(false);
  const collected = computeCollected(pot);
  const pct = Math.min(100, Math.round((collected / pot.amount) * 100));
  const presets = [5000, 10000];
  const finalAmount = amount === "custom" ? parseFloat(custom || "0") : amount;
  const canConfirm = finalAmount > 0 && finalAmount <= balance;

  if (done) {
    return <SuccessScreen title="Merci pour ta contribution" subtitle={`${fmt(finalAmount)} FCFA · ${pot.title}`} onBack={onBack} backLabel="Retour" />;
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Participer" onBack={onBack} />

      <div style={{ background: CARD, borderRadius: 20, border: `1px solid ${LINE}`, padding: "18px 18px", margin: "10px 0 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 24 }}>{pot.icon}</span>
          <span style={{ fontFamily: FONT, fontSize: 15, color: TEXT, fontWeight: 700 }}>{pot.title}</span>
        </div>
        <div style={{ height: 6, background: BG, borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 999 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 12.5 }}>
          <span style={{ color: TEXT, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(collected)} FCFA</span>
          <span style={{ color: MUTED, fontVariantNumeric: "tabular-nums" }}>Objectif {fmt(pot.amount)} FCFA</span>
        </div>
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT, marginBottom: 10 }}>Montant</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {presets.map((p) => (
          <button key={p} onClick={() => { setAmount(p); setCustom(""); }} style={{
            flex: 1, padding: "13px 0", borderRadius: 14, border: amount === p ? `1.5px solid ${ACCENT}` : "1.5px solid transparent",
            background: amount === p ? `${ACCENT}0F` : CARD, color: TEXT, fontFamily: FONT, fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontVariantNumeric: "tabular-nums",
          }}>{fmt(p)} FCFA</button>
        ))}
        <button onClick={() => setAmount("custom")} style={{
          flex: 1, padding: "13px 0", borderRadius: 14, border: amount === "custom" ? `1.5px solid ${ACCENT}` : "1.5px solid transparent",
          background: amount === "custom" ? `${ACCENT}0F` : CARD, color: TEXT, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Personnalisé</button>
      </div>

      {amount === "custom" && (
        <AmountInput value={custom} onChange={setCustom} placeholder="Montant personnalisé" autoFocus />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, background: BG, border: `1.5px solid ${LINE}`, borderRadius: 14, padding: "12px 14px", marginBottom: 20 }}>
        <Wallet size={16} color={MUTED} />
        <span style={{ fontFamily: FONT, fontSize: 13, color: MUTED }}>Débité depuis ton solde LOKA</span>
        <span style={{ marginLeft: "auto", fontFamily: FONT, fontSize: 13, color: TEXT, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          {fmt(balance)} FCFA
        </span>
      </div>

      <PrimaryButton disabled={!canConfirm} onClick={() => { onConfirm(pot.id, finalAmount); setDone(true); }}>Participer</PrimaryButton>
    </div>
  );
}

// NOTE: MarketplaceScreen is currently unmounted — it was removed from
// BottomNav (see App) but kept here since the feature may return later.
// ---------- Marketplace ----------
const marketplaceListings = [
  { id: "m1", title: "iPhone 13 128 Go, très bon état", price: 250000, category: "buy", emoji: "📱", location: "Douala, Akwa" },
  { id: "m2", title: "Studio meublé proche centre-ville", price: 60000, unit: "/mois", category: "rent", emoji: "🏠", location: "Yaoundé, Bastos" },
  { id: "m3", title: "Soirée Afrobeats — Le Rooftop", price: 5000, category: "event", emoji: "🎉", location: "Douala, Bonapriso" },
  { id: "m4", title: "Vélo VTT Decathlon, peu servi", price: 45000, category: "buy", emoji: "🚲", location: "Yaoundé, Mvog-Mbi" },
  { id: "m5", title: "Appartement 2 chambres salon", price: 120000, unit: "/mois", category: "rent", emoji: "🏢", location: "Douala, Bonamoussadi" },
  { id: "m6", title: "Concert live — scène locale", price: 10000, category: "event", emoji: "🎤", location: "Yaoundé, Centre-ville" },
  { id: "m7", title: "Chaussures Nike Air, taille 42", price: 18000, category: "buy", emoji: "👟", location: "Douala, Deido" },
  { id: "m8", title: "Chambre meublée à partager", price: 35000, unit: "/mois", category: "rent", emoji: "🛏️", location: "Yaoundé, Mendong" },
  { id: "m9", title: "Canapé convertible", price: 300000, category: "buy", emoji: "🛋️", location: "Douala, Bonapriso", seller: "@meubles_design" },
];

function MarketplaceScreen({ onSelect }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filters = [
    { key: "all", label: "Tout" },
    { key: "buy", label: "🛍️ Acheter" },
    { key: "rent", label: "🏠 Louer" },
    { key: "event", label: "🎟️ Événements" },
  ];

  const items = useMemo(() => {
    return marketplaceListings.filter((l) => {
      const matchCategory = filter === "all" || l.category === filter;
      const matchQuery = query.trim() === "" || l.title.toLowerCase().includes(query.trim().toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [query, filter]);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 110px" }}>
      <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, color: TEXT, letterSpacing: "-0.01em", padding: "18px 0 14px" }}>
        Marketplace
      </div>

      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search size={16} color={MUTED} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit, un logement, un événement"
          style={{
            width: "100%", background: CARD, border: "none", borderRadius: 14, padding: "12px 14px 12px 38px",
            color: TEXT, fontFamily: FONT, fontSize: 14.5, outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      <div className="hscroll" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            flexShrink: 0, padding: "9px 14px", borderRadius: 999, border: "none",
            background: filter === f.key ? INK : CARD, color: filter === f.key ? "#fff" : MUTED,
            fontFamily: FONT, fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.length === 0 && (
          <div style={{ color: MUTED, fontFamily: FONT, fontSize: 13.5, padding: "20px 2px", textAlign: "center" }}>
            Aucun résultat pour cette recherche.
          </div>
        )}
        {items.map((l) => (
          <div key={l.id} onClick={() => onSelect({
            emoji: l.emoji, title: l.title, amount: l.price,
            confirmLabel: "Acheter", activityLabel: `Achat · ${l.title}`,
          })} className="lk-pressable" style={{ display: "flex", gap: 14, background: CARD, borderRadius: 18, border: `1px solid ${LINE}`, padding: "14px 16px", alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {catIcon(l.emoji, 22)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 600, marginBottom: 3, lineHeight: 1.25,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{l.title}</div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED }}>{l.location}</div>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 700, fontVariantNumeric: "tabular-nums", flexShrink: 0, textAlign: "right" }}>
              {fmt(l.price)}<span style={{ fontSize: 10.5, color: MUTED, fontWeight: 500 }}> FCFA{l.unit || ""}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Profile ----------
function ProfileScreen({ balance, pots }) {
  const created = pots.filter((p) => p.creator === "Moi").length;
  const joined = pots.filter((p) => p.participants.some((x) => x.name === "Moi")).length;
  const [ptab, setPtab] = useState("publications");
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: "Coordonnées bancaires", icon: <CreditCard size={16} /> },
    { label: "Notifications", icon: <Bell size={16} /> },
    { label: "Sécurité & confidentialité", icon: <Shield size={16} /> },
    { label: "Aide", icon: <HelpCircle size={16} /> },
  ];

  const myPublications = pots.filter((p) => p.creator === "Moi");
  const favorites = [
    { id: "f1", title: "Villa Paradise", location: "Kribi", price: 150000, unit: "/nuit", emoji: "🏨" },
    { id: "f2", title: "Canapé convertible", location: "Douala, Bonapriso", price: 300000, emoji: "🛋️" },
    { id: "f3", title: "Studio meublé proche centre-ville", location: "Yaoundé, Bastos", price: 60000, unit: "/mois", emoji: "🏠" },
  ];
  const publicActions = [
    { id: "a1", icon: <Users size={18} />, label: "A rejoint un achat collectif", target: "iPhone 15", when: "il y a 2 j" },
    { id: "a2", icon: <Ticket size={18} />, label: "A créé un Écot", target: "Anniversaire de Léa", when: "il y a 5 j" },
    { id: "a3", icon: <ShoppingBag size={18} />, label: "A acheté un produit", target: "Chaussures Nike Air", when: "il y a 1 sem" },
  ];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 0 110px", position: "relative" }}>
      <div style={{ padding: "16px 20px 0" }}>
        <button onClick={() => setMenuOpen(true)} aria-label="Menu" style={{
          width: 34, height: 34, borderRadius: 10, background: CARD, border: "none",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <Menu size={18} color={TEXT} />
        </button>
      </div>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "#12151A66", zIndex: 40 }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 250, background: BG,
            padding: "20px 16px", boxShadow: "4px 0 24px #00000022", display: "flex", flexDirection: "column",
          }}>
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 16, letterSpacing: "-0.01em" }}>
              Réglages
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {menuItems.map((it) => (
                <button key={it.label} onClick={() => setMenuOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", borderRadius: 12,
                  border: "none", background: "none", cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{ color: MUTED }}>{it.icon}</div>
                  <span style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT }}>{it.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 14 }}>
          <Avatar name="Abdoul Choco" color={AVATAR_COLORS[4]} size={84} />
          <div style={{ fontFamily: FONT, fontSize: 16, color: TEXT, fontWeight: 700, marginTop: 10, letterSpacing: "-0.01em" }}>
            Abdoul Choco
          </div>
          <div style={{ color: MUTED, fontFamily: FONT, fontSize: 12, marginTop: 1 }}>@abdoul</div>

          <div style={{
            display: "flex", alignItems: "center", gap: 4, marginTop: 7, padding: "3px 8px",
            background: `${GREEN}14`, borderRadius: 999,
          }}>
            <BadgeCheck size={11} color={GREEN} />
            <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: GREEN }}>Vérifié</span>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 4, marginTop: 6, padding: "4px 10px",
            background: CARD, borderRadius: 999,
          }}>
            <Lock size={9} color={MUTED} />
            <span style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 600, color: TEXT, letterSpacing: "0.03em" }}>LK-4A2-XV</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, margin: "14px 0 20px" }}>
          <button style={{
            flex: 1, padding: "9px 0", borderRadius: 12, border: "none", background: INK, color: "#fff",
            fontFamily: FONT, fontWeight: 600, fontSize: 12.5, cursor: "pointer",
          }}>Modifier le profil</button>
          <button style={{
            flex: 1, padding: "9px 0", borderRadius: 12, border: `1.5px solid ${LINE}`, background: BG, color: TEXT,
            fontFamily: FONT, fontWeight: 600, fontSize: 12.5, cursor: "pointer",
          }}>Partager mon profil</button>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[
            { label: "Solde", value: `${fmt(balance)} FCFA` },
            { label: "Écots lancés", value: created },
            { label: "Écots rejoints", value: joined },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: CARD, borderRadius: 12, border: `1px solid ${LINE}`, padding: "9px 6px", textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontSize: 12.5, color: TEXT, fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.value}</div>
              <div style={{ fontFamily: FONT, fontSize: 9, color: MUTED, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="hscroll" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
          {[
            { key: "publications", label: "Publications" },
            { key: "favorites", label: "Favoris" },
            { key: "activity", label: "Activités" },
          ].map((t) => (
            <button key={t.key} onClick={() => setPtab(t.key)} style={{
              flexShrink: 0, padding: "9px 14px", borderRadius: 999, border: "none",
              background: ptab === t.key ? INK : CARD, color: ptab === t.key ? "#fff" : MUTED,
              fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>

        {ptab === "publications" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 26 }}>
            {myPublications.length === 0 && (
              <div style={{ color: MUTED, fontFamily: FONT, fontSize: 13.5, padding: "18px 2px", textAlign: "center" }}>
                Tu n'as encore rien publié.
              </div>
            )}
            {myPublications.map((pot) => (
              <div key={pot.id} style={{ display: "flex", alignItems: "center", gap: 12, background: CARD, borderRadius: 16, border: `1px solid ${LINE}`, padding: "12px 14px" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{pot.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 600 }}>{pot.title}</div>
                  <div style={{ fontFamily: FONT, fontSize: 11.5, color: MUTED }}>Écot · {pot.createdAgo}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {ptab === "favorites" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 26 }}>
            {favorites.map((f) => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, background: CARD, borderRadius: 16, border: `1px solid ${LINE}`, padding: "12px 14px" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{catIcon(f.emoji, 18)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.title}</div>
                  <div style={{ fontFamily: FONT, fontSize: 11.5, color: MUTED }}>{f.location}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontFamily: FONT, fontSize: 12.5, color: TEXT, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {fmt(f.price)}<span style={{ fontSize: 9.5, color: MUTED, fontWeight: 500 }}> FCFA{f.unit || ""}</span>
                  </span>
                  <Heart size={14} color="#E14F86" fill="#E14F86" />
                </div>
              </div>
            ))}
          </div>
        )}

        {ptab === "activity" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 26 }}>
            <div style={{ fontFamily: FONT, fontSize: 11, color: MUTED, marginBottom: 2, lineHeight: 1.4 }}>
              Tes actions publiques — les transactions financières restent privées.
            </div>
            {publicActions.map((a) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, background: CARD, borderRadius: 16, border: `1px solid ${LINE}`, padding: "12px 14px" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: TEXT, flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 13.5, color: TEXT, fontWeight: 600 }}>
                    {a.label} <span style={{ fontWeight: 700 }}>{a.target}</span>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 11.5, color: MUTED }}>{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Login (connexion fictive) ----------
function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35.1 27 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6C41.4 36.4 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

function AppleLogo({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 384 512" fill={color}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
    </svg>
  );
}

// Fictive login screen: phone number and Google/Apple both call onLogin()
// immediately with no real check. TODO(backend): wire to OTP flow (Partie 11
// of the cahier des charges) — register → verify OTP → create/verify PIN.
function LoginScreen({ onLogin }) {
  const [phone, setPhone] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 480, width: "100%", margin: "0 auto", padding: "0 20px", display: "flex", flexDirection: "column", flex: 1, boxSizing: "border-box" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: FONT, fontSize: 27, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em", marginBottom: 6 }}>
            Bienvenue sur LOKA
          </div>
          <div style={{ fontFamily: FONT, fontSize: 14.5, color: MUTED, marginBottom: 36 }}>
            Connecte-toi avec ton numéro de téléphone
          </div>

          <label style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, fontFamily: FONT }}>Numéro de téléphone</label>
          <div style={{ display: "flex", gap: 8, margin: "8px 0 20px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", padding: "0 14px",
              background: CARD, borderRadius: 14, border: `1px solid ${LINE}`, color: TEXT, fontFamily: FONT, fontSize: 15, fontWeight: 600,
            }}>+237</div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="6 77 12 34 56"
              inputMode="numeric"
              style={{
                flex: 1, background: CARD, border: "none", borderRadius: 14, padding: "13px 14px",
                color: TEXT, fontFamily: FONT, fontSize: 16, outline: "none", boxSizing: "border-box", letterSpacing: "0.02em",
              }}
            />
          </div>

          <button
            disabled={phone.length < 8}
            onClick={() => onLogin()}
            style={{
              width: "100%", padding: "15px 0", borderRadius: 16, border: "none",
              background: phone.length < 8 ? LINE : ACCENT, color: phone.length < 8 ? "#B7BAC0" : "#fff",
              fontFamily: FONT, fontWeight: 600, fontSize: 15, cursor: phone.length < 8 ? "not-allowed" : "pointer",
            }}
          >
            Continuer
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "26px 0" }}>
            <div style={{ flex: 1, height: 1, background: LINE }} />
            <span style={{ fontFamily: FONT, fontSize: 12.5, color: MUTED }}>ou</span>
            <div style={{ flex: 1, height: 1, background: LINE }} />
          </div>

          <button
            onClick={() => onLogin()}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "13px 0", borderRadius: 16, border: `1.5px solid ${LINE}`, background: BG,
              fontFamily: FONT, fontWeight: 600, fontSize: 14.5, color: TEXT, cursor: "pointer", marginBottom: 10,
            }}
          >
            <GoogleG size={18} /> Continuer avec Google
          </button>

          <button
            onClick={() => onLogin()}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              padding: "13px 0", borderRadius: 16, border: "none", background: INK,
              fontFamily: FONT, fontWeight: 600, fontSize: 14.5, color: "#fff", cursor: "pointer",
            }}
          >
            <AppleLogo size={17} /> Continuer avec Apple
          </button>
        </div>

        <div style={{ fontFamily: FONT, fontSize: 11.5, color: MUTED, textAlign: "center", padding: "20px 10px 30px", lineHeight: 1.5 }}>
          En continuant, tu acceptes les Conditions d'utilisation et la Politique de confidentialité de LOKA.
        </div>
      </div>
    </div>
  );
}

// ---------- Historique complet ----------
function HistoryScreen({ activity, onBack }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 40px" }}>
      <ScreenHeader title="Historique" onBack={onBack} />
      <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${LINE}`, padding: "4px 12px", marginTop: 10 }}>
        {activity.length === 0 && (
          <div style={{ color: MUTED, fontFamily: FONT, fontSize: 13.5, padding: "16px 0" }}>
            Aucune activité pour l'instant.
          </div>
        )}
        {activity.map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0",
            borderBottom: i < activity.length - 1 ? `1px solid ${LINE}` : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: BG,
                color: a.type === "in" ? GREEN : TEXT, flexShrink: 0,
              }}>
                {a.type === "in" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: TEXT, fontFamily: FONT, fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.label}</div>
                <div style={{ color: MUTED, fontFamily: FONT, fontSize: 12 }}>{a.when}</div>
              </div>
            </div>
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: a.type === "in" ? GREEN : TEXT, fontVariantNumeric: "tabular-nums", flexShrink: 0, marginLeft: 8 }}>
              {a.type === "in" ? "+" : "−"}{fmt(a.amount)} FCFA
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Bottom nav ----------
function BottomNav({ tab, setTab }) {
  const tabs = [
    { key: "home", label: "Accueil", icon: <Home size={20} /> },
    { key: "activity", label: "Activité", icon: <MapPin size={20} /> },
    { key: "profile", label: "Profil", icon: <User size={20} /> },
  ];
  return (
    <div style={{ position: "fixed", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 15, pointerEvents: "none" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 4, background: INK, borderRadius: 999,
        padding: 8, boxShadow: "0 10px 30px rgba(18,21,26,0.35)", pointerEvents: "auto",
      }}>
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer",
              borderRadius: 999, padding: active ? "10px 20px 10px 14px" : "10px 16px",
              background: active ? "#ffffff1A" : "transparent", color: active ? "#fff" : "#8A8F98",
              transition: "background 0.15s ease, color 0.15s ease",
            }}>
              {t.icon}
              {active && <span style={{ fontSize: 15, fontFamily: FONT, fontWeight: 700, whiteSpace: "nowrap" }}>{t.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  // ------------------------------------------------------------------
  // All state below is in-memory mock state. A real integration replaces:
  //   - authenticated/phone login  → OTP + session token (see cahier des charges, Partie 11)
  //   - pots/activity/balance      → API calls to the Wallet & Écot services (Parties 8-10)
  //   - setPots/setBalance updates → server confirmation callbacks, not optimistic-only writes
  // ------------------------------------------------------------------
  const [authenticated, setAuthenticated] = useState(false);
  const [pots, setPots] = useState(initialPots);
  const [stories, setStories] = useState(initialStories);
  const [tab, setTab] = useState("home");
  const [screen, setScreen] = useState({ name: "tab" });
  const [balance, setBalance] = useState(85000);
  const [activity, setActivity] = useState([
    { type: "in", label: "Reçu de Tom", amount: 15000, when: "hier" },
    { type: "out", label: "Envoyé à Nadia", amount: 10000, when: "il y a 3 jours" },
  ]);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [storyStart, setStoryStart] = useState(0);
  const [savings, setSavings] = useState(20000);

  const openPot = (id) => setScreen({ name: "detail", potId: id });
  const closeSub = () => setScreen({ name: "tab" });

  // TODO(backend): persist choice via POST /ecots/{id}/respond, then
  // reconcile local state from the server response instead of mutating optimistically.
  const handleChoose = (potId, choice) => {
    setPots((prev) => prev.map((p) => p.id === potId ? {
      ...p, participants: p.participants.map((part) => part.name === "Moi" ? { ...part, choice: part.choice === choice ? null : choice } : part),
    } : p));
  };

  // TODO(backend): POST /ecots — the id/collected/state fields below are
  // generated client-side for the mock only; the server is the source of truth.
  const handleCreate = ({ title, amount, type, icon }) => {
    const newPot = {
      id: `p${Date.now()}`, title, type, icon, amount, creator: "Moi", createdAgo: "à l'instant",
      participants: [{ name: "Moi", choice: "full", color: AVATAR_COLORS[4] }], comments: 0, likes: 0,
    };
    setPots((prev) => [newPot, ...prev]);
    setScreen({ name: "detail", potId: newPot.id });
  };

  const handleServicePick = (key) => {
    setActionSheetOpen(false);
    if (key === "pot") setScreen({ name: "create" });
    else if (key === "transfer") setScreen({ name: "transferChoice" });
    else if (key === "recharge") setScreen({ name: "recharge" });
    else if (key === "purchase") setScreen({ name: "transact", mode: "pay" });
    else if (key === "qr") setScreen({ name: "qr" });
    else if (key === "agent") setScreen({ name: "agent" });
    else if (key === "savings") setScreen({ name: "savings" });
  };

  // ------------------------------------------------------------------
  // TODO(backend): every handler below currently mutates `balance` directly
  // and optimistically. In production none of these should touch the wallet
  // balance client-side — each is a candidate POST to Partie 10's API
  // (transfers, agent-operations, airtime-recharges, savings, qr/pay), all
  // requiring an Idempotency-Key and a PIN/biometric confirmation (Partie 11)
  // before the balance shown here is ever updated from the server response.
  // ------------------------------------------------------------------
  const handleTransactionConfirm = (mode, amount) => {
    if (mode === "send") { setBalance((b) => b - amount); setActivity((a) => [{ type: "out", label: "Envoyé", amount, when: "à l'instant" }, ...a]); }
    else if (mode === "receive") { setBalance((b) => b + amount); setActivity((a) => [{ type: "in", label: "Reçu", amount, when: "à l'instant" }, ...a]); }
    else if (mode === "pay") { setBalance((b) => b - amount); setActivity((a) => [{ type: "out", label: "Paiement", amount, when: "à l'instant" }, ...a]); }
  };

  const handleRechargeConfirm = (amount, label) => {
    setBalance((b) => b - amount);
    setActivity((a) => [{ type: "out", label, amount, when: "à l'instant" }, ...a]);
  };

  const handleQRConfirm = (amount, label) => {
    setBalance((b) => b - amount);
    setActivity((a) => [{ type: "out", label, amount, when: "à l'instant" }, ...a]);
  };

  const handleAgentConfirm = (op, amount, agent) => {
    if (op === "deposit") {
      setBalance((b) => b + amount);
      setActivity((a) => [{ type: "in", label: `Dépôt · ${agent.name}`, amount, when: "à l'instant" }, ...a]);
    } else {
      setBalance((b) => b - amount);
      setActivity((a) => [{ type: "out", label: `Retrait · ${agent.name}`, amount, when: "à l'instant" }, ...a]);
    }
  };

  const handleSavingsAdd = (amount) => {
    setBalance((b) => b - amount);
    setSavings((s) => s + amount);
    setActivity((a) => [{ type: "out", label: "Ajout à l'épargne", amount, when: "à l'instant" }, ...a]);
  };

  const markSeen = (idx) => setStories((prev) => prev.map((s, i) => (i === idx ? { ...s, seen: true } : s)));
  const activePot = useMemo(() => pots.find((p) => p.id === screen.potId), [pots, screen]);

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: BG, fontFamily: FONT }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          body { margin: 0; }
          input::placeholder { color: #B7BAC0; }
          button { font-family: inherit; }
        `}</style>
        <LoginScreen onLogin={() => setAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder { color: #B7BAC0; }
        button { font-family: inherit; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        button:not(:disabled) { transition: transform 0.12s cubic-bezier(0.2,0.8,0.2,1), opacity 0.12s ease; }
        button:not(:disabled):active { transform: scale(0.96); opacity: 0.82; }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes growBar { from { width: 0%; } to { width: 100%; } }
        @keyframes screenIn { from { opacity: 0; transform: translateY(10px) scale(0.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .screen-fade { animation: screenIn 0.28s cubic-bezier(0.16,1,0.3,1); }
        .hscroll { scrollbar-width: none; -ms-overflow-style: none; }
        .hscroll::-webkit-scrollbar { display: none; }
        .lk-pressable { transition: transform 0.12s cubic-bezier(0.2,0.8,0.2,1), opacity 0.12s ease; cursor: pointer; -webkit-tap-highlight-color: transparent; }
        .lk-pressable:active { transform: scale(0.97); opacity: 0.85; }
      `}</style>

      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#FFFFFFF2", backdropFilter: "blur(10px)", borderBottom: `1px solid ${LINE}`, padding: "16px 20px 11px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 7 }}>
        <span style={{ fontFamily: FONT, fontSize: 19, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>LOKA</span>
        <button aria-label="Notifications" style={{ background: "none", border: "none", color: INK, cursor: "pointer", padding: 4, display: "flex" }}>
          <Bell size={22} />
        </button>
      </div>

      <div key={`${tab}-${screen.name}`} className="screen-fade">
        {screen.name === "tab" && tab === "home" && (
          <HomeScreen
            balance={balance}
            activity={activity}
            pots={pots}
            onOpenActions={() => setActionSheetOpen(true)}
            onOpenPot={openPot}
            onOpenHistory={() => setScreen({ name: "history" })}
          />
        )}
        {screen.name === "tab" && tab === "activity" && (
          <ActivityScreen
            pots={pots}
            stories={stories}
            onOpenStory={(i) => { setStoryStart(i); setScreen({ name: "story" }); }}
            onQuickAction={(item) => setScreen({ name: "quickaction", item })}
            onWantIt={(item) => setScreen({ name: "obtainChoice", item })}
            onGroupBuyItem={(initial) => setScreen({ name: "create", initial })}
            onContribute={(potId) => setScreen({ name: "ecotContribute", potId })}
          />
        )}
        {screen.name === "tab" && tab === "profile" && <ProfileScreen balance={balance} pots={pots} />}

        {screen.name === "history" && <HistoryScreen activity={activity} onBack={closeSub} />}
        {screen.name === "quickaction" && (
          <QuickActionScreen
            item={screen.item}
            balance={balance}
            onBack={closeSub}
            onConfirm={(item) => {
              setBalance((b) => b - item.amount);
              setActivity((a) => [{ type: "out", label: item.activityLabel, amount: item.amount, when: "à l'instant" }, ...a]);
            }}
          />
        )}
        {screen.name === "obtainChoice" && (
          <ObtainChoiceScreen
            item={screen.item}
            onBack={closeSub}
            onSolo={() => setScreen({ name: "quickaction", item: screen.item })}
            onGroup={() => setScreen({ name: "create", initial: { title: screen.item.title, amount: screen.item.amount, icon: screen.item.emoji, type: "product" } })}
          />
        )}
        {screen.name === "ecotContribute" && (
          <EcotQuickContribute
            pot={pots.find((p) => p.id === screen.potId)}
            balance={balance}
            onBack={closeSub}
            onConfirm={(potId, amount) => {
              setBalance((b) => b - amount);
              setPots((prev) => prev.map((p) => p.id === potId ? { ...p, extraContributions: [...(p.extraContributions || []), amount] } : p));
              const pot = pots.find((p) => p.id === potId);
              setActivity((a) => [{ type: "out", label: `Contribution · ${pot?.title || "Écot"}`, amount, when: "à l'instant" }, ...a]);
            }}
          />
        )}
        {screen.name === "detail" && activePot && (
          <div style={{ paddingBottom: 100 }}><PotDetail pot={activePot} onBack={closeSub} onChoose={handleChoose} /></div>
        )}
        {screen.name === "create" && <CreatePot onCreate={handleCreate} onCancel={closeSub} initial={screen.initial} />}
        {screen.name === "transferChoice" && (
          <TransferChoice onBack={closeSub} onPick={(mode) => setScreen({ name: "transact", mode })} />
        )}
        {screen.name === "recharge" && <RechargeFlow onBack={closeSub} onConfirm={handleRechargeConfirm} />}
        {screen.name === "qr" && <QRFlow onBack={closeSub} onConfirm={handleQRConfirm} />}
        {screen.name === "agent" && <AgentFlow onBack={closeSub} onConfirm={handleAgentConfirm} />}
        {screen.name === "savings" && <SavingsFlow savings={savings} onBack={closeSub} onAdd={handleSavingsAdd} />}
        {screen.name === "transact" && <TransactionFlow mode={screen.mode} onBack={closeSub} onConfirm={handleTransactionConfirm} />}
        {screen.name === "story" && <StoryViewer stories={stories} startIndex={storyStart} onClose={closeSub} onSeen={markSeen} />}
      </div>

      {screen.name === "tab" && <BottomNav tab={tab} setTab={setTab} />}
      {actionSheetOpen && <ServicesSheet onClose={() => setActionSheetOpen(false)} onPick={handleServicePick} />}
    </div>
  );
}
