$(function () {
    //表单认证
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新旧密码不能相同"
            }
        },
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次密码不一致！"
            }
        }
    })
    // 重置密码请求
    $(".layui-form").on("submit", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),//快速获取表单的值oldPwd=&newPwd=&rePwd=
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("密码重置失败！")
                }
                // console.log(res);
                layer.msg("密码重置成功！")
                $(".layui-form")[0].reset()
            }
        })
        
        // setTimeout(function(){
        //     window.parent.$("#btnLogout").click()
        // },2000)
    })
})