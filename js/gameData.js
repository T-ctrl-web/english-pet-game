// gameData.js - 游戏数据
// ===== 五种宠物 =====
var PET_TYPES = [
  { id: 'cat', name: '小猫咪', emoji: '🐱', description: '一只可爱的猫咪，喜欢晒太阳和打盹',
    image: 'images/小猫.jpg', color: '#FFB6C1' },
  { id: 'dog', name: '小狗狗', emoji: '🐶', description: '一只活泼的小狗，总是充满能量',
    image: 'images/狗.webp', color: '#DEB887' },
  { id: 'tuntun', name: '豚豚', emoji: '🐹', description: '一只圆滚滚的仓鼠，最爱吃东西',
    image: 'images/豚豚.webp', color: '#FFD700' },
  { id: 'lulu', name: '噜噜', emoji: '🦝', description: '一只调皮的浣熊，好奇心满满',
    image: 'images/噜噜.webp', color: '#B0C4DE' },
  { id: 'line-dog', name: '线条小狗', emoji: '🐕', description: '一只来自线条世界的简约小狗',
    image: 'images/线条小狗(male).jpeg', color: '#E6E6FA' }
]

// ===== 商城商品 =====
var SHOP_ITEMS = {
  food: [
    { id: 'food1', name: '小鱼干', price: 50, emoji: '🐟', stock: 10 },
    { id: 'food2', name: '大骨头', price: 60, emoji: '🦴', stock: 8 },
    { id: 'food3', name: '瓜子', price: 30, emoji: '🌰', stock: 15 },
    { id: 'food4', name: '苹果', price: 40, emoji: '🍎', stock: 12 },
    { id: 'food5', name: '鸡腿', price: 80, emoji: '🍗', stock: 6 },
    { id: 'food6', name: '肉干', price: 70, emoji: '🥩', stock: 8 }
  ],
  toys: [
    { id: 'toy1', name: '毛线球', price: 45, emoji: '🧶', stock: 10 },
    { id: 'toy2', name: '飞盘', price: 50, emoji: '⚾', stock: 8 },
    { id: 'toy3', name: '滚轮', price: 90, emoji: '⚽', stock: 5 },
    { id: 'toy4', name: '闪亮物', price: 100, emoji: '🔦', stock: 6 },
    { id: 'toy5', name: '画笔', price: 35, emoji: '🎨', stock: 12 },
    { id: 'toy6', name: '小房子', price: 150, emoji: '🏠', stock: 4 }
  ]
}

// ===== 题库 =====
var ALL_QUESTIONS = [
  // 四级 - 中文→英文
  { id:'e01', type:'cn2en', diff:'easy', cn:'美丽的', en:'beautiful', pos:'adj', hint:'beau...', phonetic:'ˈbjuːtɪfl' },
  { id:'e02', type:'cn2en', diff:'easy', cn:'重要的', en:'important', pos:'adj', hint:'imp...', phonetic:'ɪmˈpɔːtnt' },
  { id:'e03', type:'cn2en', diff:'easy', cn:'不同的', en:'different', pos:'adj', hint:'diff...', phonetic:'ˈdɪfrənt' },
  { id:'e04', type:'cn2en', diff:'easy', cn:'困难的', en:'difficult', pos:'adj', hint:'diffi...', phonetic:'ˈdɪfɪkəlt' },
  { id:'e05', type:'cn2en', diff:'easy', cn:'知识', en:'knowledge', pos:'n', hint:'know...', phonetic:'ˈnɒlɪdʒ' },
  { id:'e06', type:'cn2en', diff:'easy', cn:'大学', en:'university', pos:'n', hint:'uni...', phonetic:'ˌjuːnɪˈvɜːsəti' },
  { id:'e07', type:'cn2en', diff:'easy', cn:'环境', en:'environment', pos:'n', hint:'env...', phonetic:'ɪnˈvaɪrənmənt' },
  { id:'e08', type:'cn2en', diff:'easy', cn:'政府', en:'government', pos:'n', hint:'gov...', phonetic:'ˈɡʌvənmənt' },
  { id:'e09', type:'cn2en', diff:'easy', cn:'发展', en:'development', pos:'n', hint:'dev...', phonetic:'dɪˈveləpmənt' },
  { id:'e10', type:'cn2en', diff:'easy', cn:'教育', en:'education', pos:'n', hint:'edu...', phonetic:'ˌedʒuˈkeɪʃn' },
  { id:'e11', type:'cn2en', diff:'easy', cn:'经验', en:'experience', pos:'n', hint:'exp...', phonetic:'ɪkˈspɪriəns' },
  { id:'e12', type:'cn2en', diff:'easy', cn:'文化', en:'culture', pos:'n', hint:'cul...', phonetic:'ˈkʌltʃə' },
  { id:'e13', type:'cn2en', diff:'easy', cn:'社会', en:'society', pos:'n', hint:'soc...', phonetic:'səˈsaɪəti' },
  { id:'e14', type:'cn2en', diff:'easy', cn:'经济', en:'economy', pos:'n', hint:'eco...', phonetic:'ɪˈkɒnəmi' },
  { id:'e15', type:'cn2en', diff:'easy', cn:'技术', en:'technology', pos:'n', hint:'tech...', phonetic:'tekˈnɒlədʒi' },
  // 四级 - 英文→中文
  { id:'e16', type:'en2cn', diff:'easy', en:'opportunity', cn:'机会', pos:'n', hint:'机...', phonetic:'ˌɒpəˈtjuːnəti' },
  { id:'e17', type:'en2cn', diff:'easy', en:'challenge', cn:'挑战', pos:'n', hint:'挑...', phonetic:'ˈtʃælɪndʒ' },
  { id:'e18', type:'en2cn', diff:'easy', en:'achievement', cn:'成就', pos:'n', hint:'成...', phonetic:'əˈtʃiːvmənt' },
  { id:'e19', type:'en2cn', diff:'easy', en:'intelligence', cn:'智力', pos:'n', hint:'智...', phonetic:'ɪnˈtelɪdʒəns' },
  { id:'e20', type:'en2cn', diff:'easy', en:'independence', cn:'独立', pos:'n', hint:'独...', phonetic:'ˌɪndɪˈpendəns' },
  { id:'e21', type:'en2cn', diff:'easy', en:'responsibility', cn:'责任', pos:'n', hint:'责...', phonetic:'rɪˌspɒnsəˈbɪləti' },
  { id:'e22', type:'en2cn', diff:'easy', en:'holiday', cn:'假期', pos:'n', hint:'假...', phonetic:'ˈhɒlədeɪ' },
  { id:'e23', type:'en2cn', diff:'easy', en:'weather', cn:'天气', pos:'n', hint:'天...', phonetic:'ˈweðə' },
  { id:'e24', type:'en2cn', diff:'easy', en:'volunteer', cn:'志愿者', pos:'n', hint:'志...', phonetic:'ˌvɒlənˈtɪə' },
  { id:'e25', type:'en2cn', diff:'easy', en:'festival', cn:'节日', pos:'n', hint:'节...', phonetic:'ˈfestɪvl' },
  // 六级 - 中文→英文
  { id:'m01', type:'cn2en', diff:'medium', cn:'现象', en:'phenomenon', pos:'n', hint:'phe...', phonetic:'fəˈnɒmɪnən' },
  { id:'m02', type:'cn2en', diff:'medium', cn:'多样性', en:'diversity', pos:'n', hint:'div...', phonetic:'daɪˈvɜːsəti' },
  { id:'m03', type:'cn2en', diff:'medium', cn:'可持续的', en:'sustainable', pos:'adj', hint:'sus...', phonetic:'səˈsteɪnəbl' },
  { id:'m04', type:'cn2en', diff:'medium', cn:'创新', en:'innovation', pos:'n', hint:'inno...', phonetic:'ˌɪnəˈveɪʃn' },
  { id:'m05', type:'cn2en', diff:'medium', cn:'全球化', en:'globalization', pos:'n', hint:'glob...', phonetic:'ˌɡləʊbəlaɪˈzeɪʃn' },
  { id:'m06', type:'cn2en', diff:'medium', cn:'意识', en:'consciousness', pos:'n', hint:'cons...', phonetic:'ˈkɒnʃəsnəs' },
  { id:'m07', type:'cn2en', diff:'medium', cn:'妥协', en:'compromise', pos:'v/n', hint:'comp...', phonetic:'ˈkɒmprəmaɪz' },
  { id:'m08', type:'cn2en', diff:'medium', cn:'民主', en:'democracy', pos:'n', hint:'demo...', phonetic:'dɪˈmɒkrəsi' },
  { id:'m09', type:'cn2en', diff:'medium', cn:'效率', en:'efficiency', pos:'n', hint:'eff...', phonetic:'ɪˈfɪʃnsi' },
  { id:'m10', type:'cn2en', diff:'medium', cn:'强调', en:'emphasis', pos:'n', hint:'emp...', phonetic:'ˈemfəsɪs' },
  // 六级 - 英文→中文
  { id:'m11', type:'en2cn', diff:'medium', en:'hypothesis', cn:'假设', pos:'n', hint:'假...', phonetic:'haɪˈpɒθəsɪs' },
  { id:'m12', type:'en2cn', diff:'medium', en:'inevitable', cn:'不可避免的', pos:'adj', hint:'不...', phonetic:'ɪnˈevɪtəbl' },
  { id:'m13', type:'en2cn', diff:'medium', en:'integrity', cn:'正直', pos:'n', hint:'正...', phonetic:'ɪnˈteɡrəti' },
  { id:'m14', type:'en2cn', diff:'medium', en:'legislation', cn:'立法', pos:'n', hint:'立...', phonetic:'ˌledʒɪsˈleɪʃn' },
  { id:'m15', type:'en2cn', diff:'medium', en:'negotiate', cn:'谈判', pos:'v', hint:'谈...', phonetic:'nɪˈɡəʊʃieɪt' },
  { id:'m16', type:'en2cn', diff:'medium', en:'perception', cn:'感知', pos:'n', hint:'感...', phonetic:'pəˈsepʃn' },
  { id:'m17', type:'en2cn', diff:'medium', en:'prejudice', cn:'偏见', pos:'n', hint:'偏...', phonetic:'ˈpredʒudɪs' },
  { id:'m18', type:'en2cn', diff:'medium', en:'prosperity', cn:'繁荣', pos:'n', hint:'繁...', phonetic:'prɒˈsperəti' },
  { id:'m19', type:'en2cn', diff:'medium', en:'sufficient', cn:'充足的', pos:'adj', hint:'充...', phonetic:'səˈfɪʃnt' },
  { id:'m20', type:'en2cn', diff:'medium', en:'vulnerable', cn:'脆弱的', pos:'adj', hint:'脆...', phonetic:'ˈvʌlnərəbl' },
  // 考研 - 中文→英文
  { id:'h01', type:'cn2en', diff:'hard', cn:'悖论的', en:'paradoxical', pos:'adj', hint:'para...', phonetic:'ˌpærəˈdɒksɪkl' },
  { id:'h02', type:'cn2en', diff:'hard', cn:'深奥的', en:'profound', pos:'adj', hint:'prof...', phonetic:'prəˈfaʊnd' },
  { id:'h03', type:'cn2en', diff:'hard', cn:'综合的', en:'comprehensive', pos:'adj', hint:'compr...', phonetic:'ˌkɒmprɪˈhensɪv' },
  { id:'h04', type:'cn2en', diff:'hard', cn:'先例', en:'precedent', pos:'n', hint:'prec...', phonetic:'ˈpresɪdənt' },
  { id:'h05', type:'cn2en', diff:'hard', cn:'自主的', en:'autonomous', pos:'adj', hint:'auto...', phonetic:'ɔːˈtɒnəməs' },
  { id:'h06', type:'cn2en', diff:'hard', cn:'认知', en:'cognition', pos:'n', hint:'cog...', phonetic:'kɒɡˈnɪʃn' },
  { id:'h07', type:'cn2en', diff:'hard', cn:'繁荣', en:'flourish', pos:'v', hint:'flou...', phonetic:'ˈflʌrɪʃ' },
  { id:'h08', type:'cn2en', diff:'hard', cn:'遗传的', en:'genetic', pos:'adj', hint:'gene...', phonetic:'dʒəˈnetɪk' },
  { id:'h09', type:'cn2en', diff:'hard', cn:'等级制度', en:'hierarchy', pos:'n', hint:'hie...', phonetic:'ˈhaɪərɑːki' },
  { id:'h10', type:'cn2en', diff:'hard', cn:'意识形态', en:'ideology', pos:'n', hint:'ide...', phonetic:'ˌaɪdiˈɒlədʒi' },
  // 考研 - 英文→中文
  { id:'h11', type:'en2cn', diff:'hard', en:'legitimate', cn:'合法的', pos:'adj', hint:'合...', phonetic:'lɪˈdʒɪtɪmət' },
  { id:'h12', type:'en2cn', diff:'hard', en:'metaphor', cn:'隐喻', pos:'n', hint:'隐...', phonetic:'ˈmetəfə' },
  { id:'h13', type:'en2cn', diff:'hard', en:'notorious', cn:'臭名昭著', pos:'adj', hint:'臭...', phonetic:'nəʊˈtɔːriəs' },
  { id:'h14', type:'en2cn', diff:'hard', en:'paradigm', cn:'范式', pos:'n', hint:'范...', phonetic:'ˈpærədaɪm' },
  { id:'h15', type:'en2cn', diff:'hard', en:'quantitative', cn:'定量的', pos:'adj', hint:'定...', phonetic:'ˈkwɒntɪtətɪv' },
  { id:'h16', type:'en2cn', diff:'hard', en:'renaissance', cn:'复兴', pos:'n', hint:'复...', phonetic:'rɪˈneɪsns' },
  { id:'h17', type:'en2cn', diff:'hard', en:'skepticism', cn:'怀疑论', pos:'n', hint:'怀...', phonetic:'ˈskeptɪsɪzəm' },
  { id:'h18', type:'en2cn', diff:'hard', en:'synthesis', cn:'综合', pos:'n', hint:'综...', phonetic:'ˈsɪnθəsɪs' },
  { id:'h19', type:'en2cn', diff:'hard', en:'underlying', cn:'潜在的', pos:'adj', hint:'潜...', phonetic:'ˌʌndəˈlaɪɪŋ' },
  { id:'h20', type:'en2cn', diff:'hard', en:'validation', cn:'验证', pos:'n', hint:'验...', phonetic:'ˌvælɪˈdeɪʃn' },
  // ===== 四级短语 =====
  { id:'p01', type:'cn2en', diff:'easy', cn:'一点也不', en:'not at all', pos:'phrase', hint:'not...' },
  { id:'p02', type:'cn2en', diff:'easy', cn:'照顾', en:'take care of', pos:'phrase', hint:'take...' },
  { id:'p03', type:'cn2en', diff:'easy', cn:'期待', en:'look forward to', pos:'phrase', hint:'look...' },
  { id:'p04', type:'cn2en', diff:'easy', cn:'参加', en:'take part in', pos:'phrase', hint:'take...' },
  { id:'p05', type:'cn2en', diff:'easy', cn:'习惯于', en:'be used to', pos:'phrase', hint:'be used...' },
  { id:'p06', type:'en2cn', diff:'easy', en:'as long as', cn:'只要', pos:'phrase', hint:'只...' },
  { id:'p07', type:'en2cn', diff:'easy', en:'in conclusion', cn:'总之', pos:'phrase', hint:'总...' },
  { id:'p08', type:'en2cn', diff:'easy', en:'on the contrary', cn:'相反', pos:'phrase', hint:'相...' },
  { id:'p09', type:'en2cn', diff:'easy', en:'in addition', cn:'此外', pos:'phrase', hint:'此...' },
  { id:'p10', type:'en2cn', diff:'easy', en:'as a result', cn:'因此', pos:'phrase', hint:'因...' },
  // ===== 四级句子 =====
  { id:'s01', type:'cn2en', diff:'easy', cn:'我来自中国。', en:'I come from China.', pos:'sentence', hint:'I...' },
  { id:'s02', type:'cn2en', diff:'easy', cn:'今天天气很好。', en:'The weather is nice today.', pos:'sentence', hint:'The...' },
  { id:'s03', type:'en2cn', diff:'easy', en:'Nice to meet you.', cn:'很高兴认识你。', pos:'sentence', hint:'很...' },
  { id:'s04', type:'en2cn', diff:'easy', en:'What time is it?', cn:'几点了？', pos:'sentence', hint:'几...' },
  // ===== 六级短语 =====
  { id:'p11', type:'cn2en', diff:'medium', cn:'与此同时', en:'at the same time', pos:'phrase', hint:'at...' },
  { id:'p12', type:'cn2en', diff:'medium', cn:'从长远来看', en:'in the long run', pos:'phrase', hint:'in...' },
  { id:'p13', type:'cn2en', diff:'medium', cn:'考虑到', en:'take into account', pos:'phrase', hint:'take...' },
  { id:'p14', type:'en2cn', diff:'medium', en:'in terms of', cn:'就...而言', pos:'phrase', hint:'就...' },
  { id:'p15', type:'en2cn', diff:'medium', en:'make sense', cn:'有道理', pos:'phrase', hint:'有...' },
  { id:'p16', type:'en2cn', diff:'medium', en:'due to', cn:'由于', pos:'phrase', hint:'由...' },
  // ===== 六级句子 =====
  { id:'s05', type:'cn2en', diff:'medium', cn:'环境保护至关重要。', en:'Environmental protection is crucial.', pos:'sentence', hint:'Environmental...' },
  { id:'s06', type:'cn2en', diff:'medium', cn:'知识就是力量。', en:'Knowledge is power.', pos:'sentence', hint:'Knowledge...' },
  { id:'s07', type:'en2cn', diff:'medium', en:'Practice makes perfect.', cn:'熟能生巧。', pos:'sentence', hint:'熟...' },
  { id:'s08', type:'en2cn', diff:'medium', en:'All roads lead to Rome.', cn:'条条大路通罗马。', pos:'sentence', hint:'条...' },
  // ===== 考研短语 =====
  { id:'p17', type:'cn2en', diff:'hard', cn:'毫无疑问', en:'there is no doubt that', pos:'phrase', hint:'there...' },
  { id:'p18', type:'cn2en', diff:'hard', cn:'不可或缺', en:'indispensable', pos:'adj', hint:'indis...', phonetic:'ˌɪndɪˈspensəbl' },
  { id:'p19', type:'en2cn', diff:'hard', en:'to some extent', cn:'在某种程度上', pos:'phrase', hint:'在...' },
  { id:'p20', type:'en2cn', diff:'hard', en:'on no account', cn:'绝不', pos:'phrase', hint:'绝...' },
  { id:'p21', type:'en2cn', diff:'hard', en:'shed light on', cn:'阐明', pos:'phrase', hint:'阐...' },
  // ===== 考研句子 =====
  { id:'s09', type:'cn2en', diff:'hard', cn:'坚持就是胜利。', en:'Perseverance leads to success.', pos:'sentence', hint:'Perseverance...' },
  { id:'s10', type:'cn2en', diff:'hard', cn:'凡事预则立。', en:'Preparation ensures success.', pos:'sentence', hint:'Preparation...' },
  { id:'s11', type:'en2cn', diff:'hard', en:'Actions speak louder than words.', cn:'行动胜于空谈。', pos:'sentence', hint:'行...' },
  { id:'s12', type:'en2cn', diff:'hard', en:'Where there is a will, there is a way.', cn:'有志者事竟成。', pos:'sentence', hint:'有...' }
]

// ===== 词性中文对照 =====
var POS_MAP = {
  n: '名词',
  v: '动词',
  adj: '形容词',
  adv: '副词',
  prep: '介词',
  conj: '连词',
  pron: '代词',
  'v/n': '动词/名词',
  'adj/adv': '形容词/副词',
  phrase: '短语',
  sentence: '句子'
}

// ===== 难度配置 =====
var DIFFICULTY_CONFIG = {
  easy: { label: '四级', color: '#2ECC71' },
  medium: { label: '六级', color: '#F39C12' },
  hard: { label: '考研', color: '#E74C3C' }
}

// ===== 每日一句 =====
// ===== 题库管理（AI 出题扩充用）=====
// 从 localStorage 加载自定义题目
function loadCustomQuestions() {
  try {
    var stored = localStorage.getItem('customQuestions')
    return stored ? JSON.parse(stored) : []
  } catch(e) { return [] }
}

// 保存自定义题目到 localStorage
function saveCustomQuestions(questions) {
  try { localStorage.setItem('customQuestions', JSON.stringify(questions)) } catch(e) {}
}

// 添加一道题到题库（去重 + 上限5000）
function addQuestionToBank(newQ) {
  if (!newQ || !newQ.en || !newQ.cn) return false

  // 1. 检查是否已在本地题库（按 en + cn 匹配）
  for (var i = 0; i < ALL_QUESTIONS.length; i++) {
    if (ALL_QUESTIONS[i].en === newQ.en && ALL_QUESTIONS[i].cn === newQ.cn) {
      return false // 已存在，跳过
    }
  }

  // 2. 检查是否已在自定义题库
  var customQs = loadCustomQuestions()
  for (var i = 0; i < customQs.length; i++) {
    if (customQs[i].en === newQ.en && customQs[i].cn === newQ.cn) {
      return false // 已存在，跳过
    }
  }

  // 3. 检查上限
  var totalCount = ALL_QUESTIONS.length + customQs.length
  if (totalCount >= 12000) return false

  // 4. 加入自定义题库
  if (!newQ.id) newQ.id = 'custom_' + Date.now()
  customQs.push(newQ)
  saveCustomQuestions(customQs)
  return true
}

// 获取所有题目（含本地 + 自定义）
function getAllQuestions() {
  var customQs = loadCustomQuestions()
  // 接入导入词库（中级+高级）
  var imported = []
  if (typeof IMPORTED_INTERMEDIATE !== 'undefined') {
    imported = imported.concat(IMPORTED_INTERMEDIATE)
  }
  if (typeof IMPORTED_ADVANCED !== 'undefined') {
    imported = imported.concat(IMPORTED_ADVANCED)
  }
  // 给导入词条补充默认字段（id/type/hint）
  var processedImport = []
  for (var ii = 0; ii < imported.length; ii++) {
    var w = imported[ii]
    processedImport.push({
      id: w.id || ('imp_' + ii),
      type: w.type || (w.cn ? 'en2cn' : 'cn2en'),
      diff: w.diff || 'medium',
      cn: w.cn || '',
      en: w.en || '',
      pos: w.pos || '',
      hint: w.hint || (w.en ? w.en.substring(0, 4) + '...' : ''),
      phonetic: w.phonetic || ''
    })
  }
  return ALL_QUESTIONS.concat(processedImport, customQs)
}

var DAILY_QUOTES = [
  { en: 'The best time to plant a tree was 20 years ago. The second best time is now.', cn: '种一棵树最好的时间是十年前，其次是现在。' },
  { en: 'Believe you can and you are halfway there.', cn: '相信自己能行，你就已经成功了一半。' },
  { en: 'It does not matter how slowly you go as long as you do not stop.', cn: '前进得慢没关系，只要不停下脚步。' },
  { en: 'The only way to do great work is to love what you do.', cn: '成就伟业的唯一途径是热爱你所做的事。' },
  { en: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', cn: '成功不是终点，失败也不是终结，唯有继续前进的勇气才最重要。' },
  { en: 'The future belongs to those who believe in the beauty of their dreams.', cn: '未来属于那些相信梦想之美的人。' },
  { en: 'Learn from yesterday, live for today, hope for tomorrow.', cn: '从昨天学习，为今天而活，对未来充满希望。' }
]



