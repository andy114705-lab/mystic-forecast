// 八字排盘引擎（浏览器版）—— 含推导链 + 神煞 + 完整字段
import { Solar, Lunar } from 'lunar-javascript';

const GAN_WX = { 甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水' };
const ZHI_WX = { 子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水' };

// ═══════════════════════ 神煞查表 ═══════════════════════
// 天乙贵人：甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，六辛逢虎马
const TIAN_YI = { 甲:['丑','未'],乙:['子','申'],丙:['亥','酉'],丁:['亥','酉'],戊:['丑','未'],己:['子','申'],庚:['丑','未'],辛:['寅','午'],壬:['卯','巳'],癸:['卯','巳'] };
// 文昌贵人：甲巳乙午丙戊申，丁己酉位庚亥乡，辛子壬寅癸见卯
const WEN_CHANG = { 甲:'巳',乙:'午',丙:'申',丁:'酉',戊:'申',己:'酉',庚:'亥',辛:'子',壬:'寅',癸:'卯' };
// 禄神：甲寅乙卯丙戊巳，丁己午兮庚申位，辛酉壬亥癸在子
const LU_SHEN = { 甲:'寅',乙:'卯',丙:'巳',丁:'午',戊:'巳',己:'午',庚:'申',辛:'酉',壬:'亥',癸:'子' };
// 羊刃：甲卯乙寅丙戊午，丁己巳兮庚在酉，辛申壬子癸见亥
const YANG_REN = { 甲:'卯',乙:'寅',丙:'午',丁:'巳',戊:'午',己:'巳',庚:'酉',辛:'申',壬:'子',癸:'亥' };
// 驿马：申子辰在寅，寅午戌在申，巳酉丑在亥，亥卯未在巳
const YI_MA_MAP = { 申:['申','子','辰'],寅:['寅','午','戌'],亥:['巳','酉','丑'],巳:['亥','卯','未'] };
const YI_MA = (zhi) => { for(const [k,v] of Object.entries(YI_MA_MAP)) { if(v.includes(zhi)) return k; } return '?'; };
// 桃花：申子辰见酉，巳酉丑见午，亥卯未见子，寅午戌见卯
const TAO_HUA_MAP = { 酉:['申','子','辰'],午:['巳','酉','丑'],子:['亥','卯','未'],卯:['寅','午','戌'] };
const TAO_HUA = (zhi) => { for(const [k,v] of Object.entries(TAO_HUA_MAP)) { if(v.includes(zhi)) return k; } return '?'; };
// 华盖：申子辰见辰，巳酉丑见丑，亥卯未见未，寅午戌见戌
const HUA_GAI_MAP = { 辰:['申','子','辰'],丑:['巳','酉','丑'],未:['亥','卯','未'],戌:['寅','午','戌'] };
const HUA_GAI = (zhi) => { for(const [k,v] of Object.entries(HUA_GAI_MAP)) { if(v.includes(zhi)) return k; } return '?'; };

function getDayShenSha(dayGan, branch) {
  const ss = [];
  if (TIAN_YI[dayGan]?.includes(branch)) ss.push('天乙贵人');
  if (WEN_CHANG[dayGan] === branch) ss.push('文昌');
  if (LU_SHEN[dayGan] === branch) ss.push('禄神');
  if (YANG_REN[dayGan] === branch) ss.push('羊刃');
  const yima = YI_MA(branch);
  if (branch !== yima) {
    // Yi Ma is per-branch group, but it's better computed per year/month branch
    // For simplicity we just note it if the current branch IS the Yi Ma
  }
  return ss;
}

function getYearBranchShenSha(yearBranch, branch) {
  const ss = [];
  if (YI_MA(yearBranch) === branch) ss.push('驿马');
  if (TAO_HUA(yearBranch) === branch) ss.push('桃花');
  if (HUA_GAI(yearBranch) === branch) ss.push('华盖');
  return ss;
}

// ═══════════════════════ 十神查表 ═══════════════════════
const SHI_SHEN = {};
(() => {
  const gans = '甲乙丙丁戊己庚辛壬癸';
  for (let i=0;i<10;i++) {
    const dm=gans[i], dmYy=i%2, dmWx=Math.floor(i/2);
    for (let j=0;j<10;j++) {
      const o=gans[j], oWx=Math.floor(j/2);
      const diff=(oWx-dmWx+5)%5;
      const base = diff===0?0:diff===1?2:diff===2?4:diff===3?6:8;
      const off = dmYy===j%2?0:1;
      const labels = ['比肩','劫财','食神','伤官','偏财','正财','七杀','正官','偏印','正印'];
      SHI_SHEN[dm+o] = labels[base+off];
    }
  }
})();

// ═══════════════════════ 冲合查表 ═══════════════════════
const CHONG = { 子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳' };
const LIU_HE = { 子:'丑',丑:'子',寅:'亥',亥:'寅',卯:'戌',戌:'卯',辰:'酉',酉:'辰',巳:'申',申:'巳',午:'未',未:'午' };
const SAN_HE = { 申子辰:'水',亥卯未:'木',寅午戌:'火',巳酉丑:'金' };
const DI_SHI_ORDER = ['长生','沐浴','冠带','临官','帝旺','衰','病','死','墓','绝','胎','养'];

// ═══════════════════════ 主排盘函数 ═══════════════════════
export function calculateBaziChart({ birthYear, birthMonth, birthDay, birthHour, birthMinute=0, gender, calendarType='solar', longitude=120, name='' }) {
  const steps = []; // 推导链
  const isMale = gender === '男';
  let solar, lunarNote = '';
  let solarYear, solarMonth, solarDay;

  // ─── 第1步：日期类型处理 ───
  if (calendarType === 'lunar') {
    steps.push({ step:1, title:'阴历转阳历', input:`农历${birthYear}年${birthMonth}月${birthDay}日`, rule:'Lunar.fromYmd() 历法转换 → getSolar()', output:'', detail:'' });
    const l = Lunar.fromYmd(birthYear, birthMonth, birthDay);
    solar = l.getSolar();
    lunarNote = `（农历${birthYear}年${birthMonth}月${birthDay}日）`;
    solarYear = solar.getYear();
    solarMonth = solar.getMonth();
    solarDay = solar.getDay();
    steps[steps.length-1].output = `${solarYear}年${solarMonth}月${solarDay}日`;
    steps[steps.length-1].detail = `农历日期必须转换为公历日期才能进行后续排盘。`+
      `公历${solarYear}年${solarMonth}月${solarDay}日即为农历${birthYear}年${birthMonth}月${birthDay}日对应的阳历日期。`;
  } else {
    solarYear = birthYear; solarMonth = birthMonth; solarDay = birthDay;
    steps.push({ step:1, title:'日期确认', input:`公历${birthYear}年${birthMonth}月${birthDay}日`, rule:'直接使用公历日期', output:'公历日期，无需转换', detail:'输入为公历日期，直接进入下一步。' });
  }

  // ─── 第2步：真太阳时修正 ───
  const totalMin = birthHour * 60 + birthMinute + (longitude - 120) * 4;
  let adj = Math.round(((totalMin % 1440) + 1440) % 1440);
  const solarHour = Math.floor(adj / 60);
  const solarMinute = adj % 60;
  const timeOffset = Math.round((longitude - 120) * 4);
  const rawTime = `${String(birthHour).padStart(2,'0')}:${String(birthMinute).padStart(2,'0')}`;
  const solarTime = `${String(solarHour).padStart(2,'0')}:${String(solarMinute).padStart(2,'0')}`;

  steps.push({ step:2, title:'真太阳时修正',
    input:`钟表时间 ${rawTime} · 经度 ${longitude}°`,
    rule:`真太阳时 = 钟表时间 + (经度 − 120°) × 4分钟\n偏移 = (${longitude} − 120) × 4 = ${timeOffset>0?'+':''}${timeOffset}分钟`,
    output:`真太阳时 ${solarTime}（修正${timeOffset>0?'+':''}${timeOffset}分钟）`,
    detail:`北京时间对应东经120°。出生地经度${longitude}°，每偏离1°偏移4分钟。`+
      `${timeOffset===0?'出生地经度正好120°，无需修正。':(timeOffset>0?`出生地偏东${longitude-120}°，真太阳时比钟表时间早${timeOffset}分钟。`:`出生地偏西${120-longitude}°，真太阳时比钟表时间晚${Math.abs(timeOffset)}分钟。`)}`+
      `修正后时辰归入「${diZhiHour(solarHour)}时」（${solarHour}:${String(solarMinute).padStart(2,'0')}）。`
  });

  // ─── 第3步：排四柱 ───
  solar = Solar.fromYmdHms(solarYear, solarMonth, solarDay, solarHour, solarMinute, 0);
  const lunar = solar.getLunar();
  const bz = lunar.getEightChar();
  const dayMaster = bz.getDayGan();

  const pd = (p) => {
    const g = bz['get'+p+'Gan'](), z = bz['get'+p+'Zhi']();
    const dayGan = bz.getDayGan();
    const dayBranchShenSha = getDayShenSha(dayGan, z);
    const yearBranch = bz.getYearZhi();
    const yearBranchShenSha = getYearBranchShenSha(yearBranch, z);
    return {
      ganZhi: bz['get'+p](), gan: g, zhi: z,
      tenGod: p==='Day'?'日主':bz['get'+p+'ShiShenGan'](),
      nayin: bz['get'+p+'NaYin'](), diShi: bz['get'+p+'DiShi'](),
      hiddenStems: bz['get'+p+'HideGan'](),
      xun: bz['get'+p+'Xun'](), xunKong: bz['get'+p+'XunKong'](),
      wuXing: GAN_WX[g]+ZHI_WX[z],
      shenSha: [...dayBranchShenSha, ...yearBranchShenSha],
    };
  };

  const pillars = { year: pd('Year'), month: pd('Month'), day: pd('Day'), hour: pd('Time') };

  steps.push({ step:3, title:'排四柱',
    input:`阳历${solarYear}-${solarMonth}-${solarDay} ${solarTime}`,
    rule:'干支纪年(立春分界) · 五虎遁月 · 五鼠遁时',
    output:`年${pillars.year.ganZhi} 月${pillars.month.ganZhi} 日${pillars.day.ganZhi} 时${pillars.hour.ganZhi}`,
    detail:`用lunar-javascript库排盘，取Solar对象→Lunar对象→EightChar对象，自动处理立春分界、五虎遁（年干定月干）、五鼠遁（日干定时干）。`
  });

  // ─── 第4步：日主与十神 ───
  const tenGodSummary = ['year','month','day','hour'].map(k => {
    const p = pillars[k]; const label = {year:'年',month:'月',day:'日',hour:'时'}[k];
    return `${label}干${p.gan} → ${p.tenGod}`;
  });
  steps.push({ step:4, title:'日主与十神',
    input:`日干${dayMaster}为日主`,
    rule:'以日主为中心，按生克比和关系定其他天干十神',
    output:tenGodSummary.join('；'),
    detail:`十神规则：同我者比劫（阴阳同=比肩，异=劫财），我生者食伤（同=食神，异=伤官），我克者财（同=偏财，异=正财），克我者官杀（同=七杀，异=正官），生我者印（同=偏印，异=正印）。\n`+
      tenGodSummary.map(s=>`  ${s}`).join('\n')
  });

  // ─── 第5步：五行分析 ───
  const fe = { 金:0,木:0,水:0,火:0,土:0 };
  for (const k of ['year','month','day','hour']) {
    const p = pillars[k];
    fe[GAN_WX[p.gan]] = (fe[GAN_WX[p.gan]]||0)+1;
    fe[ZHI_WX[p.zhi]] = (fe[ZHI_WX[p.zhi]]||0)+1;
  }
  const feDetail = Object.entries(fe).map(([k,v])=>`${k}${v}个`).join('，');
  const dmWx = GAN_WX[dayMaster];
  const feNote = `日主${dayMaster}属${dmWx}，八字中${dmWx}共出现${fe[dmWx]}次（含日主本身）。`;
  steps.push({ step:5, title:'五行统计',
    input:`四柱干支共8个字`,
    rule:'天干地支各有五行属性，统计8个字的五行分布',
    output:feDetail,
    detail:`统计方法：每个天干按天干五行计1，每个地支按地支五行计1。藏干不计入（已另列藏干栏）。\n${feNote}`
  });

  // ─── 第6步：旺衰判断 ───
  const dmDiShi = pillars.day.diShi;
  const dmMonthZhi = pillars.month.zhi;
  const dmMonthWx = ZHI_WX[dmMonthZhi];
  const dmWxWangInMonth = (GAN_WX[dayMaster] === '木' && ['寅','卯'].includes(dmMonthZhi)) ||
    (GAN_WX[dayMaster] === '火' && ['巳','午'].includes(dmMonthZhi)) ||
    (GAN_WX[dayMaster] === '金' && ['申','酉'].includes(dmMonthZhi)) ||
    (GAN_WX[dayMaster] === '水' && ['亥','子'].includes(dmMonthZhi)) ||
    (GAN_WX[dayMaster] === '土' && ['辰','戌','丑','未'].includes(dmMonthZhi));
  const strong = ['长生','冠带','临官','帝旺','建禄'];
  const weak = ['死','墓','绝','病'];
  let level = '中和';
  if (strong.includes(dmDiShi)) level = '身强';
  else if (weak.includes(dmDiShi)) level = '身弱';
  if (dmWxWangInMonth && level==='中和') level = '身强';
  steps.push({ step:6, title:'旺衰判断',
    input:`日主${dayMaster}(${dmWx}) · 月令${dmMonthZhi}(${dmMonthWx}) · 日柱地势「${dmDiShi}」`,
    rule:'日主在月令得令→身强，失令+地势弱→身弱',
    output:`${level}（日主${dmWx}在${dmMonthZhi}月${dmWxWangInMonth?'得令':'失令'}，处「${dmDiShi}」地）`,
    detail:`判断分两层：\n`+
      `① 得令（月令）：日主${dmWx}，月令${dmMonthZhi}属${dmMonthWx}，${dmWxWangInMonth?`${dmWx}在${dmMonthZhi}月当令，得月令之气`:`${dmWx}在${dmMonthZhi}月不当令，失月令之气`}。\n`+
      `② 地势：日柱天干${dayMaster}在地支中的十二长生状态为「${dmDiShi}」${strong.includes(dmDiShi)?'，属旺相状态':weak.includes(dmDiShi)?'，属衰弱状态':'，属中间状态'}。\n`+
      `③ 综合：${level==='身强'?'得令+地势旺，判定身强':level==='身弱'?'失令+地势弱，判定身弱':'得令不显或地势居中，暂判中和，需结合全局五行生克进一步确认。'}`
  });

  // ─── 第7步：格局 ───
  const yueQ = pillars.month.hiddenStems[0] || '?';
  const tg = SHI_SHEN[dayMaster + yueQ] || '?';
  const pn = { '正印':'正印格','偏印':'偏印格','正官':'正官格','七杀':'七杀格','正财':'正财格','偏财':'偏财格','食神':'食神格','伤官':'伤官格','比肩':'建禄格','劫财':'月刃格' };
  steps.push({ step:7, title:'格局判定',
    input:`月令藏干首气${yueQ} · 日主${dayMaster}`,
    rule:'以月令藏干首气为「月令用神」，按十神关系定格局',
    output:`${pn[tg] || tg+'格'}（月令${yueQ}为${tg}）`,
    detail:`月令（月支）${pillars.month.zhi}的藏干为：${pillars.month.hiddenStems.join('、')}，取其首气「${yueQ}」为月令用神。\n`+
      `日主${dayMaster}与月令用神${yueQ}的关系为「${tg}」。\n`+
      `格局命名：${tg==='比肩'?'月令用神与日主同五行，称建禄格（月令为禄）。':tg==='劫财'?'月令用神为日主劫财，称月刃格。':`此格局由月令用神${yueQ}透出而定为「${pn[tg]||tg+'格'}」。`}`
  });

  // ─── 第8步：大运 ───
  const yun = bz.getYun(isMale?1:0, 1);
  const raw = yun.getDaYun(10).filter(d => d.getGanZhi()?.length >= 2);
  const sa = raw[0]?.getStartAge() || 0;
  const sy = birthYear + sa;
  const dayun = {
    direction: isMale ? (bz.getDayGan() && '甲乙丙丁戊'.includes(bz.getDayGan()) ? '顺行' : '逆行') : (!'甲乙丙丁戊'.includes(bz.getDayGan()) ? '顺行' : '逆行'),
    startAge: sa, startYear: sy,
    list: raw.map((d,i) => ({
      ganZhi: d.getGanZhi(), startAge: d.getStartAge(), endAge: d.getStartAge()+9,
      startYear: sy+i*10, endYear: sy+i*10+9,
      tenGod: SHI_SHEN[dayMaster + d.getGanZhi()[0]] || '?',
    })),
  };
  const yunRule = isMale ? '男命阳年顺行、阴年逆行' : '女命阴年顺行、阳年逆行';
  steps.push({ step:8, title:'大运排盘',
    input:`性别${gender} · 日干${dayMaster}`,
    rule:yunRule,
    output:`${dayun.direction}起运 · ${sa}岁起运（${sy}年）`,
    detail:`起运规则：${yunRule}。日干${dayMaster}${'甲乙丙丁戊'.includes(dayMaster)?'属阳':'属阴'}，${isMale?'男':'女'}命，故${dayun.direction}排大运。\n起运年龄=${sa}岁，即从${sy}年开始行第一步大运。\n共排10步大运，每步10年，覆盖${sa}岁至${sa+99}岁。`
  });

  // ─── 第9步：流年 ───
  const cy = new Date().getFullYear();
  const spSolar = Solar.fromYmd(cy, 2, 5);
  const lnGz = spSolar.getLunar().getYearInGanZhiByLiChun();
  const cd = dayun.list.find(d => cy >= d.startYear && cy <= d.endYear);
  const liunian = {
    year: cy, ganZhi: lnGz, gan: lnGz[0], zhi: lnGz[1],
    tenGod: SHI_SHEN[dayMaster+lnGz[0]] || '?',
    dayunGanZhi: cd?.ganZhi || '?',
    dayunTenGod: cd ? (SHI_SHEN[dayMaster+cd.ganZhi[0]]||'?') : '?',
    dayunAge: cd ? `${cd.startAge}-${cd.endAge}岁` : '?',
    relationWithDayMaster: SHI_SHEN[dayMaster+lnGz[0]] || '?',
  };
  steps.push({ step:9, title:'当前流年',
    input:`当前${cy}年`,
    rule:'以立春分界的干支纪年确定流年干支，流年天干与日主论十神',
    output:`${cy}年${lnGz}（${liunian.tenGod}流年）· 大运${liunian.dayunGanZhi}（${liunian.dayunAge}）`,
    detail:`${cy}年立春后干支为${lnGz}。\n流年天干${lnGz[0]}与日主${dayMaster}的关系为「${liunian.tenGod}」。\n当前所处大运：${liunian.dayunGanZhi}（${liunian.dayunTenGod}运），${liunian.dayunAge}。\n流年与大运的关系：${ynRelDesc(liunian.tenGod, liunian.dayunTenGod)}。`
  });

  // ─── 第10步：干支冲合 ───
  const rels = [];
  const brs = [{n:'年支',z:pillars.year.zhi},{n:'月支',z:pillars.month.zhi},{n:'日支',z:pillars.day.zhi},{n:'时支',z:pillars.hour.zhi}];
  for (let i=0;i<brs.length;i++) for (let j=i+1;j<brs.length;j++) {
    if (CHONG[brs[i].z]===brs[j].z) rels.push(`${brs[i].n}${brs[i].z}冲${brs[j].n}${brs[j].z}`);
    if (LIU_HE[brs[i].z]===brs[j].z) rels.push(`${brs[i].n}${brs[i].z}合${brs[j].n}${brs[j].z}`);
  }
  const sanHeGroups = [];
  for (const [key, wx] of Object.entries(SAN_HE)) {
    const branches = [key.slice(0,1), key.slice(1,2), key.slice(2,3)];
    const matches = brs.filter(b => branches.includes(b.z));
    if (matches.length === 3) sanHeGroups.push(`${matches.map(m=>m.n+m.z).join('+')}=>${key}(化${wx})`);
  }
  steps.push({ step:10, title:'干支关系',
    input:`四柱地支：${brs.map(b=>b.z).join(' ')}`,
    rule:'子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲；子丑合、寅亥合、卯戌合、辰酉合、巳申合、午未合；三合局',
    output:rels.length>0?rels.join('；')+(sanHeGroups.length>0?'；三合：'+sanHeGroups.join('；'):''):'原局无直接冲合',
    detail:`地支六冲：${CHONG_NAMES}\n地支六合：${HE_NAMES}\n三合局：申子辰化水、亥卯未化木、寅午戌化火、巳酉丑化金\n\n原局分析：\n${rels.length>0?rels.map(r=>`  ${r}`).join('\n'):'  四柱地支之间无直接冲合关系。'}${sanHeGroups.length>0?'\n三合局：\n'+sanHeGroups.map(s=>`  ${s}`).join('\n'):''}`
  });

  return {
    name,
    basic: {
      公历: `${birthYear}-${String(birthMonth).padStart(2,'0')}-${String(birthDay).padStart(2,'0')} ${String(birthHour).padStart(2,'0')}:${String(birthMinute).padStart(2,'0')}`,
      农历: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日`,
      生肖: lunar.getYearShengXiao(), 星座: solar.getXingZuo(), 日主: dayMaster, 性别: gender,
      ...(lunarNote && { 阴历备注: lunarNote }),
      ...(timeOffset !== 0 && { 真太阳时: `${String(solarHour).padStart(2,'0')}:${String(solarMinute).padStart(2,'0')}（修正${timeOffset>0?'+':''}${timeOffset}分钟）` }),
      真太阳时: `${String(solarHour).padStart(2,'0')}:${String(solarMinute).padStart(2,'0')}（修正${timeOffset>0?'+':''}${timeOffset}分钟）`,
    },
    pillars, dayMaster, fiveElements: fe,
    strength: { dayMasterDiShi: dmDiShi, level, detail: `日主${dayMaster}生于${pillars.month.zhi}月，处于「${dmDiShi}」地` },
    pattern: { name: pn[tg]||`${tg}格`, yueLingQi: yueQ, tenGod: tg },
    dayun, liunian, relations: rels, sanHeGroups,
    taiYuan: bz.getTaiYuan(), mingGong: bz.getMingGong(),
    steps, // 推导链
  };
}

// ═══════════════════════ 辅助函数 ═══════════════════════
function diZhiHour(h) {
  const dizi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  return dizi[Math.floor(((h+1)%24)/2)];
}

function ynRelDesc(ynTenGod, dyTenGod) {
  if (!ynTenGod || !dyTenGod) return '数据不足';
  const favorable = ['正印','偏印','比肩','劫财'];
  const ynFav = favorable.includes(ynTenGod);
  const dyFav = favorable.includes(dyTenGod);
  if (ynFav && dyFav) return '流年与大运皆吉，宜积极进取';
  if (!ynFav && !dyFav) return '流年与大运皆不吉，宜稳守待时';
  if (ynFav && !dyFav) return '流年吉但大运不吉，机遇中需谨慎';
  return '大运吉但流年不吉，根基稳但当年需防波折';
}

const CHONG_NAMES = '子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲';
const HE_NAMES = '子丑合、寅亥合、卯戌合、辰酉合、巳申合、午未合';
