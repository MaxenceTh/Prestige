import { describe, it, expect } from 'vitest';

describe('Test de survie', () => {
  it('devrait confirmer que 2 + 2 font 4', () => {
    expect(2 + 2).toBe(4);
  });

  it('devrait confirmer que les tests fonctionnent', () => {
    const message = "Hello Vitest";
    expect(message).toContain("Hello");
  });
});