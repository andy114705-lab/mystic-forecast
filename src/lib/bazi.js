// 八字排盘引擎（浏览器版）
import { Solar, Lunar } from 'lunar-javascript';

const GAN_WX = { 甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水' };
const ZHI_WX = { 子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水' };

export function calculateBaziChart({ birthYear, birthMonth, birthDay, birthHour, birthMinute=0, gender, calendarType='solar', longitude=120, name='' }) {
  const isMale = gender === '男';
  let solar;
  let lunarNote = '';
  let solarYear, solarMonth, solarDay;

  // 第1步：日期转换（阴历 → 阳历）
  if (calendarType === 'lunar') {
    const l = Lunar.fromYmd(birthYear, birthMonth, birthDay);
    solar = l.getSolar();
    lunarNote = `（农历${birthYear}年${birthMonth}月${birthDay}日）`;
    solarYear = solar.getYear();
    solarMonth = solar.getMonth();
    solarDay = solar.getDay();
  } else {
    solarYear = birthYear;
    solarMonth = birthMonth;
    solarDay = birthDay;
  }

  // 第2步：真太阳时修正（始终执行，与日历类型无关）
  // 用户输入的时间是出生地钟表时间，需换算为当地真太阳时
  const totalMin = birthHour * 60 + birthMinute + (longitude - 120) * 4;
  let adj = Math.round(((totalMin % 1440) + 1440) % 1440);
  const solarHour = Math.floor(adj / 60);
  const solarMinute = adj % 60;
  const timeOffset = Math.round((longitude - 120) * 4);

  // 第3步：用阳历日期 + 真太阳时构建 Solar 对象
  solar = Solar.fromYmdHms(solarYear, solarMonth, solarDay, solarHour, solarMinute, 0);

  const lunar = solar.getLunar();
  const bz = lunar.getEightChar();
  const dayMaster = bz.getDayGan();

  const pd = (p) => {
    const g = bz['get'+p+'Gan'](), z = bz['get'+p+'Zhi']();
    return {
      ganZhi: bz['get'+p](), gan: g, zhi: z,
      tenGod: p==='Day'?'日主':bz['get'+p+'ShiShenGan'](),
      nayin: bz['get'+p+'NaYin'](), diShi: bz['get'+p+'DiShi'](),
      hiddenStems: bz['get'+p+'HideGan']().join('、'),
      wuXing: GAN_WX[g]+ZHI_WX[z],
    };
  };

  const pillars = {
    year: pd('Year'), month: pd('Month'), day: pd('Day'), hour: pd('Time'),
  };

  // 五行
  const fe = { 金:0,木:0,水:0,火:0,土:0 };
  for (const k of ['year','month','day','hour']) {
    const p = pillars[k];
    fe[GAN_WX[p.gan]] = (fe[GAN_WX[p.gan]]||0)+1;
    fe[ZHI_WX[p.zhi]] = (fe[ZHI_WX[p.zhi]]||0)+1;
  }

  // 旺衰
  const dmDiShi = pillars.day.diShi;
  const strong = ['长生','冠带','临官','帝旺','建禄'];
  const weak = ['死','墓','绝','病'];
  let level = '中和';
  if (strong.includes(dmDiShi)) level = '身强';
  else if (weak.includes(dmDiShi)) level = '身弱';

  // 格局
  const yueQ = pillars.month.hiddenStems.split('、')[0];
  const tg = SHI_SHEN[dayMaster + yueQ] || '?';
  const pn = { '正印':'正印格','偏印':'偏印格','正官':'正官格','七杀':'七杀格','正财':'正财格','偏财':'偏财格','食神':'食神格','伤官':'伤官格','比肩':'建禄格','劫财':'月刃格' };

  // 大运
  const yun = bz.getYun(isMale?1:0, 1);
  const raw = yun.getDaYun(10).filter(d => d.getGanZhi()?.length >= 2);
  const sa = raw[0]?.getStartAge() || 0;
  const sy = birthYear + sa;
  const dayun = {
    direction: yun.isForward ? (yun.isForward()?'顺行':'逆行') : '?',
    startAge: sa, startYear: sy,
    list: raw.map((d,i) => ({
      ganZhi: d.getGanZhi(), startAge: d.getStartAge(), endAge: d.getStartAge()+9,
      startYear: sy+i*10, endYear: sy+i*10+9,
      tenGod: SHI_SHEN[dayMaster + d.getGanZhi()[0]] || '?',
    })),
  };

  // 流年
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
  };

  // 干支关系
  const rels = [];
  const brs = [{n:'年支',z:pillars.year.zhi},{n:'月支',z:pillars.month.zhi},{n:'日支',z:pillars.day.zhi},{n:'时支',z:pillars.hour.zhi}];
  const chong={子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
  const he={子:'丑',丑:'子',寅:'亥',亥:'寅',卯:'戌',戌:'卯',辰:'酉',酉:'辰',巳:'申',申:'巳',午:'未',未:'午'};
  for (let i=0;i<brs.length;i++) for (let j=i+1;j<brs.length;j++) {
    if (brs[i].z===chong[brs[j].z]) rels.push(`${brs[i].n}${brs[i].z}冲${brs[j].n}${brs[j].z}`);
    if (brs[i].z===he[brs[j].z]) rels.push(`${brs[i].n}${brs[i].z}合${brs[j].n}${brs[j].z}`);
  }

  return {
    name,
    basic: {
      公历: `${birthYear}-${String(birthMonth).padStart(2,'0')}-${String(birthDay).padStart(2,'0')} ${String(birthHour).padStart(2,'0')}:${String(birthMinute).padStart(2,'0')}`,
      农历: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日`,
      生肖: lunar.getYearShengXiao(), 星座: solar.getXingZuo(), 日主: dayMaster, 性别: gender,
      ...(lunarNote && { 阴历备注: lunarNote }),
      ...(timeOffset !== 0 && { 真太阳时: `${String(solarHour).padStart(2,'0')}:${String(solarMinute).padStart(2,'0')}（修正${timeOffset>0?'+':''}${timeOffset}分钟）` }),
    },
    pillars, dayMaster, fiveElements: fe,
    strength: { dayMasterDiShi: dmDiShi, level, detail: `日主${dayMaster}生于${pillars.month.zhi}月，处于「${dmDiShi}」地` },
    pattern: { name: pn[tg]||`${tg}格`, yueLingQi: yueQ, tenGod: tg },
    dayun, liunian, relations: rels,
    taiYuan: bz.getTaiYuan(), mingGong: bz.getMingGong(),
  };
}

// 十神查表（运行时构建）
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
