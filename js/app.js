// ===== 全局错误捕获 =====
window.onerror = function(msg, url, line) {
  var errDiv = document.getElementById('errorDisplay')
  if (!errDiv) {
    errDiv = document.createElement('div')
    errDiv.id = 'errorDisplay'
    errDiv.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:red;color:white;padding:8px;font-size:13px;z-index:9999'
    document.body.appendChild(errDiv)
  }
}

// app.js - 核心应用逻辑

// ===== 工具函数 =====
function shuffle(arr) {
  var a = [...arr]
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n)
}

// ===== Toast 提示 =====
function showToast(msg, duration) {
  if (!duration) duration = 1800
  var t = document.createElement('div')
  t.className = 'toast'
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(function() { t.remove() }, duration)
}

// ===== 数据持久化 =====
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch(e) {}
}

function loadData(key, def) {
  if (!def) def = null
  try {
    var d = localStorage.getItem(key)
    return d ? JSON.parse(d) : def
  } catch(e) { return def }
}

// ===== 用户数据管理 =====
function getUserData() {
  var data = loadData('petGameUserData')
  if (!data) {
    data = {
      pet: null,
      hasChosenPet: false,
      lives: 10,
      maxLives: 10,
      streakCount: 0,
      totalCorrect: 0,
      totalWrong: 0,
      score: 0,
      inventory: { food: [], toys: [] },
      comboRecord: 0
    }
    saveData('petGameUserData', data)
  }
  // 兼容旧数据：升级生命值上限
  if (data.maxLives < 10) data.maxLives = 10
  if (data.lives > data.maxLives) data.lives = data.maxLives
  return data
}

function saveUserData(data) {
  saveData('petGameUserData', data)
}

// ===== 页面跳转 =====
function goPage(page) {
  var pages = document.querySelectorAll('.page')
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active')
  }
  var el = document.getElementById('page-' + page)
  if (el) el.classList.add('active')
  if (page === 'home') renderHome()
  else if (page === 'choose-egg') renderChooseEgg()
  else if (page === 'pet-house') renderPetHouse()
  else if (page === 'shop') renderShop()
  else if (page === 'review') renderReview()
}

// ===== 首页渲染 =====
function renderHome() {
  var ud = getUserData()

  // 设计稿风格布局
  var placeholder = document.getElementById('dhPetPlaceholder')
  var img = document.getElementById('dhPetAvatarImg')
  var nameEl = document.getElementById('dhPetName')

  if (ud.hasChosenPet && ud.pet) {
    var pinfo = getPetInfo(ud.pet.type)
    placeholder.style.display = 'none'
    img.style.display = 'block'
    img.src = pinfo.image
    nameEl.textContent = ud.pet.emoji + ' ' + ud.pet.name
  } else {
    placeholder.style.display = 'block'
    img.style.display = 'none'
    nameEl.textContent = '尚未选择萌宠'
  }

  // 状态栏数据（图标版）
  document.getElementById('dhStatLives').textContent = ud.lives + '/' + ud.maxLives
  document.getElementById('dhStatQuestions').textContent = (ud.totalCorrect || 0) + (ud.totalWrong || 0)
  document.getElementById('dhStatStreak').textContent = ud.streakCount || 0
  document.getElementById('dhStatStars').textContent = ud.score || 0
}

function getPetInfo(type) {
  for (var i = 0; i < PET_TYPES.length; i++) {
    if (PET_TYPES[i].id === type) return PET_TYPES[i]
  }
  return PET_TYPES[0]
}

// ===== 选蛋页 =====
var _currentEggs = []
var _selectedEggIndex = -1

function renderChooseEgg() {
  var grid = document.getElementById('eggGrid')
  _currentEggs = shuffle(PET_TYPES)
  var html = ''
  for (var i = 0; i < _currentEggs.length; i++) {
    var p = _currentEggs[i]
    html += '<div class="egg-card" onclick="openEggModal(' + i + ')">' +
      '<div class="egg-image-wrapper">' +
        '<img src="' + p.image + '" class="egg-image">' +
      '</div>' +
      '<div style="font-size:24px;margin:5px 0">' + p.emoji + '</div>' +
      '<div class="egg-name">' + p.name + '</div>' +
      '<div class="egg-desc">' + p.description + '</div>' +
    '</div>'
  }
  grid.innerHTML = html
}

function openEggModal(index) {
  _selectedEggIndex = index
  var egg = _currentEggs[index]
  document.getElementById('modalEggImg').src = egg.image
  document.getElementById('modalEggName').textContent = egg.emoji + ' ' + egg.name
  document.getElementById('modalEggDesc').textContent = egg.description
  document.getElementById('petNameInput').value = egg.name
  document.getElementById('eggModal').style.display = 'flex'
}

function closeEggModal() {
  document.getElementById('eggModal').style.display = 'none'
}

function confirmChooseEgg() {
  var egg = _currentEggs[_selectedEggIndex]
  var name = document.getElementById('petNameInput').value.trim() || egg.name
  var ud = getUserData()
  ud.hasChosenPet = true
  ud.pet = { type: egg.id, name: name, emoji: egg.emoji, happiness: 100, fullness: 100 }
  saveUserData(ud)
  closeEggModal()
  showToast('🎉 欢迎 ' + name + '！')
  setTimeout(function() { goPage('home') }, 1500)
}

// ===== 答题逻辑 =====
var _quizState = null

function getQuizQuestions(count) {
    if (!count) count = 12
    var allQ = getAllQuestions()
    var easy = pickRandom(allQ.filter(function(q) { return q.diff === 'easy' }), 4)
    var medium = pickRandom(allQ.filter(function(q) { return q.diff === 'medium' }), 4)
    var hard = pickRandom(allQ.filter(function(q) { return q.diff === 'hard' }), 4)
    var mixed = shuffle([].concat(easy, medium, hard)).slice(0, count)
    if (mixed.length < count) {
      var rest = shuffle(allQ)
      for (var ri = 0; ri < rest.length && mixed.length < count; ri++) {
        var dup = false
        for (var mj = 0; mj < mixed.length; mj++) {
          if (mixed[mj].id === rest[ri].id) { dup = true; break }
        }
        if (!dup) mixed.push(rest[ri])
      }
    }
    var result = []
    for (var i = 0; i < mixed.length; i++) {
      result.push({
        id: mixed[i].id,
        type: mixed[i].type,
        diff: mixed[i].diff,
        cn: mixed[i].cn,
        en: mixed[i].en,
        pos: mixed[i].pos,
        hint: mixed[i].hint,
        phonetic: mixed[i].phonetic || '',
        userAnswer: '',
        isCorrect: null,
        answered: false
      })
    }
    return result
  }
// ===== 错题本功能 =====
function getWrongBank() {
  var wb = loadData('petGameWrongBank')
  if (!wb) { wb = []; saveData('petGameWrongBank', wb) }
  return wb
}

function addToWrongBank(q) {
  var wb = getWrongBank()
  for (var i = 0; i < wb.length; i++) {
    if (wb[i].en === q.en && wb[i].cn === q.cn) {
      wb[i].wrongCount = (wb[i].wrongCount || 1) + 1
      saveData('petGameWrongBank', wb)
      return
    }
  }
  wb.push({
    id: q.id, type: q.type, diff: q.diff,
    cn: q.cn, en: q.en, pos: q.pos || '',
    hint: q.hint || '', phonetic: q.phonetic || '',
    wrongCount: 1, addedAt: Date.now()
  })
  saveData('petGameWrongBank', wb)
}

function renderReview() {
  var wb = getWrongBank()
  var listEl = document.getElementById('reviewList')
  var emptyEl = document.getElementById('reviewEmpty')
  if (wb.length === 0) {
    listEl.innerHTML = ''
    emptyEl.style.display = 'block'
    return
  }
  emptyEl.style.display = 'none'
  var html = ''
  for (var i = 0; i < wb.length; i++) {
    var w = wb[i]
    var diffLabel = { easy:'四级', medium:'六级', hard:'考研' }[w.diff] || w.diff
    var diffClass = w.diff || 'medium'
    var wordDisplay = (w.type === 'cn2en') ? w.en : w.cn
    var answerDisplay = (w.type === 'cn2en') ? w.cn : w.en
    var phoneticHtml = w.phonetic ? '<div class=\"rv-phonetic\">/' + w.phonetic + '/</div>' : ''
    html += '<div class=\"review-item\">' +
      '<div class=\"rv-word\">' + wordDisplay + '</div>' +
      phoneticHtml +
      '<div class=\"rv-answer\">\u2705 ' + answerDisplay + '</div>' +
      '<div class=\"rv-meta\">' +
        '<span class=\"rv-diff ' + diffClass + '\">' + diffLabel + '</span>' +
        '<span>\uD83D\uDCD6 ' + (POS_MAP[w.pos] || w.pos || '未知') + '</span>' +
        '<span>\u274C \u9519\u4E86 ' + w.wrongCount + ' \u6B21</span>' +
      '</div></div>'
  }
  listEl.innerHTML = html
}

function clearReview() {
  if (!confirm('\u786E\u5B9A\u6E05\u7A7A\u9519\u9898\u672C\u5417\uFF1F')) return
  saveData('petGameWrongBank', [])
  renderReview()
  showToast('\u9519\u9898\u672C\u5DF2\u6E05\u7A7A')
}

  function goQuiz() {
  var ud = getUserData()
  var questions = getQuizQuestions(12)
  _quizState = {
    questions: questions,
    currentIndex: 0,
    lives: (ud.lives !== undefined && ud.lives > 0 ? ud.lives : 10),
    maxLives: 10,
    score: ud.score || 0,
    streakCount: 0,
    gameHistory: []
  }
  goPage('quiz')
  showQuestion(0)
}

function showQuestion(index) {
  var q = _quizState.questions[index]
  if (!q) return

  var conf = DIFFICULTY_CONFIG[q.diff]
  var questionText = (q.type === 'cn2en') ? q.cn : q.en

  // 生命值
  var livesHtml = ''
  for (var i = 0; i < _quizState.maxLives; i++) {
    livesHtml += '<span class="heart ' + (i < _quizState.lives ? '' : 'empty') + '">❤️</span>'
  }
  document.getElementById('quizLives').innerHTML = livesHtml
  document.getElementById('quizScore').textContent = '⭐ ' + _quizState.score

  // 连对横幅
  var banner = document.getElementById('streakBanner')
  if (_quizState.streakCount >= 2) {
    banner.style.display = 'block'
    banner.className = 'streak-banner'
    if (_quizState.streakCount >= 3) banner.className = 'streak-banner active'
    banner.textContent = '🔥 ' + _quizState.streakCount + ' 连对！' + (_quizState.streakCount >= 3 ? ' 🎉 +1 条命！' : '')
  } else {
    banner.style.display = 'none'
  }

  // 进度
  var total = _quizState.questions.length
  document.getElementById('progressFill').style.width = (index / total * 100) + '%'
  document.getElementById('progressText').textContent = (index + 1) + ' / ' + total

  // 题目
  document.getElementById('diffTag').textContent = conf.label
  document.getElementById('diffTag').style.background = conf.color
  document.getElementById('directionLabel').textContent = (q.type === 'cn2en') ? '中文 → 英文' : '英文 → 中文'

  // 词性
  var posEl = document.getElementById('posTag')
  if (q.pos && POS_MAP[q.pos]) {
    posEl.textContent = '📖 ' + POS_MAP[q.pos]
    posEl.style.display = 'block'
  } else if (q.pos) {
    posEl.textContent = '📖 ' + q.pos
    posEl.style.display = 'block'
  } else {
    posEl.style.display = 'none'
  }

  // 音标
  var phoneticEl = document.getElementById('phoneticLabel')
  if (q.phonetic) {
    phoneticEl.textContent = '/' + q.phonetic + '/'
    phoneticEl.style.display = 'block'
  } else {
    phoneticEl.style.display = 'none'
  }

  // 题目文本特殊样式
  var qText = document.getElementById('questionText')
  qText.textContent = questionText
  qText.className = 'question-text'
  if (q.pos === 'sentence') qText.classList.add('sentence')
  if (q.pos === 'phrase') qText.classList.add('phrase')

  // 输入框
  var input = document.getElementById('answerInput')
  input.value = ''
  input.disabled = false
  input.oninput = function() {
    var btn = document.getElementById('submitBtn')
    btn.disabled = (this.value.trim() === '')
  }
  input.onkeydown = function(e) {
    if (e.key === 'Enter') {
      var btn = document.getElementById('submitBtn')
      if (!btn.disabled) submitAnswer()
    }
  }
  input.focus()

  // 提示
  document.getElementById('hintArea').style.display = 'block'
  document.getElementById('hintText').textContent = q.hint

  // 按钮状态
  document.getElementById('submitBtn').style.display = 'block'
  document.getElementById('submitBtn').disabled = true
  document.getElementById('nextBtn').style.display = 'none'
  document.getElementById('skipBtn').style.display = 'block'
  document.getElementById('feedbackArea').style.display = 'none'

  _quizState.currentIndex = index
}

function submitAnswer() {
  var input = document.getElementById("answerInput")
  var answer = input.value.trim()
  if (!answer) return

  // 防御检查
  if (!_quizState || !_quizState.questions) {
    showToast("答题状态异常，请重新开始")
    return
  }
  if (!_quizState.gameHistory) {
    _quizState.gameHistory = []
  }

  input.disabled = true
  var q = _quizState.questions[_quizState.currentIndex]
  if (!q) {
    showToast("题目数据异常")
    return
  }
  var correct = (q.type === "cn2en") ? q.en : q.cn
  var exactMatch = (answer.toLowerCase() === correct.toLowerCase().trim())
  var isCorrect = exactMatch

  // 更新记录
  _quizState.questions[_quizState.currentIndex].userAnswer = answer
  _quizState.questions[_quizState.currentIndex].isCorrect = isCorrect
  _quizState.questions[_quizState.currentIndex].answered = true

  _quizState.gameHistory.push({
    question: q,
    userAnswer: answer,
    isCorrect: isCorrect,
    correctAnswer: correct
  })

  var lives = _quizState.lives
  var score = _quizState.score
  var streak = _quizState.streakCount

  if (isCorrect) {
    if (q.diff === "hard") score += 30
    else if (q.diff === "medium") score += 20
    else score += 10
    streak++
    if (streak >= 3 && lives < _quizState.maxLives) {
      lives++
      streak = 0
      showToast("🎉 连对3题 +1条命！")
    }
  } else {
    lives = Math.max(0, lives - 1)
    streak = 0
  }

  _quizState.lives = lives
  _quizState.score = score
  _quizState.streakCount = streak

  // 反馈
  document.getElementById("submitBtn").style.display = "none"
  var fa = document.getElementById("feedbackArea")
  fa.style.display = "flex"
  document.getElementById("feedbackIcon").textContent = isCorrect ? "✅" : "❌"
  document.getElementById("feedbackText").textContent = isCorrect ? "回答正确！" : "回答错误"
  document.getElementById("feedbackText").className = "feedback-text " + (isCorrect ? "correct" : "wrong")
  var correctEl = document.getElementById("correctAnswer")
  correctEl.innerHTML = isCorrect ? "" : "正确答案：<span class=\"correct-answer-text\">" + correct + "</span>"

  // AI 语义评测状态提示
  if (q.type === "en2cn" && !exactMatch && typeof aiEvaluate === "function" && aiEnabled) {
    var aiStatus = document.getElementById("aiStatus")
    if (aiStatus) {
      aiStatus.style.display = "block"
      aiStatus.className = "ai-status thinking"
      aiStatus.textContent = "🤖 AI 正在评测语义相似度..."
    }
  } else if (q.type === "en2cn" && exactMatch) {
    var aiStatus = document.getElementById("aiStatus")
    if (aiStatus) {
      aiStatus.style.display = "block"
      aiStatus.className = "ai-status correct"
      aiStatus.textContent = "✅ 精确匹配正确（本地）"
    }
  }

  // AI 异步修正（英译中语义判断）
  if (q.type === "en2cn" && !exactMatch && typeof aiEvaluate === "function" && aiEnabled) {
    var qCopy = q
    var ansCopy = answer
    ;(function(q, answer) {
      aiEvaluate(q, answer).then(function(result) {
        if (result.isCorrect) {
          var idx = _quizState.currentIndex
          _quizState.questions[idx].isCorrect = true
          if (_quizState.gameHistory.length > 0) {
            _quizState.gameHistory[_quizState.gameHistory.length - 1].isCorrect = true
          }
          // 补加分数
          if (q.diff === "hard") _quizState.score += 30
          else if (q.diff === "medium") _quizState.score += 20
          else _quizState.score += 10
          // 刷新显示
          document.getElementById("quizScore").textContent = "⭐ " + _quizState.score
          document.getElementById("feedbackIcon").textContent = "✅"
          document.getElementById("feedbackText").textContent = "回答正确！（AI 裁定语义相似）"
          document.getElementById("feedbackText").className = "feedback-text correct"
          document.getElementById("correctAnswer").innerHTML = ""
        }
        var aiStatus = document.getElementById("aiStatus")
        if (aiStatus) {
          aiStatus.className = "ai-status " + (result.isCorrect ? "correct" : "wrong")
          aiStatus.textContent = (result.isCorrect ? "✅" : "❌") + " AI：" + (result.detail || (result.isCorrect ? "语义相似" : "语义不匹配"))
        }
      })
    })(qCopy, ansCopy)
  }

  // 生命归零
  if (lives <= 0) {
    setTimeout(function() {
      showToast("💔 生命归零...")
      setTimeout(function() { goResult() }, 1000)
    }, 1200)
    return
  }

  // 下一题按钮
  document.getElementById("nextBtn").style.display = "block"
  document.getElementById("nextBtn").textContent =
    (_quizState.currentIndex >= _quizState.questions.length - 1) ? "查看成绩" : "下一题 ▶"

  // 答对自动跳转下一题（1.5秒后）
  if (isCorrect) {
    window._autoNextTimer = setTimeout(function() {
      nextQuestion()
    }, 1500)
  } else {
    if (window._autoNextTimer) {
      clearTimeout(window._autoNextTimer)
      window._autoNextTimer = null
    }
  }
}

function dontKnow() {
  if (!_quizState || !_quizState.questions[_quizState.currentIndex]) return

  var q = _quizState.questions[_quizState.currentIndex]
  var correct = (q.type === 'cn2en') ? q.en : q.cn

  // 记录到不认识列表（存储在 localStorage）
  var unknownList = []
  try {
    var stored = localStorage.getItem('unknownQuestions')
    if (stored) unknownList = JSON.parse(stored)
  } catch(e) {}
  // 去重加入
  var exists = false
  for (var i = 0; i < unknownList.length; i++) {
    if (unknownList[i].id === q.id) { exists = true; break }
  }
  if (!exists) {
    unknownList.push({ id: q.id, en: q.en, cn: q.cn, type: q.type, diff: q.diff, pos: q.pos })
    localStorage.setItem('unknownQuestions', JSON.stringify(unknownList))
  }

  // 显示正确答案，扣一条命
  document.getElementById('submitBtn').style.display = 'none'
  document.getElementById('skipBtn').style.display = 'none'

  var isCorrect = false
  var lives = Math.max(0, _quizState.lives - 1)
  var streak = 0
  _quizState.lives = lives
  _quizState.streakCount = streak

  // 更新记录
  _quizState.questions[_quizState.currentIndex].userAnswer = '❓ 不认识'
  _quizState.questions[_quizState.currentIndex].isCorrect = false
  _quizState.questions[_quizState.currentIndex].answered = true

  _quizState.gameHistory.push({
    question: q,
    userAnswer: '❓ 不认识',
    isCorrect: false,
    correctAnswer: correct
  })

  // 反馈
  var fa = document.getElementById('feedbackArea')
  fa.style.display = 'flex'
  document.getElementById('feedbackIcon').textContent = '❓'
  document.getElementById('feedbackText').textContent = '答案：' + correct
  document.getElementById('feedbackText').className = 'feedback-text wrong'
  document.getElementById('correctAnswer').innerHTML = '📝 已加入不认识列表，以后会复习'

  // 更新生命值
  var livesHtml = ''
  for (var i = 0; i < _quizState.maxLives; i++) {
    livesHtml += '<span class="heart ' + (i < lives ? '' : 'empty') + '">❤️</span>'
  }
  document.getElementById('quizLives').innerHTML = livesHtml

  if (lives <= 0) {
    setTimeout(function() {
      showToast('💔 生命归零...')
      setTimeout(function() { goResult() }, 1000)
    }, 1200)
    return
  }

  // 显示下一题
  document.getElementById('nextBtn').style.display = 'block'
  document.getElementById('nextBtn').textContent =
    (_quizState.currentIndex >= _quizState.questions.length - 1) ? '查看成绩' : '下一题 ▶'
  if (window._autoNextTimer) {
    clearTimeout(window._autoNextTimer)
    window._autoNextTimer = null
  }
}

function nextQuestion() {
  // 清除自动跳转定时器
  if (window._autoNextTimer) {
    clearTimeout(window._autoNextTimer)
    window._autoNextTimer = null
  }
  var next = _quizState.currentIndex + 1
  if (next >= _quizState.questions.length || _quizState.lives <= 0) {
    goResult()
  } else {
    showQuestion(next)
  }
}

function exitQuiz() {
  if (confirm('确认退出？')) {
    // 保存已获得的积分和生命值
    if (_quizState) {
      var ud = getUserData()
      ud.score = _quizState.score
  ud.lives = Math.max(0, _quizState.lives)
      saveUserData(ud)
    }
    goPage('home')
  }
}

function playAgain() {
  goQuiz()
}

// ===== 结算页 =====
function goResult() {
  var hist = _quizState.gameHistory
  if (!hist) hist = []
  var correct = 0
  var wrong = 0
  for (var i = 0; i < hist.length; i++) {
    if (hist[i].isCorrect) correct++
    else wrong++
  }
  var total = hist.length
  var accuracy = total > 0 ? Math.round(correct / total * 100) : 0

  // 保存用户数据
  var ud = getUserData()
      ud.lives = Math.max(0, _quizState.lives)
  ud.score = _quizState.score
  ud.streakCount = _quizState.streakCount
  ud.totalCorrect = (ud.totalCorrect || 0) + correct
  ud.totalWrong = (ud.totalWrong || 0) + wrong
  ud.comboRecord = Math.max(ud.comboRecord || 0, _quizState.streakCount)
  saveUserData(ud)

  goPage('result')

  var level = ''
  if (accuracy >= 95) level = '🌟 完美！英语大神！'
  else if (accuracy >= 80) level = '🎉 优秀！再接再厉！'
  else if (accuracy >= 60) level = '💪 继续加油！'
  else level = '📚 多练习会更好！'

  document.getElementById('resultLevel').textContent = level
  document.getElementById('resultCorrect').textContent = correct
  document.getElementById('resultWrong').textContent = wrong
  document.getElementById('resultAccuracy').textContent = accuracy + '%'
  document.getElementById('resultScore').textContent = _quizState.score

  // 错误题目纠错
  var wrongQ = []
  for (var i = 0; i < hist.length; i++) {
    if (!hist[i].isCorrect) wrongQ.push(hist[i])
  }

  var correctionSection = document.getElementById('correctionSection')
  var correctionList = document.getElementById('correctionList')
  var perfectBanner = document.getElementById('perfectBanner')

  if (wrongQ.length > 0) {
    correctionSection.style.display = 'block'
    perfectBanner.style.display = 'none'
    var html = ''
    for (var i = 0; i < wrongQ.length; i++) {
      var w = wrongQ[i]
      var q = w.question
      var type = (q.type === 'cn2en') ? '拼写错误' : '翻译错误'
      var posText = '(' + (POS_MAP[q.pos] || q.pos || '') + ')'
      var suggestion = (q.type === 'cn2en')
        ? '建议拼写为 "' + w.correctAnswer + '"' + posText + '，注意字母顺序'
        : '更准确的翻译是 "' + w.correctAnswer + '"' + posText
      html += '<div class="correction-item">' +
        '<span class="correction-type">' + type + '</span>' +
        '<span class="correction-your">你的答案：<span class="your-answer">' + w.userAnswer + '</span></span>' +
        '<span class="correction-correct">建议答案：<span class="correct-answer">' + w.correctAnswer + '</span></span>' +
        '<span class="correction-suggestion">💡 ' + suggestion + '</span>' +
      '</div>'
    }
    correctionList.innerHTML = html
  } else {
    correctionSection.style.display = 'none'
    perfectBanner.style.display = 'flex'
  }
}

// ===== 宠物屋 =====
function renderPetHouse() {
  var ud = getUserData()
  if (!ud.hasChosenPet) {
    showToast('请先选择萌宠', 2000)
    document.getElementById('petHouseImg').style.display = 'none'
    document.getElementById('petHouseName').textContent = '🐣 还没有萌宠'
    document.getElementById('petHouseDesc').textContent = '去首页选择一只萌宠开始你的旅程吧！'
    document.getElementById('happinessFill').style.width = '0%'
    document.getElementById('happinessNum').textContent = '--'
    document.getElementById('fullnessFill').style.width = '0%'
    document.getElementById('fullnessNum').textContent = '--'
    document.getElementById('feedPanel').style.display = 'none'
    document.getElementById('playPanel').style.display = 'none'
    return
  }
  var pet = ud.pet
  var pinfo = getPetInfo(pet.type)
  if (!pinfo) return

  document.getElementById('petHouseImg').src = pinfo.image
  document.getElementById('petHouseName').textContent = pet.emoji + ' ' + pet.name
  document.getElementById('petHouseDesc').textContent = pinfo.description

  var h = pet.happiness || 100
  var f = pet.fullness || 100
  document.getElementById('happinessFill').style.width = h + '%'
  document.getElementById('happinessNum').textContent = h + '%'
  document.getElementById('fullnessFill').style.width = f + '%'
  document.getElementById('fullnessNum').textContent = f + '%'

  document.getElementById('feedPanel').style.display = 'none'
  document.getElementById('playPanel').style.display = 'none'
}

function showFeedPanel() {
  var ud = getUserData()
  var foods = ud.inventory.food || []
  var grid = document.getElementById('foodGrid')
  var empty = document.getElementById('foodEmpty')

  if (foods.length === 0) {
    grid.innerHTML = ''
    empty.style.display = 'block'
  } else {
    empty.style.display = 'none'
    var html = ''
    for (var i = 0; i < foods.length; i++) {
      html += '<div class="item-card" onclick="useFood(' + i + ')">' +
        '<span class="item-emoji">' + foods[i].emoji + '</span>' +
        '<span class="item-name">' + foods[i].name + '</span>' +
      '</div>'
    }
    grid.innerHTML = html
  }
  document.getElementById('feedPanel').style.display = 'block'
  document.getElementById('playPanel').style.display = 'none'
}

function useFood(index) {
  var ud = getUserData()
  var foods = ud.inventory.food || []
  if (!foods[index]) return
  foods.splice(index, 1)
  ud.pet.fullness = Math.min(100, (ud.pet.fullness || 100) + 20)
  ud.pet.happiness = Math.min(100, (ud.pet.happiness || 100) + 5)
  ud.inventory.food = foods
  saveUserData(ud)
  showToast('🍽️ ' + ud.pet.name + ' 吃得好开心！')
  renderPetHouse()
  showFeedPanel()
}

function showPlayPanel() {
  var ud = getUserData()
  var toys = ud.inventory.toys || []
  var grid = document.getElementById('toyGrid')
  var empty = document.getElementById('toyEmpty')

  if (toys.length === 0) {
    grid.innerHTML = ''
    empty.style.display = 'block'
  } else {
    empty.style.display = 'none'
    var html = ''
    for (var i = 0; i < toys.length; i++) {
      html += '<div class="item-card" onclick="useToy(' + i + ')">' +
        '<span class="item-emoji">' + toys[i].emoji + '</span>' +
        '<span class="item-name">' + toys[i].name + '</span>' +
      '</div>'
    }
    grid.innerHTML = html
  }
  document.getElementById('playPanel').style.display = 'block'
  document.getElementById('feedPanel').style.display = 'none'
}

function useToy(index) {
  var ud = getUserData()
  var toys = ud.inventory.toys || []
  if (!toys[index]) return
  toys.splice(index, 1)
  ud.pet.happiness = Math.min(100, (ud.pet.happiness || 100) + 25)
  ud.pet.fullness = Math.min(100, (ud.pet.fullness || 100) - 5)
  ud.inventory.toys = toys
  saveUserData(ud)
  showToast('🎾 ' + ud.pet.name + ' 玩得超开心！')
  renderPetHouse()
  showPlayPanel()
}

function closePanels() {
  document.getElementById('feedPanel').style.display = 'none'
  document.getElementById('playPanel').style.display = 'none'
}

// ===== 商城 =====
function renderShop() {
  var ud = getUserData()
  document.getElementById('shopScore').textContent = '⭐ ' + (ud.score || 0)
  renderShopGrid('food')
}

function switchShopTab(tab) {
  var tabs = document.querySelectorAll('.tab-item')
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active')
  }
  if (tab === 'food') {
    tabs[0].classList.add('active')
  } else {
    tabs[1].classList.add('active')
  }
  renderShopGrid(tab)
}

function renderShopGrid(type) {
  var dataKey = (type === "toy") ? "toys" : type
  var items = SHOP_ITEMS[dataKey]
  if (!items) { showToast("商品数据异常"); return }
  var gridId = (type === "food") ? "shopFoodGrid" : "shopToyGrid"
  var otherId = (type === "food") ? "shopToyGrid" : "shopFoodGrid"
  document.getElementById(gridId).innerHTML = ""
  document.getElementById(otherId).innerHTML = ""
  document.getElementById(gridId).style.display = "grid"
  document.getElementById(otherId).style.display = "none"
  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    var stock = (item.stock !== undefined) ? item.stock : 10
    var soldOut = (stock <= 0)
    var card = document.createElement("div")
    card.className = "shop-item"
    if (!soldOut) {
      card.onclick = function(id, tp) {
        return function() { buyItem(id, tp) }
      }(item.id, type)
    }
    var imgArea = document.createElement("div")
    imgArea.className = "item-image-area"
    var imgSpan = document.createElement("span")
    imgSpan.className = "item-emoji-big"
    imgSpan.textContent = item.emoji
    imgArea.appendChild(imgSpan)
    card.appendChild(imgArea)
    var nameDiv = document.createElement("div")
    nameDiv.className = "shop-item-name"
    nameDiv.textContent = item.name
    card.appendChild(nameDiv)
    var priceDiv = document.createElement("div")
    priceDiv.className = "shop-item-price"
    var priceIcon = document.createElement("span")
    priceIcon.className = "price-icon"
    priceIcon.textContent = "⭐"
    var priceVal = document.createElement("span")
    priceVal.className = "price-value"
    priceVal.textContent = item.price
    priceDiv.appendChild(priceIcon)
    priceDiv.appendChild(priceVal)
    card.appendChild(priceDiv)
    var stockDiv = document.createElement("div")
    stockDiv.className = "shop-stock"
    stockDiv.textContent = soldOut ? "❌ 已售罄" : "剩余 " + stock + " 个"
    card.appendChild(stockDiv)
    var btn = document.createElement("button")
    btn.className = "buy-btn"
    btn.textContent = soldOut ? "已售罄" : "购买"
    if (soldOut) btn.style.background = "#ccc"
    card.appendChild(btn)
    document.getElementById(gridId).appendChild(card)
  }
}

function buyItem(itemId, type, idx) {
  var key = (type === 'toy') ? 'toys' : type
  var items = SHOP_ITEMS[key]
  var item = null
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === itemId) { item = items[i]; break }
  }
  if (!item) return

  var ud = getUserData()
  if ((ud.score || 0) < item.price) {
    showToast('积分不足！还需要 ' + (item.price - (ud.score || 0)) + ' 分')
    return
  }

  // 扣减库存
  if (idx !== undefined && items[idx] && items[idx].stock !== undefined) {
    items[idx].stock = Math.max(0, items[idx].stock - 1)
  }

  ud.score -= item.price
  if (!ud.inventory) ud.inventory = { food: [], toys: [] }
  if (!ud.inventory.food) ud.inventory.food = []
  if (!ud.inventory.toys) ud.inventory.toys = []
  if (type === 'food') { ud.inventory.food.push(item) } else { ud.inventory.toys.push(item) }
  saveUserData(ud)

  document.getElementById('shopScore').textContent = '⭐ ' + ud.score
  // ??????
  var homeScore = document.getElementById('homeScore')
  if (homeScore) homeScore.textContent = ud.score

  showToast('🎉 购买' + item.name + '成功！')
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
  renderHome()
  startPetDecay()
})



// ===== AI 实时出题 =====
var aiGenerateEnabled = false

function toggleAIGenerate() {
  aiGenerateEnabled = !aiGenerateEnabled
  var toggle = document.getElementById('aiGenToggle')
  if (toggle) {
    if (aiGenerateEnabled) toggle.classList.add('active')
    else toggle.classList.remove('active')
  }
  showToast(aiGenerateEnabled ? '✍️ AI 出题已开启' : '📖 使用本地题库')
}

function toggleApiSettings() {
  var panel = document.getElementById("aiSettingsPanel")
  if (panel) {
    if (panel.style.display === "none" || panel.style.display === "") {
      panel.style.display = "block"
    } else {
      panel.style.display = "none"
    }
  }
}



// ===== 商城库存刷新 =====
function resetShopStock() {
  var food = SHOP_ITEMS.food
  food[0].stock = 10
  food[1].stock = 8
  food[2].stock = 15
  food[3].stock = 12
  food[4].stock = 6
  food[5].stock = 8
  var toys = SHOP_ITEMS.toys
  toys[0].stock = 10
  toys[1].stock = 8
  toys[2].stock = 5
  toys[3].stock = 6
  toys[4].stock = 12
  toys[5].stock = 4
}

// ===== 宠物状态衰减 =====
// 每10分钟衰减5点，最低到0
function startPetDecay() {
  // 清除旧定时器
  if (window._petDecayTimer) {
    clearInterval(window._petDecayTimer)
  }
  // 每10分钟（600000毫秒）执行一次
  window._petDecayTimer = setInterval(function() {
    var ud = getUserData()
    if (!ud.hasChosenPet || !ud.pet) return

    var changed = false
    if ((ud.pet.happiness || 100) > 0) {
      ud.pet.happiness = Math.max(0, (ud.pet.happiness || 100) - 5)
      changed = true
    }
    if ((ud.pet.fullness || 100) > 0) {
      ud.pet.fullness = Math.max(0, (ud.pet.fullness || 100) - 5)
      changed = true
    }

    if (changed) {
      saveUserData(ud)
      // 如果当前在宠物屋页面，刷新显示
      var petHousePage = document.getElementById('page-pet-house')
      if (petHousePage && petHousePage.classList.contains('active')) {
        renderPetHouse()
      }
    }
  }, 600000) // 10分钟
}

function saveApiKeySetting() {
  var providerSelect = document.getElementById('apiProviderSelect')
  var input = document.getElementById('apiKeyInput')
  var provider = providerSelect ? providerSelect.value : 'tongyi'
  var key = input.value.trim()
  if (!key) {
    showToast('请输入 API Key')
    return
  }
  if (typeof saveApiKey === 'function') {
    saveApiKey(provider, key)
    showToast('✅ ' + provider + ' API Key 已保存')
    input.value = ''
    var status = document.getElementById('apiKeyStatus')
    if (status) {
      status.textContent = '✅ ' + provider + ' API Key 已保存'
      status.style.display = 'block'
    }
  }
}

function toggleAI() {
  aiEnabled = !aiEnabled
  var toggle = document.getElementById('aiToggle')
  var knob = document.getElementById('toggleKnob')
  if (toggle) {
    if (aiEnabled) toggle.classList.add('active')
    else toggle.classList.remove('active')
  }
  showToast(aiEnabled ? '🤖 AI 评测已开启' : '📖 使用精确匹配（本地模式）')
}

function resumeQuiz() {
  var saved = loadData('petGameQuizState')
  if (!saved || !saved.questions) { showToast('没有未完成的答题'); return }
  _quizState = saved
  goPage('quiz')
  restoreQuizUI()
}

function restoreQuizUI() {
  if (!_quizState) return
  var index = _quizState.currentIndex || 0
  var total = _quizState.questions.length
  document.getElementById('progressFill').style.width = Math.round((index / total) * 100) + '%'
  document.getElementById('progressText').textContent = (index + 1) + ' / ' + total
  document.getElementById('quizScore').textContent = '⭐ ' + (_quizState.score || 0)
  var livesHtml = ''
  for (var i = 0; i < (_quizState.maxLives || 10); i++) {
    livesHtml += '<span class="heart ' + (i < (_quizState.lives || 0) ? '' : 'empty') + '">❤️</span>'
  }
  document.getElementById('quizLives').innerHTML = livesHtml
  var q = _quizState.questions[index]
  if (q) {
    var conf = DIFFICULTY_CONFIG[q.diff]
    var questionText = (q.type === 'cn2en') ? q.cn : q.en
    document.getElementById('questionText').textContent = questionText
    document.getElementById('diffTag').textContent = conf.label
    document.getElementById('posTag').textContent = '📖 ' + (POS_MAP[q.pos] || q.pos)
    document.getElementById('directionLabel').textContent = q.type === 'cn2en' ? '中文 → 英文' : '英文 → 中文'
    document.getElementById('answerInput').value = q.userAnswer || ''
    document.getElementById('answerInput').disabled = false
    document.getElementById('submitBtn').style.display = 'block'
    document.getElementById('skipBtn').style.display = 'block'
    document.getElementById('nextBtn').style.display = 'none'
    document.getElementById('feedbackArea').style.display = 'none'
    document.getElementById('hintArea').style.display = 'none'
  }
  document.getElementById('streakBanner').style.display = 'none'
}


// ===== 重置所有数据 =====
function resetAllData() {
  if (!confirm('⚠️ 确定要重置所有数据吗？\n\n这将清除：\n• 宠物信息\n• 积分和生命值\n• 答题记录\n• 错题本\n• API 设置\n\n此操作不可撤销！')) {
    return
  }

  if (!confirm('真的确定吗？所有数据将永久丢失！')) {
    return
  }

  // 清除所有游戏相关 localStorage
  var keys = ['petGameUserData', 'petGameWrongBank', 'unknownQuestions', 'petGameQuizState']
  for (var i = 0; i < keys.length; i++) {
    localStorage.removeItem(keys[i])
  }

  // 清除 API Key（保留 localStorage 中的其他数据）
  var providers = ['openai', 'deepseek', 'tongyi', 'siliconflow']
  for (var i = 0; i < providers.length; i++) {
    localStorage.removeItem(providers[i] + 'ApiKey')
  }

  showToast('✅ 数据已清除，页面即将刷新')
  setTimeout(function() {
    location.reload()
  }, 1500)
}
