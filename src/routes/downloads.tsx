import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/downloads")({
  beforeLoad: () => {
    throw redirect({
      to: "/archive",
      replace: true,
    });
  },
  head: () => ({
    meta: [
      { title: "Academic Archive — MESAC CUSAT" },
      {
        name: "description",
        content: "Redirecting to the official MESAC Academic Archive repository.",
      },
    ],
  }),
  component: DownloadsRedirectPage,
});

function DownloadsRedirectPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/archive");
    }
  }, []);

  return (
    <Layout>
      <PageHero
        variant="downloads"
        eyebrow="Repository Relocated"
        title={
          <>
            ACADEMIC <span className="italic text-gold">ARCHIVE</span>
          </>
        }
        subtitle="The downloads catalog has moved to our unified Academic Archive with full-text search, semester indexing, and syllabus scheme filtering."
      />

      <section className="py-20 bg-background text-center px-4">
        <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
            <BookOpen className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Academic Resources Have Moved
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            All CUSAT Mechanical syllabi, previous semester question papers, lab manuals, and course
            materials are now consolidated in the Academic Archive.
          </p>
          <div className="pt-2">
            <Link
              to="/archive"
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-gold text-primary font-bold px-6 py-3 text-sm shadow-sm hover:brightness-105 active:scale-95 transition-all min-h-[44px]"
            >
              <span>Explore Academic Archive</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
