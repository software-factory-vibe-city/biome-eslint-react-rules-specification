import "vitest";

declare module "vitest" {
  interface TaskMeta {
    source?: string | undefined;
    filePath?: string | undefined;
    explanation?: string | undefined;
    priority?: number | undefined;
  }
}
