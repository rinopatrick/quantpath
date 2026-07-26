import type { PracticeModule } from '@/lib/practice-types';
import { beatTheOdds } from './beat-the-odds';
import { numberLogic } from './number-logic';
import { likelihoodList } from './likelihood-list';
import { intervals } from './intervals';
import { orderbooks } from './orderbooks';
import { mentalMath } from './mental-math';
import { genNumberLogic, genOrderbooks } from './generators';

// Infinite practice: regenerate fresh questions each attempt for
// modules whose formats are procedurally generatable.
numberLogic.generator = () => genNumberLogic(26);
orderbooks.generator = () => genOrderbooks(12);

export const practiceModules: PracticeModule[] = [
  beatTheOdds,
  numberLogic,
  likelihoodList,
  intervals,
  orderbooks,
  mentalMath,
];

export function getModule(id: string): PracticeModule | undefined {
  return practiceModules.find((m) => m.id === id);
}
