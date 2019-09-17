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

HistoryStackEmulator.prototype._startTimer = function() {
  var that = this

  if (!this._mTimer) {
    this._mTimer = setInterval(function() {
      if (that._mTimer) {
        try {
          var c = that._mIFrame.contentWindow.document.body.innerText.trim()

          that._dispatchIFrameLoaded(c)
        } catch (e) {}
      }
    }, 50)
  }
}

HistoryStackEmulator.prototype._stopTimer = function() {
  this._mTimer && (clearInterval(this._mTimer), (this._mTimer = null))
}

HistoryStackEmulator.prototype._addState = function(c) {
  var doc = null,
    content = '<html><body>' + c + '</body></html>'

  try {
    doc = this._mIFrame.contentWindow.document
    doc.open()
    doc.writeln(content)
    doc.close()

    return !0
  } catch (e) {
    return !1
  }
}

HistoryStackEmulator.prototype.replaceHistoryState = function(t) {
  if (this.type !== HistoryStackEmulator.IFRAME) return !1

  try {
    this._mIFrame.contentWindow.document.body.innerHTML = t

    return !0
  } catch (e) {
    return !1
  }
}

HistoryStackEmulator.prototype.addHistoryState = function(t) {
  return this.type !== HistoryStackEmulator.IFRAME ? !1 : this._addState(t)
}

export default HistoryStackEmulator
