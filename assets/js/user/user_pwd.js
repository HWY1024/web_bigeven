$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        newPwd: function(value) {
            var oldPwd = $('#oldPwd').val()
            if (value === oldPwd)
                return '新旧密码不能相同'
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val())
                return '两次密码输入不一致'
        }
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('更新密码失败')
                $('.layui-form')[0].reset();
                //解决不能跳出ifame框架的问题
                if (window != top)
                    top.location.href = '/login.html';
            }
        })
    })
})