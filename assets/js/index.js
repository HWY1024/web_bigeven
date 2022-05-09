$(function() {
    getUserInfo()
    var layer = layui.layer;
    $('#exit').on('click', function() {
        // return layui.layer.confirm('退出成功')
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            layer.close(index);
            localStorage.removeItem('token')
            location.href = '/login.html'
        });
    })
})

function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('登录失败!')
            }
            console.log(res)
            RenderAvatar(res.data)
        },
        // complete: function(res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}
// 更新用户头像
function RenderAvatar(user) {
    // 获取用户的真实名称或者是昵称
    var name = user.nickname || user.username;
    $('#welcome').html('&nbsp&nbsp欢迎&nbsp&nbsp' + name[0] + '哥')
        // 判断用户头像
    var pic = user.user_pic;
    if (pic !== null) {
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        $('.layui-nav-img').hide()
        $('.text-avatar').html(name[0].toUpperCase()).show()
    }
}

function exit() {
    var layer = layui.layer;
    $('#exit').on('click', function() {
        // return layui.layer.confirm('退出成功')
        layer.confirm(function(index) {
            layer.close(index);
            localStorage.removeItem('token')
            location.href = '/login.html'
        });
    })
}