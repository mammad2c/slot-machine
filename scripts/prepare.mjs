import os from "node:os";
import { exec } from "node:child_process";
import ci from "ci-info";

if (!ci.isCI) {
  exec("husky install", (_, stdout) => {
    console.log(stdout);
  });
}

if (os.type() !== "Windows" && !ci.isCI) {
  console.log("Enabled husky on non Windows systems");
  exec("chmod ug+x .husky/*", (_, stdout) => {
    console.log(stdout);
  });
}
