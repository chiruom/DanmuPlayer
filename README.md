# DanmuPlayer
## Html5弹幕视频播放器插件
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)     [![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Danmmu Player是一个具备弹幕功能的Html5视频播放器。 具备弹幕视频播放，接受用户发送彩色弹幕，实时调解弹幕显示效果等功能。 Danmmu Player意在使开发者能便捷的在网站中实现弹幕视频播放。

**完整文档及Demo：http://www.liyawei.cn/danmuplayer/**

```
此版本为V2版本，相对V1主要做了以下更新：
1.和videojs解耦合，提高了运行效率和稳定性。
2.API规范化。
3.弹幕较少时主要飘于视频的上半部分，与AB站相同。
4.一个页面可以添加多个播放器啦。
5.弹幕对象的时间改为秒，不再用分秒作为单位了。
6.性能的优化，更少的CPU占用和漏帧。
*：此版本API较上一版本有较大改变，若需使用上一版本，请去OldEdition目录下。
```
###开始使用

**1**.第一步引入本播放器的js和css文件,需要和jQuery一起引用。

```html
<link rel="stylesheet" href="css/danmuplayer.css">;
<script src="js/jquery-1.11.1.min.js"></script>;
<script src="js/danmuplayer.js"></script>;
```
_ _ _
**2**.新建一个div，这里把id值设为danmp

```html
<div id="danmup"></div>
```
_ _ _
**3**.初始化DanmuPlayer，利用刚才新建的div.

```javascript
$("#danmup").danmuplayer({
  src:"shsn.mp4",       //视频源
  width:800,			//视频宽度
  height:445			//视频高度
});
```
好了，已经可以在页面上看到播放器。试着发下弹幕，也OK。
等等，现在用户发的弹幕貌似没有写入数据库，也就是说是一次性的，刷新页面后就没了？是这样的，但是接下来就告诉你可以怎么做。

###进阶使用
_ _ _
**4**.在上一步中，我们用调用某jQuery对象的方法初始化了一个弹幕播放器，并传递了一些参数（src,width,height）。其实这个方法具有以下参数 （除了视频源外其余参数均可选，冒号后面的为默认值）

```javascript
src: "shsn.mp4",    //视频源
height: 450,             //播放器的高度
width: 800,				//播放器的宽度,最小宽度支持为720
speed:20000,			//弹幕速度，这是数值指的是视频穿过672像素所需要的毫秒数
sumTime:65535,				//弹幕视频的总时间，可不填。
danmuList:{},				//弹幕列表
defaultColor:"#ffffff",   //弹幕的默认字体颜色
fontSizeSmall:16,			//小弹幕的字号
FontSizeBig:24,				//大弹幕的字号
opacity:"1",  			//弹幕默认透明度
topBottonDanmuTime:6000,  //底部及顶部弹幕存留的时间
urlToGetDanmu:"",     //用来接收弹幕信息的url  (稍后介绍)
urlToPostDanmu:""    //用来存储弹幕信息的url  (稍后介绍)
```
_ _ _
**5**.向米娜桑介绍DanmuPlayer中的js对象：danmu对象。
danmu对象意指具体某一条弹幕以及它的信息，它有如下属性：

```javascript
text——弹幕文本内容。
color——弹幕颜色。
position——弹幕位置 0为滚动 1 为顶部 2为底部
size——弹幕文字大小。 0为小字 1为大字
time——弹幕所出现的时间。 单位为秒
isnew——当出现该属性时（属性值可为任意），会认为这是用户新发的弹幕，从而弹幕在显示的时候会有边框。
```

举例：
```javascript
var aDanmu={ text:"这是弹幕" ,color:"white",size:1,position:0,time:2};
```
要显示边框的新弹幕：
```javascript
var aDanmu={ text:"这是弹幕" ,color:"white",size:1,position:1,time:2,isnew:1};
```



_ _ _
**6**.在这一节中，告诉米娜桑如何和后端连接将弹幕存储于数据库。DanmuPlayer提供了高度封装的和后端ajax交互的接口，你只需按照接口修改出一个或两个后端页面即可。当然，也可以使用自己的接口！

**方法1：**
在初始化DanmuPlayer时，两个参数urlToGetDanmu和urlToPostDanmu就是用来和后端连接的。urlToGetDanmu用来获取弹幕，urlToPostDanmu用来存储弹幕。urlToGetDanmu和urlToPostDanmu接受的参数都是url。

DanmuPlayer在页面载入时，会向urlToGetDanmu所对应的页面发送Get请求，urlToGetDanmu对应页面的http响应报文的内容中应该是一个由danmu对象组成的js数组（字符串形式）。"['{danmmu对象1}','{danmu对象2}',...,'{danmu对象n}']"这样的字符串（遵循JSON格式标准）（在报文中是没有最外面的引号的）(注意：每个danmu对象都要被引号所包裹，否则会产生致命错误)。
当用户发弹幕时，DanmuPlayer向urlToPostDanmu发送post请求，报文的内容是用户所发弹幕的danmu对象（字符串）（遵循JSON格式标准）。
如果你需要在get和post的同时向后端发送其他参数，请在URL里以get的形式发送。

gitHub的demo里有一个简单的php版的urlToGetDanmu和urlToPostDanmu所对应页面的编写示例：



**方法2：**

使用如下语句在视频播放前为播放器添加弹幕或弹幕数组（jQuery选择器为播放器的id、空格、 .danmu-div ）：
```javascript
$('#danmp .danmu-div').danmu(addDanmu,弹幕对象 或 弹幕对象数组);
```
举例：
```javascript
$("#danmup .danmu-div").danmu("addDanmu",[
   {text:"这是滚动弹幕" ,color:"white",size:1,position:0,time:2}
  ,{text:"这是顶部弹幕" ,color:"yellow" ,size:1,position:1,time:3}
  ,{text:"这是底部弹幕" , color:"red" ,size:1,position:2,time:3}
])
```
说明：DanmuPlayer中有一个class为danmu-div的标签（此标签是一个jQuery弹幕插件的容器,详情请参照 jQuery.danmu.js( http://github.com/chiruom/danmu )项目


其他方法
_ _ _
**7**.由于DanmuPlayer中有一个html5 video便签，故几乎所有的html5 videoAPI和事件等都可用于DanmuPlayer。
可以使用代码任意改变video的播放时间,弹幕流的时间会与自动之同步。

_ _ _
**8**.注意：一个页面中可以防止多个DanmuPlayer,但是由于所有的danmuPlayer绑定有相同的键盘快捷键，可能会导致键盘事件的失灵。

### 许可
你可以随意使用本项目，只需要在您的项目中添加这么一行注释：
```html
DanmuPlayer (//github.com/chiruom/danmuplayer/) - Licensed under the MIT license
```

