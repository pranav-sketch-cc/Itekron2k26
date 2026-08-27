// I-TEKRON 2K26 — shared cinematic world wrapper for every independent route.
import type { ReactNode } from "react";
import SceneNav from "@/components/SceneNav";
import SiteFooter from "@/components/SiteFooter";

export default function PageShell({ children }: { children: ReactNode }) {
  return <div className="site-page"><SceneNav /><main className="site-page__stage">{children}</main><SiteFooter /></div>;
}
