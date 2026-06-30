// Ten God descriptions for personalized display
export const tenGodDesc = {
  '正官': '正官运主事业升迁、贵人相助。这十年适合在体制内稳步发展，守规矩得回报。',
  '偏官': '偏官运主挑战与突破。这十年压力大但成长快，适合创业或争取管理岗位。',
  '正印': '正印运主贵人扶持、学习沉淀。这十年适合进修考证、积累资源，遇事有长辈相助。',
  '偏印': '偏印运主特殊技能与独立思考。这十年适合深耕专业领域，偏门学问反有奇效。',
  '正财': '正财运主稳定收入与资产积累。这十年适合踏实工作、买房置产，不宜投机。',
  '偏财': '偏财运主投资机遇与意外之财。这十年财来财去波动大，宜灵活应变、见好就收。',
  '食神': '食神运主才华施展与生活享受。这十年创意充沛，适合艺术创作、餐饮美食相关行业。',
  '伤官': '伤官运主突破创新与锋芒毕露。这十年思维活跃敢想敢做，但需注意人际关系。',
  '比肩': '比肩运主竞争合作与自我提升。这十年靠实力说话，适合团队协作或自主创业。',
  '劫财': '劫财运主资源重组。这十年人来人往财来财去，宜合伙不宜单干，注意财务管理。',
};

export function dayunDesc(d) {
  return tenGodDesc[d?.tenGod] || '';
}

export function liunianRelationDesc(dayunTenGod, liunianTenGod) {
  if (!dayunTenGod || !liunianTenGod) return '';
  if (dayunTenGod === liunianTenGod) {
    return `大运与流年同为「${dayunTenGod}」，能量叠加。这一年${dayunTenGod}的主题被加倍放大，是${dayunTenGod}相关事务的集中爆发期。`;
  }
  return `大运「${dayunTenGod}」为十年基调，流年「${liunianTenGod}」为当年主题。两者交织，需综合判断主次与生克。`;
}
