import {
  automotiveUpdateCallsToAction,
  automotiveUpdateDoctrine,
  automotiveUpdateFormulas,
  automotiveUpdateSources,
  type DoctrinePillar,
  type DoctrineStatement,
} from './automotive-update-doctrine';

export const CORE_DOCTRINE_ID = 'BRIAN_KRAMER_CORE_DOCTRINE_V1' as const;
export const CORE_DOCTRINE_VERSION = '1.0.0' as const;
export const CORE_DOCTRINE_STATUS = 'active' as const;
export const CORE_DOCTRINE_CANONIZED_AT = '2026-07-11' as const;

export const coreDoctrineRules = [
  'Approved doctrine is authoritative for public content, playbooks and editorial decisions.',
  'Approved-with-qualification doctrine must preserve its qualification wherever consumed.',
  'Held claims must not appear as factual public claims until their evidence requirements are satisfied.',
  'Retired claims must not be reintroduced through page copy, metadata, structured data or generated content.',
  'No consumer may silently change a formula denominator, proxy or qualification.',
  'Source editions remain canonical LinkedIn records; this registry governs durable interpretation.',
] as const;

export const coreDoctrine = automotiveUpdateDoctrine.filter(
  (
    statement,
  ): statement is DoctrineStatement & {
    status: 'approved' | 'approved-with-qualification';
  } =>
    statement.status === 'approved' ||
    statement.status === 'approved-with-qualification',
);

export const coreDoctrineByPillar = coreDoctrine.reduce<
  Record<DoctrinePillar, typeof coreDoctrine>
>(
  (registry, statement) => {
    registry[statement.pillar].push(statement);
    return registry;
  },
  {
    acquisition: [],
    'appraisal-efficiency': [],
    trust: [],
    'ai-visibility': [],
    'used-car-economics': [],
    'operating-execution': [],
  },
);

export const coreDoctrineFormulas = automotiveUpdateFormulas;
export const coreDoctrineCallsToAction = automotiveUpdateCallsToAction;
export const coreDoctrineSources = automotiveUpdateSources;

export const coreDoctrineManifest = {
  id: CORE_DOCTRINE_ID,
  version: CORE_DOCTRINE_VERSION,
  status: CORE_DOCTRINE_STATUS,
  canonizedAt: CORE_DOCTRINE_CANONIZED_AT,
  pillars: Object.keys(coreDoctrineByPillar) as DoctrinePillar[],
  statementCount: coreDoctrine.length,
  formulaCount: coreDoctrineFormulas.length,
  sourceCount: coreDoctrineSources.length,
  rules: coreDoctrineRules,
} as const;
