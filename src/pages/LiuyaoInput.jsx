import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function matchYongShen(q) {
  if (/事业|工作|升迁|职场|跳槽|求职/.test(q)) return ['官鬼'];
  if (/财|赚钱|投资|生意|理财|收入/.test(q)) return ['妻财'];
  if (/感情|婚姻|恋爱|表白|复合|伴侣/.test(q)) return ['妻财','官鬼'];
  if (/考试|学业|学习|考证/.test(q)) return ['父母','官鬼'];
  if (/健康|疾病|身体|手术/.test(q)) return ['子孙'];
  if (/官司|诉讼|纠纷/.test(q)) return ['官鬼'];
  if (/子女|孩子|生育/.test(q)) return ['子孙'];
  if (/合作|合伙|团队/.test(q)) return ['兄弟'];
  if (/父母|长辈|房产/.test(q)) return ['父母'];
  return ['妻财'];
}

export default function LiuyaoInput() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) { setError('请输入你要问的事'); return; }
    setLoading(true); setError('');
    try {
      const { calculateLiuyao } = await import('taibu-core/liuyao');
      const targets = matchYongShen(question);
      const result = await calculateLiuyao({
        question, yongShenTargets: targets, method: 'auto',
        date: new Date().toISOString(),
      });
      const chart = {
        question, yongShenTargets: targets,
        本卦: { 名称: result.hexagramName, 宫位: result.hexagramGong, 五行: result.hexagramElement, 卦辞: result.guaCi },
        变卦: result.changedHexagramName ? { 名称: result.changedHexagramName, 宫位: result.changedHexagramGong } : null,
        起卦时间: {
          年: result.ganZhiTime.year.gan + result.ganZhiTime.year.zhi,
          月: result.ganZhiTime.month.gan + result.ganZhiTime.month.zhi,
          日: result.ganZhiTime.day.gan + result.ganZhiTime.day.zhi,
        },
        空亡: result.kongWang,
        六爻: result.fullYaos.map((y,i) => ({
          位置: 6-i, 纳甲: y.naJia, 六亲: y.liuQin, 六神: y.liuShen,
          世应: y.isShiYao ? '世' : y.isYingYao ? '应' : '-',
          动爻: y.isChanging ? y.movementLabel : null,
          旺衰: y.strength?.label || '', 空亡: y.kongWangState || '',
        })),
        用神: result.yongShen?.map(y => ({ 目标: y.targetLiuQin, 状态: y.selectionStatus, 选中: y.selected ? `${y.selected.naJia}(${y.selected.liuQin})` : '?' })),
        互卦: result.nuclearHexagram?.name, 错卦: result.oppositeHexagram?.name, 综卦: result.reversedHexagram?.name,
        六冲: result.liuChongGuaInfo?.isLiuChongGua ? result.liuChongGuaInfo.description : null,
        六合: result.liuHeGuaInfo?.isLiuHeGua ? result.liuHeGuaInfo.description : null,
      };
      const prompt = `请断此卦：\n\`\`\`json\n${JSON.stringify(chart, null, 2)}\n\`\`\``;
      const resp = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [
          { role: 'system', content: LIUYAO_SYSTEM },
          { role: 'user', content: prompt },
        ], temperature: 0.6, max_tokens: 1500 }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      navigate('/liuyao/result', { state: { chart, interpretation: data.choices[0].message.content, tokens: data.usage } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 pt-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h2 
          className="text-3xl font-bold mb-2 tracking-[0.15em]"
          style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", color: '#2c2416' }}
        >
          六爻占卜
        </h2>
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#8b7355' }}>I Ching Divination</p>
        <div style={{ width: 36, height: 1, background: '#c43a31', opacity: 0.35, margin: '14px auto 0' }} />
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fffdf7', border: '1px solid #e0d8c8', padding: 36 }} className="space-y-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold tracking-[0.1em]" style={{ color: '#2c2416' }}>所问之事</label>
          <textarea
            placeholder="写下你想问的事，例如：「今年能不能升职加薪？」"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="input w-full resize-none"
            rows={4}
            style={{ lineHeight: 1.8, fontSize: 15 }}
          />
        </div>

        {question && (
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: '#8b7355' }}>系统匹配用神</span>
            <span style={{ color: '#c43a31', fontWeight: 600 }}>{matchYongShen(question).join(' · ')}</span>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 text-sm" style={{ background: 'rgba(196,58,49,0.06)', border: '1px solid rgba(196,58,49,0.15)', color: '#c43a31' }}>
            {error}
          </div>
        )}

        <div className="flex justify-center pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '起卦中...' : '起 卦 占 卜'}
          </button>
        </div>

        <p className="text-xs text-center leading-relaxed" style={{ color: '#b8a88a' }}>
          系统自动摇卦 · 京房纳甲法 · 一事一占
        </p>
      </form>

      <div className="mt-16 text-center">
        <div style={{ width: 36, height: 1, background: '#c43a31', opacity: 0.35, margin: '0 auto 12px' }} />
        <p className="text-xs tracking-[0.1em]" style={{ color: '#b8a88a' }}>心诚则灵 · 一事一断</p>
      </div>
    </div>
  );
}

const LIUYAO_SYSTEM = `你是专业六爻断卦师（京房纳甲法）。

## 输出结构
### 一、卦象概述（本卦+变卦，一句总结）
### 二、用神定位（取何用神，在何爻，旺衰状态）
### 三、关键信号（动爻分析、世应关系、月建日辰影响）
### 四、吉凶判断（明确吉/凶/平+依据）
### 五、应期与建议

风格：现代简洁，术语首次出现括号解释。段落间留空行。
禁止：模棱两可、编造爻象、每个判断必须有依据。`;
