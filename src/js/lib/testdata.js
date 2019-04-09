+function () {
    $.ajax = function (options) {
        var dfd = $.Deferred(),
            data = {},
            url = options.url,
            code = '0',
            message

        if (url.indexOf('/login') > -1) {
            code = '0'
            message = 'login ok'
            data = {
                id: '1',
                login_ok: '0'
            }
        }
        if (url.indexOf('/server') > -1) {
            code = '0'
            message = 'server ok'
            data = {
                id: '1',
                server_ok: '0'
            }
        }
        if (url.indexOf('/toolStatu') > -1) {
            code = '0'
            message = 'status ok'
            data = {
                '1': false,
                '2': false,
                '3': false,
                '4': false
            }
        }
        if (url.indexOf('/option1') > -1) {
            code = '0'
            message = 'option1 ok'
            data = {
                id: '1',
                single_text: '领取成功!道具已发送到您的邮箱中'
            }
        }
        if (url.indexOf('/option2') > -1) {
            code = '0'
            message = 'option2 ok'
            data = {
                id: '1',
                single_text: '领取成功!道具已发送到您的邮箱中'
            }
        }
        if (url.indexOf('/option3') > -1) {
            code = '0'
            message = 'option3 ok'
            data = {
                id: '1',
                single_text: '领取成功!道具已发送到您的邮箱中'
            }
        }
        if (url.indexOf('/option4') > -1) {
            code = '0'
            message = 'option4 ok'
            data = {
                id: '1',
                single_text: '领取成功!道具已发送到您的邮箱中'
            }
        }
        console.log('$.ajax', url, options, {
            code: code,
            message: message,
            data: data
        })
        dfd.resolve({
            code: code,
            message: message,
            data: data
        })
        return dfd
    }
}()