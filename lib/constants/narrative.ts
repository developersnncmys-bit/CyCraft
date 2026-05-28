export const ACTS = {
  1: { sections: [1, 2], name: 'Dormancy' },
  2: { sections: [3, 4, 5], name: 'Ignition' },
  3: { sections: [6, 7, 8, 9], name: 'Divergence' },
  4: { sections: [10, 11, 12, 13], name: 'Architecture' },
  5: { sections: [14, 15, 16, 17], name: 'Proof' },
  6: { sections: [18, 19, 20, 21, 22], name: 'Invitation' },
} as const;

export type Act = keyof typeof ACTS;
