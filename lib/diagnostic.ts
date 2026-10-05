// 진단 내용은 이 파일 하나만 바꾸면 됩니다.
// 아래 문항과 요인은 화면 확인용 샘플이며, 실제 진단 문항으로 교체할 예정입니다.

export const DIAGNOSTIC = {
  title: "감성지수(EQ) 진단",
  subtitle: "다니엘 골먼의 5가지 감성지능으로 나의 균형을 확인해 보세요",
  courseTitle: "감성지능 워크숍",
  instructor: "보람 강사",
};

// 체크 척도
export const SCALE = [
  { value: 0, label: "아니다" },
  { value: 1, label: "보통이다" },
  { value: 2, label: "그렇다" },
] as const;
export const SCALE_MIN = 0;
export const SCALE_MAX = 2;

export type Factor = {
  id: string;
  no: number;
  name: string;
  english: string;
  color: string; // hex
  summary: string;
  high: string[]; // 높을 때 강점
  low: string[]; // 낮을 때 나타나기 쉬운 모습
  grow: string[]; // 기르는 방법
};

// 오각형 꼭짓점 순서 = 배열 순서 (맨 위부터 시계 방향)
export const FACTORS: Factor[] = [
  {
    id: "selfAwareness",
    no: 1,
    name: "자기이해",
    english: "Self-Awareness",
    color: "#6366f1",
    summary: "지금 내가 느끼는 감정과 그 감정이 내 표정·말·행동에 주는 영향을 알아차리는 능력",
    high: ["감정이 올라오는 순간을 빨리 알아차린다", "자신의 강점과 한계를 솔직하게 말할 수 있다", "비판을 받아도 이유를 생각하고 내 의견을 분명히 말한다"],
    low: ["기분이 표정이나 말투에 드러나는 것을 늦게 알아차린다", "말하고 나서 후회하는 일이 잦다", "피드백을 방어적으로 받아들이기 쉽다"],
    grow: [
      "하루 세 번 '지금 내 감정은?' 하고 감정에 이름 붙이기 (감정 일기)",
      "감정이 크게 움직인 순간의 상황·생각·반응을 한 줄씩 기록하기",
      "나의 장점 10가지를 적고 가까운 동료에게 확인받기",
    ],
  },
  {
    id: "selfRegulation",
    no: 2,
    name: "감정조절",
    english: "Self-Regulation",
    color: "#0ea5e9",
    summary: "부정적인 상황을 긍정적으로 재해석하고 감정을 다스려 반응을 선택하는 능력",
    high: ["실패나 꾸중을 성장의 기회로 받아들인다", "우울한 기분에서 빨리 회복한다", "반대 의견도 관심의 표현으로 해석한다"],
    low: ["부정적인 일을 오래 곱씹는다", "비판을 받으면 감정이 쉽게 흔들린다", "과거의 일에 얽매이기 쉽다"],
    grow: [
      "감정이 올라오면 6초 멈추고 심호흡한 뒤 말하기",
      "속상한 일을 '이 일에서 배운 점은?'으로 다시 써 보기 (리프레이밍)",
      "잠들기 전 오늘 감사한 일 3가지 적기",
    ],
  },
  {
    id: "motivation",
    no: 3,
    name: "자기동기화",
    english: "Motivation",
    color: "#22c55e",
    summary: "스스로 목표를 세우고 어려움 속에서도 열정과 끈기로 나아가는 능력",
    high: ["분명한 목표가 있고 쉽게 포기하지 않는다", "현상 유지보다 성장을 위해 노력한다", "장애를 만나도 좋은 결과를 확신한다"],
    low: ["성과가 바로 보이지 않으면 쉽게 지친다", "하고 싶은 일이나 목표가 막연하다", "외부의 인정이 없으면 의욕이 떨어진다"],
    grow: [
      "올해 꼭 이루고 싶은 목표 하나를 적고 동료에게 선언하기",
      "큰 목표를 일주일 단위의 작은 목표로 나누어 체크하기",
      "작년의 나와 비교해 성장한 점 3가지 적기",
    ],
  },
  {
    id: "empathy",
    no: 4,
    name: "타인이해",
    english: "Empathy",
    color: "#f59e0b",
    summary: "상대의 말뿐 아니라 표정과 태도에서 감정을 읽고 그 마음에 공감하는 능력",
    high: ["표정과 태도까지 살피며 듣는다", "상대의 장점을 빨리 찾는다", "상대의 실망이나 아픔에 마음을 쓴다"],
    low: ["사실 위주로 반응해 차갑게 느껴질 수 있다", "상대의 감정 신호를 놓치기 쉽다", "내 입장에서 먼저 판단한다"],
    grow: [
      "대화 중 '그래서 ~해서 속상했겠네요'처럼 감정까지 되돌려 말하기",
      "회의에서 가장 조용한 사람의 의견을 먼저 묻기",
      "의견이 다른 사람의 입장을 그 사람 관점에서 3줄로 써 보기",
    ],
  },
  {
    id: "socialSkills",
    no: 5,
    name: "사회적 인간관계",
    english: "Social Skills",
    color: "#ec4899",
    summary: "다른 사람과 상황에 유연하게 맞추고 새로운 환경에서도 관계를 잘 맺는 능력",
    high: ["다른 의견을 듣고 생각을 바꿀 줄 안다", "새로운 조직과 분위기에 쉽게 적응한다", "막힐 때 여러 해결 방법을 떠올린다"],
    low: ["한번 정한 생각을 바꾸기 어렵다", "낯선 환경이나 사람에게 적응이 느리다", "상황이 나빠지면 걱정이 앞선다"],
    grow: [
      "이번 주 다른 부서 동료 한 명과 대화 시간 갖기",
      "의견이 다를 때 '그럴 수도 있겠다'로 먼저 받아 주기",
      "문제를 만나면 해결 방법을 3가지 이상 적어 보고 고르기",
    ],
  },
];

export type Question = {
  id: string;
  factorId: string;
  text: string;
  reverse?: boolean; // 역채점 문항
};

// 감성지수 검사지 (보람 강사) 원문
const RAW: Record<string, (string | [string, "reverse"])[]> = {
  selfAwareness: [
    "운전을 하다가(길을 찾다가) 헤매게 되었을 때 자기가 초조해 하고 있는 것을 깨닫는다.",
    "초조한 감정에 사로잡혀 있을 때 문득 자기의 표정이 어둡다는 것을 깨닫는다.",
    "상대방의 이야기를 듣고 나서 그 사람이 자기와 마음이 통하는지 그렇지 않은지를 잘 판단하는 편이다.",
    "사회생활에서 자기의 입장을 의식하고 발언하는 경우가 많다.",
    "상대에게 갑자기 비판을 받았을 때 그 이유에 대해서 생각하는 한편 자기의 의견은 분명하게 말한다.",
    "자기의 장점에 대해서 10가지 정도 서슴없이 말할 수 있다.",
    "생각대로 일이 진행되지 않을 때 자기가 초조해 하고 있다는 것을 깨닫는다.",
    "동료가 한잔하러 가자고 유혹하더라도 거절하고 싶을 때에는 깨끗하게 거절할 수 있다.",
    "기분 나쁜 취급을 받았을 때 화를 내고 있는 자기의 상태를 알 수 있다.",
    ["일단 말을 한 뒤에 왜 그때, 그 상황에서 그런 말을 했는지 스스로 후회하는 경우가 많다.", "reverse"],
  ],
  selfRegulation: [
    "아침에 일어났을 때 오늘도 즐거운 하루를 만들겠다는 각오를 다진다.",
    "실패는 성공을 위한 경험이라고 생각한다.",
    "선배나 팀장에게 꾸중을 들었을 때 나에게 기대를 가지고 있기 때문이라고 좋게 생각할 수 있다.",
    "험담에 상처를 입었을 때, 반대 상황에서 어떤 기분이 드는지에 대한 공부를 했다고 좋게 생각할 수 있다.",
    "밤에 잠들기 전에 오늘도 무사히 보낼 수 있었다는 점에 감사한다.",
    "우울한 기분에 빠졌을 때 나보다 더 불행한 사람이 있다는 생각을 하고 밝은 쪽으로 마음을 정리한다.",
    "내 의견에 반대 의견을 제시한 사람에 대해, 내 말에 귀를 기울이고 있기 때문이라고 생각한다.",
    "일이 뜻대로 진행되지 않을 때 능력이 없는 사람이라고 생각하지 않고 운이(방법이) 나빴을 뿐이라고 생각한다.",
    "자기 자신은 플러스 사고를 하는 사람이라고 생각한다.",
    "과거에 얽매여서 아웅다웅하는 것보다는 앞으로 가능한 일에 노력을 기울이는 편이다.",
  ],
  motivation: [
    "중요한 것은 자기 나름대로 열심히 연구하고 노력하는 태도라고 생각한다.",
    "단 한 번뿐인 인생이기 때문에 기회를 놓치지 않도록 열심히 도전하고 있다.",
    "앞으로 하고 싶은 일이 산더미처럼 많이 있다고 생각한다.",
    "현재를 열심히 살다 보면 자연스럽게 좋은 결과가 나타날 것이라고 생각한다.",
    "반드시 성공하고 싶은 분명한 목표가 있다.",
    "현상 유지가 아니라 더욱 좋아지기 위해 노력하고 있다.",
    "목표 달성을 위해서라면 어느 정도 고통스럽고 힘든 일이라도 참고 노력할 수 있다.",
    "장애를 만나더라도 마지막에는 반드시 좋은 결과를 얻을 수 있을 것이라고 확신하고 포기하지 않는다.",
    "작년보다는 올해 더 성장했다고 생각한다.",
    "자기의 목표를 작성해서 누군가에게 선언하고 있다.",
  ],
  empathy: [
    "상대의 괴로운 이야기를 듣고 자기도 모르게 눈물을 흘리는 경우가 많다.",
    "다른 사람의 이야기를 들을 때 말뿐만 아니라 표정이나 태도에도 신경을 쓴다.",
    "“이런”, “세상에”, “그래?”와 같은 감탄사가 자연스럽게 튀어나온다.",
    "대중교통을 이용할 때 노약자에게 자리를 양보하는 경우가 많다.",
    "대화를 나누고 있는 상대의 장점을 즉시 파악할 수 있다.",
    "만난 적이 없는 사람과의 통화에서도 상대의 마음을 동정한다.",
    "나에게 함께 어울리자는 다른 사람의 권유를 거절할 때, 실망할 상대의 마음을 동정한다.",
    "지하철이나 버스에서 사람들의 표정을 보고 그 사람의 생활을 짐작해 보는 것을 좋아한다.",
    "길가에 활짝 피어 있는 꽃을 보고 마음의 위로를 받을 때가 자주 있다.",
    "책을 읽거나 드라마를 보고 있으면 자기도 모르게 그 줄거리에 흠뻑 빠져 버린다.",
  ],
  socialSkills: [
    "한번 결심한 일이라도 다른 사람의 의견을 듣고 다시 한번 생각하고 결정 내릴 가능성이 있다.",
    "사려고 하는 물품이 없을 때 비슷한 게 있으면 그냥 그것으로 산다.",
    "생각이나 행동을 바꾸는 동료를 보며 그럴 수도 있다고 생각한다.",
    "사태가 악화되는 경우에도 다른 방법을 찾는다.",
    "좋은 게 좋은 거라고 판단하고 행동하는 경향이 많다.",
    "걱정을 잘 안 하는 편이다.",
    "다른 부서, 직장으로 이직해도 쉽게 분위기에 적응할 수 있다.",
    "패션은 유행을 따르는 편이다.",
    "힘든 상황에서도 다행인 점을 생각하고 감사한다.",
    "일을 해결할 때 여러 가지 방법이 떠오른다.",
  ],
};

export const QUESTIONS: Question[] = FACTORS.flatMap((f) =>
  RAW[f.id].map((item, i) => {
    const [text, flag] = Array.isArray(item) ? item : [item, undefined];
    return { id: `${f.no}-${i + 1}`, factorId: f.id, text, reverse: flag === "reverse" || undefined };
  }),
);

// 영역 점수 만점
export const FACTOR_MAX = 10 * SCALE_MAX;

// ---------- 계산 ----------

export type Participant = { name: string; group: string };

export type ActionPlan = { strengthen: string; improve: string; remember: string };

export type DiagnosticResult = {
  id: string;
  participant: Participant;
  submittedAt: string;
  answers: Record<string, number>;
  factorScores: Record<string, number>; // 영역별 합계 (0~FACTOR_MAX)
  total: number; // 전체 합계 (0~FACTOR_MAX*5)
  topFactorId: string;
  lowFactorId: string;
  range: number; // 최고-최저 영역 점수 차 (균형 지표)
  actionPlan?: ActionPlan;
};

export function scoreAnswers(answers: Record<string, number>) {
  const factorScores: Record<string, number> = {};
  for (const f of FACTORS) factorScores[f.id] = 0;
  for (const q of QUESTIONS) {
    const raw = answers[q.id];
    if (raw == null) continue;
    factorScores[q.factorId] += q.reverse ? SCALE_MAX + SCALE_MIN - raw : raw;
  }
  const values = FACTORS.map((f) => factorScores[f.id]);
  // 동점이면 진단지 순서가 앞선 영역
  const top = FACTORS.reduce((a, b) => (factorScores[b.id] > factorScores[a.id] ? b : a));
  const low = FACTORS.reduce((a, b) => (factorScores[b.id] < factorScores[a.id] ? b : a));
  return {
    factorScores,
    total: values.reduce((a, b) => a + b, 0),
    range: Math.max(...values) - Math.min(...values),
    topFactorId: top.id,
    lowFactorId: low.id,
  };
}

// 영역 점수 수준 (0~20 기준)
export function levelOf(score: number) {
  if (score >= 16) return { label: "높음", tone: "high" as const };
  if (score >= 10) return { label: "보통", tone: "mid" as const };
  return { label: "낮음", tone: "low" as const };
}

// 균형 해석: 최고-최저 영역 점수 차이로 판단
export function balanceOf(range: number) {
  if (range <= 4)
    return { label: "균형형", text: "다섯 영역이 고르게 발달해 있습니다. 전체 수준을 함께 끌어올리는 데 집중해 보세요." };
  if (range <= 8)
    return { label: "약간 치우침", text: "강점 영역이 뚜렷합니다. 가장 낮은 영역 하나를 골라 집중적으로 연습해 보세요." };
  return { label: "불균형", text: "영역 간 차이가 큽니다. 강점이 약점을 가리지 않도록 낮은 영역을 먼저 보완해 보세요." };
}

export function getFactor(id: string) {
  return FACTORS.find((f) => f.id === id);
}

export function isValidAnswers(answers: unknown): answers is Record<string, number> {
  if (!answers || typeof answers !== "object") return false;
  const a = answers as Record<string, unknown>;
  return QUESTIONS.every((q) => {
    const v = a[q.id];
    return Number.isInteger(v) && (v as number) >= SCALE_MIN && (v as number) <= SCALE_MAX;
  });
}
