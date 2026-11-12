import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "./team";

export const Route = createFileRoute("/about-mesac_/team")({
  head: () => ({
    meta: [
      { title: "Executive Committee & Team — About MESAC CUSAT" },
      {
        name: "description",
        content:
          "Meet the MESAC committee — the student leaders and faculty advisors running the Mechanical Engineering Students Association at CUSAT.",
      },
      { property: "og:title", content: "Team — About MESAC CUSAT" },
      { property: "og:description", content: "The MESAC executive committee at CUSAT." },
    ],
  }),
  component: TeamPage,
});
