$(function () {
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })
    var form = layui.form
    var layer = layui.layer
    form.verify({
        //自定义一个叫pwd的校验规则
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位。且不能出现空格"],
        repwd: function (value) {
            //[name=password]是jquery里的选择器，语法： [属性名=属性值]
            var pwd = $(".reg-box [name=password]").val()
            if (pwd !== value) {
                return "两次密码不一致！"
            }
        }
    })
    //注册请求
    $("#form_reg").on("submit", function (e) {
        e.preventDefault()
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val(),
        }
        $.post(
            "/api/reguser",
            data,
            function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜你注册成功，去登陆！")
                $("#link_login").click()
            }
        )
    })
    //登录请求
    $("#form_login").submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            //获取表单数据
            data: $("#form_login").serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("登录失败！")
                }
                layer.msg("登录成功！")
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem("token", res.token)
                //跳转页面
                location.href = "/index.html"
            }
        })
    })




})