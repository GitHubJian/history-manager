function HistoryStackEmulator() {
  this._mIFrame = null
  this._mState = ''
  this._mTimer = null
  this.type = HistoryStackEmulator.NO_CHECK

  this._init()
}

HistoryStackEmulator.NO_CHECK = 0
HistoryStackEmulator.IFRAME = 1
HistoryStackEmulator.HTML5 = 2
HistoryStackEmulator.DISABLED = 3

HistoryStackEmulator.HISTORY_IFRAME_ID = 'historyIFrameEmulator'

var _historyStackEmulator
HistoryStackEmulator.getInstance = function() {
  _historyStackEmulator || (_historyStackEmulator = new HistoryStackEmulator())

  return _historyStackEmulator
}

HistoryStackEmulator.getSupportedType = function() {
  var t = 'undefined' != typeof window.attachEvent,
    e = 'onhashchange' in window

  if (e) {
    var i = /MSIE (\d+)/gi
    i.test(navigator.userAgent) && RegExp.$1 < 9 && (e = !1)
  }

  return t && !e
    ? HistoryStackEmulator.IFRAME
    : 'onhashchange' in window
    ? HistoryStackEmulator.HTML5
    : HistoryStackEmulator.DISABLED
}

HistoryStackEmulator.prototype._buildIFrame = function() {
  var t = document.getElementById(HistoryStackEmulator.HISTORY_IFRAME_ID)

  return t ? ((this._mIFrame = t), !0) : !1
}

HistoryStackEmulator.prototype._init = function() {
  var that = this

  function t() {
    that._dispatchIFrameLoaded(location.hash.slice(1) || '')
  }

  this.type = HistoryStackEmulator.getSupportedType()

  if (this.type !== HistoryStackEmulator.DISABLED) {
    if (this.type === HistoryStackEmulator.IFRAME) {
      var e = this._buildIFrame()
      e && (this._startTimer(), this._addState(''))
    }

    this.type === HistoryStackEmulator.HTML5 &&
      (window.addEventListener
        ? window.addEventListener('hashchange', t, !1)
        : window.attachEvent && window.attachEvent('onhashchange', t))
  }
}

HistoryStackEmulator.prototype._dispatchIFrameLoaded = function(t) {
  if (t != this._mState) {
    this._mState = t
    this.emit('historychanged', t)
  }
}
