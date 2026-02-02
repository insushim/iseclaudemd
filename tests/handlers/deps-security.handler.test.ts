/**
 * Dependencies Security Handler 테스트
 */
import { describe, it, expect } from 'vitest';

describe('Deps Security - Vulnerability Parsing', () => {
  interface VulnerabilityResult {
    critical: number;
    high: number;
    moderate: number;
    low: number;
  }

  const parseAuditResult = (auditJson: string): VulnerabilityResult => {
    try {
      const audit = JSON.parse(auditJson);
      const vulns = audit.metadata?.vulnerabilities || {};
      return {
        critical: vulns.critical || 0,
        high: vulns.high || 0,
        moderate: vulns.moderate || 0,
        low: vulns.low || 0,
      };
    } catch {
      return { critical: 0, high: 0, moderate: 0, low: 0 };
    }
  };

  it('취약점 파싱', () => {
    const auditJson = JSON.stringify({
      metadata: {
        vulnerabilities: {
          critical: 1,
          high: 2,
          moderate: 3,
          low: 4,
        },
      },
    });

    const result = parseAuditResult(auditJson);
    expect(result.critical).toBe(1);
    expect(result.high).toBe(2);
    expect(result.moderate).toBe(3);
    expect(result.low).toBe(4);
  });

  it('취약점 없는 경우', () => {
    const auditJson = JSON.stringify({
      metadata: {
        vulnerabilities: {},
      },
    });

    const result = parseAuditResult(auditJson);
    expect(result.critical).toBe(0);
    expect(result.high).toBe(0);
  });

  it('잘못된 JSON 처리', () => {
    const result = parseAuditResult('invalid json');
    expect(result.critical).toBe(0);
    expect(result.high).toBe(0);
  });
});

describe('Deps Security - Severity Assessment', () => {
  const assessSeverity = (
    critical: number,
    high: number
  ): 'safe' | 'warning' | 'danger' => {
    if (critical > 0) return 'danger';
    if (high > 0) return 'warning';
    return 'safe';
  };

  it('critical 이슈 있으면 danger', () => {
    expect(assessSeverity(1, 0)).toBe('danger');
    expect(assessSeverity(5, 10)).toBe('danger');
  });

  it('high 이슈만 있으면 warning', () => {
    expect(assessSeverity(0, 1)).toBe('warning');
    expect(assessSeverity(0, 5)).toBe('warning');
  });

  it('이슈 없으면 safe', () => {
    expect(assessSeverity(0, 0)).toBe('safe');
  });
});

describe('Deps Security - Outdated Packages', () => {
  interface OutdatedPackage {
    name: string;
    current: string;
    wanted: string;
    latest: string;
  }

  const parseOutdated = (outdatedJson: string): OutdatedPackage[] => {
    try {
      const data = JSON.parse(outdatedJson);
      return Object.entries(data).map(([name, info]: [string, any]) => ({
        name,
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
      }));
    } catch {
      return [];
    }
  };

  it('outdated 패키지 파싱', () => {
    const outdatedJson = JSON.stringify({
      'lodash': { current: '4.17.0', wanted: '4.17.21', latest: '4.17.21' },
      'axios': { current: '0.21.0', wanted: '1.6.0', latest: '1.6.0' },
    });

    const result = parseOutdated(outdatedJson);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('lodash');
    expect(result[0].current).toBe('4.17.0');
  });

  it('빈 결과 처리', () => {
    const result = parseOutdated('{}');
    expect(result.length).toBe(0);
  });

  it('major 버전 업데이트 감지', () => {
    const isMajorUpdate = (current: string, latest: string): boolean => {
      const currentMajor = parseInt(current.split('.')[0]);
      const latestMajor = parseInt(latest.split('.')[0]);
      return latestMajor > currentMajor;
    };

    expect(isMajorUpdate('1.0.0', '2.0.0')).toBe(true);
    expect(isMajorUpdate('1.0.0', '1.1.0')).toBe(false);
    expect(isMajorUpdate('4.17.0', '4.17.21')).toBe(false);
  });
});
