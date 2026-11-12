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
    require.resolve("../src/repositories/planRepository.ts"),
  );
  const repository =
    /** @type {typeof import("../src/repositories/planRepository").planRepository} */ (
      exports.planRepository
    );
  return { repository, values };
}

const email = "teste@example.invalid";
const key = `plans:${encodeURIComponent(email)}`;

test("operações preservam identidade, perfis e registros restantes", () => {
  const { repository, values } = createHarness();
  const first = repository.create(" TESTE@EXAMPLE.INVALID ", {
    name: " Café ",
    description: " Um ",
  });
  const second = repository.create(email, {
    name: "Café",
    description: "Dois",
  });
  const other = repository.create("outro@example.invalid", { name: "Café" });
  const otherKey = "plans:outro%40example.invalid";
  const otherRaw = values.get(otherKey);
  assert.equal(first.profileEmail, email);
  assert.equal(first.name, "Café");
  const updated = repository.update(email, first.id, {
    name: " Novo ",
    description: " ",
  });
  assert.equal(updated.createdAt, first.createdAt);
  assert.equal(updated.description, undefined);
  assert.equal(repository.getById(email, first.id)?.name, "Novo");
  repository.remove(email, first.id);
  assert.deepEqual(
    repository.list(email).map((plan) => plan.id),
    [second.id],
  );
  assert.equal(repository.getById(email, first.id), undefined);
  assert.equal(
    repository.getById("outro@example.invalid", other.id)?.id,
    other.id,
  );
  assert.equal(values.get(otherKey), otherRaw);
  assert.throws(() => repository.update(email, first.id, { name: "Teste" }));
  assert.throws(() => repository.remove(email, first.id));
});

test("duplicidade considera nome e descrição normalizados no mesmo perfil", () => {
  const { repository } = createHarness();
  const first = repository.create(email, { name: " Plano " });
  assert.throws(() =>
    repository.create(email, { name: "plano", description: "  " }),
  );
  const second = repository.create(email, {
    name: "PLANO",
    description: " Outra ",
  });
  assert.throws(() => repository.update(email, second.id, { name: " plano " }));
  assert.equal(
    repository.update(email, first.id, { name: "PLANO" }).id,
    first.id,
  );
  assert.doesNotThrow(() =>
    repository.create("outro@example.invalid", { name: "plano" }),
  );
});

test("dados inválidos bloqueiam alterações sem sobrescrever o documento", () => {
  const { repository, values } = createHarness();
  for (const raw of [
    "{",
    "null",
    '{"schemaVersion":2,"plans":[]}',
    '{"schemaVersion":1,"plans":[{"id":"x","profileEmail":"outro","name":"A","createdAt":"2026-01-01"}]}',
    '{"schemaVersion":1,"plans":[{"id":"x","profileEmail":"teste@example.invalid","name":" ","createdAt":"2026-01-01"}]}',
  ]) {
    values.set(key, raw);
    assert.throws(() => repository.list(email));
    assert.throws(() => repository.create(email, { name: "A" }));
    assert.throws(() => repository.update(email, "x", { name: "A" }));
    assert.throws(() => repository.remove(email, "x"));
    assert.equal(values.get(key), raw);
  }
  assert.throws(() => repository.list(" "));
});

