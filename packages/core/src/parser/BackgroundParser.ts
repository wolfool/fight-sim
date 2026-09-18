// ============================================
// 자연어 격투 이력 파서 (한국어, 규칙 기반 + 키워드 매칭)
// confidence < 0.7 시 UI에서 드롭다운 보정 유도
// ============================================

import { ParsedBackground } from '../data/schemas';
import { normalizeArt, ART_ALIASES } from '../data/art-stats';

// ============================================
// 파싱 결과 타입
// ============================================

export interface ParseResult {
  parsed: ParsedBackground;
  warnings: string[];
  extracted: {
    arts: Array<{ art: string; confidence: number }>;
    durations: Array<{ value: number; unit: string; confidence: number }>;
    frequencies: Array<{ value: number; confidence: number }>;
  };
}

// ============================================
// 정규식 패턴들
// ============================================

const PATTERNS = {
  // 종목 (가장 긴 매칭 우선)
  arts: [
    /(브라질리안\s*주짓수|브라질\s*주짓수)/gi,
    /(주짓수|BJJ|bjj)/gi,
    /(무에타이|무에\s*타이|Muay\s*Thai|muaythai)/gi,
    /(타이복싱)/gi,
    /(킥복싱|킥\s*복싱|Kick\s*boxing)/gi,
    /(태권도|Taekwondo|TKD|tkd)/gi,
    /(유도|Judo|judo)/gi,
    /(레슬링|Wrestling|wrestling)/gi,
    /(삼보|Sambo|sambo)/gi,
    /(산타|Sanda|sanda)/gi,
    /(복싱|권투|Boxing|boxing)/gi,
    /(MMA|종합격투기|종합)/gi,
    /(그래플링|그라운드)/gi,
    /(클린치)/gi,
    /(타격|스트라이킹)/gi,
  ],
  
  // 기간 (개월/년)
  duration: [
    /(\d+(?:\.\d+)?)\s*(년|year|yr)/gi,
    /(\d+(?:\.\d+)?)\s*(개월|달|month|mon|mo)/gi,
    /(\d+(?:\.\d+)?)\s*(주|week|wk)/gi,
  ],
  
  // 빈도 (주당 횟수)
  frequency: [
    /(?<!격)(주|주당|매주|weekly)\s*(\d+)\s*(?:[-~]\s*(\d+)\s*)?(회|번|times?)/gi,
    /(\d+)\s*(회|번)\s*(주|주당|매주|weekly)/gi,
    /(\d+)\s*times?\s*(?:a|per)\s*(?:week|wk)/gi,
    /(\d+)\s*주일\s*(?:에|당)\s*(\d+)\s*(회|번)/gi,
    /(격주|biweekly)\s*(\d+)/gi,
    /(매일|daily)\s*(\d+)/gi,
  ],
  
  // 체육관/환경
  gym: [
    /(체육관|도장|짐|GYM|gym)\s*[:：]?\s*([^.,]+)/gi,
    /(코치|관장|마스터|사범)\s*[:：]?\s*([^.,]+)/gi,
  ],
};

// ============================================
// 메인 파서 클래스
// ============================================

export class BackgroundParser {
  private input: string = '';
  
  parse(input: string): ParseResult {
    this.input = input.trim();
    
    const extracted = {
      arts: this.extractArts(),
      durations: this.extractDurations(),
      frequencies: this.extractFrequencies(),
    };
    
    const parsed = this.buildParsedBackground(extracted);
    const warnings = this.generateWarnings(parsed, extracted);
    
    return { parsed, warnings, extracted };
  }
  
  // ============================================
  // 종목 추출
  // ============================================
  
  private extractArts(): Array<{ art: string; confidence: number }> {
    const results: Array<{ art: string; raw: string; confidence: number }> = [];
    const matched = new Set<string>();
    
    const sortedPatterns = [...PATTERNS.arts].sort((a, b) => {
      return b.source.length - a.source.length;
    });
    
    for (const pattern of sortedPatterns) {
      const matches = this.input.matchAll(pattern);
      for (const match of matches) {
        const raw = match[0].toLowerCase().trim();
        const normalized = normalizeArt(raw);
        if (!matched.has(normalized)) {
          matched.add(normalized);
          const confidence = Math.min(0.95, 0.6 + raw.length * 0.02);
          results.push({ art: normalized, raw, confidence });
        }
      }
    }
    
    // 포함관계 중복 제거 ("킥복싱" 안의 "복싱" 등)
    const kept = results.filter(
      (r1) => !results.some(
        (r2) => r2 !== r1 && r2.raw.includes(r1.raw) && r2.raw !== r1.raw
      )
    );
    
    if (kept.length === 0) {
      return [{ art: 'mma', confidence: 0.3 }];
    }
    
    return kept
      .map(({ art, confidence }) => ({ art, confidence }))
      .sort((a, b) => b.confidence - a.confidence);
  }
  
  // ============================================
  // 기간 추출 (개월 단위로 통일)
  // ============================================
  
  private extractDurations(): Array<{ value: number; unit: string; confidence: number }> {
    const results: Array<{ value: number; unit: string; confidence: number }> = [];
    
for (const pattern of PATTERNS.duration) {
      const matches = this.input.matchAll(pattern);
      for (const match of matches) {
        const valueStr = match[1];
        const unitStr = match[2];
        if (!valueStr || !unitStr) continue;
        const value = parseFloat(valueStr);
        const unit = unitStr.toLowerCase();
        
        let months: number;
        switch (unit) {
          case '년': case 'year': case 'yr':
            months = value * 12;
            break;
          case '개월': case '달': case 'month': case 'mon': case 'mo':
            months = value;
            break;
          case '주': case 'week': case 'wk':
            months = value / 4.33;
            break;
          default:
            months = value;
        }
        
        results.push({ value: Math.round(months), unit: 'months', confidence: 0.85 });
      }
    }
    
    return results;
  }
  
  // ============================================
  // 빈도 추출 (주당 횟수)
  // ============================================
  
  private extractFrequencies(): Array<{ value: number; confidence: number }> {
    const results: Array<{ value: number; confidence: number }> = [];
    
    for (const pattern of PATTERNS.frequency) {
      const matches = this.input.matchAll(pattern);
      for (const match of matches) {
        let value = NaN;
        for (const g of match.slice(1)) {
          if (g && /^\d+$/.test(g)) {
            const n = parseInt(g, 10);
            if (Number.isNaN(value) || n > value) value = n;
          }
        }
        if (Number.isNaN(value)) continue;
        
        // "격주" 처리
        if (match[0].includes('격주') || match[0].includes('biweekly')) {
          value = Math.ceil(value / 2);
        }
        // "매일" 처리
        if (match[0].includes('매일') || match[0].includes('daily')) {
          value = value * 7;
        }
        
        results.push({ value: Math.min(14, value), confidence: 0.8 });
      }
    }
    
    // "매일" 단독 표기 (횟수 없음) → 주 7회
    if (results.length === 0 && /(매일|daily)/i.test(this.input)) {
      results.push({ value: 7, confidence: 0.7 });
    }
    
    return results;
  }
  
  // ============================================
  // 체육관 추출
  // ============================================
  
  private extractGym(): string[] {
    const results: string[] = [];
    
    for (const pattern of PATTERNS.gym) {
      const matches = this.input.matchAll(pattern);
      for (const match of matches) {
        results.push(match[0].trim());
      }
    }
    
    return results;
  }
  
  // ============================================
  // 통합 파싱 결과 구성
  // ============================================
  
  private buildParsedBackground(extracted: any): ParsedBackground {
    // 주 종목 (가장 높은 신뢰도)
    const primaryArt = extracted.arts[0]?.art || 'mma';
    const artConfidence = extracted.arts[0]?.confidence || 0.3;
    
    // 수련 개월 (최대값 사용, 여러 개 있으면 가장 큰 것)
    const months = extracted.durations.length > 0
      ? Math.max(...extracted.durations.map((d: any) => d.value))
      : 0;
    const durationConfidence = extracted.durations.length > 0
      ? Math.max(...extracted.durations.map((d: any) => d.confidence))
      : 0;
    
    // 주당 빈도 (최대값)
    const frequency = extracted.frequencies.length > 0
      ? Math.max(...extracted.frequencies.map((f: any) => f.value))
      : 2; // 기본값
    const freqConfidence = extracted.frequencies.length > 0
      ? Math.max(...extracted.frequencies.map((f: any) => f.confidence))
      : 0.4;
    
    // 체육관 (첫 번째)
    const gymEnvironment = this.extractGym()[0] || undefined;
    
    // 전체 신뢰도 (가중 평균)
    const confidence = (
      artConfidence * 0.4 +
      durationConfidence * 0.25 +
      freqConfidence * 0.2 +
      0.15 // 전적 가중치 고정 (입력 안 받으므로)
    );
    
    return {
      primaryArt,
      experienceMonths: months,
      trainingFrequency: frequency,
      gymEnvironment,
      confidence: Math.round(confidence * 100) / 100,
    };
  }
  
  // ============================================
  // 경고 생성 (confidence 낮을 때)
  // ============================================
  
  private generateWarnings(parsed: ParsedBackground, extracted: any): string[] {
    const warnings: string[] = [];
    
    if (parsed.confidence < 0.7) {
      warnings.push('파싱 신뢰도가 낮습니다. 드롭다운에서 직접 선택해 주세요.');
    }
    
    if (extracted.arts.length > 1) {
      warnings.push(`여러 종목이 감지되었습니다: ${extracted.arts.map((a: any) => a.art).join(', ')}. 주 종목이 맞는지 확인해 주세요.`);
    }
    
    if (parsed.experienceMonths === 0) {
      warnings.push('수련 기간을 인식하지 못했습니다. 직접 입력해 주세요.');
    }
    
    if (extracted.frequencies.length === 0) {
      warnings.push('주당 훈련 횟수를 인식하지 못했습니다. 직접 선택해 주세요.');
    }
    
    return warnings;
  }
}

// ============================================
// 편의 함수
// ============================================

export function parseMartialArtsHistory(input: string): ParseResult {
  const parser = new BackgroundParser();
  return parser.parse(input);
}

// ============================================
// 드롭다운 옵션 생성 (UI용)
// ============================================

export const ART_OPTIONS = [
  { value: 'boxing', label: '복싱', aliases: ['복싱', '권투', 'boxing'] },
  { value: 'muaythai', label: '무에타이', aliases: ['무에타이', '무에 타이', 'Muay Thai'] },
  { value: 'bjj', label: '주짓수 (BJJ)', aliases: ['주짓수', 'BJJ', '브라질리안 주짓수', '브라질 주짓수', '그래플링'] },
  { value: 'wrestling', label: '레슬링', aliases: ['레슬링', 'Wrestling', '프리레슬링', '그레코로만'] },
  { value: 'judo', label: '유도', aliases: ['유도', 'Judo'] },
  { value: 'tkd', label: '태권도', aliases: ['태권도', 'Taekwondo', 'TKD'] },
  { value: 'kickboxing', label: '킥복싱', aliases: ['킥복싱', '킥 복싱', 'Kickboxing'] },
  { value: 'mma', label: 'MMA (종합격투기)', aliases: ['MMA', '종합격투기', '종합'] },
  { value: 'sambo', label: '삼보', aliases: ['삼보', 'Sambo'] },
  { value: 'sanda', label: '산타', aliases: ['산타', 'Sanda'] },
];

export const DURATION_OPTIONS = [
  { value: 0, label: '미입력' },
  { value: 1, label: '1개월' },
  { value: 3, label: '3개월' },
  { value: 6, label: '6개월' },
  { value: 12, label: '1년' },
  { value: 24, label: '2년' },
  { value: 36, label: '3년' },
  { value: 60, label: '5년' },
  { value: 120, label: '10년 이상' },
];

export const FREQUENCY_OPTIONS = [
  { value: 1, label: '주 1회' },
  { value: 2, label: '주 2회' },
  { value: 3, label: '주 3회' },
  { value: 4, label: '주 4회' },
  { value: 5, label: '주 5회' },
  { value: 6, label: '주 6회' },
  { value: 7, label: '매일' },
];

