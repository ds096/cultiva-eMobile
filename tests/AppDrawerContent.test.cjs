/// <reference types="node" />
// Exercita o componente real sem carregar módulos nativos ou dados do aparelho.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

/** @param {() => void | Promise<void>} clearProfile @param {number} bottom */
function createHarness(clearProfile, bottom = 0) {
  /** @type {any[]} */
  const slots = [];
  let cursor = 0;
  const hooks = {
    /** @param {any} initial */
    useState(initial) {
      const slot = cursor++;
      if (!(slot in slots)) slots[slot] = initial;
      return [slots[slot], (/** @type {any} */ next) => (slots[slot] = next)];
    },
    /** @param {any} initial */
    useRef(initial) {
      const slot = cursor++;
      if (!(slot in slots)) slots[slot] = { current: initial };
      return slots[slot];
    },
  };
  /** @param {string} name @returns {any} */
  function localRequire(name) {
    if (name === "react") return hooks;
    if (name === "react/jsx-runtime") return require(name);
    if (name === "react-native") return { View: "View", Image: "Image" };
    if (name === "expo-router/drawer")
      return {
        DrawerContentScrollView: "Scroll",
        DrawerItemList: "Destinations",
      };
    if (name === "react-native-paper")
      return { Button: "Button", Divider: "Divider", Snackbar: "Snackbar" };
    if (name === "react-native-safe-area-context")
      return {
        useSafeAreaInsets: () => ({ top: 24, bottom, left: 0, right: 0 }),
      };
    if (name.endsWith("ProfileContext"))
      return { useProfile: () => ({ clearProfile }) };
    if (name.endsWith("theme")) return { theme: { colors: {} } };
    if (name.includes("material-design-icons"))
      return { MaterialDesignIcons: "Icon" };
    if (name.endsWith(".png")) return 1;
    throw new Error(`Módulo inesperado: ${name}`);
  }
  const file = require.resolve("../src/components/AppDrawerContent.tsx");
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const loaded = { exports: /** @type {any} */ ({}) };
  vm.runInThisContext(`(function(require, module, exports) {${source}\n})`, {
    filename: file,
  })(localRequire, loaded, loaded.exports);
  function render() {
    cursor = 0;
    /** @type {any[]} */
    const nodes = [];
    /** @param {any} node */
    function walk(node) {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node?.props) return;
      nodes.push(node);
      walk(node.props.children);
    }
    walk(loaded.exports.default({}));
    return nodes;
  }
  /** @param {string} type */
  function find(type) {
    const node = render().find((node) => node.type === type);
    assert.ok(node, type);
    return node;
  }
  return { render, find };
}

test("bloqueia dois toques antes da renderização e mostra carregamento", async () => {
  let calls = 0;
  /** @type {() => void} */
  let finish = () => {};
  const pending = new Promise((resolve) => {
    finish = () => resolve(undefined);
  });
  const h = createHarness(() => {
    calls++;
    return pending;
  });
  const press = h.find("Button").props.onPress;
  const first = press();
  const second = press();
  assert.equal(calls, 1);
  assert.equal(h.find("Button").props.loading, true);
  assert.equal(h.find("Button").props.disabled, true);
  finish();
  await Promise.all([first, second]);
  assert.equal(h.find("Snackbar").props.visible, false);
  assert.equal(h.find("Button").props.disabled, false);
});

for (const asyncFailure of [false, true]) {
  test(`falha ${asyncFailure ? "assíncrona" : "síncrona"} tem feedback e permite tentar novamente`, async () => {
    let calls = 0;
    const h = createHarness(() => {
      calls++;
      if (calls > 1) return;
      if (asyncFailure) return Promise.reject(new Error("Falha simulada"));
      throw new Error("Falha simulada");
    });
    await h.find("Button").props.onPress();
    const snackbar = h.find("Snackbar");
    assert.equal(snackbar.props.visible, true);
    assert.match(snackbar.props.children, /Não foi possível sair/);
    assert.equal(h.find("Button").props.loading, false);
    assert.equal(h.find("Button").props.disabled, false);
    snackbar.props.onDismiss();
    assert.equal(h.find("Snackbar").props.visible, false);
    await h.find("Button").props.onPress();
    assert.equal(calls, 2);
    assert.equal(h.find("Snackbar").props.visible, false);
  });
}

for (const bottom of [0, 16, 48]) {
  test(`rodapé e feedback respeitam inset inferior de ${bottom}`, () => {
    const h = createHarness(() => {}, bottom);
    const footer = h
      .render()
      .find(
        (node) =>
          node.type === "View" && node.props.style?.paddingBottom !== undefined,
      );
    assert.ok(footer);
    assert.equal(footer.props.style.paddingBottom, 16 + bottom);
    assert.equal(h.find("Scroll").props.contentContainerStyle.paddingBottom, 0);
    assert.equal(h.find("Snackbar").props.wrapperStyle.position, "relative");
  });
}
