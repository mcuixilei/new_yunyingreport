if ("undefined" == typeof PDCY || !PDCY) var PDCY = {};
PDCY.namespace = function() {
    var i, j, d, a = arguments,
    o = null;
    for (i = 0; i < a.length; i += 1) for (d = ("" + a[i]).split("."), o = PDCY, j = "PDCY" == d[0] ? 1 : 0; j < d.length; j += 1) o[d[j]] = o[d[j]] || {},
    o = o[d[j]];
    return o;
};
PDCY.namespace("carousel"),
PDCY.carousel = function(){
    var glume = function(banners_id, focus_id) {
        this.$ctn = $('#' + banners_id);
        this.$focus = $('#' + focus_id);
        this.$adLis = null;
        this.$btns = null;
        this.switchSpeed = 5;//自动播放间隔(s)
        this.defOpacity = 1;
        this.crtIndex = 0;
        this.adLength = 0;
        this.timerSwitch = null;
        this.init();
    };
    glume.prototype = {
        fnNextIndex : function() {
            return (this.crtIndex >= this.adLength - 1) ? 0 : this.crtIndex + 1;
        },
        //动画切换
        fnSwitch : function(toIndex) {
            if (this.crtIndex == toIndex) {
                return;
            }
            this.$adLis.css('zIndex', 0);
            this.$adLis.filter(':eq(' + this.crtIndex + ')').css('zIndex', 2);
            this.$adLis.filter(':eq(' + toIndex + ')').css('zIndex', 1);
            this.$btns.removeClass('on');
            this.$btns.filter(':eq(' + toIndex + ')').addClass('on');
            var me = this;

            $(this.$adLis[this.crtIndex]).animate({
                opacity : 0
            }, 1000, function() {
                me.crtIndex = toIndex;
                $(this).css({
                    opacity : me.defOpacity,
                    zIndex : 0
                });
            });
        },
        fnAutoPlay : function() {
            this.fnSwitch(this.fnNextIndex());
        },
        fnPlay : function() {
            var me = this;
            me.timerSwitch = window.setInterval(function() {
                me.fnAutoPlay();
            }, me.switchSpeed * 1000);
        },
        fnStopPlay : function() {
            window.clearTimeout(this.timerSwitch);
            this.timerSwitch = null;
        },
        init : function() {
            this.$adLis = this.$ctn.children();
            this.$btns = this.$focus.children();
            this.adLength = this.$adLis.length;

            var me = this;
            //点击切换
            this.$focus.on('click', 'a', function(e) {
                e.preventDefault();
                var index = parseInt($(this).attr('data-index'), 10);
                me.fnSwitch(index);
            });
            this.$adLis.filter(':eq(' + this.crtIndex + ')').css('zIndex', 2);
            this.fnPlay();

            //hover时暂停动画
            this.$ctn.hover(function() {
                me.fnStopPlay();
            }, function() {
                me.fnPlay();
            });
        }
    };
    return glume;
},
PDCY.namespace("app.slideNav"),
PDCY.app.slideNav = {
    init : function(){
    	var pageCode = ["8","88","18","28","38","68","98"];/*从左到右分别对应首页、投资、借款、新手指引、关于、我的账户、帮助*/
       	var currentCode = $("#page-identify").text();
    	for (var identy = 0;identy<pageCode.length;identy++){
    		if(pageCode[identy] == currentCode ){
				if (identy<5)
					$(".nav-main-item:eq("+identy+")").addClass("current");
				else if (identy == 5){
					$(".mod-link-account").css({"background":"none repeat scroll 0% 0% #16AFEE","border":"1px solid #16AFEE","color":"#FFF"});
					$(".homePage").addClass("current");
				}
				else
	    			$(".homePage").addClass("current");
				}
    	}
        /*滑动导航*/
        var $navcur = $(".J-nav-current");
        var $nav = $("#J-nav-menu");
        var current = ".current";
        var itemW = $nav.find(current).innerWidth();    //默认当前位置宽度
        if($nav.find(current).position())
        {	
           var defLeftW = $nav.find(current).position().left;  //默认当前位置Left值
           //添加默认下划线
          $navcur.css({width:itemW,left:defLeftW});
        }

        //hover事件
        $nav.find("li").hover(function(){
            var index = $(this).index();    //获取滑过元素索引值
            var leftW = $(this).position().left;    //获取滑过元素Left值
            var currentW = $nav.find("a").eq(index).innerWidth();   //获取滑过元素Width值
            $navcur.stop().animate({
                left: leftW,
                width: currentW
            },300);
            
        },function(){
            $navcur.stop().animate({
                left: defLeftW,
                width: itemW
            },300);
        });
    }
},
PDCY.namespace("tabSwitch"),
PDCY.tabSwitch = {
    init:function (titId,cntId){
        var tabItem = $('#' + titId).children('li');
        tabItem.each(function(i){
            $(this).on('click',function(event){
                event.preventDefault();
                tabItem.removeClass('current').eq(i).addClass('current');
                $('#' + cntId).children().hide().eq(i).show();
            });
        });
    }
};
$(function(){
    if(typeof($('#adSwitch')[0]) != 'undefined'){
        $('#adSwitch').switchCarousel();
    };
    if(typeof(authModeType) != "undefined"){
        if(authModeType.email!=null&&authModeType.email!=''){
            $('#verFind').attr('data-rel','email');
            var emailInput = $('.email-verify').find('#email');
            emailInput.val(authModeType.email);
            emailInput.attr('readonly',true);
        }else if(authModeType.mobile!=null&&authModeType.mobile!=''){
            $('#verFind').attr('data-rel','phone');
            var mobileInput = $('.phone-verify').find('#pwdMobile');
            mobileInput.val(authModeType.mobile);
            mobileInput.attr('readonly',true);
        }
    }
    $('#getCodeButton').click(function(){
        Util.Countdown($('#getCodeButton'));
    });
}),
PDCY.namespace("jsLoader"),
PDCY.jsLoader = function(url, callback, ecall) {
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
        script, options, o, scriptsArray = [];
    if (typeof url === "object") {
        options = url;
        url = undefined
    };
    o = options || {};
    url = url || o.url;
    var path = url.split(",");
    callback = callback || o.success;
    for (var i = 0; i < path.length; i++) {
        str = path[i].slice(path[i].lastIndexOf('/') + 1);
        name = str.substring(0, str.indexOf("."));
        script = document.createElement("script");
        script.async = o.async || false;
        script.type = "text/javascript";
        if (o.charset) script.charset = o.charset;
        if (o.cache === false) {
            path[i] = path[i] + (/\?/.test(path[i]) ? "&" : "?") + "time=" + (new Date()).getTime()
        };
        script.src = (path[i].indexOf("/") == '-1' ? true : false) === true ? Util.config.JSfile + path[i] : path[i];
        head.appendChild(script)
    };
    if ('function' == typeof callback) {
        document.addEventListener ? script.addEventListener("load", function() {
            callback();
            script.onload = null;
            script.parentNode.removeChild(script)
        }, false) : script.onreadystatechange = function() {
            if (/loaded|complete/.test(script.readyState)) {
                callback();
                script.onreadystatechange = null
            }
        }
    };
    if (ecall) {
        script.onerror = function() {
            script = null;
            if ('function' == typeof ecall) ecall()
        }
    }
};
$(function(){
	(function ($){
	    $.fn.pjsPlaceholder=function(){
	      $('.J-input').each(function() {
	          if($(this).val()!=''){
	            $(this).siblings('.J-placeholder').hide();
	          }
	      });
	      $('.J-placeholder').click(function() {
	        $(this).siblings('.J-ui-input').focus();
	        $(this).hide();
	      });
	      $('.J-ui-input').focus(function() {
	        if ($(this).val() == '') {
	          $(this).siblings('.J-placeholder').hide();
	        }
	      }).blur(function() {
	        if ($(this).val() == '') {
	          $(this).siblings('.J-placeholder').show();
	        }
	      });
	    };
	    $.fn.pjsPlaceholder();
	})(jQuery);
})


$(function(){
    $(document).on('click',function(a) {
        var $src = $(a.target || event.srcElement);
        if ($src.closest(".J_select_btn").length > 0 || $(".J_se lect_btn").hasClass("cus-sel-active")) return;
        if($('.J_select_btn').hasClass('cus-sel-active')) $('.J_select_btn').removeClass("cus-sel-active");
    });
    $(".J_select_btn").on('click',function(a) {
        $(this).toggleClass("cus-sel-active");
        $(this).parent().siblings().children().removeClass('cus-sel-active');
        $(this).siblings().removeClass('cus-sel-active');
    });
    $(".J_select-ctn").on('click','li',function(a) {
        var $src = $(a.target || event.srcElement);
        var d = $(this).find("span").html();
        var c= $(this).find("span").attr('resultKey');
        e = $(this).parent().parent();
        e.find(".J_txt").attr('resultKey',c);
        if (e.find(".J_txt").html(d)) {
            return;
        };
    });
});



/*执行调用*/
$(function(){
    var slider =  PDCY.carousel();
    new slider('J-banners','J-focus');
    if(typeof($('#J-nav-menu')[0]) != 'undefined')PDCY.app.slideNav.init();
});
