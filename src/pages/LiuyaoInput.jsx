import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKey } from '../App.jsx';

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
  const { apiKey } = useKey();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey) { setError('请先输入 API Key'); return; }
    if (!question.trim()) { setError('请输入你要问的事'); return; }
    setLoading(true); setError('');

    try {
      // Dynamically import taibu-core (heavy)
      const { calculateLiuyao } = await import('taibu-core/liuyao');
      const targets = matchYongShen(question);
      
      const result = await calculateLiuyao({
        question,
        yongShenTargets: targets,
        method: 'auto',
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
          动爻: y.isChanging ? '⚡'+y.movementLabel : '静',
          旺衰: y.strength?.label || '', 空亡: y.kongWangState || '',
        })),
        用神: result.yongShen?.map(y => ({ 目标: y.targetLiuQin, 状态: y.selectionStatus, 选中: y.selected ? `${y.selected.naJia}(${y.selected.liuQin})` : '?' })),
        互卦: result.nuclearHexagram?.name, 错卦: result.oppositeHexagram?.name, 综卦: result.reversedHexagram?.name,
        六冲: result.liuChongGuaInfo?.isLiuChongGua ? result.liuChongGuaInfo.description : null,
        六合: result.liuHeGuaInfo?.isLiuHeGua ? result.liuHeGuaInfo.description : null,
      };

      // LLM
      const prompt = `请断此卦：\n\`\`\`json\n${JSON.stringify(chart, null, 2)}\n\`\`\``;
      const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: 'deepseek-chat', messages: [
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
    <div className="max-w-lg mx-auto p-6 pt-12">
      <h2 className="text-2xl text-gold-400 mb-8 text-center">六爻占卜</h2>
      <form onSubmit={handleSubmit} className="glow-card p-6 space-y-4">
        <textarea
          placeholder="写下你想问的事，例如：今年能不能升职加薪？"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="glow-input w-full h-28 resize-none"
          rows={3}
        />
        {question && (
          <p className="text-xs text-white/30">系统将自动匹配用神：{matchYongShen(question).join('、')}</p>
        )}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading} className="glow-btn w-full">
          {loading ? '起卦中...' : '起卦占卜'}
        </button>
      </form>
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
