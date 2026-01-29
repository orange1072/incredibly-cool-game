#!/usr/bin/env node
"use strict";

const { spawn } = require("child_process");

const rawArgs = process.argv.slice(2);
const filteredArgs = [];

for (let i = 0; i < rawArgs.length; i += 1) {
  const arg = rawArgs[i];
  if (arg === "--mutex") {
    i += 1;
    continue;
  }
  if (arg.startsWith("--mutex=")) {
    continue;
  }
  filteredArgs.push(arg);
}

if (!filteredArgs.includes("--non-interactive")) {
  filteredArgs.push("--non-interactive");
}

const child = spawn("yarn", filteredArgs, { stdio: "inherit" });

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
