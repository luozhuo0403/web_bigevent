$(function () {
    var layer = layui.layer
    //获取用户基本信息
    function getUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            //在baseAPI.js里统一设置
            // headers: {
            //     Authorization: localStorage.getItem("token") || ""
            // },
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("获取用户信息失败！")
                }
                renderAvatar(res.data)
            },
            //在baseAPI.js中统一管理
            //无论是否获取成功，都会执行complete 回调函数
            //如果不经过登录直接进入index.html页面，强制跳转到登陆陆页面，必须经过身份验证才能进入
            // complete: function(res){
            //     // console.log(res);
            //     if(res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            //         //强制删除本地的token
            //         localStorage.removeItem("token")
            //         //强制跳出到登录页面
            //         location.href = "/login.html"
            //     }
            // }
        })
    }
    getUserInfo()
    //渲染头像
    function renderAvatar(user) {
        //获取用户名
        var name = user.nickname || user.username
        //设置用户名
        $("#welcome").html(name)
        //获取用户名的第一个字母，并设置成大写
        var first = name[0].toUpperCase()
        //设置里面的内容为用户名的第一个字母
        $(".text-avatar").html(first)
        //如果没有头像就显示字母头像
        if (user.user_pic != null) {
            $(".text-avatar").hide()
            $(".layui-nav-img").attr("src", user.user_pic).show()
        } else {
            $(".text-avatar").show()
            $(".layui-nav-img").hide()
        }
    }
    //实现点击退出功能
    $("#btnLogout").on("click", function () {
        //弹出提示框
        layer.confirm('是否要退出?', { icon: 3, title: '提示' }, function (index) {
            //删除本地存储的token
            localStorage.removeItem("token")
            //跳转页面
            location.href = "/login.html"
            //layer自带固定写法，不要修改
            layer.close(index);
        });
    })


})