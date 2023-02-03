const fs = require("fs");
const path = require("path");

const createScreen = (name) => {
  const packageScreenDir = path.resolve("packages", "app", "screens");
  const nextPageDir = path.resolve("apps", "next", "src", "pages");
  const componentDir = path.resolve("packages", "app", "components");

  fs.writeFileSync(
    `${packageScreenDir}/${name}.tsx`,
    `import React from "react";
    export  function ${name}() {
        return <div>${name}</div>;
    }
    `
  );

  fs.mkdirSync(`${nextPageDir}/${name}`);

  fs.writeFileSync(
    `${nextPageDir}/${name}/index.tsx`,
    `import React from "react";
    export default function ${name}() {
        return <div>${name}</div>;
    }
    `
  );

  fs.writeFileSync(
    `${componentDir}/${name}.tsx`,
    `import React from "react";
    export function ${name}() {
        return <div>${name}</div>;
    }
    `
  );
};

const main = () => {
  createScreen(process.argv[2]);
};

main();
