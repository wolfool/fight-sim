import { describe, it, expect } from 'vitest';
import { BackgroundParser, parseMartialArtsHistory } from '../BackgroundParser';

const parse = (input: string) => new BackgroundParser().parse(input);

describe('BackgroundParser - 종목 추출', () => {
  it.each([
    ['복싱 6개월', 'boxing'],
    ['무에타이 1년', 'muaythai'],
    ['브라질리안 주짓수 6개월', 'bjj'],
    ['주짓수 2년', 'bjj'],
    ['레슬링 5년', 'wrestling'],
    ['유도 3년', 'judo'],
    ['태권도 3년', 'tkd'],
    ['킥복싱 6개월', 'kickboxing'],
    ['MMA 1년', 'mma'],
    ['종합격투기 6개월', 'mma'],
    ['삼보 2년', 'sambo'],
    ['산타 1년', 'sanda'],
    ['boxing 1 year', 'boxing'],
    ['Muay Thai 6 months', 'muaythai'],
  ])('%s → %s', (input, expected) => {
    expect(parse(input).parsed.primaryArt).toBe(expected);
  });

  it('미인식 입력은 기본값 mma + 낮은 신뢰도', () => {
    const r = parse('그냥 헬스장 다녀요');
    expect(r.parsed.primaryArt).toBe('mma');
    expect(r.parsed.confidence).toBeLessThan(0.7);
  });

  it('빈 입력도 크래시 없이 기본값 반환', () => {
    const r = parse('');
    expect(r.parsed.primaryArt).toBe('mma');
    expect(r.parsed.experienceMonths).toBe(0);
  });

  it('여러 종목 감지 시 경고 발생', () => {
    const r = parse('복싱과 주짓수 2년, 주 3회');
    expect(r.warnings.some((w) => w.includes('여러 종목'))).toBe(true);
  });
});

describe('BackgroundParser - 기간 추출', () => {
  it.each([
    ['복싱 6개월', 6],
    ['복싱 1년', 12],
    ['복싱 3주', 1],
    ['복싱 2.5년', 30],
    ['boxing 1 year', 12],
    ['boxing 6 months', 6],
  ])('%s → %d개월', (input, expected) => {
    expect(parse(input).parsed.experienceMonths).toBe(expected);
  });

  it('기간 미기입 → 0개월 + 경고', () => {
    const r = parse('복싱 다녀요');
    expect(r.parsed.experienceMonths).toBe(0);
    expect(r.warnings.some((w) => w.includes('수련 기간'))).toBe(true);
  });
});

describe('BackgroundParser - 빈도 추출', () => {
  it.each([
    ['복싱 6개월, 주 3회', 3],
    ['복싱 6개월, 주3회', 3],
    ['복싱 6개월, 주당 4회', 4],
    ['복싱 6개월, 매주 5회', 5],
    ['boxing 1 year, weekly 3 times', 3],
    ['boxing 1 year, 3 times a week', 3],
    ['복싱 1년, 1주일에 3번', 3],
    ['복싱 1년, 주 3-4회', 4],
  ])('%s → 주 %d회', (input, expected) => {
    expect(parse(input).parsed.trainingFrequency).toBe(expected);
  });

  it('격주 N회 → 절반(올림)', () => {
    expect(parse('주짓수 2년, 격주 3회').parsed.trainingFrequency).toBe(2);
  });

  it('매일 N회 → 주 7N회 (상한 14)', () => {
    expect(parse('태권도 3년, 매일 2회').parsed.trainingFrequency).toBe(14);
  });

  it('매일 단독 표기 → 주 7회', () => {
    expect(parse('복싱 6개월, 매일 조금씩').parsed.trainingFrequency).toBe(7);
  });

  it('빈도 미기입 → 기본 2회 + 경고', () => {
    const r = parse('무에타이 1년');
    expect(r.parsed.trainingFrequency).toBe(2);
    expect(r.warnings.some((w) => w.includes('훈련 횟수'))).toBe(true);
  });

  it('주짓수의 "주"를 빈도로 오인하지 않음', () => {
    const r = parse('주짓수 2년, 주 3회');
    expect(r.parsed.primaryArt).toBe('bjj');
    expect(r.parsed.trainingFrequency).toBe(3);
    expect(r.parsed.experienceMonths).toBe(24);
  });
});

describe('BackgroundParser - 신뢰도/경고', () => {
  it('모든 요소 인식 시 신뢰도 >= 0.7', () => {
    const r = parse('복싱 6개월, 주 3회');
    expect(r.parsed.confidence).toBeGreaterThanOrEqual(0.7);
    expect(r.warnings).toHaveLength(0);
  });

  it('extracted 구조에 파싱 근거 포함', () => {
    const r = parse('복싱 6개월, 주 3회');
    expect(r.extracted.arts.length).toBeGreaterThan(0);
    expect(r.extracted.durations.length).toBeGreaterThan(0);
    expect(r.extracted.frequencies.length).toBeGreaterThan(0);
  });

  it('parseMartialArtsHistory 편의 함수 동작', () => {
    const r = parseMartialArtsHistory('복싱 6개월, 주 3회');
    expect(r.parsed.primaryArt).toBe('boxing');
  });
});
