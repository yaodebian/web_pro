document.addEventListener('DOMContentLoaded', function (e) {
  document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
})

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
$('.showDetail').click(function (ev) {
  let index = $(ev.target).attr('data-index')
  $(ev.target).addClass('hide')
  let con = $('.info').eq(index)
  con.find('.mid').removeClass('ellipsis')
  con.find('.beh').removeClass('hide')
  con.find('.takeBack').removeClass('hide')
})

// 点击收回栏目详情
$('.takeBack').click(function (ev) {
  let index = $(ev.target).attr('data-index')
  $(ev.target).addClass('hide')
  let con = $('.info').eq(index)
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

// 活动关闭
$('.confirm').on('click', function () {
  $('.dialog-box').hide()
  dialog_bg.hide()
})

$('.hide').on('click', function () {
  $('.dialog-box').hide()
  dialog_bg.hide()
})

// 道具点击获取
option.find('.tool-item').on('click', function () {
  let isGotten = $(this).hasClass('gray')
  if (isGotten) {
    $('.dialog-text').text('亲，道具已经领取过了哦，请在您的邮箱中查看！！！')
    $('.dialog-box').show()
    dialog_bg.show()
    return
  }
  if (!login) {
    $('.dialog-text').text('亲，您还没有登录哦，请先登录后重试！！！')
    $('.dialog-box').show()
    dialog_bg.show()
  }
  let self = $(this)
  let self_data_id = self.attr('data-id')
  let tag = self_data_id.charAt(0)
  let all
  let url = oPageConfig.oPageUrl.optionUrl[tag]
  if (tag === '1') {
    all = option1.find('.tool-item')
  } else if (tag === '2') {
    all = option2.find('.tool-item')
  } else if (tag === '3') {
    all = option3.find('.tool-item')
  } else if (tag === '4') {
    all = option4.find('.tool-item')
  }
  // 弹出确定框
  $.ajax({
    url,
    type: 'get'
  }).done(function (msg) {
    var text = msg.data.single_text
    if (msg.code === '0') {
      all.addClass('gray')
      $('.dialog-text').text(text)
      $('.dialog-box').show()
      dialog_bg.show()
    } else if (msg.code === '1') {
      $('.dialog-text').text('亲，您的账户不符合领取条件哦！！！')
      $('.dialog-box').show()
      dialog_bg.show()
    } else if (msg.code === '2') {
      $('.dialog-text').text('很抱歉，当前网络异常，请稍后重试！！！')
      $('.dialog-box').show()
      dialog_bg.show()
    }
  })
})
