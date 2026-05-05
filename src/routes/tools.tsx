import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "GPX Crop Tool — FiveCrops" },
      { name: "description", content: "Process and export your GPX routes — FiveCrops / PedaLúdico." },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <iframe
      src="/tools.html"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "none",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        zIndex: 9999,
      }}
      title="GPX Crop Tool"
    />
  );
}
