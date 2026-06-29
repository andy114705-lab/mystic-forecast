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
        ], temperature: 0.6, max_tokens: 3000 }),
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

  return (
    <div className="max-w-lg mx-auto p-6 pt-12">
      <h2 className="text-2xl text-gold-400 mb-8 text-center">八字命盘</h2>
      <form onSubmit={handleSubmit} className="glow-card p-6 space-y-4">
        {/* 姓名 */}
        <input type="text" placeholder="姓名（选填）" value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} className="glow-input w-full" />

        {/* 阳历/阴历 */}
        <div className="flex gap-2">
          {[{k:'solar',l:'☀ 阳历'},{k:'lunar',l:'🌙 阴历'}].map(t => (
            <button key={t.k} type="button" onClick={() => setForm({...form, calendarType: t.k})}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${form.calendarType === t.k ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/40'}`}>
              {t.l}
            </button>
          ))}
        </div>

        {/* 日期 */}
        <div className="grid grid-cols-3 gap-3">
          <input type="number" placeholder="年" value={form.year}
            onChange={e => setForm({...form, year: e.target.value})} className="glow-input" />
          <input type="number" placeholder="月" value={form.month}
            onChange={e => setForm({...form, month: e.target.value})} className="glow-input" />
          <input type="number" placeholder="日" value={form.day}
            onChange={e => setForm({...form, day: e.target.value})} className="glow-input" />
        </div>

        {/* 时间 */}
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="时(0-23)" value={form.hour}
            onChange={e => setForm({...form, hour: e.target.value})} className="glow-input" />
          <input type="number" placeholder="分" value={form.minute}
            onChange={e => setForm({...form, minute: e.target.value})} className="glow-input" />
        </div>

        {/* 城市 / 经度 */}
        <div className="relative">
          <div className="flex gap-2 items-center">
            {form.manualLng ? (
              <div className="flex gap-2 w-full">
                <input type="number" step="0.1" placeholder="经度（如 116.4）" value={form.lng}
                  onChange={e => setForm({...form, lng: +e.target.value})}
                  className="glow-input flex-1" />
                <button type="button" onClick={() => setForm({...form, manualLng: false, city: ''})}
                  className="text-xs text-white/30 hover:text-white/60 px-2">选城市</button>
              </div>
            ) : (
              <>
                <input type="text" placeholder="搜索城市..." value={citySearch}
                  onChange={e => setCitySearch(e.target.value)}
                  onFocus={() => setCitySearch(citySearch || form.city)}
                  className="glow-input flex-1" />
                <button type="button" onClick={() => setForm({...form, manualLng: true, city: ''})}
                  className="text-xs text-white/30 hover:text-white/60 px-2">手输经度</button>
              </>
            )}
          </div>
          {citySearch && !form.manualLng && (
            <div className="absolute z-20 mt-1 w-full bg-cosmic-800 border border-purple-400/15 rounded-lg max-h-48 overflow-y-auto shadow-xl">
              {filteredCities.map(c => (
                <div key={c.n} onClick={() => selectCity(c)}
                  className="px-3 py-2 cursor-pointer hover:bg-purple-500/20 text-sm text-white/70 flex justify-between">
                  <span>{c.n}</span>
                  <span className="text-white/30">{c.lng}°E</span>
                </div>
              ))}
            </div>
          )}
          {form.city && <p className="text-xs text-white/30 mt-1 ml-1">📍 {form.city}（{form.lng}°E）</p>}
          {solarOffset !== 0 && (
            <p className="text-xs text-teal-400/70 mt-1 ml-1">
              ⏱ 真太阳时修正 {solarOffset > 0 ? '+' : ''}{solarOffset} 分钟
            </p>
          )}
        </div>

        {/* 性别 */}
        <div className="flex gap-3">
          {['男','女'].map(g => (
            <button key={g} type="button" onClick={() => setForm({...form, gender: g})}
              className={`flex-1 py-2 rounded-lg transition-all ${form.gender === g ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/40'}`}>
              {g}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading} className="glow-btn w-full">
          {loading ? '排盘中...' : '开始排盘解读'}
        </button>
      </form>
    </div>
  );
}

const SYSTEM_PROMPT = `你是一位专业的八字命理师（旺衰派）。风格：现代简洁，术语必解释，推理透明。

## 输出结构
### 一、命盘总览
### 二、旺衰分析（日主在月令状态+依据）
### 三、格局与用神（格局名+喜用神+忌神）
### 四、性格特征（2-3点）
### 五、事业财运
### 六、大运走势（当前大运+当前流年分析）
### 七、总结建议

禁止：不模糊、不编造、每个判断有依据`;

function buildPrompt(chart) {
  const p = chart.pillars;
  const nameLine = chart.name ? `姓名：${chart.name}\n` : '';
  return `${nameLine}请分析以下八字：

四柱：${p.year.ganZhi} ${p.month.ganZhi} ${p.day.ganZhi} ${p.hour.ganZhi}
日主：${chart.dayMaster}
纳音：年${p.year.nayin} 月${p.month.nayin} 日${p.day.nayin} 时${p.hour.nayin}
十神：年${p.year.tenGod} 月${p.month.tenGod} 日${p.day.tenGod} 时${p.hour.tenGod}
藏干：年${p.year.hiddenStems} 月${p.month.hiddenStems} 日${p.day.hiddenStems} 时${p.hour.hiddenStems}
地势：年${p.year.diShi} 月${p.month.diShi} 日${p.day.diShi} 时${p.hour.diShi}
五行统计：${JSON.stringify(chart.fiveElements)}
格局：${chart.pattern.name}
旺衰：${chart.strength.level}（日主在月令处于${chart.strength.dayMasterDiShi}地）
大运：${chart.dayun.direction}起运${chart.dayun.startAge}岁，列表：${chart.dayun.list.filter(d=>d.ganZhi).map(d=>d.ganZhi+'('+d.startAge+'-'+d.endAge+'岁)').join(' ')}
当前流年：${chart.liunian.year}年${chart.liunian.ganZhi}，十神${chart.liunian.tenGod}，位于${chart.liunian.dayunGanZhi}大运(${chart.liunian.dayunAge})
干支关系：${chart.relations.join('；')}
胎元：${chart.taiYuan} 命宫：${chart.mingGong}`;
}
