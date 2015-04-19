var danmu_from_sql=new Array();
var danmu_count=0;

	
 function htmlEncode(str) {
   var s = "";
   if (str.length == 0)
	   return "";
   s = str.replace(/&/g, "&gt;");
   s = s.replace(/</g, "&lt;");
   s = s.replace(/>/g, "&gt;");
   s = s.replace(/\"/g, "&quot;");
   s = s.replace(/\n/g, " ");
   return s;
}
;
(function($) {

	var DanmuPlayer = function(element, options) {
		this.$element = $(element);
		this.options = options;
		url_to_post_danmu = options.url_to_post_danmu;

		$(element).css({
			"position":"relative",
			"width":options.width+250,
			"height":options.height+52,
			"overflow":"hidden",
//			"border-width": "thin",
//			"border-bottom-color": "#555",
//			"border":"solid"
			"-moz-box-shadow":" 0px 0px 3px #555555",
			"box-shadow":" 0px 0px 3px #555555"
			
		});

		$(element).append('<video id="danmu_video" class="video-js vjs-default-skin" width="' + options.width + '" height="' + options.height + '"><source src="' + options.src + '" type="video/mp4" /></video>');
		danmu_video = videojs("#danmu_video", {
			"controls": true,
			"autoplay": false,
			"preload": "auto",
			"loop": false
		}, function() {
			// This is functionally the same as the previous example.

			$(".video-js").append('<div id="danmu71452" >');
			$(".vjs-live-controls").remove();


			function query() {
				$.get(options.url_to_get_danmu, function(data, status) {
					danmu_from_sql = eval(data);
					for (var i = 0; i < danmu_from_sql.length; i++) {
					try{
							var danmu_ls = eval('(' + danmu_from_sql[i] + ')');
							}catch(e){
								continue;
						}
						$('#danmu71452').danmu("add_danmu", danmu_ls);
						}	
					
				});
			};


			function initer() {
		
				this.on('loadstart',function(e) {

					$(".vjs-big-play-button").css({
						"z-index": "500"
					});
					$(".vjs-control-bar").css({
						"z-index": "500"
					});
					$("#danmu71452").danmu({
						left: 0,
						top: 0,
						width: "100%",
						height: "100%",
						zindex: 100,
						speed: options.speed,
						opacity: options.opacity,
						font_size_small: options.font_size_small,
						font_size_big: options.font_size_big,
						top_botton_danmu_time: options.top_botton_danmu_time
					});
										if (options.url_to_get_danmu)
						query();
					
				});
				

				this.on('play', function(e) {
					console.log('playback has started!');
					$('#danmu71452').data("nowtime", parseInt(danmu_video.currentTime() * 10));
					$('#danmu71452').danmu("danmu_resume");
					setTimeout("revise_time()",500)

				});


				this.on('pause', function(e) {
					console.log('playback has paused!');
					$('#danmu71452').danmu('danmu_pause');
				});

				this.on('waiting', function(e) {
					console.log('playback has waiting!');

					if (danmu_video.currentTime() == 0) {

						$('#danmu71452').data("nowtime", 0);
					} else {
						$('#danmu71452').data("nowtime", parseInt(danmu_video.currentTime() * 10));
					}
				});

				this.on('ended', function(e) {
					console.log('playback has ended!');
					$('#danmu71452').danmu('danmu_stop');
				});


				this.on('seeked', function(e) {
					$('#danmu71452').danmu('danmu_hideall');
					$('#danmu71452').data("nowtime", parseInt(this.currentTime() * 10));
				});
				
				this.on('resize', function(e) {
					var new_speed=parseInt(options.speed*(danmu_video.width()/options.width));	
					$('#danmu71452').data("speed",new_speed);
					console.log("resize width:",danmu_video.width());
				});
				
				
				
				
				
				
				this.on('fullscreenchange', function(e) {
					
					if(this.isFullscreen()){
						var new_speed=parseInt(options.speed*(screen.availWidth/options.width));	
					$('#danmu71452').data("speed",new_speed);
					console.log("fullscreen width:",screen.availWidth);
						
						$(".vjs-control-bar").css({"bottom":"0em"});
						$(".vjs-control-bar").css({"opacity":"0.7"});
$("#ctbcss").html("   .vjs-default-skin.vjs-has-started .vjs-control-bar { display: block; visibility: visible;opacity: 1;-webkit-transition: visibility 0.1s, opacity 0.1s;-moz-transition: visibility 0.1s, opacity 0.1s;-o-transition: visibility 0.1s, opacity 0.1s;transition: visibility 0.1s, opacity 0.1s;} .vjs-default-skin.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar { display: block;visibility:hidden;opacity:0;-webkit-transition: visibility 1s, opacity 1s; -moz-transition: visibility 1s, opacity 1s;-o-transition: visibility 1s, opacity 1s;transition: visibility 1s, opacity 1s;}")
					}
					else{
						var new_speed=parseInt(options.speed*(danmu_video.width()/options.width));	
					$('#danmu71452').data("speed",new_speed);
					console.log("resize width:",danmu_video.width());
							$(".vjs-control-bar").css({"bottom":"-4em"});
						$(".vjs-control-bar").css({"opacity":"1"});
						$("#ctbcss").html("   .vjs-default-skin.vjs-has-started .vjs-control-bar { display: block; visibility: visible;opacity: 1;-webkit-transition: visibility 0.1s, opacity 0.1s;-moz-transition: visibility 0.1s, opacity 0.1s;-o-transition: visibility 0.1s, opacity 0.1s;transition: visibility 0.1s, opacity 0.1s;} .vjs-default-skin.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar { display: block;visibility:visible;opacity:1;-webkit-transition: visibility 1s, opacity 1s; -moz-transition: visibility 1s, opacity 1s;-o-transition: visibility 1s, opacity 1s;transition: visibility 1s, opacity 1s;}")
					}
			
					
				});
				
				
			}

			videojs.plugin('initer', initer);
			this.initer({
				exampleOption: true
			});

			$("body").append("<div id='tip2' class='tipb' hidden='true'><form  id='danmu_position'>弹幕位置：<input type='radio' checked='checked'  name='danmu_position' value='0' />滚动&nbsp;&nbsp;<input type='radio' name='danmu_position' value='1' />顶端&nbsp;&nbsp;<input type='radio' name='danmu_position' value='2' />底端&nbsp;&nbsp;</form><form  id='danmu_size' >弹幕大小：<input   type='radio' checked='checked'  name='danmu_size' value='1' />大文字&nbsp;&nbsp;<input   type='radio' n name='danmu_size' value='0' />小文字&nbsp;&nbsp;</form>弹幕颜色：<br><div id='danmu_color' /></div></div><div id='tip22' class='tipb' hidden='true'>透明度：<input type='range' name='op' id='op' onchange='op()' value=100 ><br>显示弹幕:<input type='checkbox' checked='checked' id='ishide' value='is' onchange='changehide()'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;循环播放:<input type='checkbox' id='isloop' value='is' onchange='changeloop()'> </div> ");

			$(".vjs-control-bar").append('<span class="shezhi vjs-control " id="danmu_send_opt"><u>あ</u></span>');
			$(".vjs-control-bar").append('<input class="vjs-control"   role="botton" type="textarea" id="danmu_text" max=300 />'); // -> button あ 
			$(".vjs-control-bar").append('<a class=" send_btn"  id="send_danmu"  onclick="send_danmu();return false">发送 ></a>');

			$(".vjs-control-bar").append('<span  class="shezhi  vjs-control vjs-menu-button" id="danmu_shi_opt"  > 視 </span>');




			$(".shezhi").css({
				"cursor": "pointer",
				"font-family": "Microsoft YaHei,微软雅黑,MicrosoftJhengHei"
			});


			$("#danmu_text").css({
				"width": "40%",
				"left": "auto",
				"right": "auto",
				"font-family": "Microsoft YaHei,微软雅黑,MicrosoftJhengHei"
				
			});
			$("button").css({
				"font-family": "Microsoft YaHei,微软雅黑,MicrosoftJhengHei"
			});


			$('#danmu_send_opt').scojs_tooltip71452({
				appendTo: '.video-js',
				contentElem: '#tip2',
			});


			$('#danmu_shi_opt').scojs_tooltip71452({
				appendTo: '.video-js',
				contentElem: '#tip22',
	
			});

			$("#danmu_color").colpick({
				flat: true,
				layout: 'hex',
				submit: 0,
				onChange: function(hsb, hex, rgb, el, bySetColor) {
					danmu_color = "#" + hex
				}
			});
			
			$(".vjs-play-control").attr("id","play_btn");
	



		});



	};
	
		



	DanmuPlayer.DEFAULTS = {
		height: 450,
		width: 800,
		src: "shsn.mp4",
		speed: 20000,
		danmuss: {},
		default_font_color: "#FFFFFF",
		font_size_small: 16,
		font_size_big: 28,
		opacity: "1",
		top_botton_danmu_time: 6000,
		url_to_get_danmu: "",
		url_to_post_danmu: ""
	}



	function Plugin(option, arg) {
		return this.each(function() {
			var $this = $(this);
			var options = $.extend({}, DanmuPlayer.DEFAULTS, typeof option == 'object' && option);
			var data = $this.data('danmuplayer');
			var action = typeof option == 'string' ? option : NaN;
			if (!data) $this.data('danmuplayer', (data = new DanmuPlayer(this, options)))
			if (action) data[action](arg);
		})
	};


	$.fn.danmuplayer = Plugin;
	$.fn.danmuplayer.Constructor = DanmuPlayer;



})(jQuery);


var is_loop = false;
var url_to_post_danmu = "";
var danmu_color = "#ffffff";
jQuery(document).ready(function() {
	jQuery("body").keydown(function(event) {
		if (event.which == 13) {
			console.log("enter")
			send_danmu();
			return false
		}
	});
});

function send_danmu() {
	var text = document.getElementById('danmu_text').value;
	if (text.length==0){
		console.log("conn`t send")
		return;
	}
	text = text.replace(/&/g, "&gt;");
	text = text.replace(/</g, "&lt;");
	text = text.replace(/>/g, "&gt;");
	text = text.replace(/\"/g, "&quot;");
	text = text.replace(/\n/g, "<br>");
	var color = danmu_color;
	var position_select = jQuery("[name='danmu_position']").filter(":checked");
	var position = position_select.attr("value")
	var position_size = jQuery("[name='danmu_size']").filter(":checked");
	var size = position_size.attr("value");
	var time = jQuery('#danmu71452').data("nowtime") + 5;
	var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + '}';
	console.log(url_to_post_danmu);
	if (url_to_post_danmu)
		jQuery.post(url_to_post_danmu, {
			danmu: text_obj
		});
	var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + ',"isnew":""}';
	var new_obj = eval('(' + text_obj + ')');
	jQuery('#danmu71452').danmu("add_danmu", new_obj);
	console.log(text_obj);
	document.getElementById('danmu_text').value = '';
};


function op() {
	var op = document.getElementById('op').value;
	op = op / 100;
	jQuery('#danmu71452').data("opacity", op);
	jQuery(".flying").css({
		"opacity": op
	});
}

function changeloop() {
	if (document.getElementById("isloop").checked)
		danmu_video.loop(true)
	else
		danmu_video.loop(false)
}

function changehide() {
	var op = document.getElementById('op').value;
	op = op / 100;
	if (document.getElementById("ishide").checked) {
		jQuery('#danmu71452').data("opacity", op);
		jQuery(".flying").css({
			"opacity": op
		}); 
	} else {
		jQuery('#danmu71452').data("opacity", 0);
		jQuery(".flying").css({
			"opacity": 0
		});
	}
}



function revise_time(){
	//"""每隔半秒修正弹幕计时器的时间误差，以确保与视频时间的高同步率"""
	if( Math.abs($('#danmu71452').data("nowtime") - parseInt(danmu_video.currentTime() * 10))>2 ){
		console.log("reivise time:("+$('#danmu71452').data("nowtime") +","+parseInt(danmu_video.currentTime() * 10)+")");
		$('#danmu71452').data("nowtime", parseInt(danmu_video.currentTime() * 10));
		
	}
	t=setTimeout("revise_time()",100);	
	
}






