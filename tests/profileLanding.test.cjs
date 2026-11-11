/// <reference types="node" />
// Exercita a decisão de entrada real sem MMKV nem perfis do aparelho.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

/** @param {string} email @param {number} count @param {boolean} fails */
function createHarness(email, count, fails = false) {
  /** @type {any[]} */
  const slots = [];
  /** @type {string[]} */
  const reads = [];
  let cursor = 0;
  let cleared = false;
  const file = require.resolve("../src/components/ProfileLanding.tsx");
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const loaded = { exports: /** @type {any} */ ({}) };
  /** @param {string} name @returns {any} */
  function localRequire(name) {
    if (name === "react")
      return {
        useState(/** @type {any} */ initial) {
          const slot = cursor++;
          if (!(slot in slots))
            slots[slot] = typeof initial === "function" ? initial() : initial;
          return [
            slots[slot],
            (/** @type {any} */ value) => {
              slots[slot] = value;
            },
          ];
        },
      };
    if (name === "react/jsx-runtime") return require(name);
    if (name === "expo-router") return { Redirect: "Redirect" };
    if (name === "react-native") return { ScrollView: "ScrollView" };
    if (name === "react-native-paper")
      return { Button: "Button", Text: "Text" };
    if (name === "react-native-safe-area-context")
      return { SafeAreaView: "SafeAreaView" };
    if (name.endsWith("theme"))
      return { theme: { colors: {} }, tokens: { space: {} } };
    if (name.endsWith("ProfileContext"))
      return {
        useProfile: () => ({
          clearProfile: () => {
            cleared = true;
          },
        }),
      };
    if (name.endsWith("plotRepository"))
      return {
        plotRepository: {
          list(/** @type {string} */ profile) {
            reads.push(profile);
            if (fails) throw new Error("Falha de leitura simulada");
            return Array(count).fill({});
          },
        },
      };
    throw new Error(`Módulo inesperado: ${name}`);
  }
  vm.runInThisContext(`(function(require, module, exports) {${source}\n})`, {
    filename: file,
  })(localRequire, loaded, loaded.exports);
  function render() {
    cursor = 0;
    /** @type {any[]} */
    const nodes = [];
    function walk(/** @type {any} */ node) {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node?.props) return;
      nodes.push(node);
      walk(node.props.children);
    }
    walk(loaded.exports.default({ email }));
    return nodes;
  }
  return {
    render,
    reads,
    recover: () => {
      fails = false;
    },
    wasCleared: () => cleared,
  };
}

for (const email of ["novo@example.invalid", "restaurado@example.invalid"]) {
  for (const count of [0, 1, 3]) {
    test(`entrada de ${email} com ${count} talhões`, () => {
      const h = createHarness(email, count);
      const redirect = h.render().find((node) => node.type === "Redirect");
      assert.ok(redirect);
      assert.equal(redirect.props.href, count === 0 ? "/plots" : "/calendar");
      assert.deepEqual(h.reads, [email]);
    });
  }
}

test("erro de leitura não redireciona e permite tentar novamente", () => {
  const h = createHarness("falha@example.invalid", 1, true);
  const nodes = h.render();
  assert.ok(!nodes.some((node) => node.type === "Redirect"));
  assert.ok(nodes.some((node) => node.props.accessibilityRole === "alert"));
  h.recover();
  nodes
    .find((node) => node.props.children === "Tentar novamente")
    .props.onPress();
  assert.equal(
    h.render().find((node) => node.type === "Redirect").props.href,
    "/calendar",
  );
});

test("erro de leitura permite sair do perfil sem apagar talhões", () => {
  const h = createHarness("falha@example.invalid", 0, true);
  h.render()
    .find((node) => node.props.children === "Sair do perfil")
    .props.onPress();
  assert.equal(h.wasCleared(), true);
});
