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
        ], temperature: 0.6, max_tokens: 2500 }),
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
    <label className="text-sm font-semibold tracking-[0.1em]" style={{ color: '#2c2416' }}>{children}</label>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 pt-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h2 
          className="text-3xl font-bold mb-2 tracking-[0.15em]"
          style={{ fontFamily: "Georgia, 'Noto Serif SC', serif", color: '#2c2416' }}
        >
          八字命盘
        </h2>
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#8b7355' }}>Four Pillars of Destiny</p>
        <div style={{ width: 36, height: 1, background: '#c43a31', opacity: 0.35, margin: '14px auto 0' }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-7" style={{ background: '#fffdf7', border: '1px solid #e0d8c8', padding: 36 }}>
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Label>姓名 / 称谓</Label>
          <input type="text" placeholder="选填，用于称呼" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} className="input w-full" />
        </div>

        {/* Calendar Type */}
        <div className="flex flex-col gap-1.5">
          <Label>历法</Label>
          <div className="flex gap-2">
            {[{k:'solar',l:'阳历'},{k:'lunar',l:'阴历'}].map(t => (
              <button key={t.k} type="button" onClick={() => setForm({...form, calendarType: t.k})}
                className={`btn-toggle flex-1 ${form.calendarType === t.k ? 'active' : ''}`}>
                {t.l}
              </button>
            ))}
          </div>
          <p className="text-xs mt-1 ml-1" style={{ color: '#b8a88a' }}>
            {form.calendarType === 'solar' ? '公历（格里高利历）日期' : '农历日期，自动转换为公历排盘'}
          </p>
        </div>

        {/* Birth Date */}
        <div className="flex flex-col gap-1.5">
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

        {/* Time + Gender */}
        <div className="grid grid-cols-[1fr_1fr] gap-5">
          <div className="flex flex-col gap-1.5">
            <Label>出生时间</Label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="时 (0-23)" value={form.hour}
                onChange={e => setForm({...form, hour: e.target.value})} className="input" />
              <input type="number" placeholder="分" value={form.minute}
                onChange={e => setForm({...form, minute: e.target.value})} className="input" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>性别</Label>
            <div className="flex gap-2">
              {['男','女'].map(g => (
                <button key={g} type="button" onClick={() => setForm({...form, gender: g})}
                  className={`btn-toggle flex-1 ${form.gender === g ? 'active' : ''}`}>{g}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <Label>出生地点</Label>
          <div className="relative">
            {form.manualLng ? (
              <div className="flex gap-2">
                <input type="number" step="0.1" placeholder="输入经度，如 116.4" value={form.lng}
                  onChange={e => setForm({...form, lng: +e.target.value})} className="input flex-1" />
                <button type="button" onClick={() => setForm({...form, manualLng: false, city: ''})}
                  className="text-xs px-3 whitespace-nowrap" style={{ color: '#b8a88a' }}>
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
                  className="text-xs px-3 whitespace-nowrap" style={{ color: '#b8a88a' }}>
                  手输经度
                </button>
              </div>
            )}
            {citySearch && !form.manualLng && (
              <div className="absolute z-20 mt-1 w-full border max-h-56 overflow-y-auto"
                style={{ background: '#fffdf7', borderColor: '#e0d8c8' }}>
                {filteredCities.map(c => (
                  <div key={c.n} onClick={() => selectCity(c)}
                    className="px-4 py-3 cursor-pointer text-sm flex justify-between border-b"
                    style={{ color: '#2c2416', borderColor: '#ede6d8' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,58,49,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span>{c.n}</span>
                    <span style={{ color: '#b8a88a' }}>{c.lng}°E</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {form.city && (
            <p className="text-xs mt-2 ml-1" style={{ color: '#8b7355' }}>
              {form.city} · 经度 {form.lng}°E
            </p>
          )}
          {solarOffset !== 0 && (
            <p className="text-xs mt-1 ml-1" style={{ color: '#c43a31' }}>
              真太阳时修正 {solarOffset > 0 ? '+' : ''}{solarOffset} 分钟
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 text-sm" style={{ background: 'rgba(196,58,49,0.06)', border: '1px solid rgba(196,58,49,0.15)', color: '#c43a31' }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-center pt-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '排盘中...' : '开 始 排 盘'}
          </button>
        </div>
      </form>
    </div>
  );
}

const SYSTEM_PROMPT = `你是一位专业的八字命理师。按以下结构严格输出，每个部分用 ## 标题分隔。

## 输出结构（必须严格遵守）

## 四维交叉验证
采用旺衰法/格局法/调候法/病药法四维独立分析后交叉综合。每项标注信号强度：✅✅强 / ✅中 / ⚠️弱。

## 流年分析
分析当前流年${new Date().getFullYear()}年对命主的影响，包括流年干支与原局的冲合关系、十神作用、吉凶判断。

## 核心建议
先写综合结论（2-3句话），再分四项具体建议：
- 事业：具体建议文字
- 财富：具体建议文字  
- 感情：具体建议文字
- 健康：具体建议文字

## 评分
在最后单独一行，用此格式输出（0-100整数，基于分析给出客观评分）：
[评分] 事业:XX 财富:XX 感情:XX 健康:XX

风格：现代简洁，术语首次出现括号解释。不模棱两可，每个判断有依据。
禁止：极端断语、孤证定论、编造冲合关系`;

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
