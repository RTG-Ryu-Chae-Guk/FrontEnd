import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../css/SmallBusinessNews.module.css';
import WaveCanvas from '../components/Start/WaveCanvas';
import {
  IoSend,
  IoNewspaperOutline,
  IoRefresh,
  IoVolumeHighSharp,
  IoVolumeMuteSharp, IoApps
} from 'react-icons/io5';
import { FaRobot, FaUserCircle } from 'react-icons/fa';
import Header from '../components/Header';

const SmallBusinessNews = () => {
  const [chatMessages, setChatMessages] = useState([
    { sender: 'gpt', text: '안녕하세요, RCG봇입니다. 무엇을 도와드릴까요?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [showNews, setShowNews] = useState(false);
  const [newsList, setNewsList] = useState([]);
  const [newsIndex, setNewsIndex] = useState(0);
  const [summary, setSummary] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [industryArea, setIndustryArea] = useState('');
  const [industryCapital, setIndustryCapital] = useState('');
  const synthRef = useRef(window.speechSynthesis);
  const voicesRef = useRef([]);
  const chatWindowRef = useRef(null);
  const location = useLocation();
  const autoSentRef = useRef(false);
  const [salesArea, setSalesArea] = useState('');
  const [salesIndustry, setSalesIndustry] = useState('');
  const [competitionArea, setCompetitionArea] = useState('');
  const [competitionIndustry, setCompetitionIndustry] = useState('');
  const [populationArea, setPopulationArea] = useState('');
  const [rentArea, setRentArea] = useState('');
  const [accessArea, setAccessArea] = useState('');
  const [compareType, setCompareType] = useState('');

  const handleAnalysisMenu = () => {
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'gpt',
        tabbed: true,
        tabbedType: 'analysisMenu',
        prompt: '원하는 분석 항목을 선택해주세요.',
      }
    ]);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get('query');

    if (initialQuery && !autoSentRef.current) {
      autoSentRef.current = true;
      setUserInput(initialQuery);
      handleSend(initialQuery);
    }
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      voicesRef.current = voices;
      console.log('🔊 Available voices:');
      voices.forEach((v) => {
        console.log(`${v.name} - ${v.lang}`);
      });
    };

    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  const extractHashtags = (text) => {
    if (typeof text !== 'string') return [];
    const keywords = ['정책', '지원금', '금융', '혜택', '정부', '대출', '자금', '창업', '세금', '감면'];
    return keywords.filter((keyword) => text.includes(keyword)).map((tag) => `#${tag}`);
  };

  const keywordColors = {
    '정책': '#FF6B6B',
    '지원금': '#4ECDC4',
    '금융': '#1A535C',
    '혜택': '#FF9F1C',
    '정부': '#2E86AB',
    '대출': '#6A0572',
    '자금': '#FF6F00',
    '창업': '#3E885B',
    '세금': '#C70039',
    '감면': '#00796B',
  };

  const fetchNews = async () => {
    const res = await fetch('/api/news/search?query=소상공인 혜택');
    const data = await res.json();
    setNewsList(data);
  };

  const fetchSummary = async () => {
    setIsLoadingSummary(true);
    const res = await fetch('/api/gptnews/summary?query=소상공인혜택');
    const text = await res.text();
    setSummary(text);
    setIsLoadingSummary(false);
    return text;
  };

  const handleSalesAnalysis = () => {
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'gpt',
        tabbed: true,
        tabbedType: 'sales',
        prompt: '📊 지역과 업종을 입력하면 매출 분석을 도와드립니다.'
      }
    ]);
  };

  const handleRentAnalysis = () => {
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'gpt',
        tabbed: true,
        tabbedType: 'rent',
        prompt: '🧾 임대료 및 공실률 분석을 위해 지역명을 입력해주세요.'
      }
    ]);
  };

  const handleAccessAnalysis = () => {
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'gpt',
        tabbed: true,
        tabbedType: 'access',
        prompt: '🚉 접근성 평가를 위한 위치명을 입력해주세요.'
      }
    ]);
  };

  const handleTypeComparison = () => {
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'gpt',
        tabbed: true,
        tabbedType: 'typeCompare',
        prompt: '🗺 상권 유형별 비교를 위해 업종을 입력해주세요 (예: 음식점).'
      }
    ]);
  };

  const handleSalesSubmit = () => {
    if (!salesArea.trim() || !salesIndustry.trim()) return;
    const query = `${salesArea}에서 ${salesIndustry} 창업 시 매출과 경쟁 상황 분석해줘`;
    setChatMessages(prev => [...prev, { sender: 'gpt', isLoading: true }]);
    setSalesArea('');
    setSalesIndustry('');
    handleSend(query, false);
  };

  const handleCompetitionAnalysis = () => {
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'gpt',
        tabbed: true,
        tabbedType: 'competition',
        prompt: '🏬 경쟁 업체 분석을 위해 아래 정보를 입력해주세요.'
      }
    ]);
  };

  const handleCompetitionSubmit = () => {
    if (!competitionArea.trim() || !competitionIndustry.trim()) return;
    const query = `${competitionArea} 지역의 ${competitionIndustry} 업종에 대해 경쟁 업체 수, 밀집도, 브랜드 비율 등을 분석해줘. 그리고 최대한 내용을 많이 넣어서 구체적으로 알려줘`;
    setChatMessages(prev => [...prev, { sender: 'gpt', isLoading: true }]);
    setCompetitionArea('');
    setCompetitionIndustry('');
    handleSend(query, false);
  };

  const handlePopulationTrend = () => {
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'gpt',
        tabbed: true,
        tabbedType: 'population',
        prompt: '👥 유동인구 트렌드를 확인할 지역을 입력해주세요.'
      }
    ]);
  };

  const handlePopulationSubmit = () => {
    if (!populationArea.trim()) return;
    const query = `${populationArea}의 유동인구 트렌드를 알고있는 한 많이 구체적으로 알려줘.`;
    setChatMessages(prev => [...prev, { sender: 'gpt', isLoading: true }]);
    setPopulationArea('');
    handleSend(query, false);
  };

  const handleRentSubmit = () => {
    if (!rentArea.trim()) return;
    const query = `${rentArea}의 평균 임대료 및 공실률을 알려줘. 분석과 함께 시각화 가능한 표현도 넣어줘. 그리고 최대한 내용을 많이 넣어서 구체적으로 알려줘`;
    setChatMessages(prev => [...prev, { sender: 'gpt', isLoading: true }]);
    setRentArea('');
    handleSend(query, false);
  };

  const handleAccessSubmit = () => {
    if (!accessArea.trim()) return;
    const query = `${accessArea} 근처의 지하철역/버스정류장 접근성과 유입 동선을 분석해줘. 그리고 최대한 내용을 많이 넣어서 구체적으로 알려줘`;
    setChatMessages(prev => [...prev, { sender: 'gpt', isLoading: true }]);
    setAccessArea('');
    handleSend(query, false);
  };

  const handleTypeCompareSubmit = () => {
    if (!compareType.trim()) return;
    const query = `${compareType} 업종 창업 시 주거형, 업무형, 혼합형 상권의 장단점을 비교해줘. 그리고 최대한 내용을 많이 넣어서 구체적으로 알려줘`;
    setChatMessages(prev => [...prev, { sender: 'gpt', isLoading: true }]);
    setCompareType('');
    handleSend(query, false);
  };

  const handleSend = async (customInput, showUserMessage = true) => {
    const input =
      typeof customInput === 'string'
        ? customInput.trim()
        : typeof userInput === 'string'
        ? userInput.trim()
        : '';

    if (!input) return;

    if (showUserMessage) {
      setChatMessages((prev) => [...prev, { sender: 'user', text: input }]);
    }

    setShowNews(false);
    setUserInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const responseText = data?.response ?? '';
      const hashtags = extractHashtags(responseText);

      // 🔁 가장 마지막 메시지가 isLoading이면 그걸 GPT 응답으로 교체
      setChatMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.isLoading) {
          return [
            ...prev.slice(0, prev.length - 1),
            { sender: 'gpt', text: responseText, hashtags }
          ];
        }
        return [
          ...prev,
          { sender: 'gpt', text: responseText, hashtags }
        ];
      });
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'gpt', text: '⚠️ 오류가 발생했습니다. 다시 시도해주세요.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };



  const handleIndustryOnly = () => {
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'gpt',
        tabbed: true,
        tabbedType: 'industry', // <-- 추가,
        prompt: '📈 창업 업종 추천을 위해 아래 정보를 입력해주세요.'
      }
    ]);
  };

  const handleIndustrySubmit = () => {
    if (!industryArea.trim() || !industryCapital.trim()) return;
    const query = `${industryArea}에서 ${industryCapital}만원으로 창업 가능한 업종 추천해줘. 그리고 이유를 구체적이고 자세하게 길게 써줘.`;

    // 1. 로딩 메시지 먼저 추가
    setChatMessages((prev) => [
      ...prev,
      { sender: 'gpt', isLoading: true }
    ]);

    // 2. 입력값 초기화
    setIndustryArea('');
    setIndustryCapital('');

    // 3. GPT 요청 (사용자 메시지 숨김)
    handleSend(query, false);
  };

  const handleNewsClick = async () => {
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: '소상공인 뉴스 요약 보여줘' },
      { sender: 'gpt', isLoading: true }
    ]);
    setShowNews(true);
    await fetchNews();
    const text = await fetchSummary();
    const hashtags = extractHashtags(text);

    setChatMessages((prev) => [
      ...prev.slice(0, prev.length - 1),
      { sender: 'gpt', text, hashtags }
    ]);
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  const speakLastMessage = () => {
    const lastGptMsg = [...chatMessages].reverse().find((msg) => msg.sender === 'gpt' && !msg.isLoading);
    if (!lastGptMsg || !lastGptMsg.text) return;

    const utterance = new SpeechSynthesisUtterance(lastGptMsg.text);
    const voices = voicesRef.current;

    const koreanVoice =
      voices.find((v) => v.name.includes('Google 한국의')) ||
      voices.find((v) => v.name.includes('Microsoft Heami')) ||
      voices.find((v) => v.lang === 'ko-KR');

    if (koreanVoice) {
      utterance.voice = koreanVoice;
      console.log('✅ 사용할 음성:', koreanVoice.name);
    }

    utterance.lang = 'ko-KR';
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => setIsSpeaking(false);

    synthRef.current.cancel();
    synthRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="chat-container">
      <Header />
      <div className={styles.chatContainer}>
        <div className={styles.chatWindowWrapper}>
          <div className={styles.chatWindow} ref={chatWindowRef}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`${styles.chatBubble} ${msg.sender === 'gpt' ? styles.bot : styles.user}`}>
                <div className={styles.avatar}>
                  {msg.sender === 'gpt' ? <FaRobot size={25} /> : <FaUserCircle size={25} />}
                </div>
                <div className={styles.chatContent}>
                  {msg.sender === 'gpt' && msg.isLoading ? (
                    <p className={styles.typingEffect}>⌛ GPT가 요약 중입니다...</p>
                  ) : msg.tabbed ? (
                    <>
                      {msg.tabbedType === 'industry' && (
                        <div className={styles.tabContainer}>
                          <div className={styles.tabContent}>
                            <p>{msg.prompt}</p>
                            <input
                              type="text"
                              placeholder="📍 지역명을 입력하세요"
                              value={industryArea}
                              onChange={(e) => setIndustryArea(e.target.value)}
                            />
                            <input
                              type="number"
                              placeholder="💰 자본금 (만원)"
                              value={industryCapital}
                              onChange={(e) => setIndustryCapital(e.target.value)}
                            />
                            <button className={styles.submitButton} onClick={handleIndustrySubmit}>
                              추천 받기
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.tabbedType === 'sales' && (
                        <div className={styles.tabContainer}>
                          <div className={styles.tabContent}>
                            <p>{msg.prompt}</p>
                            <input
                              type="text"
                              placeholder="📍 지역명을 입력하세요"
                              value={salesArea}
                              onChange={(e) => setSalesArea(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="🏷 업종명을 입력하세요"
                              value={salesIndustry}
                              onChange={(e) => setSalesIndustry(e.target.value)}
                            />
                            <button className={styles.submitButton} onClick={handleSalesSubmit}>
                              분석 받기
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.tabbedType === 'competition' && (
                        <div className={styles.tabContainer}>
                          <div className={styles.tabContent}>
                            <p>{msg.prompt}</p>
                            <input
                              type="text"
                              placeholder="📍 지역명을 입력하세요"
                              value={competitionArea}
                              onChange={(e) => setCompetitionArea(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="🏷 업종명을 입력하세요"
                              value={competitionIndustry}
                              onChange={(e) => setCompetitionIndustry(e.target.value)}
                            />
                            <button className={styles.submitButton} onClick={handleCompetitionSubmit}>
                              분석 받기
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.tabbedType === 'population' && (
                        <div className={styles.tabContainer}>
                          <div className={styles.tabContent}>
                            <p>{msg.prompt}</p>
                            <input
                              type="text"
                              placeholder="📍 지역명을 입력하세요"
                              value={populationArea}
                              onChange={(e) => setPopulationArea(e.target.value)}
                            />
                            <button className={styles.submitButton} onClick={handlePopulationSubmit}>
                              분석 받기
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.tabbedType === 'rent' && (
                        <div className={styles.tabContainer}>
                          <div className={styles.tabContent}>
                            <p>{msg.prompt}</p>
                            <input
                              type="text"
                              placeholder="📍 지역명을 입력하세요"
                              value={rentArea}
                              onChange={(e) => setRentArea(e.target.value)}
                            />
                            <button className={styles.submitButton} onClick={handleRentSubmit}>
                              분석 받기
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.tabbedType === 'access' && (
                        <div className={styles.tabContainer}>
                          <div className={styles.tabContent}>
                            <p>{msg.prompt}</p>
                            <input
                              type="text"
                              placeholder="📍 위치명을 입력하세요"
                              value={accessArea}
                              onChange={(e) => setAccessArea(e.target.value)}
                            />
                            <button className={styles.submitButton} onClick={handleAccessSubmit}>
                              분석 받기
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.tabbedType === 'typeCompare' && (
                        <div className={styles.tabContainer}>
                          <div className={styles.tabContent}>
                            <p>{msg.prompt}</p>
                            <input
                              type="text"
                              placeholder="🏷 업종명을 입력하세요"
                              value={compareType}
                              onChange={(e) => setCompareType(e.target.value)}
                            />
                            <button className={styles.submitButton} onClick={handleTypeCompareSubmit}>
                              분석 받기
                            </button>
                          </div>
                        </div>
                      )}


                      {msg.tabbedType === 'analysisMenu' && (
                        <div className={styles.tabContainer}>
                          <div className={styles.tabContent}>
                            <p>{msg.prompt}</p>
                            <div className={styles.analysisButtonGrid}>
                              <button onClick={handleNewsClick}>📰 뉴스 요약</button>
                              <button onClick={handleIndustryOnly}>🏪 업종 추천</button>
                              <button onClick={handleSalesAnalysis}>📊 매출 분석</button>
                              <button onClick={handleCompetitionAnalysis}>🏬 경쟁 분석</button>
                              <button onClick={handlePopulationTrend}>👥 유동인구</button>
                              <button onClick={handleRentAnalysis}>🧾 임대료 분석</button>
                              <button onClick={handleAccessAnalysis}>🚉 접근성</button>
                              <button onClick={handleTypeComparison}>🗺 유형 비교</button>
                            </div>
                          </div>
                        </div>
                      )}

                    </>

                  ) : (
                    <>
                      <p className={styles.chatText}>{msg.text}</p>
                      {msg.hashtags && msg.hashtags.length > 0 && (
                        <div className={styles.hashtags}>
                          {msg.hashtags.map((tag, i) => {
                            const keyword = tag.replace('#', '');
                            const color = keywordColors[keyword] || '#888';
                            return (
                              <span key={i} className={styles.hashtag} style={{ color }}>
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {msg.sender === 'gpt' && idx === chatMessages.length - 1 && (
                        <div className={styles.actions}>
                          <button onClick={isSpeaking ? stopSpeaking : speakLastMessage}>
                            {isSpeaking ? <IoVolumeMuteSharp /> : <IoVolumeHighSharp />}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {showNews && newsList.length > 0 && (
              <div className={`${styles.chatBubble} ${styles.bot}`}>
                <div className={styles.avatar}>
                  <FaRobot size={22} />
                </div>
                <div className={styles.chatContent}>
                  <a
                    href={newsList[newsIndex].link}
                    className={styles.newsLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <p
                      className={styles.newsText}
                      dangerouslySetInnerHTML={{ __html: newsList[newsIndex].title }}
                    ></p>
                    <p
                      className={styles.newsDesc}
                      dangerouslySetInnerHTML={{ __html: newsList[newsIndex].description }}
                    ></p>
                    <p className={styles.newsDate}>{newsList[newsIndex].pubDate}</p>
                  </a>
                  <div className={styles.newsNav}>
                    <button onClick={() => setNewsIndex((i) => (i - 1 + newsList.length) % newsList.length)}>
                      ←
                    </button>
                    <span>
                      {newsIndex + 1} / {newsList.length}
                    </span>
                    <button onClick={() => setNewsIndex((i) => (i + 1) % newsList.length)}>→</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.controlsAreaFixed}>
            <div className={styles.inputArea}>
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend(userInput);
                }}
              />
              <IoApps
                className={styles.iconButton}
                size={22}
                style={{ cursor: 'pointer' }}
                onClick={handleAnalysisMenu}
              />
              <button onClick={() => handleSend(userInput)}>
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      </div>

              <WaveCanvas />

    </div>
  );
};

export default SmallBusinessNews;
