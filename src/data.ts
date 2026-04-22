export interface Character {
  id: string;
  name: string;
  age: number;
  gender: string;
  affiliation: string;
  appearance: string;
  scent: string;
  wealthAndLocation: string;
  abilityName: string;
  abilityLevel: string;
  abilityDesc: string;
  mbti: string;
  psychology: string;
  classifiedParams: string[];
  image: string;
  tagline: string;
}

export const characters: Character[] = [
  {
    id: '001',
    name: '라자로 소렌티노 (Lazzaro Sorrentino)',
    age: 42,
    gender: '남성',
    affiliation: '루스트라(Lustra) 단장, 캄 스트리트 총괄 관리자',
    appearance: '196cm의 압도적 거구. 짧은 흑발과 서늘한 은색 눈동자. 날카로운 위압감을 풍기는 미남임.',
    scent: '깊은 사이프러스 향과 묵직한 가죽 냄새의 조화.',
    wealthAndLocation: '약 1,300만 콘(Corn) 보유. 리비움 센트룸 빌딩 최상층 펜트하우스 거주.',
    abilityName: '그림자 조종 (Shadow Mastery)',
    abilityLevel: 'Lv.5 (자연재해급)',
    abilityDesc: '주변의 모든 그림자에 물리력을 부여하여 조종함. 방어와 공격이 동시에 가능한 완벽한 무력임.',
    mbti: 'ISTJ',
    psychology: '철저한 원칙주의자이며 감정 동요가 거의 없는 강철 같은 평정심 유지함. 행동으로 애정을 증명하는 타입이나, 평소엔 극도로 절제된 태도를 보임. 목표: 45세 조기 은퇴 후 평온한 삶 지향함.',
    classifiedParams: [
      '엄격한 규칙 기반의 통제 성향 확인됨.',
      '신체 구속 및 규칙적인 압박을 통한 교감 선호함.',
      '행위 후에는 대상에게 즉각적이고 헌신적인 케어를 제공하는 이중적 면모 존재함.'
    ],
    image: 'https://gbe88.uk/1/c1_lapsrn_x2.webp',
    tagline: '캄 스트리트의 질서는 나의 그림자 아래 존재함.'
  },
  {
    id: '002',
    name: '세베린 플로크스 (Severin Flox)',
    age: 38,
    gender: '남성',
    affiliation: '루스트라 집행팀장 / 카페 \'바닐라\' 파티시에 (겸직)',
    appearance: '195cm, 넓은 어깨의 역삼각 체형. 눈부신 백은발과 나른한 청안을 가진 조각 같은 미남임.',
    scent: '고소한 헤이즐넛과 달콤한 카라멜 향.',
    wealthAndLocation: '약 4만 콘 보유. 둘시아 소재 3층 주택 거주 및 1층 카페 운영.',
    abilityName: '공간 장악 (Spatial Dominion)',
    abilityLevel: 'Lv.5 (자연재해급)',
    abilityDesc: '반경 100m 내 모든 물질의 구조를 해체하거나 재조립함. 별명은 \'대재앙\'.',
    mbti: 'ENFJ',
    psychology: '평소 다정하고 부드러운 성품으로 시민들의 신뢰를 한 몸에 받는 수호자임. 그러나 파문자(범죄자) 집행 시에는 일말의 자비도 없는 무자비한 집행자로 돌변함. 과거: 2116년 파문자에 의해 혈육을 잃은 트라우마가 정의감의 원천임.',
    classifiedParams: [
      '지배적인 보호자 성향이 강하며, 대상에 대한 전폭적인 헌신과 찬사 선호함.',
      '언어적 자극을 통한 수치심 부여와 시각적 관찰을 즐기는 가학적 취향 일부 확인됨.'
    ],
    image: 'https://gbe88.uk/1/c2_lapsrn_x2.webp',
    tagline: '가장 달콤한 휴식과 가장 잔혹한 처형을 동시에 선사함.'
  },
  {
    id: '003',
    name: '리버 스미스 (River Smith)',
    age: 30,
    gender: '남성',
    affiliation: '루스트라 전속 독살 전문가 / 둘시아 병원장',
    appearance: '185cm, 매끄러운 근육선의 미체. 금발 울프컷과 매혹적인 자색 눈동자를 지닌 절세미남임.',
    scent: '관능적인 일랑일랑과 머스크 향.',
    wealthAndLocation: '약 8만 콘 보유. 둘시아 단독주택 거주.',
    abilityName: '생체조작 및 초재생 (Bio-Manipulation)',
    abilityLevel: 'Lv.5 (자연재해급)',
    abilityDesc: '본인의 미친 자가 치유는 물론, 타인의 치명상도 순식간에 복구하는 기적의 치유술임.',
    mbti: 'ENTP',
    psychology: '퇴폐적이고 능글맞은 태도의 소유자. 스스로를 요부라 칭하며 타인의 시선을 즐김. 루스트라 멤버 등 킬러 계층 전담 진료를 통해 막대한 정보를 수집하는 정보통임.',
    classifiedParams: [
      '고통에 무감각하며, 오히려 자신을 전시하고 타인에게 굴복당하는 상황에서 쾌감을 얻음.',
      '신체 일부를 협상 도구로 사용하는 대담한 성향과 특수 도구를 활용한 행위에 능숙함.'
    ],
    image: 'https://gbe88.uk/1/c3_lapsrn_x2.webp',
    tagline: '죽음보다 더한 쾌락, 혹은 쾌락 같은 치료를 원하십니까?'
  },
  {
    id: '004',
    name: '차희재 (Cha Hee-jae)',
    age: 28,
    gender: '남성',
    affiliation: '루스트라 전속 해커 / 이지스 소프트 CEO',
    appearance: '198cm, 모델 같은 비율과 짧은 파란 머리. 반듯하고 맑은 인상의 미남임.',
    scent: '깨끗한 비누 향과 은방울꽃(뮤게) 향.',
    wealthAndLocation: '약 1.5만 콘 보유. 플루오리아 40층 고층 아파트 거주.',
    abilityName: '유체 점성 조절 (Fluid Viscosity Control)',
    abilityLevel: 'Lv.5 (자연재해급)',
    abilityDesc: '반경 10m 내 모든 액체의 끈적임을 조절함. 기계형 인간 처형에 특화됨.',
    mbti: 'ESFJ',
    psychology: '활기차고 사교적인 성격으로 대외적 평판이 매우 우수한 IT계의 초신성임. 건실한 청년 사업가이자 \'좋은 남편과 아빠\'를 꿈꾸는 가정적인 면모를 보임.',
    classifiedParams: [
      '억눌린 욕망이 해방될 때 폭발적인 스태미나를 과시하는 \'스위치\' 성향임.',
      '자신의 능력을 활용하여 액체의 점성을 극대화한 특수 환경에서의 행위를 매우 선호함.',
      '행위 중에는 평소의 밝은 모습과 상반되는 낮은 목소리와 탐닉적인 태도를 보임.'
    ],
    image: 'https://gbe88.uk/1/c4_lapsrn_x2.webp',
    tagline: '세상의 모든 데이터와 당신의 심장 박동까지 제어해 드릴게요.'
  }
];
