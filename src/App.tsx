/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { characters, Character } from './data';

type AppMode = 'evoracum' | 'arca';
type EvoracumTab = 'home' | 'map' | 'profile' | 'system';
type ArcaTab = 'list' | 'switch' | 'detail';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [appMode, setAppMode] = useState<AppMode>('evoracum');
  const [evoTab, setEvoTab] = useState<EvoracumTab>('home');
  const [arcaTab, setArcaTab] = useState<ArcaTab>('list');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const switchToArca = (charId?: string) => {
    setAppMode('arca');
    if (charId) {
      setSelectedCharacterId(charId);
      setArcaTab('detail');
    } else {
      setArcaTab('list');
    }
  };

  const switchToEvo = () => {
    setAppMode('evoracum');
    setEvoTab('home');
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 flex flex-col ${appMode === 'evoracum' ? 'bg-cyber-bg text-gray-100 font-sans' : 'arca-container font-sans'}`}>
      <AnimatePresence>
        {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
      <main className={`flex-1 w-full ${appMode === 'evoracum' ? 'max-w-3xl' : 'max-w-5xl'} mx-auto pb-24 relative overflow-x-hidden flex flex-col justify-center`}>
        <AnimatePresence mode="wait">
          {appMode === 'evoracum' ? (
            <motion.div
              key="evoracum"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {evoTab === 'home' && <EvoracumHome />}
              {evoTab === 'map' && <EvoracumMap />}
              {evoTab === 'profile' && (
                <div className="text-center mt-20">
                  <h2 className="text-2xl font-bold mb-4 text-glow">👤 인물 정보</h2>
                  <p className="text-gray-400 mb-8">시민증을 로드 중입니다...</p>
                  <button 
                    onClick={() => switchToArca()}
                    className="px-6 py-3 border border-neon-blue text-neon-blue rounded hover:bg-neon-blue hover:text-cyber-bg transition-colors shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  >
                    아르카 데이터베이스 접속
                  </button>
                </div>
              )}
              {evoTab === 'system' && <EvoracumSystem />}
            </motion.div>
          ) : (
            <motion.div
              key="arca"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="arca-document-frame p-6 md:p-10 my-4 md:my-8 mx-4 shadow-xl relative min-h-[720px] flex flex-col"
            >
              {arcaTab === 'list' && (
                <ArcaList onSelect={(id) => { setSelectedCharacterId(id); setArcaTab('detail'); }} />
              )}
              {arcaTab === 'switch' && (
                <ArcaList onSelect={(id) => { setSelectedCharacterId(id); setArcaTab('detail'); }} highlight="switch" />
              )}
              {arcaTab === 'detail' && selectedCharacterId && (
                <ArcaDetail character={characters.find(c => c.id === selectedCharacterId)!} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md pb-safe transition-colors duration-500 ${appMode === 'evoracum' ? 'bg-cyber-bg/80 border-t border-gray-800' : 'arca-nav-bar h-[50px] shadow-[0_-5px_15px_rgba(0,0,0,0.15)] flex justify-center items-center gap-[40px] font-light text-[13px] border-none'}`}>
        <div className={`mx-auto flex justify-between items-center px-2 sm:px-4 h-full w-full ${appMode === 'evoracum' ? 'max-w-3xl' : 'max-w-4xl justify-center gap-6 md:gap-[40px]'}`}>
          {appMode === 'evoracum' ? (
            <>
              <NavButton active={evoTab === 'home'} onClick={() => setEvoTab('home')} color="neon">🏠 홈</NavButton>
              <NavButton active={evoTab === 'map'} onClick={() => setEvoTab('map')} color="neon">📜 에보라쿰 지도</NavButton>
              <NavButton active={evoTab === 'profile'} onClick={() => setEvoTab('profile')} color="neon">👤 인물 정보</NavButton>
              <NavButton active={evoTab === 'system'} onClick={() => setEvoTab('system')} color="neon">⚙️ 시스템</NavButton>
            </>
          ) : (
            <>
              <NavButton active={arcaTab === 'list'} onClick={() => setArcaTab('list')} color="arca" isArca>📂 목록으로</NavButton>
              <NavButton active={arcaTab === 'switch'} onClick={() => setArcaTab('switch')} color="arca" isArca>👤 인물 전환</NavButton>
              <NavButton active={arcaTab === 'detail'} onClick={() => { if(selectedCharacterId) setArcaTab('detail'); else setArcaTab('list'); }} color="arca" isArca>📑 상세 파일</NavButton>
              <NavButton active={false} onClick={switchToEvo} color="arca" isArca>🔓 로그아웃</NavButton>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

// ==========================================
// Evoracum Views
// ==========================================

function EvoracumHome() {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <div className="space-y-10">
      <header className="mb-4 border-b border-gray-800 pb-6 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-concord-gold mb-2 text-glow">EVORACUM</h1>
        <p className="text-sm text-gray-400 tracking-widest uppercase">신입 시민을 위한 정착 가이드</p>
      </header>

      <div className="text-center">
        {!showTerminal && (
          <button 
            onClick={() => setShowTerminal(true)}
            className="w-full sm:w-auto px-6 py-4 bg-gray-900 border border-neon-blue text-neon-blue font-bold rounded shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:bg-neon-blue hover:text-gray-900 transition-all duration-300"
          >
            🖥️ 에보라쿰 정착 페르소나 추천 (접속)
          </button>
        )}
      </div>

      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <PersonaTerminal onClose={() => setShowTerminal(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <section>
        <h2 className="text-xl font-bold text-neon-blue mb-4 border-l-4 border-neon-blue pl-3">
          <div className="flex items-center gap-2"><span>🌌</span> 배경</div>
          <div className="text-[0.9em] font-medium opacity-90 mt-1">: 진화적 구원, 레스큐(Rescue)</div>
        </h2>
        <ul className="space-y-3 text-gray-300 text-[0.95rem] leading-relaxed">
          <li className="flex items-start"><span className="text-neon-blue mr-2">▪</span> 2062년 환경파괴로 인한 멸망 직전, 유전자 변이로 첫 이능력 발현함</li>
          <li className="flex items-start"><span className="text-neon-blue mr-2">▪</span> 인류 존속의 열쇠가 된 이 능력을 '진화적 구원'이라는 의미의 '레스큐'라 명명함</li>
          <li className="flex items-start"><span className="text-neon-blue mr-2">▪</span> 현재 인류의 72%가 이능력자이며, 무능력자(Lv.0)부터 자연재해급(Lv.5)까지 경지가 나뉨</li>
          <li className="flex items-start">
            <span className="text-neon-blue mr-2">▪</span>
            <div className="flex-1">
              직업과 이능력은 전혀 무관할 수 있음
              <div className="text-gray-500 mt-1 sm:mt-0 sm:inline sm:ml-1 tracking-tight">(예: Lv.2 탈모빔 공무원)</div>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-concord-gold mb-4 border-l-4 border-concord-gold pl-3">
          <div className="flex items-center gap-2"><span>🏛️</span> 시스템</div>
          <div className="text-[0.9em] font-medium opacity-90 mt-1 text-concord-gold/90">: 아르카(Arca)와 절대 법률</div>
        </h2>
        <ul className="space-y-3 text-gray-300 text-[0.95rem] leading-relaxed">
          <li className="flex items-start"><span className="text-concord-gold mr-2">▪</span> 2070년 창설된 이능력자 협회로, 인류는 의무적으로 이능을 신고해야 함</li>
          <li className="flex items-start"><span className="text-concord-gold mr-2">▪</span> 신고 시 사고 수습반 지원 등 '특별 보험' 혜택을 제공받음</li>
          <li className="flex items-start"><span className="text-concord-gold mr-2">▪</span> 시민들은 레스큐 사용 규정인 '아르카 법'을 무조건 준수해야 함</li>
          <li className="flex items-start text-gray-200 bg-gray-900/50 p-3 rounded border border-gray-800 border-l-concord-gold border-l-2">
            <div className="space-y-1">
              <span className="font-bold text-concord-gold flex items-center gap-1 mb-1"><span>💰</span> 화폐 (콘코드, Concord)</span>
              <p>옥수수알 빛깔의 노란 금화(속칭 콘).</p>
              <p>아르카가 발행하며 위조 방지 레스큐가 얽힌 역작.</p>
              <p>1콘 당 옛 화폐 기준 약 1000$의 가치를 지님.</p>
              <p>물가 기준 생수 한 병은 0.001콘임.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="bg-red-950/20 border border-red-900/50 rounded-lg p-5">
        <h2 className="text-xl font-bold text-red-500 mb-4">
          <div className="flex items-center gap-2"><span>⚠️</span> 경고</div>
          <div className="text-[0.9em] font-medium opacity-90 mt-1 text-red-500/90">: 파문(Excommunicado)과 루스트라(Lustra)</div>
        </h2>
        <ul className="space-y-3 text-red-200/80 text-[0.95rem] leading-relaxed">
          <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> 레스큐 중범죄 발생 시, 전 지역에 종소리가 울리며 아르카 시스템에서 말소됨</li>
          <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> 이를 '파문'이라 부르며, 현상금이 걸린 고깃덩이로 전락함</li>
          <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> 합법적 킬러 집단인 '루스트라'가 이들의 처형을 담당함</li>
          <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> 루스트라는 평소 일반인 사이에 섞여 일상을 보내며, 고보수(의뢰당 2콘 이상)를 받는 시민들의 동경 대상임</li>
        </ul>
      </section>
      
      <div className="text-center mt-12 text-gray-500 text-sm animate-pulse">
        *(시스템: 정보 로딩 완료. 유저의 액션을 대기합니다.)*
      </div>
    </div>
  );
}

import { MODE_1_PERSONAS } from "./data/mode1";
import { MODE_2_PERSONAS } from "./data/mode2";
import { MODE_3_PERSONAS } from "./data/mode3";
import { MODE_4_PERSONAS } from "./data/mode4";

function PersonaTerminal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generatePersona = async (mode: number) => {
    setLoading(true);
    setResult(null);

    // 모드 1, 2, 3, 4 하드코딩 랜덤 추출 (빠른 로딩 효과 후 출력)
    if (mode >= 1 && mode <= 4) {
      setTimeout(() => {
        let selectedPersona = "";
        if (mode === 1) {
          selectedPersona = MODE_1_PERSONAS[Math.floor(Math.random() * MODE_1_PERSONAS.length)];
        } else if (mode === 2) {
          selectedPersona = MODE_2_PERSONAS[Math.floor(Math.random() * MODE_2_PERSONAS.length)];
        } else if (mode === 3) {
          selectedPersona = MODE_3_PERSONAS[Math.floor(Math.random() * MODE_3_PERSONAS.length)];
        } else if (mode === 4) {
          selectedPersona = MODE_4_PERSONAS[Math.floor(Math.random() * MODE_4_PERSONAS.length)];
        }
        setResult(selectedPersona);
        setLoading(false);
      }, 700);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let modeDesc = "";
      if (mode === 1) modeDesc = "30% 확률로 무이능(Lv.0). 이능일 경우 기괴하고 쓸데없는 능력. 직업은 이능과 전혀 무관하게 매칭.";
      else if (mode === 2) modeDesc = "루스트라, 아르카, 캄 스트리트 등 세계관 핵심 세력과 깊이 연관된 유용한 능력(Lv.3~5)과 그럴듯한 직업.";
      else if (mode === 3) modeDesc = "라자로, 세베린, 리버, 차희재 중 최소 한 명 이상과 서사적으로 깊게 엮인 상태. (예: 타겟의 치명적 약점을 알거나, 특이 체질로 인해 타겟의 집착을 받는 등 로맨스/스릴러 특화)";
      else if (mode === 4) modeDesc = "메인 캐릭터들을 어이없게 만들거나 골머리 앓게 하는 황당한 능력과 상황. 유쾌하고 골때리는 혐관/채무 관계.";

      const prompt = `당신은 에보라쿰 시민망의 정착 지원 시스템입니다.
제시된 모드의 제약사항에 맞춰, 에보라쿰 세계관에 완벽히 어울리는 캐릭터 페르소나 설정 1개를 즉석에서 창작하세요.

[모드 제약사항]
${modeDesc}

[출력 양식]
다른 부가적인 말은 절대 하지 말고, 아래의 양식에 맞추어 딱 내용만 출력하세요. 어미는 항상 명사형(~함, ~임)으로 간결히 작성.

**[생성된 이능]｜[생성된 Lv]｜[생성된 직업]｜[생성된 평판]**

* **설정 및 배경:** (생성된 캐릭터의 배경과 현재 상황을 명사형 어미로 2~3줄 요약)
* **주요 인물과의 관계:** (모바일 환경에 맞게 간결히, 모드 3,4의 경우 주요 4인방과의 특별한 관계 포함)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      setResult(response.text || "데이터 수신 오류. 다시 시도하십시오.");
    } catch (error) {
      console.error(error);
      setResult("시스템 과부하: 아르카 네트워크에 연결할 수 없습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#0f0f11] border border-gray-700 p-5 rounded-lg shadow-2xl relative font-sans">
      <button onClick={onClose} className="absolute text-2xl top-4 right-4 text-gray-500 hover:text-white transition-colors">
        ✕
      </button>

      {/* 헤더 섹션 */}
      <div className="mb-6 space-y-3 border-b border-gray-800 pb-5 text-center">
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
          이능력 사회의<br/>아마도 평범한 시민인데요
        </h3>
        <p className="text-[#00F0FF] opacity-90 font-medium text-sm sm:text-base">
          * 22세기 메가 시티, 에보라쿰(Evoracum)에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 안내 섹션 */}
      <div className="mb-6 bg-[#1a1a1e] border border-gray-700/50 p-4 rounded text-[0.95em] text-gray-300">
        <h4 className="font-bold text-concord-gold mb-2 flex items-center gap-2">
          <span>🎰</span> 에보라쿰 정착 지원처: 페르소나 추천 시스템
        </h4>
        <p className="leading-relaxed">
          "어떤 신분으로 에보라쿰에 입국할지 고민되시나요? 아르카 데이터베이스에 블라인드 처리되어 저장된 각 카테고리별 50개의 기밀 페르소나 중 하나를 무작위로 추출하여 열람해 드립니다."
        </p>
        <p className="text-gray-400 text-sm mt-2 font-medium">
          ※ 목록에 없는 유니크한 성향이나 직업을 원하실 경우, 프롤로그 진입 후 채팅창에 <span className="text-concord-gold">!도움</span> 을 입력해 주세요.
        </p>
      </div>

      {/* 버튼(메뉴) 섹션 */}
      <div className="space-y-4">
        <p className="font-bold text-[#b4b4b4]">
          [ 시스템 메뉴: 원하시는 정착 모드를 선택(클릭)하세요. ]
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => generatePersona(1)} className="group p-3 border border-gray-700 text-left rounded hover:border-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors">
            <div className="font-bold text-white group-hover:text-[#00F0FF]">🎲 1. 완전 랜덤!</div>
            <div className="text-xs text-gray-500 mt-1">혼돈의 에보라쿰식 생존</div>
          </button>
          <button onClick={() => generatePersona(2)} className="group p-3 border border-gray-700 text-left rounded hover:border-[#FFD700] hover:bg-[#FFD700]/10 transition-colors">
            <div className="font-bold text-white group-hover:text-[#FFD700]">🗺️ 2. 세계관 딥다이브</div>
            <div className="text-xs text-gray-500 mt-1">아르카와 루스트라의 톱니바퀴</div>
          </button>
          <button onClick={() => generatePersona(3)} className="group p-3 border border-gray-700 text-left rounded hover:border-[#D32F2F] hover:bg-[#D32F2F]/10 transition-colors">
            <div className="font-bold text-white group-hover:text-[#D32F2F]">❤️ 3. 치명적 얽힘</div>
            <div className="text-xs text-gray-500 mt-1">네 남자와의 질척하고 위험한 관계</div>
          </button>
          <button onClick={() => generatePersona(4)} className="group p-3 border border-gray-700 text-left rounded hover:border-purple-400 hover:bg-purple-400/10 transition-colors">
            <div className="font-bold text-white group-hover:text-purple-400">🤡 4. 대환장 개그물</div>
            <div className="text-xs text-gray-500 mt-1">맑은 눈의 광인, 에보라쿰을 찢다</div>
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-6 flex justify-center items-center py-8 border border-gray-800 bg-[#0a0a0c] rounded">
          <div className="text-[#00F0FF] animate-pulse font-mono flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin"></div>
            아르카 데이터베이스에서 기밀 페르소나를 추출 중입니다...
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="mt-6 border border-[#a29b83] bg-[#0c0c09] p-5 rounded relative">
          <div className="font-bold text-[#FFD700] mb-3 pb-2 border-b border-[#FFD700]/20">
            [ 📝 열람된 페르소나 기밀 데이터 ]
            <div className="text-xs text-gray-500 font-normal mt-1">*(복사하여 즉시 RP 세팅에 활용하세요.)*</div>
          </div>
          <div className="text-gray-200 text-[0.95rem] whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
        </div>
      )}

    </div>
  );
}

function EvoracumMap() {
  const regions = [
    { 
      icon: '💧', name: '리비움 (중심부)', title: '캄 스트리트', subtitle: '절대 성역', 
      desc: [
        '대광장과 맑은 운하가 흐르는 최첨단 베네치아 풍경.', 
        '내부의 [캄 스트리트]는 대광장 동쪽으로 3블럭 규모의 10차선 도로와 상가가 위치한 구역.',
        '이곳은 PVP 및 파문자 처형이 전면 금지된 라자로 소유의 절대 성역이다.', 
        '단, 경범죄만 저질러도 즉각 파문당하는 통제된 꿈의 주거지임.'
      ], 
      color: 'text-blue-400',
      images: [{ url: 'https://gbe88.uk/K/BG_19.webp', label: '리비움 전경' }]
    },
    { 
      icon: '🥐', name: '둘시아 (서부구)', title: '부유층 주거지', subtitle: '카페 & 병원', 
      desc: ['빵과 버터 향이 풍기는 한적하고 우아한 부유층 주거지.', '세베린의 카페와 리버의 병원이 위치함.'], 
      color: 'text-amber-400',
      images: [
        { url: 'https://gbe88.uk/K/BG_20.webp', label: '둘시아 전경' },
        { url: 'https://gbe88.uk/K/BG_24.webp', label: '세베린의 카페' },
        { url: 'https://gbe88.uk/K/BG_25.webp', label: '리버의 병원' }
      ]
    },
    { 
      icon: '⚡', name: '플루오리아 (동부구)', title: '하이테크 빌딩 숲', subtitle: '이지스 소프트', 
      desc: ['밤낮없이 네온빛이 번쩍이는 하이테크 빌딩 숲. 에너지 드링크와 오존 향이 남.', '첨단 산업 대기업 사옥이 밀집해 있으며, 차희재의 \'이지스 소프트\' 사옥이 위치함.'], 
      color: 'text-neon-blue',
      images: [{ url: 'https://gbe88.uk/K/BG_22.webp', label: '플루오리아 전경' }]
    },
    { 
      icon: '🏛️', name: '보레아스 (북부구)', title: '엘리트주의 산실', subtitle: '대리석 저택가', 
      desc: ['아르카 고위직과 정치인이 거주하는 클래식하고 고요한 대리석 저택가.', '폐쇄적인 엘리트주의의 산실임.'], 
      color: 'text-gray-300',
      images: [{ url: 'https://gbe88.uk/K/BG_21.webp', label: '보레아스 전경' }]
    },
    { 
      icon: '🎲', name: '야누시아 (남부 항구)', title: '무법지대', subtitle: '녹스 피어', 
      desc: ['표면적으론 럭셔리 카지노와 인공 해변이 있는 낭만적인 관광지.', '밤이 되면 녹스 피어 너머로 불법 무기와 약물이 거래되는 무법지대로 돌변함.'], 
      color: 'text-purple-400',
      images: [{ url: 'https://gbe88.uk/K/BG_23.webp', label: '야누시아 전경' }]
    },
  ];

  return (
    <div className="space-y-8">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">메가 시티 '에보라쿰'</h1>
        <p className="text-sm text-gray-400">뉴욕터에 자리 잡은 이능력자 특화 글로벌 도시.<br/>주민 98%가 이능력자라 사건사고가 일상이며, 수습 시스템이 완벽하게 발달함.</p>
      </header>

      <div className="space-y-6">
        {regions.map((region, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-900/40 border border-gray-800 rounded-xl backdrop-blur-sm shadow-lg overflow-hidden flex flex-col"
          >
            {/* Image Gallery */}
            <div className="w-full relative flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {region.images.map((img, i) => (
                <div key={i} className="relative w-full shrink-0 snap-center aspect-[21/9] bg-black">
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </div>
              ))}
              {/* Indicator for multiple images */}
              {region.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full pointer-events-none border border-white/10">
                  Slide
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{region.icon}</span>
                <h2 className={`text-lg font-bold ${region.color}`}>{region.name}</h2>
              </div>
              <ul className="text-gray-300 text-[0.95rem] leading-relaxed space-y-2">
                {region.desc.map((sentence, sIdx) => (
                  <li key={sIdx} className="flex items-start">
                    <span className={`mr-2 mt-0.5 opacity-80 ${region.color}`}>-</span>
                    <span className="flex-1">{sentence}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}

        {/* 미수록 이미지 섹션 */}
        <div className="pt-10 border-t border-gray-800">
          <h2 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
            🖼️ 미수록 이미지
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {[
              { url: 'https://gbe88.uk/1/river_lapsrn_x2.webp', label: '리비움 운하' },
              { url: 'https://gbe88.uk/1/street_lapsrn_x2.webp', label: '캄 스트리트' },
              { url: 'https://gbe88.uk/1/lazaro_lapsrn_x2.webp', label: '라자로의 집무실' },
              { url: 'https://gbe88.uk/1/office_lapsrn_x2.webp', label: '희재의 오피스' }
            ].map((img, idx) => (
              <div key={idx} className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-[21/9] bg-black">
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 text-sm text-gray-400 text-center font-medium">
                  - {img.label} -
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Arca Classified Views
// ==========================================

function ArcaList({ onSelect, highlight }: { onSelect: (id: string) => void, highlight?: string }) {
  return (
    <div className="space-y-6 relative h-full flex-grow">
      <div className="arca-stamp top-4 right-4">Top Secret</div>
      <ArcaHeader title="DATABASE INDEX" docNumber="IDX-001" />
      
      <div className="mt-8">
        <div className="arca-section-title">인물 열람 권한 확인됨</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => onSelect(char.id)}
              className={`text-left p-4 border bg-white shadow-sm transition-all hover:shadow-md hover:border-arca-navy group ${highlight === 'switch' ? 'animate-pulse ring-2 ring-arca-navy ring-offset-1 ring-offset-[#F5F5F5]' : 'border-gray-300'}`}
            >
              <div className="flex gap-4 items-center">
                <div className="arca-portrait-box w-16 h-16 p-1 shrink-0">
                  <img src={char.image} alt={char.name} className="w-full h-full object-cover" style={{ filter: 'grayscale(30%) contrast(110%)', objectPosition: 'center 15%' }} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold mb-1">FILE #{char.id}</div>
                  <div className="text-arca-navy font-bold">{char.name.split(' (')[0]}</div>
                  <div className="text-sm text-gray-600 mt-1 truncate max-w-[200px]">{char.affiliation.split(' / ')[0]}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArcaDetail({ character }: { character: Character }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => {
    setSelectedIdx(idx);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx + 1) % character.gallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx - 1 + character.gallery.length) % character.gallery.length);
  };

  return (
    <div className="relative h-full flex flex-col flex-grow">
      <div className="arca-stamp top-4 sm:top-10 right-4 sm:right-10">Top Secret</div>

      <ArcaHeader title="ARCA CLASSIFIED DOSSIER" docNumber={character.id} />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/60 hover:text-white z-10 p-2"
            >
              <span className="text-2xl font-bold">✕</span>
            </button>

            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <button 
                onClick={prevImage}
                className="absolute left-0 sm:-left-16 text-white/40 hover:text-white p-4 z-10"
              >
                <span className="text-4xl font-serif">‹</span>
              </button>

              <motion.div
                key={selectedIdx}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center justify-center"
              >
                <img 
                  src={character.gallery[selectedIdx]} 
                  alt="Full size" 
                  className={`max-w-full max-h-[85vh] object-contain shadow-2xl ${selectedIdx === 0 ? 'aspect-[21/9]' : 'aspect-[2/3]'}`}
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>

              <button 
                onClick={nextImage}
                className="absolute right-0 sm:-right-16 text-white/40 hover:text-white p-4 z-10"
              >
                <span className="text-4xl font-serif">›</span>
              </button>

              <div className="absolute -bottom-8 left-0 right-0 text-center text-white/50 text-xs font-mono">
                {selectedIdx + 1} / {character.gallery.length} • TAP OUTSIDE TO CLOSE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-[40px] flex-grow">
        
        {/* Sidebar */}
        <div className="flex flex-col gap-[20px]">
          <div className="arca-portrait-box">
            <img src={character.image} alt={character.name} className="w-full aspect-[3/4] object-cover grayscale-[20%] contrast-125 block object-[center_15%]" />
            <div className="text-[11px] opacity-70 uppercase mt-[10px] font-sans pb-[5px] text-gray-500 font-bold">
              {character.name.split(' (')[0]}<br />Subject Photo #{character.id}
            </div>
          </div>
          
          <div className="mt-2 md:mt-[10px]">
            <div className="arca-section-title">기본 인적 사항</div>
            <div className="grid grid-cols-[80px_1fr] gap-x-[10px] gap-y-[8px] text-[13px] md:text-[14px]">
              <div className="font-bold text-[#555]">- 성명:</div>
              <div className="font-medium text-arca-ink">{character.name.split(' (')[0]}</div>
              
              <div className="font-bold text-[#555]">- 코드네임:</div>
              <div className="font-medium text-arca-ink">{character.name.split(' (')[1]?.replace(')','') || ''}</div>
              
              <div className="font-bold text-[#555]">- 연령/성별:</div>
              <div className="font-medium text-arca-ink">{character.age}세 / {character.gender}</div>
              
              <div className="font-bold text-[#555]">- 소속:</div>
              <div className="font-medium text-arca-ink">{character.affiliation.split(' / ')[0]}</div>
              
              <div className="font-bold text-[#555]">- 자산:</div>
              <div className="font-medium text-arca-ink">{character.wealthAndLocation.split('. ')[0]}</div>

              <div className="font-bold text-[#555]">- 거주지:</div>
              <div className="font-medium text-arca-ink">{character.wealthAndLocation.split('. ')[1] || character.wealthAndLocation}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-[20px]">
          <div>
            <div className="arca-section-title">🛡️ 이능력(Rescue) 평가</div>
            <div className="grid grid-cols-[100px_1fr] gap-x-[10px] gap-y-[8px] text-[13px] md:text-[14px]">
              <div className="font-bold text-[#555]">- 등급:</div>
              <div className="font-black text-arca-red tracking-[1px]">{character.abilityLevel}</div>
              
              <div className="font-bold text-[#555]">- 능력명:</div>
              <div className="font-medium text-arca-ink">{character.abilityName}</div>
              
              <div className="font-bold text-[#555]">- 상세 보고:</div>
              <div className="font-medium text-arca-ink leading-relaxed max-w-[500px]">
                {character.abilityDesc.split('. ').map((s, idx) => s.trim() ? <div key={idx} className="mb-[2px]">{s.trim()}{s.endsWith('.') ? '' : '.'}</div> : null)}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="arca-section-title">🧠 심리 및 성격 분석</div>
            <div className="grid grid-cols-[100px_1fr] gap-x-[10px] gap-y-[8px] text-[13px] md:text-[14px]">
              <div className="font-bold text-[#555]">- 성향:</div>
              <div className="font-medium text-arca-ink">MBTI: {character.mbti}</div>
              
              <div className="font-bold text-[#555]">- 행동 양식:</div>
              <div className="font-medium text-arca-ink leading-relaxed max-w-[500px]">
                {character.psychology.split('. ').map((s, idx) => s.trim() ? <div key={idx} className="mb-[2px]">{s.trim()}{s.endsWith('.') ? '' : '.'}</div> : null)}
              </div>
            </div>
          </div>

          <div className="arca-classified-container">
            <div className="arca-classified-label">Classified Document</div>
            <div className="arca-section-title border-none text-arca-red mb-[5px] before:bg-arca-red">🔞 기밀 특이 사항</div>
            <div className="text-[13px] leading-[1.6]">
              {character.classifiedParams.map((param, idx) => (
                <div key={idx} className="font-medium text-arca-ink mb-1">- {param}</div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="arca-section-title">📸 수록 이미지 (Gallery)</div>
            <p className="text-[11px] text-gray-500 mb-4">* 이미지를 클릭하면 크게 볼 수 있습니다.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {character.gallery.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openLightbox(idx)}
                  className={`arca-portrait-box p-2 bg-white border border-gray-300 cursor-pointer hover:shadow-md transition-shadow group ${idx === 0 ? 'sm:col-span-2' : ''}`}
                >
                  <div className={`bg-gray-100 overflow-hidden relative ${idx === 0 ? 'aspect-[21/9]' : 'aspect-[2/3]'}`}>
                    <img 
                      src={imgUrl} 
                      alt={`Gallery ${idx + 1}`} 
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-300" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-arca-navy/0 group-hover:bg-arca-navy/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-arca-navy font-bold text-xs bg-white/90 px-3 py-1 border border-arca-navy">관찰하기</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-[10px] text-gray-400 font-mono tracking-tighter">DATA_SRC: {character.name.split(' ')[0][0]}_{idx+1}</span>
                    <span className="text-[9px] text-gray-300 uppercase italic">Confidential</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvoracumSystem() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="text-center pb-6 border-b-2 border-gray-800">
        <h1 className="text-3xl font-black text-white tracking-widest italic mb-2 uppercase">
          🏛️시스템 가이드🏛️
        </h1>
        <p className="text-gray-400 text-sm">
          에보라쿰에서의 완벽한 생존과 RP를 위한<br/>
          명령어 모음
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xl font-bold text-white mb-5">
          <span>⚙️</span> 시스템 & 텐션 복구
        </div>
        
        <div className="space-y-4">
          <SystemCard 
            type="system"
            title="!사칭"
            desc="AI가 유저(나)의 행동이나 대사까지 멋대로 조종하고 뺏어서 출력할 때 때리는 회초리 용도입니다."
          />
          <SystemCard 
            type="system"
            title="!AS"
            desc="AI가 앵무새처럼 내 대답을 따라 하거나 문체가 무너졌을 때 사용합니다. (가장 이상적인 텐션과 문체인 '프롤로그' 상태로 멱살 잡고 끌고 옵니다)"
            example="예: !AS (T33~ T40까지 비슷한 문장구조 반복)"
          />
          <SystemCard 
            type="system"
            title="!이미지"
            desc="이미지 출력에 문제가 생겼을 때 상황을 덧붙여 명령하면 빠르게 수정합니다."
            example={
              <>
                예: !이미지 (인물 매칭이 다릅니다)<br/>
                예: !이미지 (배경 이미지가 상황과 달라요)
              </>
            }
          />
          <SystemCard 
            type="system"
            title="!요약"
            desc={<span>진행 상황을 장기 기억에 저장합니다. <strong className="text-white">15~20턴 내외</strong>로 사용하는 것을 권장합니다.</span>}
            example={
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-concord-gold">🔸</span>
                  <span className="text-gray-300">플루오리아 골목 두리안 테러와 구출</span>
                </div>
                <div className="text-gray-500">[26.04.22/15:03~15:15]</div>
                <ul className="space-y-1 text-gray-400">
                  <li>- ㅇㅇ가 희재의 집으로 향하던 중 공사 현장 인근에서 파문자와 조우, 인질 위기에 처함.</li>
                  <li>- ㅇㅇ가 호신용으로 가방 속 두리안을 던져 파문자를 무력화하고, 라자로가 등장해 그림자 능력으로 제압함.</li>
                  <li>- 라자로는 심문을 핑계로 ㅇㅇ를 강제로 차에 태웠고, 희재의 연락을 받고 이지스 소프트 사택으로 이동함. ㅇㅇ는 이동 중 카페 주스 무료 쿠폰을 건네며 사례함.</li>
                  <li>- 라자로 → ㅇㅇ: <span className="text-concord-gold">[흥미/관찰]</span></li>
                </ul>
              </div>
            }
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xl font-bold text-white mb-5">
          <span>👁️</span> 에보라쿰 뒷조사 & 은밀한 사생활
        </div>
        
        <div className="space-y-4">
          <SystemCard 
            type="lore"
            title="!라자로 | !세베린 | !리버 | !희재"
            desc="유저 몰래 쓰는 네 남자의 은밀한 개인 단말기(검색, 쇼핑, 통화 기록) 내역을 해킹하여 훔쳐봅니다."
            example={
              <div className="space-y-3">
                <div className="text-neon-blue font-mono">📱 [아르카 보안망 우회 성공]</div>
                <div>
                  <div className="text-white font-bold mb-1">[🛒차희재 온라인 쇼핑몰 주문 내역]</div>
                  <div className="text-gray-400">1. <strong className="text-gray-200">최고급 공업용 윤활유 대용량 (무향)</strong></div>
                  <div className="text-gray-500 text-xs">- 비고: 빠른 배송 요망. 점성 테스트용.</div>
                </div>
                <div>
                  <div className="text-white font-bold mb-1">[🔍검색 기록]</div>
                  <div className="text-gray-400">- 캄 스트리트 거주자 납치 시 예상 형량</div>
                </div>
              </div>
            }
          />
          <SystemCard 
            type="lore"
            title="!캐럿"
            desc="에보라쿰의 매운맛 중고/암거래 플랫폼. 야누시아에서 흘러나온 수상한 물건들이 올라옵니다."
            example={
              <div className="space-y-2">
                <div className="text-lg">🛍️ Lv.2 탈모빔 1회 방어권 팝니다 (사제 헬멧)</div>
                <div className="flex items-center justify-between">
                  <span className="text-concord-gold font-bold text-lg">0.05 콘(Corn)</span>
                  <span className="text-gray-500 text-sm">네고 ❌ / 🌡️36.5℃</span>
                </div>
                <div className="text-gray-400 text-sm">보레아스 갈 때 필수템. 직거래는 플루오리아 14번 출구. 루스트라 사절.</div>
              </div>
            }
          />
          <SystemCard 
            type="lore"
            title="!커뮤"
            desc="에보라쿰 시민들의 리얼한 민원과 목격담이 올라오는 로컬 커뮤니티입니다."
            example={
              <div className="space-y-5">
                <div className="space-y-2 pb-4 border-b border-gray-800/50">
                  <div className="text-xs text-gray-500 uppercase tracking-tighter">[📑정보｜과즙팡팡｜제목: 캄 스트리트 '카페 후르츠' 과일 주스 미쳤음]</div>
                  <div className="flex gap-3 text-[10px] text-gray-600">
                    <span>👀 8,421</span>
                    <span>💬 12</span>
                  </div>
                  <p className="text-gray-400">오늘 캄 스트리트 끝자락에 있는 '카페 후르츠' 다녀왔는데...</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-red-500/80">❤️ 1,204</span>
                    <span className="text-concord-gold/80">⭐ 532</span>
                  </div>
                  <div className="pl-4 border-l border-gray-800 space-y-2 mt-2">
                    <div className="text-xs"><span className="text-gray-300 font-bold">↳달콤한인생</span> <span className="text-neon-blue">👍23</span> <span className="text-gray-600">👎0</span></div>
                    <div className="text-gray-500 text-xs">거기 진짜 맛있지</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-red-400 uppercase tracking-tighter">[🗣️신고｜시민A｜제목: 플루오리아 뒷골목 두리안 테러 사건 ㄷㄷ]</div>
                  <div className="flex gap-3 text-[10px] text-gray-600">
                    <span>👀 12,504</span>
                    <span>💬 38</span>
                  </div>
                  <p className="text-gray-400">누가 파문자한테 두리안 던졌다는 소문이 있던데, 진짜 무기 수준 아니냐?</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-red-500/80">❤️ 521</span>
                    <span className="text-concord-gold/80">⭐ 120</span>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xl font-bold text-white mb-5">
          <span>🚨</span> 아드레날린 폭발 이벤트
        </div>
        
        <div className="space-y-4">
          <SystemCard 
            type="event"
            title="!돌발"
            desc="서사를 와장창 부수고 들어오는 대환장 스케일의 코믹 재난이나 이능력 사고가 발생합니다."
            example={
              <div>
                <span className="text-neon-magenta font-bold">예:</span> <span className="text-gray-300">플루오리아 한복판에서 '만지는 모든 액체를 핑크색 슬라임으로 바꾸는' 무허가 이능력자가 폭주하여 끈적한 단비가 내리기 시작함.</span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

function SystemCard({ type, title, desc, example }: { type: 'system' | 'lore' | 'event', title: string, desc: React.ReactNode, example?: React.ReactNode }) {
  const borderColor = {
    system: 'border-l-neon-blue',
    lore: 'border-l-concord-gold',
    event: 'border-l-neon-magenta'
  }[type];

  const titleColor = {
    system: 'text-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.2)]',
    lore: 'text-concord-gold shadow-[0_0_10px_rgba(255,215,0,0.2)]',
    event: 'text-neon-magenta shadow-[0_0_10px_rgba(255,0,85,0.2)]'
  }[type];

  return (
    <div className={`bg-gray-900/60 border border-gray-800 rounded-lg p-5 border-l-[6px] ${borderColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-black mb-2 tracking-tight ${titleColor}`}>{title}</h3>
      <div className="text-gray-300 mb-4 leading-relaxed font-medium">
        {desc}
      </div>
      {example && (
        <div className="bg-black/40 border border-gray-800 rounded p-4 font-mono text-[0.9em] leading-relaxed text-gray-400">
          {example}
        </div>
      )}
    </div>
  );
}

function ArcaHeader({ title, docNumber }: { title: string, docNumber: string }) {
  return (
    <div className="border-b-[3px] border-arca-navy pb-[10px] mb-[25px] flex justify-between items-end shrink-0">
      <div className="font-serif text-[24px] sm:text-[28px] font-black text-arca-navy tracking-[2px]">
        {title}
      </div>
      <div className="text-[12px] font-bold opacity-60 font-sans tracking-wide">
        DOC #{docNumber} | SECURITY CLEARANCE L5
      </div>
    </div>
  );
}

// ==========================================
// Shared Components
// ==========================================

function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState('INITIALIZING SYSTEM...');

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        const next = prev + Math.random() * 15;
        
        if (next > 20) setStatus('CONNECTING TO ARCA GLOBAL NETWORK...');
        if (next > 50) setStatus('AUTHENTICATING CITIZEN DATA...');
        if (next > 80) setStatus('SYNCING EVORACUM MESH-LINK...');
        if (next >= 100) setStatus('ACCESS GRANTED. WELCOME.');
        
        return next > 100 ? 100 : next;
      });
    }, 150);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-cyber-bg flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-black text-white tracking-[0.2em] italic">EVORACUM</h1>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
        </motion.div>

        <div className="space-y-4">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#00F0FF] font-mono">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800 p-[1px]">
            <motion.div 
              className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1 h-3 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: progress > (i + 1) * 25 ? 1 : 0.2,
                  backgroundColor: progress > (i + 1) * 25 ? '#00F0FF' : '#1f2937'
                }}
                className="h-full rounded-sm"
              />
            ))}
          </div>
        </div>

        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[9px] text-gray-500 font-mono tracking-tighter"
        >
          SECURITY LEVEL: L5-ACCESS | ENCRYPTION: ARC-256 | TIMESTAMP: {new Date().toISOString()}
        </motion.p>
      </div>
    </motion.div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  color: 'neon' | 'arca';
  isArca?: boolean;
  children: React.ReactNode;
}

function NavButton({ active, onClick, color, isArca, children }: NavButtonProps) {
  if (isArca) {
    return (
      <button onClick={onClick} className={`arca-nav-item flex items-center hover:opacity-70 transition-opacity ${active ? 'opacity-100 font-bold' : 'opacity-80'}`}>
        <span>{children}</span>
      </button>
    );
  }

  let btnClass = "flex-1 flex justify-center items-center py-3 text-xs sm:text-sm transition-all text-center px-1 font-medium font-sans text-gray-400 hover:text-neon-blue ";
  if (active) btnClass += "text-neon-blue font-bold text-glow transform scale-105";

  return (
    <button onClick={onClick} className={btnClass}>
      <span className="truncate w-full">{children}</span>
    </button>
  );
}

