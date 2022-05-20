$(function() {
    getCategory()

    // 请求表单数据
    function getCategory() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                var tpl = template('tpl', res)
                $('tbody').html(tpl)
            }
        })
    }

    // 类别添加弹出层
    var form = layui.form
    var layer = layui.layer
    var indexAdd = null
    $('#btnAddCategory').on('click', function() {
        indexAdd = layer.open({
            title: '文章类别添加',
            type: 1,
            area: ['500px', '300px'],
            content: $('#dialog_add').html()
        });
    })

    // 提交添加分类请求
    //因为表单是通过script添加进去的，需要通过代理的方式来写
    $('body').on('submit', '#addCategory_form', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0)
                //执行return直接跳出
                    return layer.msg('添加类别失败')
                getCategory()
                layer.msg('添加类别成功')
                layer.close(indexAdd)
            }
        })
    })

    // 类别操作弹出层
    var indexOperate = null
    $('body').on('click', '#btnOperate', function() {
        indexOperate = layer.open({
            title: '文章类别操作',
            type: 1,
            area: ['500px', '300px'],
            content: $('#dialog_Operate').html()
        });
        var id = $(this).attr('data-id')
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // var t = $('#id').val(id);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败')
                }
                form.val('form_edit', res.data)
            }
        })
    })

    $('body').on('submit', '#form_edit', function(e) {
            e.preventDefault()
            $.ajax({
                type: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0)
                        return layer.msg('修改失败')
                    layer.msg('修改成功')
                    layer.close(indexOperate)
                    getCategory()
                }
            })
        })
        //点击重置
    $('body').on('click', '#btn_set', function(e) {
        e.preventDefault()
        var id = $('#id').val()
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('重置数据失败')
                }
                form.val('form_edit', res.data)
            }
        })
    })
    $('body').on('click', '#btn_delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除该分类?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    layer.close(index);
                    getCategory()
                }
            })
        });
    })
})