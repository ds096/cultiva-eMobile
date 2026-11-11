/// <reference types="node" />
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

/** @param {string | undefined} plotCreated @param {boolean} focused */
function createHarness(plotCreated, focused = true) {
  const file = require.resolve("../src/components/PlotCreatedFeedback.tsx");
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const loaded = { exports: /** @type {any} */ ({}) };
  /** @param {string} name @returns {any} */
  function localRequire(name) {
    if (name === "react/jsx-runtime") return require(name);
    if (name === "expo-router")
      return {
        useLocalSearchParams: () => ({ plotCreated }),
        useIsFocused: () => focused,
        useNavigation: () => ({
          setParams: (/** @type {{ plotCreated?: string }} */ params) => {
            plotCreated = params.plotCreated;
          },
        }),
      };
    if (name === "react-native-paper")
      return { Snackbar: "Snackbar", Text: "Text" };
    if (name.endsWith("theme")) return { tokens: { color: {} } };
    throw new Error(`Módulo inesperado: ${name}`);
  }
  vm.runInThisContext(`(function(require, module, exports) {${source}\n})`, {
    filename: file,
  })(localRequire, loaded, loaded.exports);
  return { render: () => loaded.exports.default() };
}

test("confirmação aparece no destino e seu fechamento limpa o parâmetro da tela", () => {
  const h = createHarness("true");
  const snackbar = h.render();
  assert.equal(snackbar.props.visible, true);
  assert.equal(
    snackbar.props.children.props.children,
    "Talhão cadastrado com sucesso! Salvo neste dispositivo.",
  );
  snackbar.props.onDismiss();
  assert.equal(h.render().props.visible, false);
});

test("abertura comum das telas não mostra confirmação de cadastro", () => {
  assert.equal(createHarness(undefined).render().props.visible, false);
});

test("tela fora de foco não exibe confirmação sobre o próximo cadastro", () => {
  assert.equal(createHarness("true", false).render().props.visible, false);
});
