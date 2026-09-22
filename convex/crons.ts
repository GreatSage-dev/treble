import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Hourly statutory cure audit sweep:
// Checks for cases where the 14-day cure deadline has expired and updates status
crons.interval(
  "statutory-cure-audit-sweep",
  { hours: 1 },
  internal.cases.auditExpiringCureWindows
);

export default crons;
