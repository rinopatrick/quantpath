// Sanity-check generated questions: run with npx tsx scripts/check-generators.ts
import { genNumberLogic, genOrderbooks, genMentalMath } from '../src/data/practice/generators';
import { practiceModules } from '../src/data/practice';

let failures = 0;

function assert(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error('FAIL:', msg);
  }
}

// Run each generator many times
for (let iter = 0; iter < 50; iter++) {
  const nl = genNumberLogic(26);
  assert(nl.length === 26, `nl length ${nl.length}`);
  for (const q of nl) {
    assert(q.type === 'numeric', 'nl type');
    if (q.type === 'numeric') {
      assert(Number.isFinite(q.answer), `nl answer not finite: ${q.prompt}`);
      assert(q.prompt.endsWith(', ?'), `nl prompt format: ${q.prompt}`);
      const terms = q.prompt.replace(', ?', '').split(', ').map(Number);
      assert(terms.every(Number.isFinite), `nl terms parse: ${q.prompt}`);
      assert(terms.length >= 5, `nl too few terms: ${q.prompt}`);
    }
  }

  const ob = genOrderbooks(12);
  assert(ob.length === 12, `ob length ${ob.length}`);
  for (const q of ob) {
    if (q.type === 'orderbook-mcq') {
      assert(q.answerIndex >= 0 && q.answerIndex < q.options.length, `ob answerIndex: ${q.prompt} -> ${q.answerIndex}`);
      assert(new Set(q.options).size === q.options.length, `ob duplicate options: ${JSON.stringify(q.options)}`);
      assert(q.books.length >= 1, 'ob books');
      for (const b of q.books) {
        for (const lv of [...b.bids, ...b.asks]) {
          assert(Number.isFinite(lv.price) && Number.isFinite(lv.size), 'ob level numbers');
        }
      }
    }
  }

  const mm = genMentalMath(80);
  assert(mm.length === 80, `mm length ${mm.length}`);
  for (const q of mm) {
    if (q.type === 'numeric') {
      assert(Number.isFinite(q.answer), `mm answer: ${q.prompt}`);
      // verify arithmetic by eval-ing the prompt
      const expr = q.prompt
        .replace(' = ?', '')
        .replace('²', '**2')
        .replace('−', '-')
        .replace('×', '*')
        .replace('÷', '/')
        .replace('% dari ', '/100*')
        .replace(' sebagai desimal', '');
      try {
        const val = Function(`"use strict"; return (${expr});`)();
        assert(Math.abs(val - q.answer) < 1e-9, `mm mismatch: ${q.prompt} expected ${val} got ${q.answer}`);
      } catch {
        failures++;
        console.error('FAIL: mm eval error:', q.prompt, '->', expr);
      }
    }
  }
}

// module registry
assert(practiceModules.length === 6, `modules: ${practiceModules.length}`);
const gens = practiceModules.filter((m) => m.generator).map((m) => m.id);
assert(gens.includes('number-logic') && gens.includes('orderbooks') && gens.includes('mental-math'), `generators wired: ${gens}`);

if (failures === 0) {
  console.log('ALL CHECKS PASSED (50 iterations × 3 generators + registry)');
} else {
  console.error(`${failures} failures`);
  process.exit(1);
}
