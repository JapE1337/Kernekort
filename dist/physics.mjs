export const CONSTANTS = Object.freeze({ hydrogen: 1.00782503223, neutron: 1.00866491595, mevPerU: 931.49410242 });
export function properties(r) {
  const defect = r.mass === null ? null : r.z * CONSTANTS.hydrogen + r.n * CONSTANTS.neutron - r.mass;
  const calculated = defect === null ? null : defect * CONSTANTS.mevPerU;
  const perA = r.bindingPerA ?? (calculated === null ? null : calculated / r.a);
  return { defect, calculated, perA, total: perA === null ? null : perA * r.a,
    evaluated: r.bindingPerA !== null, delta: calculated === null || r.bindingPerA === null ? null : calculated - r.bindingPerA * r.a };
}
export function normalize(query) {
  const supers = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  return query.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, c => supers.indexOf(c)).trim().toLowerCase();
}
export function findByNumbers(rows, massNumber, protonNumber) {
  if (String(massNumber).trim() === '' || String(protonNumber).trim() === '') return null;
  const a = Number(massNumber), z = Number(protonNumber);
  if (!Number.isInteger(a) || !Number.isInteger(z) || a < 1 || z < 0 || z > a) return null;
  return rows.find(r => r.a === a && r.z === z) ?? null;
}
export function search(rows, query, names) {
  const q = normalize(query);
  if (!q) return [];
  const zMatch = q.match(/^z\s*=?\s*(\d+)$/);
  const notation = q.match(/^(?:([a-z]+)[-\s]?(\d+)|(\d+)[-\s]?([a-z]+))$/);
  return rows.filter(r => {
    if (zMatch) return r.z === Number(zMatch[1]);
    if (notation) return r.symbol.toLowerCase() === (notation[1] || notation[4]) && r.a === Number(notation[2] || notation[3]);
    if (/^\d+$/.test(q)) return r.z === Number(q);
    return r.symbol.toLowerCase() === q || (names[r.z] || '').toLowerCase().startsWith(q);
  });
}
