import type { PracticeModule } from '@/lib/practice-types';
import { beatTheOdds } from './beat-the-odds';
import { numberLogic } from './number-logic';
import { likelihoodList } from './likelihood-list';
import { intervals } from './intervals';
import { orderbooks } from './orderbooks';

export const practiceModules: PracticeModule[] = [
  beatTheOdds,
  numberLogic,
  likelihoodList,
  intervals,
  orderbooks,
];

export function getModule(id: string): PracticeModule | undefined {
  return practiceModules.find((m) => m.id === id);
}
