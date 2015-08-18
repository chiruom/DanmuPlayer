# DanmuPlayer
## Html5弹幕视频播放器插件
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)     [![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Danmmu Player是一个具备弹幕功能的Html5视频播放器。 具备弹幕视频播放，接受用户发送彩色弹幕，实时调解弹幕显示效果等功能。 Danmmu Player意在使开发者能便捷的在网站中实现弹幕视频播放。

**完整文档及Demo：http://www.liyawei.cn/danmuplayer/**

```
此版本为V2版本，相对V1主要做了以下更新：
1.和videojs解耦合，提高了运行效率和稳定性。
2.API规范化。  *API有较大变化。
3.弹幕较少时主要飘于视频的上半部分，与AB站相同。
4.一个页面可以添加多个播放器啦。
```
###开始使用

1.第一步引入本播放器的js和css文件,需要和jQuery一起引用。

```html
<link rel="stylesheet" href="css/danmuplayer.css">;
<script src="js/jquery-1.11.1.min.js"></script>;
<script src="js/danmuplayer.js"></script>;
```
_ _ _
2.新建一个div，这里把id值设为danmp

```html
<div id="danmup"></div>
```
_ _ _
3.初始化DanmuPlayer，利用刚才新建的div.

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
4.在上一步中，我们用调用某jQuery对象的方法初始化了一个弹幕播放器，并传递了一些参数（src,width,height）。其实这个方法具有以下参数 （除了视频源外其余参数均可选，冒号后面的为默认值）

```javascript
src: "shsn.mp4",    //视频源
height: 450,             //播放器的高度
width: 800,				//播放器的宽度,最小宽度支持为720
speed:20000,			//弹幕速度，这是数值指的是视频穿过640像素所需要的毫秒数
sumTime:65535,				//弹幕视频的总时间，可不填。
danmuList:{},				//弹幕列表
defaultColor:"#ffffff",   //弹幕的默认字体大小
fontSizeSmall:16,			//小弹幕的字号
FontSizeBig:24,				//小弹幕的字号
opacity:"1",  			//弹幕默认透明度
topBottonDanmuTime:6000,  //底部及顶部弹幕存留的时间
urlToGetDanmu:"",     //用来接收弹幕信息的url  (稍后介绍)
urlToPostDanmu:""    //用来存储弹幕信息的url  (稍后介绍)
```
_ _ _
5.在这一节中，向米娜桑介绍DanmuPlayer中的两种js对象，danmu对象及danmuList对象。

```javascript
danmu对象意指具体某一条弹幕以及它的信息，它有如下属性：
text——弹幕文本内容。
color——弹幕颜色。 position——弹幕位置 “0”为滚动 “1” 为顶部 “2”为底部
size——弹幕文字大小。 “0”为小字 ”1”为大字
time——弹幕所出现的时间。 单位为”分秒“（及1/10秒，100毫秒）
isnew——当出现该属性时（属性值可为任意），会认为这是用户新发的弹幕，从而弹幕在显示的时候会有边框。
```

举例：
```javascript
var a_danmu={ "text":"2333333" , "color":"green" ,"size":"1","position":"0","time":60};
```
要显示边框的新弹幕：

```javascript
var a_danmu={ "text":"2333333" , "color":"green" ,"size":"1","position":"0","time":60 ,"isnew":" "};
```
danmuList对象是该弹幕视频中所有danmu对象的集合，是由所有danmu它的存在是为了提高程序的效率。
每个DanmuPlayer只有一个danmuList对象。DanmuPlayer在运行时会把每个danmu对象写入danmuList对象。
danmuList对象每个属性的名称为弹幕所出现的时间点(分秒)，属性值为该时间点所出现的所有弹幕的danmu对象(除掉time属性的)所组成的数组。
例如:
```javascript
var danmuList={ 1:[ { "text":"hahahaha" , "color":"red" ,"size":"0","position":"0"},
{ "text":"233333" , "color":"red" ,"size":"0","position":"2"} ],
 3:[ { "text":"poi" , "color":"red" ,"size":"1","position":"1"},
{ "text":"2333" , "color":"#FFFFFF" ,"size":"0","position":"0"} ],
 50:[ { "text":"XXX真好" , "color":"#FFFFFF" ,"size":"0","position":"2"}, ] };

```

在初始化DanmuPlayer时有个可选的参数danmuList，它的值就应该是一个合法的danmuList对象。有了这个参数，DanmuPlayer会把这个参数值中的danmuList播放于屏幕。（对于danmuList对象，如果暂时不理解可以绕过，很少用到）
上面的danmuList被传入播放器的效果为：在第1分秒，3分秒，50分秒是播放对应的弹幕
_ _ _
6.在这一节中，告诉米娜桑如何和后端连接将弹幕存储于数据库。DanmuPlayer提供了高度封装的和后端ajax交互的接口，你只需按照接口修改出一个或两个后端页面即可。

**方法1：**
在初始化DanmuPlayer时，两个参数urlToGetDanmu和urlToPostDanmu就是用来和后端连接的。urlToGetDanmu用来获取弹幕，urlToPostDanmu用来存储弹幕。urlToGetDanmu和urlToPostDanmu接受的参数都是url。

DanmuPlayer在页面载入时，会向urlToGetDanmu所对应的页面发送Get请求，urlToGetDanmu对应页面的http响应报文的内容中应该是一个由danmu对象组成的js数组（字符串形式）。"['{danmmu对象1}','{danmu对象2}',...,'{danmu对象n}']"这样的字符串（遵循JSON格式标准）（在报文中是没有最外面的引号的）(注意：每个danmu对象都要被引号所包裹，否则会产生致命错误)。
当用户发弹幕时，DanmuPlayer向urlToPostDanmu发送post请求，报文的内容是用户所发弹幕的danmu对象（字符串）（遵循JSON格式标准）。
如果你需要在get和post的同时向后端发送其他参数，请在URL里以get的形式发送。

这里有一个简单的php版的urlToGetDanmu和urlToPostDanmu所对应页面的编写示例：



**方法2：**
在播放器初始化前从后端取得任意格式的弹幕，整理成danmuList对象后传入播放器。

**方法3：**
DanmuPlayer中有一个class为danmu-div的标签（此标签是一个jQuery.danmu.js的容器,详情请参照<a target="_blank" href="http://github.com/chiruom/danmu">jQuery.danmu.js项目</a>）
可以调用jQuery.danmu.js的addDanmu方法逐一添加弹幕（注意选择器要带上播放器的id以避免冲突）：

```javascript
$('#danmp .danmu-div').danmu(addDanmu,danmu类型对象);
```




其他方法
_ _ _
8.由于DanmuPlayer中有一个html5 video便签，故几乎所有的html5 videoAPI和事件等都可用于DanmuPlayer。
	可以使用代码任意改变video的播放时间,弹幕流的时间会与自动之同步

_ _ _
9.注意：一个页面中可以防止多个DanmuPlayer,但是由于所有的danmuPlayer绑定有相同的键盘快捷键，可能会导致键盘事件的失灵。

### 许可
你可以随意使用本项目，只需要在您的项目中添加这么一行注释：
```
DanmuPlayer (//github.com/chiruom/danmuplayer/) - Licensed under the MIT license
```

