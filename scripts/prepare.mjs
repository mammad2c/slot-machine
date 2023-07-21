import os from "node:os";
import { exec } from "node:child_process";

exec("husky install", (_, stdout) => {
  console.log(stdout);
});

if (os.type() !== "Windows") {
  exec("chmod ug+x .husky/*", (_, stdout) => {
    console.log(stdout);
  });
}
