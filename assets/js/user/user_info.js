$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 7)
                return '昵称长度在0-6之间'
        }
    })


    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('获取用户信息失败')
                form.val('formUserInfo', res.data)
            }
        })
    }
    initUserInfo()

    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('更新用户信息失败')
                else {
                    layer.msg('更新用户信息成功');
                    //调用父页面方法
                    window.parent.getUserInfo()
                }

            }
        })
    })
})