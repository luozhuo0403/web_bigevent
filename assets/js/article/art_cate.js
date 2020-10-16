$(function () {
    var layer = layui.layer
    var form = layui.form
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
            }
        })
    }
    initArtCateList()

    //添加类别按钮绑定事件，layUI里的方法
    var indexAdd = null
    $("#btnAddCate").on("click", function () {
        // 弹出层
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '300px'],
            content: $("#dialog-add").html()
        });
    })
    //表单提交监听事件
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败！")
                }
                layer.msg("新增分类成功！")
                initArtCateList()
                //关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    //编辑功能
    var indexEdit = null
    $("tbody").on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '300px'],
            content: $("#dialog-edit").html()
        })
        var id = $(this).attr("data-id")
        var name = $(this).attr("data-name")
        var alias = $(this).attr("data-alias")
        // 表单赋值 layUI里的方法form.val('表单id', object)
        form.val('form-edit', {
            Id: id,
            name: name,
            alias: alias
        })
    })
    //点击确认修改功能
    $("body").on("submit", '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // console.log(res);
                    return layer.msg("更新分类失败！")
                }
                layer.msg("更新分类成功！")
                //关闭弹出层
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    //删除功能
    $("tbody").on("click", ".btn-delete", function () {
        var id = $(this).attr("data-id")
        layer.confirm('是否要删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        // console.log(res);
                        return layer.msg("删除失败！")
                    }
                    layer.msg("删除成功！")
                    //关闭弹出层
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })



})