import Stack from './historyStackEmulator'

function HistoryManager() {
  var that = this

  this._mEmulator = Stack.getInstance()

  this._mEmulator.on('historychanged', function(e) {
    if (e) {
      var r = HistoryManager.parseHistory(e)
      if (r) {
        var i = r[0]

        that.emit(i, r[1])
      } else {
        that.emit('all', {}, !0)
      }
    }
  })
}

var _historyManager = null
HistoryManager.getDefault = function() {
  return (
    _historyManager || (_historyManager = new HistoryManager()), _historyManager
  )
}

HistoryManager.PATTERN_HISTORY_STATE = /^([\w-]+)((\/(?:[\w-]+)=[^&]*(&(?:[\w-]+)=[^&]*)*)*)$/gi

HistoryManager.parseHistory = function(t) {
  HistoryManager.PATTERN_HISTORY_STATE.lastIndex = 0
  if (HistoryManager.PATTERN_HISTORY_STATE.test(t)) {
    var e = RegExp.$2.trim(),
      r = {}

    if (e.length > 0) {
      var i = e.substring(1).split('&'),
        o = 0,
        s = i.length
      for (; s > o; o++) {
        var a = i[o].split('=')

        r[a[0]] = decodeURIComponent(a[1])
      }
    }

    return [RegExp.$1.trim(), r]
  }

  return null
}

HistoryManager.getCurrentParams = function() {
  var t = HistoryManager.getCurrentHash()

  return t && 2 === t.length ? t[1] : {}
}

HistoryManager.getCurrentHash = function() {
  return HistoryManager.parseHistory(location.hash.slice(1))
}

HistoryManager.getCurrentModule = function() {
  var t = location.hash,
    e = t.indexOf('/')

  return e > -1 ? t.substring(1, e) : t.substring(1)
}
