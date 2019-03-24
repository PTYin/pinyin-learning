# 目录

应用根目录： [www.peter-sia.top:8080](http://www.peter-sia.top:8080 "根目录")  
网站主页&User Guide：[www.peter-sia.top/pinyin](http://www.peter-sia.top/pinyin/ "主页")  
数据库： www.peter-sia.top:27017  
技术文档: [www.peter-sia.top/pinyin/techDocs](http://www.peter-sia.top/pinyin/techDocs "技术文档")  

## 功能

* 学习版块
  * 汉字转换拼音
  * 朗读拼音
  * 字典功能
  * 汉语拼音学习视频
  * 中英大辞典接口
* 登录模块
  * 持久化信息记录
  * 登入登出
  * cookie自动登录
  * session保持登录
  * control panel更改信息
  * 删除账户
  * 忘记密码（发送邮件确认）
* 测试版块
  * 每次随机从数据库抽取十道题，支持手动点击刷新
  * 提交判断对错，并提示错误选项
  * 统计模块
    * 数字显示
    * 饼状图显示正确率
    * 柱状图显示最易做错的7道题，并将你的数据和peter用户进行对比
    * 持久化统计
      * 未登录状态下利用cookie session将用户做题信息储存
      * 登录状态下利用数据库长期保存用户做题详细数据

## 框架

* 前端
  * html
  * CSS
  * JavaScript
    * jQuery
* 后端
  * 基于NodeJS
  * Express框架
  * Pug模板引擎(原Jade)
  * MongoDB数据库
* 前后端通信
  * AJAX
* 登录模块
  * braitsch/node-login  模板

## 依赖

* 前端
  * jQuery UI(jQuery官方UI库)
  * chart.js(绘制图表的插件)
  * 哔哩哔哩iframe
* 后端
  * express框架
  * body-parser(request body解析中间件; 用来解析post请求的body)
  * cookie-parser(cookie解析中间件)
  * express-session(用来创建session的中间件)
  * mongoDB(数据库)
  * connect-mongo(将session信息储存在数据库而中)
  * pwxcoo/chinese-xinhua(共4个JSON，词典)
  * hotoo/pinyin(汉字转拼音)
  * braitsch/node-login 模板

### 文件结构

* /homework/
  * dictionary/
    * 四个词典JSON文件
  * image/(logo.png等一些图片)
  * voice/(拼音音频)
  * jquery-ui/
  * node_modules/
  * index.html
  * index.js(nodejs服务器)
  * package.json
  * pinyin.log(网站运行日志文件)
  * start.sh(服务器linux开启脚本)

## 特色&优势

* 可拓展性
  * 题库存在数据库，想拓展题目不需更改源代码，只需远程连接数据库即可
  * 将session储存在数据库中而不是分散的文件中可以拓展以下功能
    * 控制一个帐号只能一个人登录
    * 统计在线人数
    * 踢出某个在线用户
    * 多站点共享session（网络通行证）
  * 实现了用户模块，未来可拓展的功能
    * 用户间正确率的PK(目前只能和peter用户进行比较)
* 易用性
  * 为用户提供说明书及联系方式
  * 网页结构简洁易上手
  * 持久化统计，用户不小心关掉界面也可继续统计
* 合理性
  * 目标群众：non-native Chinese learner. 全站英文
  * 中文转pinyin的同时，还提供查询中文意思的功能
  * 提供的学习内容丰富