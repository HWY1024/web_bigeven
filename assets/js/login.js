$(function() {
    $('#link_reg').on('click', function() {
        $('.login_box').hide()
        $('.reg_box').show()
    })
    $('#link_login').on('click', function() {
            $('.reg_box').hide()
            $('.login_box').show()
        })
        // 定义表单验证
    var form = layui.form
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }
                //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
                if (value === '逼') {
                    alert('用户名不能为敏感词');
                    return true;
                }
            }
            //我们既支持上述函数式的方式，也支持下述数组的形式
            //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
            ,
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repassword: function(value) {
            var password = $('#password').val()
            if (password != value) {
                return '两次密码输入不一致!'
            }
        }
    });
    var layer = layui.layer
        // 发起注册请求
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            $.post(
                '/api/reguser', {
                    username: $('#username').val(),
                    password: $('#password').val()
                },
                function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('注册成功')
                        // 模拟人的点击行为
                    $('#link_login').click()
                }
            )
        })
        // 发起登录请求
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.post(
            '/api/login',
            $(this).serialize(), //data
            function(res) {
                if (res.status !== 0) {
                    // console.log(res)
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                    // 将登陆成功得到的tokrn字符串添加到localStorage
                    // 有的接口需要权限
                    // console.log(res)
                    // console.log($(this).serialize())
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        )
    })
})