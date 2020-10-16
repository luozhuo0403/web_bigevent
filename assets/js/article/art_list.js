$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    //定义美化时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //补零
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }

    var q = {
        pagenum: 1,// 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: "",// 文章分类的 Id
        state: "",// 文章的发布状态
    }
    //获取文章的列表，打开页面，渲染已经有的文章数据
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章的列表失败！")
                }
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用分页渲染函数
                readerPage(res.total)
            }
        })
    }
    initTable()

    // 初始化文章分类的方法，将文章分类渲染到下拉菜单中
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    initCate()

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义分页渲染的方法
    function readerPage(total) {
        laypage.render({
            elem: 'pageBox', //渲染到哪，存放的容器
            count: total, //列表总条数
            limit: q.pagesize, //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //当页码发生切换时，触发执行回调函数
            jump: function (obj, first) {
                // console.log(obj.curr);
                // console.log(first);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //首次不执行 ， first默认是true， 点击之后，变成undefined，执行下面if语句，渲染之后，first变回true,这样就不会造成死循环
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //删除功能
    $("tbody").on("click", ".btn-delete", function () {
          //获取删除按钮个数
        var len = $(".btn-delete").length
        // console.log(len);
        var id = $(this).attr("data-id")
        //弹出询问框
        layer.confirm('是否要删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg("删除失败！")
                    }
                    layer.msg("删除成功！")
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })


})