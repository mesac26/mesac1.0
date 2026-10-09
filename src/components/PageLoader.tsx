import { useAppLoader } from "../context/AppLoaderContext";

/**
 * PageLoader:
 * Backward-compatible helper component if referenced elsewhere.
 * Visibility is now centrally managed by AppLoaderContext.
 */
export function PageLoader() {
  // Managed centrally by AppLoaderProvider
  return null;
}

export { useAppLoader };
