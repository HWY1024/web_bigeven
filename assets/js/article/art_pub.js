$(function() {
    // console.log(window.location.href);
    var layer = layui.layer
    loadSelect()
        // 初始化富文本编辑器
    initEditor()

    // 解决layui不显示下拉框等问题
    function loadSelect() {
        layui.use('form', function() {
            var form = layui.form;
            form.render();
        });
    }

    initCate()

    // 获取文章类别数据并填充
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('获取文章类别失败')
                var tpl_cate = template('tpl_cate', res)
                $('[name=cate_id]').html(tpl_cate)
                loadSelect()

            }
        })
    }


    function add(e) {
        e.preventDefault();
        // 1. 初始化图片裁剪器
        var $image = $('#image')

        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image.cropper(options)

        $('#selectPic').on('click', function() {
            $('#file').click()
        })
        $('#file').on('change', function(e) {
            var filesList = e.target.files
                // console.log(e.target.files)
                // console.log(e.target.files[0])
            if (filesList.length === 0)
                return layer.msg('请选择图片')

            // 拿到用户选择的文件
            var file = e.target.files[0]

            // 根据选择的文件，创建一个对应的 URL 地址
            var newImgURL = URL.createObjectURL(file)

            // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域

        })
        var art_state = '已发布'
        $('#btnSave').on('click', function() {
            art_state = '存为草稿'
        })
        var fd = new FormData($(this)[0])
            //$this表示将当前表单传入formdata对象
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                pubListArticle(fd)
            })

        function pubListArticle(fd) {
            $.ajax({
                type: 'post',
                url: '/my/article/add',
                data: fd,
                //必须加下面这俩
                contentType: false, //不设置数据格式
                processData: false, //不需要对数据做任何预处理
                success: function(res) {
                    if (res.status !== 0)
                        return layer.msg('发布文章失败')
                    layui.layer.msg('发布文章成功')
                    location.href = "/article/art_list.html"
                }
            })
        }

    }

    function edit(e) {
        e.preventDefault();

        var $image = $('#image')
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        $image.cropper(options)
        var art_state = '已发布'
        $('#btnSave').on('click', function() {
            art_state = '存为草稿'
        })
        var fd = new FormData($(this)[0])
            //$this表示将当前表单传入formdata对象
        fd.append('state', art_state)
        var img = $(this).attr('src', 'data-id')
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                // fd.append('cover_img', blob)
                fd.append('cover_img', img)
                fd.append('Id', targetPageId)
                    // 6. 发起 ajax 数据请求
                pubListArticle(fd)
            })

        function pubListArticle(fd) {
            $.ajax({
                type: 'post',
                url: '/my/article/edit',
                data: fd,
                //必须加下面这俩
                contentType: false, //不设置数据格式
                processData: false, //不需要对数据做任何预处理
                success: function(res) {
                    if (res.status !== 0)
                        return layer.msg('更新文章失败')
                    layui.layer.msg('更新文章成功')
                    location.href = "/article/art_list.html"
                }
            })
        }

    }

    var form = layui.form

    var searchURL = window.location.search;
    searchURL = searchURL.substring(1, searchURL.length);
    var targetPageId = searchURL.split("&")[0].split("=")[1];

    if (targetPageId == null)
        $('#form_pub').on('submit', add)
    else {
        $.ajax({
            type: 'get',
            url: '/my/article/' + targetPageId,
            contentType: false, //不设置数据格式
            processData: false, //不需要对数据做任何预处理
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('文章数据获取失败')
                layer.msg('文章数据获取成功')
                form.val('form_pub', res.data)
            }
        })
        $('#form_pub').on('submit', edit)

        // uploads/upload_65dfaaf83f8d7d6ae7f6b90bcf39fa1a"
        // uploads/upload_8f66c3e116261f222894d26962df499a"
    }
})