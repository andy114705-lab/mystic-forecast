import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateBaziChart } from '../lib/bazi.js';
import { CITIES, trueSolarMinutes } from '../lib/cities.js';

export default function BaziInput() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', year: 1990, month: 1, day: 1, hour: 12, minute: 0, gender: '男',
    calendarType: 'solar',
    city: '', lng: 120, manualLng: false,
  });
  const [citySearch, setCitySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredCities = useMemo(() => {
    if (!citySearch) return CITIES.slice(0, 20);
    const q = citySearch.toLowerCase();
    return CITIES.filter(c => c.n.includes(q) || q.includes(c.n)).slice(0, 20);
  }, [citySearch]);

  const solarOffset = useMemo(() => {
    return trueSolarMinutes(+form.hour, +form.minute, +form.lng).offset;
  }, [form.hour, form.minute, form.lng]);

  const selectCity = (c) => {
    setForm({ ...form, city: c.n, lng: c.lng, manualLng: false });
    setCitySearch('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const chart = calculateBaziChart({
        birthYear: +form.year, birthMonth: +form.month, birthDay: +form.day,
        birthHour: +form.hour, birthMinute: +form.minute, gender: form.gender,
        calendarType: form.calendarType, longitude: +form.lng, name: form.name.trim(),
      });
      const prompt = buildPrompt(chart);
      const resp = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ], temperature: 0.6, max_tokens: 4000 }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      navigate('/bazi/result', { state: { chart, interpretation: data.choices[0].message.content, tokens: data.usage } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Label = ({ children }) => (
    <div className="text-xs text-white/40 uppercase tracking-[0.1em] mb-2">{children}</div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 pt-16 animate-fade-in">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl tracking-[0.1em] mb-2" 
          style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", color: '#c9a55c' }}>
          八字命盘
        </h2>
        <p className="text-white/15 text-xs tracking-[0.2em] uppercase">Four Pillars of Destiny</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Row 1: 姓名 */}
        <div>
          <Label>姓名 / 称谓</Label>
          <input type="text" placeholder="选填，用于称呼" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} className="input w-full" />
        </div>

        {/* Row 2: 日历类型 */}
        <div>
          <Label>历法</Label>
          <div className="flex gap-2">
            {[{k:'solar',l:'阳历'},{k:'lunar',l:'阴历'}].map(t => (
              <button key={t.k} type="button" onClick={() => setForm({...form, calendarType: t.k})}
                className={`btn-toggle flex-1 ${form.calendarType === t.k ? 'active' : ''}`}>
                {t.l}
              </button>
            ))}
          </div>
          <p className="text-white/15 text-xs mt-1.5 ml-1">
            {form.calendarType === 'solar' ? '公历（格里高利历）日期' : '农历日期，自动转换为公历排盘'}
          </p>
        </div>

        {/* Row 3: 出生日期 */}
        <div>
          <Label>出生日期</Label>
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
            <input type="number" placeholder="年份" value={form.year}
              onChange={e => setForm({...form, year: e.target.value})} className="input" />
            <input type="number" placeholder="月" value={form.month}
              onChange={e => setForm({...form, month: e.target.value})} className="input" />
            <input type="number" placeholder="日" value={form.day}
              onChange={e => setForm({...form, day: e.target.value})} className="input" />
          </div>
        </div>

        {/* Row 4: 时间 + 性别 */}
        <div className="grid grid-cols-[1fr_1fr] gap-6">
          <div>
            <Label>出生时间</Label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="时 (0-23)" value={form.hour}
                onChange={e => setForm({...form, hour: e.target.value})} className="input" />
              <input type="number" placeholder="分" value={form.minute}
                onChange={e => setForm({...form, minute: e.target.value})} className="input" />
            </div>
          </div>
          <div>
            <Label>性别</Label>
            <div className="flex gap-2">
              {['男','女'].map(g => (
                <button key={g} type="button" onClick={() => setForm({...form, gender: g})}
                  className={`btn-toggle flex-1 ${form.gender === g ? 'active' : ''}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 5: 出生地点 */}
        <div>
          <Label>出生地点</Label>
          <div className="relative">
            {form.manualLng ? (
              <div className="flex gap-2">
                <input type="number" step="0.1" placeholder="输入经度，如 116.4" value={form.lng}
                  onChange={e => setForm({...form, lng: +e.target.value})} className="input flex-1" />
                <button type="button" onClick={() => setForm({...form, manualLng: false, city: ''})}
                  className="text-xs text-white/20 hover:text-white/40 px-3 whitespace-nowrap">
                  选城市
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="text" placeholder="搜索城市名称..." value={citySearch}
                  onChange={e => setCitySearch(e.target.value)}
                  onFocus={() => setCitySearch(citySearch || form.city)}
                  className="input flex-1" />
                <button type="button" onClick={() => setForm({...form, manualLng: true, city: ''})}
                  className="text-xs text-white/20 hover:text-white/40 px-3 whitespace-nowrap">
                  手输经度
                </button>
              </div>
            )}
            {citySearch && !form.manualLng && (
              <div className="absolute z-20 mt-1 w-full bg-ink-800 border border-white/[0.06] max-h-56 overflow-y-auto">
                {filteredCities.map(c => (
                  <div key={c.n} onClick={() => selectCity(c)}
                    className="px-4 py-3 cursor-pointer hover:bg-cinnabar-500/10 text-sm text-white/60 flex justify-between border-b border-white/[0.03]">
                    <span>{c.n}</span>
                    <span className="text-white/20">{c.lng}°E</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {form.city && (
            <p className="text-white/20 text-xs mt-2 ml-1">
              {form.city} · 经度 {form.lng}°E
            </p>
          )}
          {solarOffset !== 0 && (
            <p className="text-cinnabar-400/70 text-xs mt-1 ml-1">
              真太阳时修正 {solarOffset > 0 ? '+' : ''}{solarOffset} 分钟
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-cinnabar-500/10 border border-cinnabar-500/20 px-4 py-3 text-cinnabar-300 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
          {loading ? '排盘中 ···' : '开始排盘解读'}
        </button>
      </form>
    </div>
  );
}

const SYSTEM_PROMPT = `你是一位专业的八字命理师。采用**四维交叉验证法**，每一维独立判断后再交叉综合，不靠单一方法下结论。

## 四维框架
| 维度 | 方法 | 回答的问题 |
|------|------|-----------|
| 旺衰法 | 日主在月令的得令失令 + 全局生扶克泄 | 能量强弱 |
| 格局法 | 月令本气透干取格 + 用神喜忌 | 社会定位 |
| 调候法 | 冬生喜火/夏生喜水的寒暖燥湿平衡 | 舒适度 |
| 病药法 | 八字最大缺陷（太旺/太弱/冲战）有无制化 | 危机化解力 |

## 分析流程
1. **旺衰判定**：日主得令否？得地否？得生扶否？综合定身强/身弱/中和。必须给出每个判断的具体依据。
2. **格局取用**：月令藏干透出何神？立何格局？喜用神是什么？忌神是什么？
3. **调候需求**：出生月份寒暖？需调候否？调候用神是否出现？
4. **病药诊断**：八字最大的「病」是什么？有无「药」来制化？
5. **四维交叉**：四个维度结论是否一致？不一致处展开调和分析。
6. **专项分析**：事业财运、婚姻感情、健康、性格（2-3点精髓）
7. **大运走势**：当前大运 + 当前流年 + 未来1-3年趋势
8. **逐月分析**：当前流年12个月的干支十神 + 与原局大运的冲合关系 + 每月简要提示

## 输出格式
用 Markdown，标题用 ###。每个判断必须标注信号强度：
- ✅✅ 强信号（>=3个维度一致或单个维度证据极强）
- ✅ 中等信号（2个维度一致或有明确生克关系）
- ⚠️ 弱信号（单一维度且证据不充分）

## 风格要求
- 现代、简洁、直白。每个术语首次出现时括号附白话解释。
- 不确定的地方标注「存疑」，不硬下结论。

## 禁止项
- 禁止极端断语（「必定大富大贵」「一生悲惨」等）
- 禁止孤证定论（单一信号作为确定性判断）
- 禁止模糊不标来源（「可能」「也许」必须附置信度）
- 禁止跳过四维中的任一维
- 禁止编造不存在的冲合关系`;

function buildPrompt(chart) {
  const p = chart.pillars;
  const nameLine = chart.name ? `姓名：${chart.name}\n` : '';
  return `${nameLine}请分析以下八字：

四柱：${p.year.ganZhi} ${p.month.ganZhi} ${p.day.ganZhi} ${p.hour.ganZhi}
日主：${chart.dayMaster}
纳音：年${p.year.nayin} 月${p.month.nayin} 日${p.day.nayin} 时${p.hour.nayin}
十神：年${p.year.tenGod} 月${p.month.tenGod} 日${p.day.tenGod} 时${p.hour.tenGod}
藏干：年${p.year.hiddenStems.join('、')} 月${p.month.hiddenStems.join('、')} 日${p.day.hiddenStems.join('、')} 时${p.hour.hiddenStems.join('、')}
地势：年${p.year.diShi} 月${p.month.diShi} 日${p.day.diShi} 时${p.hour.diShi}
五行统计：${JSON.stringify(chart.fiveElements)}
格局：${chart.pattern.name}
旺衰：${chart.strength.level}（日主在月令处于${chart.strength.dayMasterDiShi}地）
大运：${chart.dayun.direction}起运${chart.dayun.startAge}岁，列表：${chart.dayun.list.filter(d=>d.ganZhi).map(d=>d.ganZhi+'('+d.startAge+'-'+d.endAge+'岁)').join(' ')}
当前流年：${chart.liunian.year}年${chart.liunian.ganZhi}，十神${chart.liunian.tenGod}，位于${chart.liunian.dayunGanZhi}大运(${chart.liunian.dayunAge})
干支关系：${chart.relations.join('；')||'原局无直接冲合'}${chart.sanHeGroups?.length>0?'\\n三合局：'+chart.sanHeGroups.join('；'):''}
胎元：${chart.taiYuan} 命宫：${chart.mingGong}
神煞：${['year','month','day','hour'].map(k=>p[k].ganZhi+p[k].shenSha.filter(Boolean).join('、')).filter(s=>s.length>2).join(' ')||'无'}
旬空：${['year','month','day','hour'].map(k=>p[k].ganZhi+'旬空'+p[k].xunKong).join(' ')}
流月（${chart.liunian.year}年）：
${chart.liuyue.map(m=>`  ${m.month}月 ${m.ganZhi}（${m.tenGod}）${m.relations.length>0?' · 与命局:'+m.relations.join('、'):''}`).join('\n')}`;
}
