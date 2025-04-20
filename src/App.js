import React, { useState, useEffect } from 'react';
import './App.css';

// 엑셀 데이터를 표로 보여주는 컴포넌트
function AnswerTable({ data }) {
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;
  const toggleRow = idx => setExpandedRows(prev => ({ ...prev, [idx]: !prev[idx] }));
  const toggleQuestion = idx => setExpandedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));

  // (2025-04-20 09:41:10) ** ... ** 마크다운 굵게 변환 함수 추가
  function renderMarkdownBold(text) {
    // **텍스트** 를 <b>텍스트</b>로 변환
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        return <b key={i}>{part.slice(2, -2)}</b>;
      }
      return part;
    });
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '32px 0', fontSize: 15 }}>
      <thead>
        <tr style={{ background: '#e7f9f5' }}>
          <th style={{ padding: 8, border: '1px solid #b0f3d1' }}>문제</th>
          <th style={{ padding: 8, border: '1px solid #b0f3d1' }}>모델 답변</th>
          <th style={{ padding: 8, border: '1px solid #b0f3d1' }}>평가 결과</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
            {/* 문제 열도 접기/펴기 적용, 항상 버튼 노출, 펼침 시 전체 표시 */}
            <td style={{ padding: 8, border: '1px solid #b0f3d1', fontWeight: 500, textAlign: 'left', whiteSpace: 'pre-line', position: 'relative', minWidth: 320 }}>
              <div
                style={{
                  maxHeight: expandedQuestions[idx] ? 'none' : 120,
                  overflow: expandedQuestions[idx] ? 'visible' : 'hidden',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7,
                  paddingRight: 24,
                  transition: 'max-height 0.2s',
                  background: expandedQuestions[idx] ? '#f6fff6' : undefined
                }}
              >
                {renderMarkdownBold(row.question)}
              </div>
              {row.question && row.question.length > 120 && (
                <button
                  onClick={() => toggleQuestion(idx)}
                  style={{
                    marginTop: 6,
                    border: '1px solid #0a7',
                    background: '#e7f9f5',
                    borderRadius: 4,
                    padding: '2px 10px',
                    fontSize: 13,
                    cursor: 'pointer',
                    color: '#0a7',
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    zIndex: 1
                  }}
                >
                  {expandedQuestions[idx] ? '접기' : '더보기'}
                </button>
              )}
            </td>
            {/* 모델 답변 열 */}
            <td style={{ padding: 8, border: '1px solid #b0f3d1', textAlign: 'left', whiteSpace: 'pre-line', position: 'relative', minWidth: 320 }}>
              <div
                style={{
                  maxHeight: expandedRows[idx] ? 'none' : 120,
                  overflow: expandedRows[idx] ? 'visible' : 'hidden',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7,
                  paddingRight: 24,
                  transition: 'max-height 0.2s',
                  background: expandedRows[idx] ? '#f6fff6' : undefined
                }}
              >
                {renderMarkdownBold(row.answer)}
              </div>
              {row.answer && row.answer.length > 120 && (
                <button
                  onClick={() => toggleRow(idx)}
                  style={{
                    marginTop: 6,
                    border: '1px solid #0a7',
                    background: '#e7f9f5',
                    borderRadius: 4,
                    padding: '2px 10px',
                    fontSize: 13,
                    cursor: 'pointer',
                    color: '#0a7',
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    zIndex: 1
                  }}
                >
                  {expandedRows[idx] ? '접기' : '더보기'}
                </button>
              )}
            </td>
            {/* 평가 결과 */}
            <td style={{ padding: 8, border: '1px solid #b0f3d1', whiteSpace: 'pre-line', color: row.result==='Pass' ? '#2a7' : '#d22', fontWeight: 'bold' }}>{row.result}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  const [tableData, setTableData] = useState([]); 
  useEffect(() => {
    fetch('/gemini2.5flash_test.json')
      .then(res => res.json())
      .then(setTableData)
      .catch(() => setTableData([]));
  }, []);

  return (
    <div className="App" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2>Gemini 2.5 Flash 추론 테스트 결과</h2>
      <AnswerTable data={tableData} />
      <div style={{ marginTop: 40, fontSize: 12, color: '#888' }}>
        * 각 문제의 질문과 모델의 답변, 평가 결과를 표로 확인할 수 있습니다.<br/>
        * 답변이 긴 경우 "더보기" 버튼으로 전체 내용을 펼쳐볼 수 있습니다.<br/>
        * 데이터 기준: gemini2.5flash_test.json (2025-04-20 09:36:50 적용)
      </div>
    </div>
  );
}

export default App;
