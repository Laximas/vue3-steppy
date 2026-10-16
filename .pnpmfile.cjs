// typescript-eslint does not support TypeScript 7 yet. Give it its own
// TypeScript 6 (side by side with the project's TypeScript 7) by turning its
// `typescript` peer dependency into a regular dependency.
const tsEslintPackages = new Set([
  "@typescript-eslint/parser",
  "@typescript-eslint/typescript-estree",
  "@typescript-eslint/project-service",
  "@typescript-eslint/tsconfig-utils",
  "ts-api-utils",
]);

function readPackage(pkg) {
  if (tsEslintPackages.has(pkg.name) && pkg.peerDependencies?.typescript) {
    delete pkg.peerDependencies.typescript;
    if (pkg.peerDependenciesMeta) delete pkg.peerDependenciesMeta.typescript;
    pkg.dependencies = { ...pkg.dependencies, typescript: "npm:typescript@^6" };
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
