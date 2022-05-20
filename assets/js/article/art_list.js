$(function() {
    layui.use('form', function() {
        var form = layui.form;
        form.render();
    });
    var layer = layui.layer
    var form = layui.form

    // 定义时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1,
        pagesize: 10,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()

    //获取文章列表
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('成功')
                console.log(res)
                var data = template('tpl', res)
                    // console.log(data)
                $('tbody').html(data)
                renderPage(res.total)
            }
        })
    }

    //获取文章分类
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('获取失败')
                else {
                    var initCateTpl = template('initCateTpl', res)
                    $('[name=cate_id]').html(initCateTpl)
                        // console.log(layui.$.fn.jquery);
                    layui.use('form', function() {
                        var form = layui.form;
                        form.render();
                    });
                }
            }
        })
    }
    //为筛选绑定表单事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();

        //获取已选中的下拉框中的value
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        //再将获取到的值赋给查询参数对象
        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    function renderPage(total) {
        layui.use(['layer', 'form', 'element', 'laypage'], function() {
            var layer = layui.layer,
                form = layui.form,
                element = layui.element,
                laypage = layui.laypage

            laypage.render({
                elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: q.pagesize,
                curr: q.pagenum,
                layout: ['count', 'limit', 'prev', 'page', 'next', '', 'skip'],
                limits: [3, 5, 8, 12],
                jump: function(obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit //得到每页显示的条数

                    if (!first) {
                        // if()
                        //do something
                        initTable()
                    }
                }
            });
        });
    }

    //完善删除功能
    $('body').on('click', '#btnDelete', function() {
        var id = $(this).attr('data-id')
        var len = $('#btnDelete').length
        layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0)
                        return layer.msg('删除失败')
                    layer.msg('删除成功')
                    if (len === 1) {
                        q.pagesize = q.pagesize === 1 ? 1 : q.pagesize - 1
                            //如果页码值等于1，那么就不需要再减了。
                            //如果页码值不等于1，那就给他减1
                        initTable()
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

    //完善文章编辑功能

    $('body').on('click', '#btnEdit', function() {
        // cookie.setCookie('num', id);
        var id = $(this).attr('data-id')
        location.href = "/article/art_pub.html?id=" + id
            // console.log(window.location.href);
    })

    function getid() {
        var id = $(this).attr('data-id')
        console.log('id')
    }
})