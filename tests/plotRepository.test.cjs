/// <reference types="node" />
// Usa os tipos Node já disponíveis para este teste executado fora do aplicativo.
// Exercita o repositório real, simulando apenas MMKV e UUIDs nativos.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function createHarness() {
  /** @type {Map<string, string>} */
  const values = new Map();
  let nextId = 0;

  // Cada harness possui um armazenamento novo para isolar os cenários.
  /** @param {string} file @returns {Record<string, unknown>} */
  function load(file) {
    const module = { exports: {} };
    const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText;
    /** @param {string} name @returns {unknown} */
    function localRequire(name) {
      if (name === "react-native-mmkv") {
        return {
          createMMKV: () => ({
            /** @param {string} key */
            getString: (key) => values.get(key),
            /** @param {string} key @param {string} value */
            set: (key, value) => values.set(key, value),
          }),
        };
      }
      if (name === "expo-crypto") {
        return { randomUUID: () => `teste-${++nextId}` };
      }
      return load(path.resolve(path.dirname(file), `${name}.ts`));
    }
    // Transpila sem alterar o fonte; as regras e a serialização são as reais.
    vm.runInThisContext(`(function(require, module, exports) {${source}\n})`, {
      filename: file,
    })(localRequire, module, module.exports);
    return module.exports;
  }

  const exports = load(
    require.resolve("../src/repositories/plotRepository.ts"),
  );
  const repository =
    /** @type {typeof import("../src/repositories/plotRepository").plotRepository} */ (
      exports.plotRepository
    );
  return { repository, values };
}

// Dados fictícios usados apenas em memória, sem acessar perfis do dispositivo.
const email = "teste@example.invalid";
const key = `plots:${encodeURIComponent(email)}`;
const input = {
  name: "Talhão de teste",
  area: 1,
  crops: [{ name: "Café", quantity: 10 }],
};

test("cadastro pode ser listado e um segundo cadastro preserva o primeiro", () => {
  const { repository, values } = createHarness();
  assert.deepEqual(repository.list(email), []);
  const first = repository.create(email, input);
  assert.equal(repository.list(email)[0].id, first.id);
  const second = repository.create(email, input);
  assert.deepEqual(
    repository.list(email).map((plot) => plot.id),
    [first.id, second.id],
  );
  assert.equal(JSON.parse(values.get(key) ?? "null").schemaVersion, 1);
});

test("formato antigo é descartado apenas no perfil consultado e permite novo cadastro", () => {
  const { repository, values } = createHarness();
  values.set(key, JSON.stringify([{ id: "antigo" }]));
  const otherKey = "plots:outro%40example.invalid";
  values.set(otherKey, "[]");
  assert.deepEqual(repository.list(email), []);
  assert.deepEqual(JSON.parse(values.get(key) ?? "null"), {
    schemaVersion: 1,
    plots: [],
  });
  assert.equal(values.get(otherKey), "[]");
  const saved = repository.create(email, input);
  assert.equal(repository.findById(email, saved.id)?.id, saved.id);
});

test("e-mail normalizado permite reler o cadastro sem cruzar perfis", () => {
  const { repository } = createHarness();
  const saved = repository.create(" TESTE@EXAMPLE.INVALID ", input);
  assert.equal(saved.profileEmail, email);
  assert.equal(repository.list(email)[0].id, saved.id);
  assert.deepEqual(repository.list("outro@example.invalid"), []);
});

test("JSON inválido e versões desconhecidas continuam preservados e bloqueiam escrita", () => {
  const { repository, values } = createHarness();
  for (const raw of ["{", "null", '{"schemaVersion":2,"plots":[]}']) {
    values.set(key, raw);
    assert.throws(() => repository.list(email));
    assert.throws(() => repository.create(email, input));
    assert.equal(values.get(key), raw);
  }
});
