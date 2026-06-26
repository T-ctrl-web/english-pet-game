// ========================================
// ⚠️ 安全警告 - 请务必阅读
// ========================================
// 1. API Key 请在页面中通过设置界面输入，会自动保存到 localStorage
// 2. 不要在代码中硬写入 API Key！
// 3. 如果你 fork 或部署此项目到公开仓库，
//    请确保 AI_CONFIG 中的所有 apiKey 字段为空
// 4. 泄露 API Key 可能导致经济损失
// ========================================

﻿// aiService.js - AI 语义评测服务
// 优先使用 AI API，不可用时自动回退到本地 NLP

var aiEnabled = true

// config.js - API 集中配置文件
// 发布到 GitHub 后，其他人只需修改此文件即可适配自己的 API
// 配置说明见各字段注释

var AI_CONFIG = {
  // ===== 服务商选择 =====
  // 支持 OpenAI 兼容接口，可选值:
  // 'openai'      - OpenAI 官方 API
  // 'deepseek'    - DeepSeek 官方 API
  // 'tongyi'      - 阿里云通义千问（百炼平台）
  // 'siliconflow' - SiliconCloud（硅基流动）
  // 切换后 API Key 会读取对应 localStorage 键
  provider: 'tongyi',

  // ===== OpenAI 配置 =====
  openai: {
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    apiKey: ''
  },

  // ===== DeepSeek 配置 =====
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    apiKey: ''
  },

  // ===== 通义千问（阿里云百炼）配置 =====
  tongyi: {
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    model: 'qwen-turbo',
    apiKey: ''
  },

  // ===== SiliconCloud（硅基流动）配置 =====
  siliconflow: {
    baseUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'Qwen/Qwen2.5-7B-Instruct',
    apiKey: ''
  },

  // ===== AI 出题模式配置 =====
  aiGenerate: {
    max_tokens: 200,
    temperature: 0.8
  },

  // ===== AI 评测配置 =====
  aiEvaluate: {
    max_tokens: 200,
    temperature: 0.3,
    timeout: 15000
  }
}

function loadApiKeys() {
  var providers = ['openai', 'deepseek', 'tongyi', 'siliconflow']
  for (var i = 0; i < providers.length; i++) {
    var p = providers[i]
    // 优先读取 localStorage（用户在页面中输入的），没有则用配置文件中写好的
    var savedKey = localStorage.getItem(p + 'ApiKey')
    if (savedKey && AI_CONFIG[p]) {
      AI_CONFIG[p].apiKey = savedKey
    }
    // 如果配置文件中写了 Key 且 localStorage 没有，则保留配置文件的值
    // 这样用户在 config 区域直接填 Key 也同样有效
  }
}
loadApiKeys()

function saveApiKey(provider, key) {
  if (AI_CONFIG[provider]) {
    AI_CONFIG[provider].apiKey = key
    localStorage.setItem(provider + 'ApiKey', key)
  }
}


// ===== AI 语义评测（AI API + 本地 NLP 回退）=====
function aiEvaluate(question, userAnswer) {
  return new Promise(function(resolve) {
    if (!aiEnabled) {
      // AI 评测关闭，用精确匹配
      var correct = (question.type === 'cn2en') ? question.en : question.cn
      resolve({ isCorrect: exact, detail: '精确匹配（AI 评测已关闭）' })
      resolve({ isCorrect: exact, detail: '' })
      return
    }

    // 先尝试 AI API
    if (AI_CONFIG[AI_CONFIG.provider].apiKey) {
      callAI(question, userAnswer).then(function(result) {
        resolve(result)
      }).catch(function() {
        // API 失败，回退到本地 NLP
        var localResult = localEvaluate(question, userAnswer)
        localResult.detail = (localResult.detail || '') + '（本地评测）'
        resolve(localResult)
      })
    } else {
      // 没有配置 API Key，直接使用本地 NLP
      resolve(localEvaluate(question, userAnswer))
    }
  })
}
// ===== 构建评测 Prompt =====
function buildPrompt(question, userAnswer) {
  var type = question.type
  var sourceText = (type === 'cn2en') ? question.cn : question.en
  var refAnswer = (type === 'cn2en') ? question.en : question.cn
  var direction = (type === 'cn2en') ? '中文翻译成英文' : '英文翻译成中文'

  var prompt = '你是一个英语学习评测助手。请判断以下翻译是否正确。\n\n'
  prompt += '【翻译方向】' + direction + '\n'
  prompt += '【源文】' + sourceText + '\n'
  prompt += '【用户答案】' + userAnswer + '\n'
  prompt += '【参考答案】' + refAnswer + '\n\n'
  prompt += '评测规则：\n'
  prompt += '1. 语法正确率 >= 95% 才算通过（时态、单复数、冠词、介词等基本正确）\n'
  prompt += '2. 逻辑正确率 >= 80% 就算通过（意思相近即可，不需逐字对应）\n'
  prompt += '3. 对于英译中：只要核心意思一致就算对，如 "I am happy" 和 "我很开心" 都是对的\n'
  prompt += '4. 对于中译英：允许合理的同义替换，如 "beautiful" 和 "pretty"\n'
  prompt += '5. 请直接用 JSON 格式返回：{"isCorrect": true/false, "reason": "简短的中文原因说明"}'
  return prompt
}

// ===== AI API 调用（支持 DeepSeek / 通义千问）=====
function callAI(question, userAnswer) {
  var config = AI_CONFIG[AI_CONFIG.provider]
  if (!config || !config.apiKey) {
    return Promise.resolve(localEvaluate(question, userAnswer))
  }

  var modelName = AI_CONFIG[AI_CONFIG.provider].model
  var evalConfig = AI_CONFIG.aiEvaluate

  // 超时控制
  var controller = new AbortController()
  var timeoutId = setTimeout(function() { controller.abort() }, evalConfig.timeout)

  return fetch(config.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.apiKey
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: '你是一个严谨的英语学习评测助手。请严格按照评测规则判断，并用 JSON 格式回复。' },
        { role: 'user', content: buildPrompt(question, userAnswer) }
      ],
      temperature: evalConfig.temperature,
      max_tokens: evalConfig.max_tokens
    }),
    signal: controller.signal
  }).then(function(res) {
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error('API 请求失败: ' + res.status)
    return res.json()
  }).then(function(data) {
    var content = data.choices[0].message.content
    var result = JSON.parse(content)
    return {
      isCorrect: result.isCorrect === true,
      detail: AI_CONFIG.provider + ': ' + (result.reason || '')
    }
  }).catch(function(err) {
    clearTimeout(timeoutId)
    console.log('AI 调用失败，回退到本地评测:', err)
    var localResult = localEvaluate(question, userAnswer)
    localResult.detail = (localResult.detail || '') + '（本地评测）'
    return localResult
  })
}

// ===== 本地 NLP 语义评测（免费回退方案）=====
function localEvaluate(question, userAnswer) {
  if (question.type !== 'en2cn') {
    var correct = question.en
    var exact = userAnswer.trim().toLowerCase() === correct.trim().toLowerCase()
    return { isCorrect: exact, detail: '' }
  }

  var userAns = userAnswer.trim()
  var refAns = question.cn.trim()

  // 精确匹配
  if (userAns === refAns) {
    return { isCorrect: true, detail: '精确匹配' }
  }

  // 语法检查
  var grammarScore = checkGrammar(userAns)
  if (grammarScore < 0.95) {
    return { isCorrect: false, detail: '语法正确率 ' + Math.round(grammarScore * 100) + '%（需 ≥ 95%）' }
  }

  // 分词相似度
  var userTokens = simpleTokenize(userAns)
  var refTokens = simpleTokenize(refAns)
  var jaccard = jaccardSimilarity(userTokens, refTokens)
  var maxLen = Math.max(userAns.length, refAns.length)
  var editDist = levenshteinDistance(userAns, refAns)
  var editSim = 1 - (editDist / maxLen)
  var finalScore = jaccard * 0.6 + editSim * 0.4

  // 同义词检查
  // 同义词检查（整词匹配，防止子串误判）
  var isSynonym = false
  var synonymPairs = [
    ['高兴','开心','快乐','愉快','幸福'],
    ['美丽','漂亮','好看','迷人'],
    ['重要','关键','核心','要紧'],
    ['困难','艰难','费力'],
    ['容易','简单','轻松'],
    ['喜欢','喜爱','热爱','爱'],
    ['知道','明白','理解','懂得'],
    ['认为','觉得','感觉'],
    ['可以','能够','能','会'],
    ['帮助','帮忙','协助'],
    ['许多','很多','大量','众多'],
    ['常常','经常','时常','频繁'],
    ['立刻','马上','立即','赶紧']
  ]
  function wordBoundaryMatch(text, word) {
    // 整词匹配：确保不是某词的一部分（如'开心'不匹配'不开心'）
    var idx = text.indexOf(word)
    if (idx < 0) return false
    // 检查前边界
    if (idx > 0) {
      var prevChar = text[idx - 1]
      if (/[\u4e00-\u9fff]/.test(prevChar)) return false
    }
    // 检查后边界
    var end = idx + word.length
    if (end < text.length) {
      var nextChar = text[end]
      if (/[\u4e00-\u9fff]/.test(nextChar)) return false
    }
    return true
  }
  for (var i = 0; i < synonymPairs.length; i++) {
    var inUser = false
    var inRef = false
    for (var j = 0; j < synonymPairs[i].length; j++) {
      if (wordBoundaryMatch(userAns, synonymPairs[i][j])) inUser = true
      if (wordBoundaryMatch(refAns, synonymPairs[i][j])) inRef = true
    }
    if (inUser && inRef) { isSynonym = true; break }
  }

  if (finalScore >= 0.4 || isSynonym) {
    return { isCorrect: true, detail: '语义相似 ' + Math.round(finalScore * 100) + '% ✓' }
  }
  return { isCorrect: false, detail: '逻辑相似度 ' + Math.round(finalScore * 100) + '%（需 ≥ 40%）' }
}

// ===== 辅助函数 =====
function checkGrammar(text) {
  var errors = 0
  var checks = 0
  var hasChinesePunct = /[，。！？、；：""''（）]/.test(text)
  if (hasChinesePunct) checks++
  var hasEnglishInChinese = /[\u4e00-\u9fff].*[a-zA-Z]|[a-zA-Z].*[\u4e00-\u9fff]/.test(text)
  if (hasEnglishInChinese) { errors++; checks++ }
  var hasVerb = /[会能要可是在有被把让给对从把被将了着过的]/.test(text)
  if (hasVerb) checks++
  var hasRepeat = /(.)\1{3,}/.test(text)
  if (hasRepeat) { errors++; checks++ }
  if (checks === 0) return 0.9
  return 1 - (errors / Math.max(checks, 1))
}

function simpleTokenize(text) {
  var dict = [
    '很高兴','很开心','很愉快','很幸福','非常','十分','特别','超级','及其',
    '但是','可是','然而','不过','却','因为','所以','因此','于是',
    '如果','假如','要是','倘若','虽然','尽管','即使','哪怕',
    '而且','并且','还','也','又','或者','还是','要么',
    '美丽','漂亮','好看','帅气','迷人','重要','关键','核心','必要',
    '困难','艰难','辛苦','费力','容易','简单','轻松','便捷',
    '喜欢','热爱','喜爱','钟情','讨厌','厌恶','反感','嫌弃',
    '知道','明白','理解','懂得','认为','以为','觉得','感觉',
    '可以','能够','会','可能','应该','应当','必须','需要',
    '想要','希望','期望','渴望','开始','启动','开启','开端',
    '结束','完成','完毕','终结','帮助','协助','辅助','援助',
    '保护','守护','维护','捍卫','改变','变化','转变','改造',
    '发展','进步','成长','壮大','成功','胜利','成就','达成',
    '失败','挫折','失利','落败','学习','练习','训练','复习',
    '工作','任务','事务','生活','生存','时间','时刻','时候',
    '地点','位置','场所','地方','天气','气候','温度','气温',
    '节日','假日','假期','庆典','机会','机遇','时机','良机',
    '问题','疑问','难题','困惑','答案','回复','方法','方式','办法','途径',
    '结果','后果','效果','成果','原因','缘故','起因','根源'
  ]
  var tokens = []
  var i = 0
  while (i < text.length) {
    var found = false
    for (var len = 4; len >= 1; len--) {
      if (i + len > text.length) continue
      var sub = text.substring(i, i + len)
      for (var d = 0; d < dict.length; d++) {
        if (dict[d] === sub) { tokens.push(sub); i += len; found = true; break }
      }
      if (found) break
    }
    if (!found) { tokens.push(text[i]); i++ }
  }
  return tokens
}

function jaccardSimilarity(setA, setB) {
  var intersection = 0
  var union = setA.length + setB.length
  for (var i = 0; i < setA.length; i++) {
    for (var j = 0; j < setB.length; j++) {
      if (setA[i] === setB[j]) { intersection++; break }
    }
  }
  union = union - intersection
  if (union === 0) return 1
  return intersection / union
}

// ===== AI 实时出题 =====
function parseJSONFromText(text) {
  // 优先尝试直接解析
  try { return JSON.parse(text) } catch(e) {}
  // 去掉可能的 ```json ... ``` 代码块标记
  var cleaned = text.replace(/\`\`\`(?:json)?\s*/gi, "").replace(/\s*\`\`\`/g, "")
  try { return JSON.parse(cleaned) } catch(e) {}
  // 用正则找第一个 {...} JSON 块（兼容换行和多余文字）
  var match = cleaned.match(/\{[\s\S]*?\}/)
  if (match) {
    try { return JSON.parse(match[0]) } catch(e) {}
  }
  return null
}

function aiGenerateQuestion() {
  return new Promise(function(resolve) {
    var activeConfig = AI_CONFIG[AI_CONFIG.provider]
    if (!activeConfig || !activeConfig.apiKey || activeConfig.apiKey === "YOUR_API_KEY_HERE") {
      resolve(null)
      return
    }
    var prompt = "你是一个英语出题助手。请出一道英语翻译题。\n\n"
    prompt += "要求：\n"
    prompt += "- 难度在 四级&lparen;easy&rparen;、六级&lparen;medium&rparen;、考研&lparen;hard&rparen; 中随机选一个\n"
    prompt += "- 题型在 中文→英文&lparen;cn2en&rparen; 和 英文→中文&lparen;en2cn&rparen; 中随机选一个\n"
    prompt += "- 形式在 单词、短语、句子 中随机选一个\n"
    prompt += "- 必须标注词性 pos：n/v/adj/adv/phrase/sentence\n"
    prompt += "- hint 字段给出提示\n"
    prompt += "- 必须是考研或四六级范围内的实用词汇\n"
    prompt += "请只返回纯 JSON 格式，不要包含任何其他文字或代码块标记：\n"
    prompt += '{"type":"cn2en","diff":"medium","cn":"现象","en":"phenomenon","pos":"n","hint":"phe..."}'

    attemptGenerate(prompt, 0, 2, resolve)
  })
}

function attemptGenerate(prompt, attempt, maxRetries, resolve) {
  var activeConfig = AI_CONFIG[AI_CONFIG.provider]

  fetch(activeConfig.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + activeConfig.apiKey
    },
    body: JSON.stringify({
      model: activeConfig.model,
      messages: [{ role: "user", content: prompt }],
      temperature: AI_CONFIG.aiGenerate.temperature,
      max_tokens: AI_CONFIG.aiGenerate.max_tokens
    }),
    signal: AbortSignal.timeout(10000)
  }).then(function(res) {
    if (!res.ok) throw new Error("HTTP " + res.status)
    return res.json()
  }).then(function(data) {
    var content = data.choices[0].message.content
    var parsed = parseJSONFromText(content)
    if (parsed && parsed.type && parsed.cn && parsed.en) {
      parsed.id = "ai_" + Date.now()
      resolve(parsed)
    } else {
      throw new Error("JSON 解析失败或字段不完整")
    }
    if (attempt < maxRetries) {
      attemptGenerate(prompt, attempt + 1, maxRetries, resolve)
    } else {
      resolve(null)
    }
  })
}

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  var matrix = []
  for (var i = 0; i <= b.length; i++) { matrix[i] = [i] }
  for (var j = 0; j <= a.length; j++) { matrix[0][j] = j }
  for (var i = 1; i <= b.length; i++) {
    for (var j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) === a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1]
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1))
      }
    }
  }
  return matrix[b.length][a.length]
}
