// 根据设备尺寸动态计算设备rem基准值
(function (doc, win) {
  var docEl = doc.documentElement;
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  var recalc = function () {
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) {
      return true;
    }
    docEl.style.fontSize = 36 * (clientWidth / 360) + 'px';
  };
  if (!doc.addEventListener) {
    return true;
  }

  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

// 登录状态
let login = false

// 登录请求
$.ajax({
  url: oPageConfig.oPageUrl.loginUrl,
  type: 'get'
}).done(function (msg) {
  if (msg) {
    login = true
  }
})

// 道具获取状态
$.ajax({
  url: oPageConfig.oPageUrl.toolStatuUrl,
  type: 'get'
}).done(function (msg) {
  for (let i in msg.data) {
    if (msg.data[i]) {
      toolGotten(i)
    }
  }
})

// 点击查看栏目详情
$('.showDetail').click(function () {
  let index = $(this).attr('data-index')
  $(this).addClass('hide')
  let con = $('.info').eq(index)
  con.addClass('all-info')
  con.find('.mid').removeClass('ellipsis')
  con.find('.beh').removeClass('hide')
  con.find('.takeBack').removeClass('hide')
})

// 点击收回栏目详情
$('.takeBack').click(function () {
  let index = $(this).attr('data-index')
  $(this).addClass('hide')
  let con = $('.info').eq(index)
  con.removeClass('all-info')
  con.find('.mid').addClass('ellipsis')
  con.find('.beh').addClass('hide')
  con.find('.showDetail').removeClass('hide')
})

/* dialog */
let dialog_bg = $('.dialog-bg')
let option = $('.box')
let option1 = $('#box1')
let option2 = $('#box2')
let option3 = $('#box3')
let option4 = $('#box4')
let grayFlag = [
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false],
  [false, false]
]

/**
 * 判断相应栏目中的道具是否全部领取
 * @param {Number} index 
 */
function checkAllSelected (index) {
  let arr = grayFlag[index]
  for (let i in arr) {
    if (!arr[i]) {
      return false
    }
  }
  return true
}

/**
 * 判断第三个栏目中道具是否选中一个
 * @param {Number} index 
 */
function checkSingleSelected () {
  let arr = grayFlag[2]
  for (let i in arr) {
    if (arr[i]) {
      return true
    }
  }
  return false
}

// 活动关闭
$('.confirm').click(function () {
  $('.dialog-box').hide()
  dialog_bg.hide()
})

$('.hide').click(function () {
  $('.dialog-box').hide()
  dialog_bg.hide()
})

  // 道具点击获取
  option.find('.tool-item').on('click', function () {
    let isGotten = $(this).hasClass('gray')
    let self = $(this)
    let self_data_id = self.attr('data-id')
    let tag = self_data_id.charAt(0)
    if (isGotten || (!isGotten && tag === '3' && checkSingleSelected())) {
      let text = (tag === '3' && !isGotten) ? '亲，道具只能领取一个哦' : '亲，道具已经领取过了哦，请在您的邮箱中查看'
      $('.dialog-text').text(text)
      $('.dialog-box').show()
      dialog_bg.show()
      return
    }
    if (!login) {
      $('.dialog-text').text('亲，您还没有登录哦，请先登录后重试')
      $('.dialog-box').show()
      dialog_bg.show()
    }
    let index = self_data_id.charAt(2)
    let target
    let url = oPageConfig.oPageUrl.optionUrl[tag]
    if (tag === '1') {
      index === 'e' ? target = option1.find('.tool-item') : target = self
    } else if (tag === '2') {
      index === 'e' ? target = option2.find('.tool-item') : target = self
    } else if (tag === '3') {
     target = self
    } else if (tag === '4') {
      index === 'e' ? target = option4.find('.tool-item') : target = self
    }

    function adapt () {
      let tempFlagArr = grayFlag[parseInt(tag) - 1]
      if (tag !== '3') {
        target.addClass('gray')
        if (index !== 'e') {
          tempFlagArr[parseInt(index) - 1] = true
          if (checkAllSelected(parseInt(tag) - 1)) {
            self.parent().find('.tool-item').last().addClass('gray')
          }
        }
        return
      }
      if (!checkSingleSelected()) {
        tempFlagArr[parseInt(index) - 1] = true
        target.addClass('gray')
      }
    }

    // 弹出确定框
    $.ajax({
      url,
      type: 'get'
    }).done(function (msg) {
      var text = msg.data.single_text
      if (msg.code === '0') {
        adapt()
        $('.dialog-text').text(text)
        $('.dialog-box').show()
        dialog_bg.show()
      } else if (msg.code === '1') {
        $('.dialog-text').text('亲，您的账户不符合领取条件哦')
        $('.dialog-box').show()
        dialog_bg.show()
      } else if (msg.code === '2') {
        $('.dialog-text').text('很抱歉，当前网络异常，请稍后重试')
        $('.dialog-box').show()
        dialog_bg.show()
      }
    })
  })
