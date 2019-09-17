define('system-core:system/uiService/historyListManage/historyListManage.js', function(
  t,
  i,
  s
) {
  function e(t) {
    ;(this.historyList = []),
      (this.historyListTips = []),
      (this.historyListParents = []),
      t || (t = {}),
      t.container
        ? ((t.$container = o(t.container)), (t.renderDefaultDom = !0))
        : (t.renderDefaultDom = !1),
      (this.config = t),
      this.init()
  }
  var o = t('base:widget/libs/jquerypacket.js'),
    r = t('base:widget/tools/tools.js'),
    h = t('base:widget/historyManager/historyManager.js'),
    n = t('system-core:system/baseService/message/message.js'),
    a =
      '<ul class="FuIxtL" node-type="FuIxtL"><li><a data-deep="-1" href="javascript:;">返回上一级</a><span class="EKIHPEb">|</span></li><li node-type="tbAudfb"></li></ul>'
  ;(e.prototype.init = function() {
    if (this.config.renderDefaultDom) {
      var t = this.config.$container
      this.config &&
        this.config.needSwitch &&
        this.config.needSwitch === !0 &&
        (t.find('.FcucHsb').before('<a class="FbaCPx"></a>'),
        (this.$swicthButton = t.find('.FbaCPx')),
        /vmode=grid/.test(location.hash) &&
          this.$swicthButton.addClass('ugcOHtb')),
        t.append(a),
        (this.$historyList = t.find('ul[node-type="FuIxtL"]')),
        (this.$historySubList = t.find('li[node-type="tbAudfb"]')),
        this.bindEvent()
    }
  }),
    (e.prototype.bindEvent = function() {
      if (this.config.renderDefaultDom) {
        var t = this
        t.$historyList.delegate('a', 'click', function() {
          var i = o(this),
            s = parseInt(i.attr('data-deep'), 10)
          t._goHistoryByDeep(s)
        }),
          this.config &&
            this.config.needSwitch === !0 &&
            t.config.$container.delegate('.FbaCPx', 'click', function() {
              o(this).toggleClass('ugcOHtb')
              var t = o(this).hasClass('ugcOHtb'),
                i = h.getCurrentParams(),
                s = h.getCurrentModule()
              ;(i.vmode = t ? 'grid' : 'list'),
                n.trigger('system-change-view-mode-loadingtip'),
                h.getDefault().addHistory(h.buildHistory(s, i))
            })
      }
    }),
    (e.prototype._goHistoryByDeep = function(t) {
      ;-1 === t ? this.goPrev() : this.goToHistory(t + 1)
    }),
    (e.prototype.addHistory = function(t, i) {
      this.historyList.push(t),
        this.historyListTips.push(i),
        this.historyChange()
    }),
    (e.prototype.getPath = function() {
      var t = this.historyList.join('/')
      return ('/' + t + '/').replace(/^\/+/, '/')
    }),
    (e.prototype.changeHistory = function(t, i, s) {
      t.length !== i.length ||
        t.length <= 0 ||
        ((this.historyList = t),
        (this.historyListTips = i),
        (this.historyListParents = s || []),
        this.historyChange())
    }),
    (e.prototype.goToHistory = function(t) {
      t >= this.historyList.length ||
        0 > t ||
        (this.historyList.splice(t, this.historyList.length),
        this.historyListTips.splice(t, this.historyListTips.length),
        this.historyChange())
    }),
    (e.prototype.goPrev = function() {
      this.goToHistory(this.historyList.length - 1, 'isPrev')
    }),
    (e.prototype.clear = function() {
      ;(this.historyList.length = 0),
        (this.historyListTips.length = 0),
        this.historyChange()
    }),
    (e.prototype.historyChange = function() {
      this.renderHistoryDOM(),
        this.onHistoryChange(
          this.historyList,
          this.historyListTips,
          this.historyListParents
        )
    }),
    (e.prototype.getFullPathStr = function(t, i) {
      return (i = Math.min(t.length, i)), t.slice(0, i + 1).join('/')
    }),
    (e.prototype.renderHistoryDOM = function() {
      var t = 0
      if (this.config.renderDefaultDom) {
        for (var i = [], s = 0; s < this.historyListTips.length; s++)
          o.inArray(this.historyListTips[s], this.historyListParents) < 0
            ? i.push(this.historyListTips[s])
            : (t += 1)
        if (
          (this.historyListParents.length > 0 && (this.historyListTips = i),
          !(this.historyListTips.length > 1))
        )
          return void this.$historyList.hide()
        this.$historyList.show()
        var e,
          h,
          n = [],
          a = 8,
          y = 4,
          g = this.historyListTips.slice()
        '' === g[g.length - 1] && (g.length = g.length - 1),
          g.length <= 2 ? (a = 30) : g.length <= 3 && (a = 15)
        var l = Math.max(g.length - y, 0),
          p = g
        if (g.length > y) {
          p = g.slice(l)
          var c = r.encodeHTML(this.getFullPathStr(g, g.length - y))
          n[n.length] =
            '<span title="' +
            c +
            '">...</span><span class="KLxwHFb">&gt;</span>'
        }
        for (var d = 0, f = p.length; f > d; d++) {
          ;(e = p[d]),
            (h = e.length > a ? e.substring(0, a) + '...' : e),
            (h = r.encodeHTML(h))
          var u = r.encodeHTML(this.getFullPathStr(g, d + l))
          n[n.length] =
            d !== f - 1
              ? '<a href="javascript:;" title="' +
                u +
                '" data-deep="' +
                (d + l) +
                '">' +
                h +
                '</a><span class="KLxwHFb">&gt;</span>'
              : '<span title="' + u + '">' + h + '</span>'
        }
        this.$historySubList.html(n.join('')), this.changeHistoryList()
      }
    }),
    (e.prototype.changeHistoryList = function() {
      this.$historyList.find('.fccMxxb').html(this.historyListTips[0]),
        this.onChangeHistoryList()
    }),
    (e.prototype.onHistoryChange = function() {}),
    (e.prototype.onChangeHistoryList = function() {}),
    (s.exports = e)
})


define('base:widget/historyManager/historyStackEmulator.js', function(t, e, i) {
  function n() {
    o.call(this),
      (this._mIFrame = null),
      (this._mState = ''),
      (this._mTimer = null),
      (this.type = n.NO_CHECK),
      this._init()
  }
  var r = t('base:widget/tools/service/tools.util.js'),
    o = t('base:widget/tools/service/tools.event.js').EventEmitter
  r.inherits(n, o),
    (n.NO_CHECK = 0),
    (n.IFRAME = 1),
    (n.HTML5 = 2),
    (n.DISABLED = 3)
  var a = null
  ;(n.HISTORY_IFRAME_ID = 'historyIFrameEmulator'),
    (n.getInstance = function() {
      return a || (a = new n()), a
    }),
    (n.getSupportedType = function() {
      var t = 'undefined' != typeof window.attachEvent,
        e = 'onhashchange' in window
      if (e) {
        var i = /MSIE (\d+)/gi
        i.test(navigator.userAgent) && RegExp.$1 < 9 && (e = !1)
      }
      return t && !e
        ? n.IFRAME
        : 'onhashchange' in window
        ? n.HTML5
        : n.DISABLED
    }),
    (n.prototype._buildIFrame = function() {
      var t = document.getElementById(n.HISTORY_IFRAME_ID)
      return t ? ((this._mIFrame = t), !0) : !1
    }),
    (n.prototype._init = function() {
      function t() {
        i._dispatchIFrameLoaded(location.hash.slice(1) || '')
      }
      if (((this.type = n.getSupportedType()), this.type !== n.DISABLED)) {
        if (this.type === n.IFRAME) {
          var e = this._buildIFrame()
          e && (this._startTimer(), this._addState(''))
        }
        var i = this
        this.type === n.HTML5 &&
          (window.addEventListener
            ? window.addEventListener('hashchange', t, !1)
            : window.attachEvent && window.attachEvent('onhashchange', t))
      }
    }),
    (n.prototype._dispatchIFrameLoaded = function(t) {
      t != this._mState && ((this._mState = t), this.emit('historychanged', t))
    }),
    (n.prototype._startTimer = function() {
      if (!this._mTimer) {
        var t = this
        this._mTimer = setInterval(function() {
          if (t._mIFrame)
            try {
              var e = t._mIFrame.contentWindow.document.body.innerText.trim()
              t._dispatchIFrameLoaded(e)
            } catch (i) {}
        }, 50)
      }
    }),
    (n.prototype._stopTimer = function() {
      this._mTimer && (clearInterval(this._mTimer), (this._mTimer = null))
    }),
    (n.prototype._addState = function(t) {
      var e = null,
        i = '<html><body>' + t + '</body></html>'
      try {
        return (
          (e = this._mIFrame.contentWindow.document),
          e.open(),
          e.writeln(i),
          e.close(),
          !0
        )
      } catch (n) {
        return !1
      }
    }),
    (n.prototype.replaceHistoryState = function(t) {
      if (this.type !== n.IFRAME) return !1
      try {
        return (this._mIFrame.contentWindow.document.body.innerHTML = t), !0
      } catch (e) {
        return !1
      }
    }),
    (n.prototype.addHistoryState = function(t) {
      return this.type !== n.IFRAME ? !1 : this._addState(t)
    }),
    (i.exports = n)
})
define('base:widget/historyManager/historyManager.js', function(t, e, r) {
  function n() {
    s.call(this), (this._mEmulator = i.getInstance())
    var t = this
    this._mEmulator.on('historychanged', function(e) {
      if (e) {
        var r = n.parseHistory(e)
        if (r) {
          var i = r[0]
          t.emit(i, r[1])
        }
      } else t.emit('all', {}, !0)
    })
  }
  var i = t('base:widget/historyManager/historyStackEmulator.js'),
    o = t('base:widget/tools/service/tools.util.js'),
    s = t('base:widget/tools/service/tools.event.js').EventEmitter
  o.inherits(n, s)
  var a = null
  ;(n.getDefault = function() {
    return a || (a = new n()), a
  }),
    (n.PATTERN_HISTORY_STATE = /^([\w-]+)((\/(?:[\w-]+)=[^&]*(&(?:[\w-]+)=[^&]*)*)*)$/gi),
    (n.parseHistory = function(t) {
      if (
        ((n.PATTERN_HISTORY_STATE.lastIndex = 0),
        n.PATTERN_HISTORY_STATE.test(t))
      ) {
        var e = RegExp.$2.trim(),
          r = {}
        if (e.length > 0)
          for (
            var i = e.substring(1).split('&'), o = 0, s = i.length;
            s > o;
            o++
          ) {
            var a = i[o].split('=')
            r[a[0]] = decodeURIComponent(a[1])
          }
        return [RegExp.$1.trim(), r]
      }
      return null
    }),
    (n.getCurrentParams = function() {
      var t = n.getCurrentHash()
      return t && 2 === t.length ? t[1] : {}
    }),
    (n.getCurrentHash = function() {
      return n.parseHistory(location.hash.slice(1))
    }),
    (n.getCurrentModule = function() {
      var t = location.hash,
        e = t.indexOf('/')
      return e > -1 ? t.substring(1, e) : t.substring(1)
    }),
    (n.assignUrlHash = function(t, e) {
      if (0 != t.trim().length || e !== !0)
        try {
          location.hash = t
        } catch (r) {}
    }),
    (n.replaceUrlHash = function(t, e) {
      if (0 != t.trim().length || e !== !0)
        try {
          location.replace('#' + t)
        } catch (r) {
          debug && console.log('Exception On Assigning Url Hash = ', t)
        }
    }),
    (n.buildHistory = function(t, e) {
      var r = []
      for (var n in e)
        e.hasOwnProperty(n) &&
          void 0 != e[n] &&
          r.push(n + '=' + encodeURIComponent(e[n]))
      return t + (r.length > 0 ? '/' + r.join('&') : '')
    }),
    (n.interpretCurrentWindow = function(t) {
      var e = location.hash.slice(1)
      if (e) {
        var r = n.parseHistory(e)
        if (null != r)
          return t
            ? r
            : (n.getDefault()._mEmulator.emit('historychanged', e), !0)
      }
      return t ? null : !1
    }),
    (n.prototype.addListener = n.prototype.listen = function(t, e) {
      this.on(t, e), this.on('all', e)
    }),
    (n.prototype.removeListener = n.prototype.unlisten = function(t, e) {
      this.removeAllListeners(t), e && this.removeListener('all', e)
    }),
    (n.prototype.addHistory = function(t) {
      ;(t = t.trim()),
        t && (n.assignUrlHash(t), this._mEmulator.addHistoryState(t))
    }),
    (n.prototype.replaceHistory = function(t) {
      ;(t = t.trim()),
        t && (n.replaceUrlHash(t), this._mEmulator.replaceHistoryState(t))
    }),
    (n.prototype.navigate = function(t, e, r) {
      if ('undefined' == typeof t || null == t)
        throw new Error("Arguments 'module' required to navigate history")
      var i = n.buildHistory(t, e)
      return i == location.hash.slice(1)
        ? !1
        : (r === !0 ? this.replaceHistory(i) : this.addHistory(i), !0)
    }),
    (n.prototype.go = function(t) {
      history.go(t)
    }),
    (r.exports = n)
})