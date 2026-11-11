/// <reference types="node" />
// Exercita os handlers reais com hooks e elementos em memória; não é teste visual.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

/** @typedef {{ type: unknown, props: Record<string, any>, key?: string | null }} Element */

/** @param {import("node:test").TestContext} t */
function createScreenHarness(t) {
  /** @type {any[]} */
  const slots = [];
  /** @type {unknown[]} */
  const writes = [];
  let cursor = 0;
  let failWrite = false;
  /** @type {Map<number, { deps: unknown[], cleanup?: void | (() => void) }>} */
  const effects = new Map();
  /** @type {Array<() => void>} */
  const pendingEffects = [];
  // Cancela os efeitos da tela ao encerrar cada teste, inclusive seus timers.
  t.after(() => effects.forEach((effect) => effect.cleanup?.()));
  // O estado persiste entre chamadas da tela, sem montar módulos nativos.
  const hooks = {
    /** @param {() => void | (() => void)} effect @param {unknown[]} deps */
    useEffect(effect, deps) {
      const slot = cursor++;
      const previous = effects.get(slot);
      if (
        !previous ||
        deps.some((value, index) => !Object.is(value, previous.deps[index]))
      ) {
        pendingEffects.push(() => {
          previous?.cleanup?.();
          effects.set(slot, { deps, cleanup: effect() });
        });
      }
    },
    /** @param {any} initial */
    useState(initial) {
      const slot = cursor++;
      if (!(slot in slots)) slots[slot] = initial;
      return [
        slots[slot],
        /** @param {any} next */ (next) => {
          slots[slot] = typeof next === "function" ? next(slots[slot]) : next;
        },
      ];
    },
    /** @param {any} initial */
    useRef(initial) {
      const slot = cursor++;
      if (!(slot in slots)) slots[slot] = { current: initial };
      return slots[slot];
    },
  };

  /** @param {string} file @returns {any} */
  function load(file) {
    const module = { exports: {} };
    const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText;
    /** @param {string} name @returns {any} */
    function localRequire(name) {
      if (name === "react") return hooks;
      if (name === "react/jsx-runtime") return require("react/jsx-runtime");
      if (name === "react-native")
        return {
          View: "View",
          ScrollView: "ScrollView",
          KeyboardAvoidingView: "KeyboardAvoidingView",
          Keyboard: { dismiss() {} },
          StyleSheet: { create: (/** @type {unknown} */ styles) => styles },
        };
      if (name === "react-native-paper")
        return {
          Text: "Text",
          Snackbar: "Snackbar",
          MD3LightTheme: { colors: {} },
          configureFonts: () => ({}),
        };
      if (name === "react-native-safe-area-context")
        return { SafeAreaView: "SafeAreaView" };
      if (name === "expo-router") return { Stack: { Screen: "Stack.Screen" } };
      if (name === "expo-router/react-navigation")
        return { useHeaderHeight: () => 0 };
      if (name.endsWith("ProfileContext"))
        return { useProfile: () => ({ email: "teste@example.invalid" }) };
      if (name.endsWith("PlotFormControls"))
        return {
          PlotFormField: "Field",
          PlotFormButton: "Button",
          PlotRemoveButton: "RemoveButton",
        };
      if (name.endsWith("plotRepository"))
        return {
          plotRepository: {
            create(/** @type {string} */ email, /** @type {unknown} */ input) {
              if (failWrite) throw new Error("Falha simulada de escrita");
              writes.push({ email, input });
            },
          },
        };
      return load(path.resolve(path.dirname(file), `${name}.ts`));
    }
    vm.runInThisContext(`(function(require, module, exports) {${source}\n})`, {
      filename: file,
    })(localRequire, module, module.exports);
    return module.exports;
  }
  const Screen = load(require.resolve("../src/app/createPlot.tsx")).default;

  /** @returns {Element[]} */
  function render() {
    cursor = 0;
    /** @type {Element[]} */
    const elements = [];
    /** @param {any} node */
    function walk(node) {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object" || !node.props) return;
      elements.push(node);
      walk(node.props.children);
    }
    walk(Screen());
    // Executa os efeitos depois da renderização simulada.
    pendingEffects.splice(0).forEach((run) => run());
    return elements;
  }
  /** @param {string} id @param {string} value */
  function fill(id, value) {
    const field = render().find(
      (node) => node.type === "Field" && node.props.id === id,
    );
    assert.ok(field, id);
    field.props.onChangeText(value);
  }
  /** @param {string} label */
  function button(label) {
    const element = render().find(
      (node) => node.type === "Button" && node.props.label === label,
    );
    assert.ok(element, label);
    return element.props.onPress;
  }
  function fillValidForm() {
    fill("plot-name", "Talhão Norte");
    fill("plot-area", "2,5");
    fill("plot-year", "2022");
    fill("crop-name", "Café");
    fill("crop-quantity", "1500");
    button("Adicionar cultura")();
  }
  return {
    render,
    fill,
    button,
    fillValidForm,
    writes,
    fail: () => {
      failWrite = true;
    },
  };
}

test("sucesso limpa todos os campos e culturas; toque repetido não salva novamente", (t) => {
  const screen = createScreenHarness(t);
  screen.fillValidForm();
  const save = screen.button("Salvar talhão");
  save();
  save();
  assert.equal(screen.writes.length, 1);
  const fields = screen.render().filter((node) => node.type === "Field");
  assert.equal(fields.length, 5);
  assert.ok(fields.every((field) => field.props.value === ""));
  // Sem culturas após salvar, nenhuma ação de lixeira deve permanecer na tela.
  assert.ok(!screen.render().some((node) => node.type === "RemoveButton"));
  assert.ok(
    screen
      .render()
      .some(
        (node) =>
          node.props.children ===
          "Talhão cadastrado com sucesso! Salvo neste dispositivo.",
      ),
  );
  // Uma nova edição libera um novo cadastro, sem reutilizar os dados anteriores.
  screen.fillValidForm();
  screen.button("Salvar talhão")();
  assert.equal(screen.writes.length, 2);
});

test("falha de persistência mantém campos e culturas para nova tentativa", (t) => {
  const screen = createScreenHarness(t);
  screen.fillValidForm();
  screen.fail();
  screen.button("Salvar talhão")();
  assert.equal(screen.writes.length, 0);
  const fields = screen.render().filter((node) => node.type === "Field");
  assert.equal(
    fields.find((node) => node.props.id === "plot-name")?.props.value,
    "Talhão Norte",
  );
  assert.equal(
    fields.find((node) => node.props.id === "plot-area")?.props.value,
    "2,5",
  );
  assert.equal(
    fields.find((node) => node.props.id === "plot-year")?.props.value,
    "2022",
  );
  assert.ok(
    screen
      .render()
      .some(
        (node) =>
          node.type === "RemoveButton" && node.props.cropName === "Café",
      ),
  );
  assert.ok(
    screen
      .render()
      .some(
        (node) =>
          typeof node.props.children === "string" &&
          node.props.children.includes("Não foi possível salvar"),
      ),
  );
});

test("cultura ainda não adicionada bloqueia salvamento sem apagar o texto", (t) => {
  const screen = createScreenHarness(t);
  screen.fillValidForm();
  screen.fill("crop-name", "Milho");
  screen.button("Salvar talhão")();
  assert.equal(screen.writes.length, 0);
  assert.equal(
    screen.render().find((node) => node.props.id === "crop-name")?.props.value,
    "Milho",
  );
  assert.ok(
    screen
      .render()
      .some(
        (node) =>
          Array.isArray(node.props.children) &&
          node.props.children.some(
            (text) =>
              typeof text === "string" &&
              text.includes("Toque em Adicionar cultura"),
          ),
      ),
  );
});

// Valida o contrato com o Snackbar; duração e animação são executadas pelo Paper.
test("Snackbar de erro fica no topo e seu fechamento preserva a validação", (t) => {
  const screen = createScreenHarness(t);
  screen.button("Salvar talhão")();
  const snackbar = screen.render().find((node) => node.type === "Snackbar");
  assert.ok(snackbar);
  assert.equal(snackbar.props.visible, true);
  assert.equal(snackbar.props.duration, 3000);
  // O aviso ocupa espaço próprio e aparece antes da rolagem, sem sobreposição.
  assert.equal(snackbar.props.wrapperStyle.position, "relative");
  const elements = screen.render();
  assert.ok(
    elements.findIndex((node) => node.type === "Snackbar") <
      elements.findIndex((node) => node.type === "ScrollView"),
  );
  assert.equal(snackbar.props.wrapperStyle.bottom, undefined);
  assert.ok(
    screen
      .render()
      .some(
        (node) =>
          node.props.children === "Revise os campos indicados antes de salvar.",
      ),
  );
  snackbar.props.onDismiss();
  const after = screen.render();
  assert.ok(!after.some((node) => node.type === "Snackbar"));
  assert.equal(
    after.find((node) => node.props.id === "plot-name")?.props.error,
    "Informe o nome do talhão.",
  );
  assert.ok(after.find((node) => node.props.id === "plot-area")?.props.error);
  assert.ok(
    after.some(
      (node) =>
        Array.isArray(node.props.children) &&
        node.props.children.includes(
          "Adicione pelo menos uma cultura ao talhão.",
        ),
    ),
  );
  assert.equal(screen.writes.length, 0);
});

test("fechar Snackbar de sucesso mantém o formulário limpo", (t) => {
  const screen = createScreenHarness(t);
  screen.fillValidForm();
  screen.button("Salvar talhão")();
  const snackbar = screen.render().find((node) => node.type === "Snackbar");
  assert.ok(snackbar);
  assert.equal(snackbar.props.duration, 3000);
  snackbar.props.onDismiss();
  const after = screen.render();
  assert.ok(!after.some((node) => node.type === "Snackbar"));
  assert.ok(
    after
      .filter((node) => node.type === "Field")
      .every((node) => node.props.value === ""),
  );
});

test("nova tentativa remonta Snackbar para reiniciar a duração do Paper", (t) => {
  const screen = createScreenHarness(t);
  screen.button("Salvar talhão")();
  const first = screen.render().find((node) => node.type === "Snackbar");
  screen.button("Salvar talhão")();
  const second = screen.render().find((node) => node.type === "Snackbar");
  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first.key, second.key);
  assert.equal(second.props.duration, 3000);
});

// Confere o destino real de cada confirmação sem depender de um teclado específico.
test("confirmar no teclado avança pelos quatro próximos campos sem fechar o teclado", (t) => {
  const screen = createScreenHarness(t);
  const order = [
    "plot-name",
    "plot-area",
    "plot-year",
    "crop-name",
    "crop-quantity",
  ];
  /** @type {string[]} */
  const focused = [];
  const fields = screen.render().filter((node) => node.type === "Field");
  for (let index = 0; index < order.length - 1; index += 1) {
    const current = fields.find((node) => node.props.id === order[index]);
    const next = fields.find((node) => node.props.id === order[index + 1]);
    assert.ok(current);
    assert.ok(next);
    next.props.inputRef.current = {
      focus: () => focused.push(order[index + 1]),
    };
    assert.equal(current.props.returnKeyType, "next");
    assert.equal(current.props.submitBehavior, "submit");
    current.props.onSubmitEditing();
    assert.equal(focused.at(-1), order[index + 1]);
  }
  assert.equal(screen.writes.length, 0);
});

test("concluir no último campo adiciona a cultura sem salvar o talhão", (t) => {
  const screen = createScreenHarness(t);
  screen.fill("crop-name", "Café");
  screen.fill("crop-quantity", "100");
  const last = screen
    .render()
    .find((node) => node.props.id === "crop-quantity");
  assert.ok(last);
  assert.equal(last.props.returnKeyType, "done");
  last.props.onSubmitEditing();
  assert.ok(
    screen
      .render()
      .some(
        (node) =>
          node.type === "RemoveButton" && node.props.cropName === "Café",
      ),
  );
  assert.equal(
    screen.render().find((node) => node.props.id === "crop-name")?.props.value,
    "",
  );
  assert.equal(
    screen.render().find((node) => node.props.id === "crop-quantity")?.props
      .value,
    "",
  );
  assert.equal(screen.writes.length, 0);
});
