import './main.less'
import { isMbDevice } from './utils'

class resizeBox {
  constructor(el, opts) {
    this.el = el
    this.options = opts || {}
    this.ready = false
    this.pressingBarName = ''
    this.mousePos = {
      x: 0,
      y: 0
    }
    this.initialRatio = 0
    this.isMobile = isMbDevice()
    /**
     * mode
     * 'half' - relative mode, normal flow, support 'right' 'bottom' 'rb'
     * 'full' -  out of normal flow, support 'right' 'bottom' 'top' 'left' 'rb' 'rt' 'lb' 'lt'
     */
    this.mode = 'half'
    this.modeBars = {
      half: 'right,bottom,rb',
      full: 'right,bottom,top,left,rb,rt,lb,lt'
    }

    this.containerStyle = {}
    this.divs = []

    this.getComputedStyle()
    this.initContainer()

    // define events func
    this.movingFunc = this.mouseMoving.bind(this)
    this.mouseLeftFunc = this.mouseLeft.bind(this)
    this.mouseUpFunc = this.mouseUp.bind(this)
    this.mouseDownFunc = this.mouseDown.bind(this)
    this.mouseEnterFunc = this.mouseEnter.bind(this)
    // mobile events

    if (!this.isMobile) {
      this.mouseEvents()
    } else {
      this.mbEvents()
    }
  }
  initContainer() {
    const computedStyle = window.getComputedStyle(this.el)
    if (computedStyle.position === 'static') {
      this.el.style.position = 'relative'
    } else {
      this.mode = 'full'
    }
    if (this.isMobile) {
      this.genSideHandler()
    }

    // make ele > minSize && < maxSize
    let adjustWidth = this.containerStyle.width
    let adjustHeight = this.containerStyle.height
    adjustWidth = this.getBoundaryValue(
      this.containerStyle.width,
      this.options.minWidth,
      'min'
    )
    adjustWidth = this.getBoundaryValue(
      adjustWidth,
      this.options.maxWidth,
      'max'
    )
    adjustHeight = this.getBoundaryValue(
      this.containerStyle.height,
      this.options.minHeight,
      'min'
    )
    adjustHeight = this.getBoundaryValue(
      adjustHeight,
      this.options.maxHeight,
      'max'
    )
    this.el.style.width = adjustWidth + 'px'
    this.el.style.height = adjustHeight + 'px'
  }
  getComputedStyle() {
    const computedStyle = window.getComputedStyle(this.el)
    this.containerStyle = {
      width: parseInt(computedStyle.width, 10),
      height: parseInt(computedStyle.height, 10),
      top: parseInt(computedStyle.top, 10),
      left: parseInt(computedStyle.left, 10)
    }
  }
  initRatio() {
    this.initialRatio = this.containerStyle.width / this.containerStyle.height
    if (this.options.keepRatio) {
      this.options.minWidth &&
        (this.options.minHeight = Math.floor(
          this.options.minWidth / this.initialRatio
        ))
      this.options.minHeight &&
        (this.options.minWidth = this.options.minHeight * this.initialRatio)
      this.options.maxWidth &&
        (this.options.maxHeight = Math.floor(
          this.options.maxWidth / this.initialRatio
        ))
      this.options.maxHeight &&
        (this.options.maxWidth = this.options.maxHeight * this.initialRatio)
    }
  }
  mbEvents() {
    document.documentElement.addEventListener(
      'touchstart',
      this.mouseDownFunc,
      {
        passive: false
      }
    )
    document.documentElement.addEventListener('touchmove', this.movingFunc, {
      passive: false
    })
    document.documentElement.addEventListener('touchend', this.mouseUpFunc)
    document.documentElement.addEventListener('touchcancel', this.mouseUpFunc)
  }
  mouseEvents() {
    document.documentElement.addEventListener('mousemove', this.movingFunc)
    this.el.addEventListener('mouseenter', this.mouseEnterFunc)
    this.el.addEventListener('mouseleave', this.mouseLeftFunc)
    document.documentElement.addEventListener('mouseup', this.mouseUpFunc)
  }
  mouseEnter() {
    this.genSideHandler()
  }
  mouseDown(e) {
    if (this.isMobile && e.target.className.indexOf('v-resize-bar') < 0) return
    this.ready = true
    this.pressingBarName = e.target.getAttribute('data-pos')
    if (this.isMobile) {
      this.mousePos.x = e.touches[0].pageX
      this.mousePos.y = e.touches[0].pageY
    } else {
      this.mousePos.x = e.clientX
      this.mousePos.y = e.clientY
    }
    this.getComputedStyle()
    this.initRatio()
    e.preventDefault()
  }
  mouseUp() {
    this.ready = false
    if (!this.isMobile) {
      this.removeDivs()
    }
    this.getComputedStyle()
  }
  getBoundaryValue(val, limitVal, compare) {
    let res = 0
    if (compare === 'min') {
      if (limitVal !== undefined && val < limitVal) {
        res = limitVal
        this.ready = false
      } else {
        res = val
      }
    }
    if (compare === 'max') {
      if (limitVal !== undefined && val > limitVal) {
        res = limitVal
        this.ready = false
      } else {
        res = val
      }
    }
    return res
  }
  calcMove(e) {
    if (!this.ready) return
    const newX = this.isMobile ? e.touches[0].pageX : e.clientX
    const newY = this.isMobile ? e.touches[0].pageY : e.clientY
    const rangeX =
      'left,right,lt,rt,lb,rb'.indexOf(this.pressingBarName) > -1
        ? newX - this.mousePos.x
        : 0
    const rangeY =
      'top,bottom,lt,rt,lb,rb'.indexOf(this.pressingBarName) > -1
        ? newY - this.mousePos.y
        : 0
    this.mousePos.x = newX
    this.mousePos.y = newY

    let calcedWidth = this.containerStyle.width + rangeX
    let calcedHeight = this.containerStyle.height + rangeY
    let calcedLeft = this.containerStyle.left + rangeX
    let calcedTop = this.containerStyle.top + rangeY

    if ('left,lt,lb'.indexOf(this.pressingBarName) > -1) {
      calcedWidth = this.containerStyle.width - rangeX
    }
    if ('top,lt,rt'.indexOf(this.pressingBarName) > -1) {
      calcedHeight = this.containerStyle.height - rangeY
    }

    if (this.options.minWidth) {
      calcedWidth = this.getBoundaryValue(
        calcedWidth,
        this.options.minWidth,
        'min'
      )
    }
    if (this.options.maxWidth) {
      calcedWidth = this.getBoundaryValue(
        calcedWidth,
        this.options.maxWidth,
        'max'
      )
    }
    if (this.options.minHeight) {
      calcedHeight = this.getBoundaryValue(
        calcedHeight,
        this.options.minHeight,
        'min'
      )
    }
    if (this.options.maxHeight) {
      calcedHeight = this.getBoundaryValue(
        calcedHeight,
        this.options.maxHeight,
        'max'
      )
    }

    if (this.options.keepRatio) {
      if (this.pressingBarName === 'right' || this.pressingBarName === 'rb') {
        calcedHeight = Math.floor(calcedWidth / this.initialRatio)
      }
      if (this.pressingBarName === 'bottom') {
        calcedWidth = calcedHeight * this.initialRatio
      }

      if (this.pressingBarName === 'lt') {
        this.el.style.top = calcedTop + 'px'
        this.el.style.left = calcedLeft + 'px'
      }

      if (this.pressingBarName === 'top' || this.pressingBarName === 'rt') {
        this.el.style.top = calcedTop + 'px'
        calcedWidth = calcedHeight * this.initialRatio
      }
      if (this.pressingBarName === 'left' || this.pressingBarName === 'lb') {
        this.el.style.left = calcedLeft + 'px'
        calcedHeight = Math.floor(calcedWidth / this.initialRatio)
      }
      this.el.style.width = calcedWidth + 'px'
      this.el.style.height = calcedHeight + 'px'
    } else {
      if (this.pressingBarName === 'right' || this.pressingBarName === 'rt') {
        this.el.style.width = calcedWidth + 'px'
      }
      if (this.pressingBarName === 'bottom') {
        this.el.style.height = calcedHeight + 'px'
      }
      if (this.pressingBarName === 'rb') {
        this.el.style.width = calcedWidth + 'px'
        this.el.style.height = calcedHeight + 'px'
      }
      if (this.pressingBarName === 'lb') {
        this.el.style.height = calcedHeight + 'px'
      }
      if (
        this.pressingBarName === 'top' ||
        this.pressingBarName === 'lt' ||
        this.pressingBarName === 'rt'
      ) {
        this.el.style.top = calcedTop + 'px'
        this.el.style.height = calcedHeight + 'px'
      }
      if (
        this.pressingBarName === 'left' ||
        this.pressingBarName === 'lb' ||
        this.pressingBarName === 'lt'
      ) {
        this.el.style.left = calcedLeft + 'px'
        this.el.style.width = calcedWidth + 'px'
      }
    }

    this.getComputedStyle()
  }
  mouseMoving(e) {
    if (this.ready) {
      e.preventDefault()
      this.calcMove(e)
    }
    // when mousedown
    if (this.ready && e.buttons == 1) {
      // if (this.ready) {
      // is draging bar
      this.calcMove(e)
    }
  }
  mouseLeft() {
    // this.ready = false
    if (!this.ready) {
      this.removeDivs()
    }
  }
  genDiv(position) {
    if (this.divs.find(div => div.pos === position)) {
      return
    }
    const div = document.createElement('div')
    div.setAttribute('class', 'v-resize-bar' + ' v-bar-' + position)
    div.setAttribute('data-pos', position)
    div.setAttribute('draggable', false)
    this.attachBarEvent(div)
    this.divs.push({
      pos: position,
      div: div
    })
  }
  removeDivs() {
    this.el.querySelectorAll('.v-resize-bar').forEach(bar => bar.remove())
  }
  attachBarEvent(bar) {
    bar.addEventListener('mousedown', this.mouseDownFunc)
    bar.addEventListener('mouseup', this.mouseUpFunc)
  }
  removeBarEvent() {
    for (var divIndex = 0; divIndex < this.divs.length; divIndex++) {
      this.divs[divIndex].removeEventListener('mousedown', this.mouseDownFunc)
      this.divs[divIndex].removeEventListener('mouseup', this.mouseUpFunc)
    }
  }
  genSideHandler() {
    this.options.bars.forEach(barName => {
      this.genDiv(barName)
    })
    this.divs.forEach(div => {
      if (this.modeBars[this.mode].indexOf(div.pos) > -1) {
        this.el.appendChild(div.div)
      }
    })
  }
  removeElEvents() {
    // pc events
    document.documentElement.removeEventListener('mousemove', this.movingFunc)
    this.el.removeEventListener('mouseenter', this.mouseEnterFunc)
    this.el.removeEventListener('mouseleave', this.mouseLeftFunc)
    document.documentElement.removeEventListener('mouseup', this.mouseUpFunc)
    // mb events
    document.documentElement.removeEventListener(
      'touchstart',
      this.mouseDownFunc
    )
    document.documentElement.removeEventListener('touchmove', this.movingFunc)
    document.documentElement.removeEventListener('touchend', this.mouseUpFunc)
    document.documentElement.removeEventListener(
      'touchcancel',
      this.mouseUpFunc
    )
  }
  destory() {
    this.removeBarEvent()
    this.removeDivs()
    this.removeElEvents()
  }
  updateSize(size) {
    this.options.maxWidth = size.maxWidth
    this.options.maxHeight = size.maxHeight
  }
}

export default resizeBox
