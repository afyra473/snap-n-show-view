import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JSX mockup component without types
import LokaApp from "../components/LokaApp.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOKA — Portefeuille & écots entre amis" },
      {
        name: "description",
        content:
          "LOKA : payez, épargnez et organisez des écots de groupe avec vos amis, depuis un seul portefeuille mobile.",
      },
      { property: "og:title", content: "LOKA — Portefeuille & écots entre amis" },
      {
        property: "og:description",
        content:
          "Transferts, QR, recharge, épargne et cagnottes de groupe dans une seule application.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <LokaApp />;
}
