// Testa o contrato sem acessar dados reais nem exigir o módulo nativo no Node.
const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const fs = require('node:fs');
const ts = require('typescript');

const values = new Map();
let writes = 0;
let failWrite = false;
let sequence = 0;
const originalLoad = Module._load;
Module._load = function (request, ...args) {
  if (request === 'expo-crypto') return { randomUUID: () => `id-${++sequence}` };
  if (request === 'react-native-mmkv') return { createMMKV: () => ({
    getString: (key) => values.get(key),
    set: (key, value) => { if (failWrite) throw Error('falha'); writes++; values.set(key, value); },
  }) };
  return originalLoad.call(this, request, ...args);
};
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, filename);
};
const { planRepository: repo } = require('../src/repositories/planRepository.ts');
const { calculatePlannedEndDate, ACTIVITY_CATEGORIES } = require('../src/domain/activity.ts');
Module._load = originalLoad;

test('cálculo respeita calendário, bissextos, ausência e limite de ano', () => {
  assert.equal(calculatePlannedEndDate('2026-11-10', 3), '2026-11-13');
  assert.equal(calculatePlannedEndDate('2026-11-10T00:00:00.000Z', 3), '2026-11-13');
  assert.throws(() => calculatePlannedEndDate('2026-11-10T12:00:00.000Z', 3));
  assert.equal(calculatePlannedEndDate('2024-02-28', 2), '2024-03-01');
  assert.equal(calculatePlannedEndDate('0001-12-31', 1), '0002-01-01');
  assert.equal(calculatePlannedEndDate(undefined, 3), undefined);
  assert.throws(() => calculatePlannedEndDate('9999-12-31', 1));
  assert.throws(() => calculatePlannedEndDate('2026-02-29', 1));
  assert.equal(ACTIVITY_CATEGORIES.length, 8);
});

test('criação conjunta valida antes de uma escrita e preserva operações existentes', () => {
  const email = ' TESTE@example.com ';
  const input = { name: ' Manejo ', description: ' teste ' };
  const before = writes;
  assert.throws(() => repo.createWithActivities(email, input, [{ name: 'Válida', notify: false }, { name: ' ', notify: true }]));
  assert.equal(writes, before);
  assert.deepEqual(repo.list(email), []);
  const plan = repo.createWithActivities(email, input, [{ name: ' Poda ', notify: false, plannedStartDate: '2026-11-10', estimatedDurationDays: 3 }]);
  assert.equal(writes, before + 1);
  assert.equal(plan.activities[0].name, 'Poda');
  assert.equal(plan.activities[0].plannedStartDate, '2026-11-10T00:00:00.000Z');
  assert.equal(JSON.parse(values.get('plans:teste%40example.com')).schemaVersion, 2);
  assert.deepEqual(repo.getById(email, plan.id), plan);
  assert.deepEqual(repo.list('outro@example.com'), []);
  assert.throws(() => repo.createWithActivities(email, input, []));
  assert.throws(() => repo.createWithActivities(email, { name: 'Outro' }, [{ name: 'A', category: 'Personalizada', notify: false }]));
  assert.equal(writes, before + 1);
  const empty = repo.create(email, { name: 'Vazio' });
  assert.deepEqual(empty.activities, []);
  const updated = repo.update(email, plan.id, { name: 'Alterado' });
  assert.deepEqual(updated.activities, plan.activities);
  const activity = repo.addActivity(email, plan.id, { name: 'Colheita', notify: true });
  repo.updateActivity(email, plan.id, activity.id, { name: 'Plantio', notify: false });
  repo.removeActivity(email, plan.id, activity.id);
  repo.remove(email, empty.id);
  assert.equal(repo.list(email).length, 1);
});

test('migra datas antigas somente após validar todo o documento', () => {
  const email = 'migracao@example.com';
  const key = 'plans:migracao%40example.com';
  const document = { schemaVersion: 1, plans: [{ id: 'p1', profileEmail: email, name: 'Plano', createdAt: '2026-01-01T00:00:00.000Z', activities: [{ id: 'a1', name: 'Poda', notify: false, plannedStartDate: '2026-11-10' }] }] };
  values.set(key, JSON.stringify(document));
  assert.equal(repo.list(email)[0].activities[0].plannedStartDate, '2026-11-10T00:00:00.000Z');
  assert.equal(JSON.parse(values.get(key)).schemaVersion, 2);
  document.plans[0].activities[0].plannedStartDate = '2026-02-30';
  const invalid = JSON.stringify(document);
  values.set(key, invalid);
  assert.throws(() => repo.list(email));
  assert.equal(values.get(key), invalid);
  document.plans[0].activities[0].plannedStartDate = '2026-11-10';
  const original = JSON.stringify(document);
  values.set(key, original);
  failWrite = true;
  try { assert.throws(() => repo.list(email), /migrar/); }
  finally { failWrite = false; }
  assert.equal(values.get(key), original);
});

test('falhas de leitura ou escrita não substituem o documento salvo', () => {
  const key = 'plans:falha%40example.com';
  values.set(key, '{inválido');
  assert.throws(() => repo.createWithActivities('falha@example.com', { name: 'X' }, []));
  assert.equal(values.get(key), '{inválido');
  const email = 'teste@example.com';
  const existing = values.get('plans:teste%40example.com');
  failWrite = true;
  try { assert.throws(() => repo.createWithActivities(email, { name: 'Falha' }, [])); }
  finally { failWrite = false; }
  assert.equal(values.get('plans:teste%40example.com'), existing);
});
