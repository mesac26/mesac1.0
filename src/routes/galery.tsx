import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/galery")({
  beforeLoad: () => {
    throw redirect({ to: "/gallery" });
  },
  component: () => null,
});
