import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "./about";

export const Route = createFileRoute("/about-mesac")({
  head: () => ({
    meta: [
      { title: "About MESAC — CUSAT Mechanical Association" },
      {
        name: "description",
        content:
          "The Mechanical Engineering Students Association of CUSAT (MESAC) is a registered association established in July 2005.",
      },
      { property: "og:title", content: "About MESAC — CUSAT" },
      {
        property: "og:description",
        content:
          "History, objectives, patron, and coordinators of Mechanical Engineering Students Association of CUSAT.",
      },
    ],
  }),
  component: AboutPage,
});
