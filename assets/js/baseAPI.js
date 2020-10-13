//当使用jQuery发起请求时，都会调用此函数，在这个函数中，可以拿到我们给Ajax提供的配置对象，然后进行修改路径
$.ajaxPrefilter(function (options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url
    // console.log(options.url);
    //统一设置如果发起请求时需要权限的添加请求头
    if (options.url.indexOf("/my/") != -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    //统一执行complete 回调函数
    options.complete = function (res) {
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            //强制删除本地的token
            localStorage.removeItem("token")
            //强制跳出到登录页面
            location.href = "/login.html"
        }
    }
})