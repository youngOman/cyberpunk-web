import { Cpu, Zap, Shield, Radio, Disc, Skull } from 'lucide-react';

export const SLOT_ITEMS = [
  { id: 1, name: 'CPU', icon: Cpu, color: 'text-neon-blue', points: 50, rarity: 'common' },
  { id: 2, name: 'ENERGY', icon: Zap, color: 'text-neon-yellow', points: 100, rarity: 'common' },
  { id: 3, name: 'DATA', icon: Disc, color: 'text-neon-pink', points: 200, rarity: 'uncommon' },
  { id: 4, name: 'SIGNAL', icon: Radio, color: 'text-green-400', points: 500, rarity: 'rare' },
  { id: 5, name: 'SECURE', icon: Shield, color: 'text-white', points: 1000, rarity: 'epic' },
  { id: 6, name: 'NETRUN', icon: Skull, color: 'text-neon-red', points: 5000, rarity: 'legendary' },
];

export const INITIAL_CREDITS = 1000000;
export const COST_PER_SPIN = 50;
