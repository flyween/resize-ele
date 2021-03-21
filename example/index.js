import './index.less'

import resize from '../src/main'

new resize(document.querySelector('.main-box1'), {
  bars: ['bottom', 'right', 'rb', 'rt', 'lb', 'lt', 'left', 'top'],
  //   keepRatio: true,
  minWidth: 400,
  minHeight: 42
})

new resize(document.querySelector('.main-box2'), {
  bars: ['bottom', 'right', 'rb', 'rt', 'lb', 'lt', 'left', 'top'],
  keepRatio: true,
  minWidth: 400,
  minHeight: 42
})
