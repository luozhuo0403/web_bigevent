$(function () {
    var form = layui.form
    var layer = layui.layer
    //layUI里的表单认证方法
    form.verify({
        nickname: function (value) {  //value：表单的值
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
    // 获取用户信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("获取用户信息失败！")
                }
                //   console.log(res);
                //调用 form.val() 方法为表单赋值，就是把用户登录的信息渲染到表单上
                form.val("formUserInfo", res.data)
            }
        })
    }
    initUserInfo()

    //重置功能
    $("#btnReset").on("click", function (e) {
        e.preventDefault()
        initUserInfo()
    })
    //提交功能
    //监听表单提交事件
    $(".layui-form").on("submit", function(e){
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if(res.status != 0) {
                    return layer.msg("修改用户信息失败！")
                }
                layer.msg("修改用户信息成功！")
                //修改信息后渲染头像,window是这个页面，这个页面的parent是index页面，getUserInfo()函数在index页面里
                window.parent.getUserInfo()
            }
        })
   
    })




})