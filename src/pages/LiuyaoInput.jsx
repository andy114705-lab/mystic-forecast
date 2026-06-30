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
        ], temperature: 0.6, max_tokens: 2000 }),
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
    <div className="max-w-xl mx-auto p-6 pt-16 animate-fade-in">
      <div className="mb-12 text-center">
        <h2 className="text-3xl tracking-[0.1em] mb-2"
          style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", color: '#c9a55c' }}>
          六爻占卜
        </h2>
        <p className="text-white/15 text-xs tracking-[0.2em] uppercase">I Ching Divination</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <div>
          <div className="text-[11px] text-white/25 uppercase tracking-[0.1em] mb-2">
            所问之事
          </div>
          <textarea
            placeholder="写下你想问的事，例如：「今年能不能升职加薪？」"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="input w-full resize-none"
            rows={4}
            style={{ lineHeight: '1.8', fontSize: '15px' }}
          />
        </div>

        {question && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/20">系统匹配用神</span>
            <span className="text-cinnabar-300">{matchYongShen(question).join(' · ')}</span>
          </div>
        )}

        {error && (
          <div className="bg-cinnabar-500/10 border border-cinnabar-500/20 px-4 py-3 text-cinnabar-300 text-sm">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
          {loading ? '起卦中 ···' : '起卦占卜'}
        </button>

        <p className="text-white/10 text-xs text-center leading-relaxed">
          系统自动摇卦 · 京房纳甲法 · 六爻装卦
        </p>
      </form>

      <div className="mt-16 text-center">
        <hr className="border-white/[0.04] w-24 mx-auto mb-3" />
        <p className="text-[10px] text-white/10 tracking-[0.1em]">
          一事一占 · 心诚则灵
        </p>
      </div>
    </div>
  );
}

const LIUYAO_SYSTEM = `你是专业六爻断卦师（京房纳甲法）。风格：现代简洁，术语必解释。

## 输出结构
### 一、卦象概述（本卦+变卦，一句话总结）
### 二、用神定位（取何用神，在何爻，旺衰状态）
### 三、关键信号（动爻分析、世应关系、月建日辰影响）
### 四、吉凶判断（明确吉/凶/平+依据）
### 五、应期与建议

禁止：不模棱两可、不编造爻象、每个判断有依据`;
