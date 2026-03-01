import { writeFileSync } from "node:fs";

interface VitestError {
  readonly message: string;
  readonly actual?: string;
  readonly expected?: string;
}

interface VitestTaskResult {
  readonly state: string;
  readonly duration?: number;
  readonly errors?: ReadonlyArray<VitestError>;
}

interface VitestTask {
  readonly type: string;
  readonly name: string;
  readonly meta: Record<string, unknown>;
  readonly result?: VitestTaskResult;
  readonly tasks?: ReadonlyArray<VitestTask>;
  readonly suite?: VitestTask;
}

interface VitestFile extends VitestTask {
  readonly filepath: string;
}

interface TestCase {
  readonly name: string;
  readonly status: "passed" | "failed" | "skipped" | "errored";
  readonly durationMs?: number | undefined;
  readonly details?: string | undefined;
  readonly explanation?: string | undefined;
  readonly filePath?: string | undefined;
  readonly source?: string | undefined;
}

interface TestSuite {
  readonly name: string;
  readonly timestamp: string;
  readonly durationMs?: number | undefined;
  readonly passed: boolean;
  readonly summary: string;
  readonly priority?: number | undefined;
  readonly cases: ReadonlyArray<TestCase>;
}

interface TestReport {
  readonly version: 1;
  readonly suites: ReadonlyArray<TestSuite>;
  readonly overallPassed: boolean;
}

const mapStatus = (
    state: string | undefined,
): TestCase["status"] => {
  switch (state) {
    case "pass":
      return "passed";
    case "fail":
      return "failed";
    case "skip":
    case "todo":
      return "failed";
    default:
      return "errored";
  }
};

const getFullName = (task: VitestTask): string => {
  const parts: string[] = [];
  let current: VitestTask | undefined = task;
  while (current) {
    if (current.suite) {
      parts.unshift(current.name);
    }
    current = current.suite;
  }
  return parts.join(" > ");
};

const collectTests = (
    tasks: ReadonlyArray<VitestTask>,
): ReadonlyArray<VitestTask> =>
    tasks.flatMap((task) => {
      if (task.type === "test" || task.type === "custom") return [task];
      if (task.type === "suite" && task.tasks) return collectTests(task.tasks);
      return [];
    });

const formatErrors = (errors: ReadonlyArray<VitestError>) =>
    errors
        .map((e) => {
          const parts = [e.message];
          if (e.expected !== undefined) parts.push(`Expected: ${e.expected}`);
          if (e.actual !== undefined) parts.push(`Actual: ${e.actual}`);
          return parts.join("\n");
        })
        .join("\n---\n");

const buildTestCase = (task: VitestTask): TestCase => {
  const status = mapStatus(task.result?.state);
  const errors = task.result?.errors ?? [];
  const details = errors.length > 0 ? formatErrors(errors) : undefined;

  return {
    name: getFullName(task),
    status,
    durationMs: task.result?.duration,
    details,
    explanation: task.meta["explanation"] as string | undefined,
    filePath: task.meta["filePath"] as string | undefined,
    source: task.meta['source'] as string | undefined
  };
};

const deriveSuitePriority = (file: VitestFile): number | undefined => {
  if (typeof file.meta["priority"] === "number") return file.meta["priority"];
  const priorities = collectTests(file.tasks ?? [])
      .map((t) => t.meta["priority"])
      .filter((p): p is number => typeof p === "number");
  return priorities.length > 0 ? Math.min(...priorities) : undefined;
};

const buildTestSuite = (file: VitestFile): TestSuite => {
  const tests = collectTests(file.tasks ?? []);
  const cases = tests.map(buildTestCase);
  const passCount = cases.filter((c) => c.status === "passed").length;
  const failCount = cases.length - passCount;
  const priority = deriveSuitePriority(file);

  return {
    name: file.name,
    timestamp: new Date().toISOString(),
    durationMs: file.result?.duration,
    passed: failCount === 0 && cases.length > 0,
    summary: `${passCount} passed, ${failCount} failed out of ${cases.length}`,
    ...(priority !== undefined ? { priority } : {}),
    cases,
  };
};

export default class HarnessReporter {
  onFinished(files: ReadonlyArray<VitestFile> = []) {
    const reportPath = process.env["HARNESS_REPORT_PATH"];
    if (!reportPath) return;

    const suites = files.map(buildTestSuite);
    const overallPassed =
        suites.length > 0 && suites.every((s) => s.passed);

    const report: TestReport = {
      version: 1,
      suites,
      overallPassed,
    };

    writeFileSync(reportPath, JSON.stringify(report, null, 2));
  }
}
