# DanmuPlayer
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
##Html5弹幕视频播放器插件


Danmmu Player是一个具备弹幕功能的Html5视频播放器。
具备弹幕视频播放，接受用户发送彩色弹幕，实时调解弹幕显示效果等功能。
Danmmu Player意在使开发者能便捷的在网站中实现弹幕视频播放。

完整文档及Demo：http://www.liyawei.cn/danmuplayer/

<br>
<br>
<h3>开始使用</h3>
<pre>
1.第一步引入本播放器的js和css文件,需要和jQuery一起引用。
<code class=language-html>&lt;link rel=&quot;stylesheet&quot; href=&quot;assets/DanmuPlayer/css/danmuplayer.css&quot;&gt;
	&lt;script src=&quot;assets/js/jquery-1.11.1.min.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;assets/DanmuPlayer/js/danmuplayer.js&quot;&gt;&lt;/script&gt;</code></pre>
<pre>
2.新建一个div，这里把id值设为danmp
<code class=language-html>&lt;div id=&quot;danmup&quot;&gt;&lt;/div&gt;</code></pre>
<pre>
3.初始化DanmuPlayer，利用刚才新建的div.
<code class="language-js">$("#danmup").danmuplayer({
  src:"shsn.mp4",       //视频源
  width:800,			//视频宽度
  height:445			//视频高度
});</code>好了，已经可以在页面上看到播放器。试着发下弹幕，也OK。
等等，现在用户发的弹幕貌似没有写入数据库，也就是说是一次性的，刷新页面后就没了？是这样的，但是接下来就告诉你可以怎么做。</pre>

	<h3>进阶使用</h3>
<pre>
4.在上一步中，我们用调用某jQuery对象的方法初始化了一个弹幕播放器，并传递了一些参数（src,width,height）。其实这个方法具有以下参数 （除了视频源外其余参数均可选，冒号后面的为默认值）
<code class="language-js">
src: "shsn.mp4",		//视频源
height: 450,             //播放器的高度
width: 800,				//播放器的宽度,最小宽度支持为720
speed: 20000,			//弹幕速度，穿过视频的毫秒数 
danmuss: {},            //默认的danmuss对象（稍后介绍）
default_font_color: "#FFFFFF",  //默认的弹幕颜色
font_size_small: 16,			////小号弹幕的字体大小,注意此属性值只能是整数
font_size_big:28,           //大号弹幕的字体大小 
opacity: "1",				//默认弹幕的透明度
top_botton_danmu_time: 6000,    //底部及顶部弹幕存留的世界
url_to_get_danmu: "",				//用来接收弹幕信息的url  (稍后介绍)
url_to_post_danmu: ""				//用来存储弹幕信息的url  (稍后介绍)

</code>
</pre>
<pre>
5.在这一节中，向米娜桑介绍DanmuPlayer中的两种js对象，danmu对象及danmuss对象。
danmu对象意指具体某一条弹幕及起信息，它有如下属性：
<code>text——弹幕文本内容。 
color——弹幕颜色。 position——弹幕位置 “0”为滚动 “1” 为顶部 “2”为底部 
size——弹幕文字大小。 “0”为小字 ”1”为大字
time——弹幕所出现的时间。 单位为”分秒“（及1/10秒，100毫秒）
isnew——当出现该属性时（属性值科委任意），会认为这是用户新发的弹幕，从而弹幕在显示的时候会有边框。
</code> 
举例：
<code> var a_danmu={ "text":"2333333" , "color":"green" ,"size":"1","position":"0","time":60};</code> 
要显示边框的新弹幕：
<code>var a_danmu={ "text":"2333333" , "color":"green" ,"size":"1","position":"0","time":60 ,"isnew":" "}; </code>

danmuss对象是该弹幕视频中所有danmu对象的集合，它的存在是为了提高程序的效率。
每个DanmuPlayer只有一个duamss对象。DanmuPlayer在运行时会把每个danmu对象写入danmuss对象。
dammuss对象每个属性的名称为弹幕所出现的时间点(分秒)，属性值为该时间点所出现的所有弹幕的danmu对象(除掉time属性的)所组成的数组。
例如:
<code class="language-js">var danmuss={ 1:[ { "text":"hahahaha" , "color":"red" ,"size":"0","position":"0"}, 
{ "text":"233333" , "color":"red" ,"size":"0","position":"2"} ],
 3:[ { "text":"poi" , "color":"red" ,"size":"1","position":"1"}, 
{ "text":"2333" , "color":"#FFFFFF" ,"size":"0","position":"0"} ],
 50:[ { "text":"XXX真好" , "color":"#FFFFFF" ,"size":"0","position":"2"}, ] };
</code>
 在初始化DanmuPlayer时有个可选的参数danmuss，它的值就应该是一个合法的danmuss对象。有了这个参数，DanmuPlayer会把这个参数值中的dannuss播放于屏幕。（对于danmuss对象，如果暂时不理解可以绕过，很少用到）
</pre>
<pre>
6.在这一节中，告诉米娜桑如何和后端连接将弹幕存储于数据库。DanmuPlayer提供了高度封装的和后端ajax交互的接口，你只需按照接口修改出一个或两个后端页面即可。

在初始化DanmuPlayer时，两个参数url_to_get_danmu和url_to_post_danmu就是用来和后端连接的。url_to_get_danmu用来获取弹幕，url_to_post_danmu用来存储弹幕。url_to_get_danmu和url_to_post_danmu接受的参数都是url。

DanmuPlayer在页面载入时，会向url_to_get_danmu所对应的页面发送Get请求，url_to_get_danmu对应页面的http响应报文的内容中应该是一个由danmu对象组成的js数组（字符串形式）。"['{danmmu对象1}','{danmu对象2}',...,'{danmu对象n}']"这样的字符串（遵循JSON格式标准）（在报文中是没有最外面的引号的）(注意：每个danmu对象都要被引号所包裹，否则会产生致命错误)。
当用户发弹幕时，DanmuPlayer向url_to_post_danmu发送post请求，报文的内容是用户所发弹幕的danmu对象（字符串）（遵循JSON格式标准）。
如果你需要在get和post的同时向后端发生其他参数，请在URL里以get的形式发送。

在demo&doc目录中有一个简单的php版的url_to_get_danmu和url_to_post_danmu所对应页面的编写示例：


</pre>
<pre>
7.7.DanmuPlayer中有一个id为danmu71452的标签（这句话可以不用理,详情请参照<a target="_blank" href="http://githu.com/chiruom/danmu">jQuery.danmu.js项目</a>）。可以直接复制以下代码语句去即时的操作弹幕：

暂停弹幕：<code class="language-js">$('#danmu71452').danmu('danmu_pause'); </code>暂停后继续：<code class="language-js">$('#danmu71452').danmu('danmu_resume'); </code>停止弹幕：
<code class="language-js">$('#danmu71452').danmu('danmu_stop');  </code>即时增加弹幕：<code class="language-js">$('#danmu71452').danmu("add_danmu",新弹幕的danmu类型对象); </code>获取弹幕运行的当前时间(单位为分秒)：<code class="language-js">$('#danmu71452').data("nowtime"); </code>设置弹幕运行的当前时间(单位为分秒)：<code class="language-js">$('#danmu71452').data("nowtime"，新时间)  </code>更改弹幕透明度：<code class="language-js">$('#danmu71452').data("opacity",新透明度数值);</code>是否处于暂停状态：<code class="language-js">$('#danmu71452').data("paused");</code>
</pre>


<h3>其他方法</h3>
<pre>8.由于DanmuPlayer基于video.js编写，故几乎所有的video.js接口都可用于DanmuPlayer。
video.js项目及文档地址：<a target="blank" href="https://github.com/videojs/video.js/">https://github.com/videojs/video.js/</a>
DanmuPlayer在内部定义了一个名字叫做danmu_video的全局videojs对象，可以对danmu_video使用video.js的任何方法及相应事件处理等。
</pre>
<pre>
9.注意：由于DanmuPlayer内部组件命名的规范性，它几乎可以与其他任何前端插件共存。但是，一个页面上只允许存在一个DanmuPlayer。此缺陷在后续版本或许会改进。如果你需要在一个页面中使用多个DanmuPlayer，可以使用frame标签。</pre>
<h3>许可</h3>
<pre>
你可以随意使用本项目，只需要在您的项目中添加这么一行注释：
<code class="language-html">DanmuPlayer (//github.com/chiruom/danmuplayer/) - Licensed under the MIT license</code>
</pre>

