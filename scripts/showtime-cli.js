const fs = require("fs");
const path = require("path");

function pascalToHyphen(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

const createScreen = (name) => {
  const fileName = pascalToHyphen(name);
  const screenDir = path.resolve("packages", "app", "screens");
  const nextPageDir = path.resolve("apps", "next", "src", "pages");
  const componentDir = path.resolve("packages", "app", "components");

  fs.writeFileSync(
    `${screenDir}/${fileName}Screen.tsx`,
    `import React from "react";
    export  function ${name}() {
        return <div>${name}</div>;
    }
    `
  );

  fs.mkdirSync(`${nextPageDir}/${fileName}`);

  fs.writeFileSync(
    `${nextPageDir}/${fileName}/index.tsx`,
    `import React from "react";
    export default function ${name}() {
        return <div>${name}</div>;
    }
    `
  );

  fs.writeFileSync(
    `${componentDir}/${fileName}.tsx`,
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
