# 目录

>应用根目录： [www.peter-sia.top:8080](http://www.peter-sia.top:8080 "根目录")  
>网站主页&User Guide：[www.peter-sia.top/pinyin](http://www.peter-sia.top/pinyin/ "主页")  
>数据库： www.peter-sia.top:27017  
>技术文档: [www.peter-sia.top/pinyin/docs](http://www.peter-sia.top/pinyin/docs "技术文档")  
Github仓库: [github.com/PTYin/pinyin-learning](https://github.com/PTYin/pinyin-learning "Github")

## Installation & Setup

1. Install [Node.js](https://nodejs.org/) & [MongoDB](https://www.mongodb.org/) if you haven't already.
2. Clone this repository and install its dependencies.

        > git clone https://github.com/PTYin/pinyin-learning.git
        > cd pinyin-learning
        > npm install

3. In a separate shell start MongoDB.

        > mongod

4. From within the pinyinlearning directory start the server.

        > npm start

5. Open a browser window and navigate to: [http://localhost:3000](http://localhost:3000)

## Function

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

## Frame

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

## Dependency

* 前端
  * jQuery UI(jQuery官方UI库)
  * chart.js(绘制图表的插件)
  * 哔哩哔哩iframe
* 后端
  * express框架
  * body-parser(request body解析中间件; 用来解析post请求的body)
  * morgan(日志中间件)
  * file-stream-rotator(日志切割)
  * cookie-parser(cookie解析中间件)
  * express-session(用来创建session的中间件)
  * mongoDB(数据库)
  * connect-mongo(将session信息储存在数据库而中)
  * emailjs(发送email的API)
  * pwxcoo/chinese-xinhua(共4个JSON，词典)
  * hotoo/pinyin(汉字转拼音)
  * braitsch/node-login 模板

## File Structure

* pinyin(根目录)
  * .git
  * .gitignore
  * .vscode(vscode配置)
  * app(应用核心)
    * logs(日志文件夹)
      * .gitignore
    * public(公共静态资源)
      * 1.swf
      * 2.swf
      * css
      * dictionary(4个词典JSON文件)
      * image
      * jquery-ui(定制jQuery UI)
      * js(前段需要的js模块化)
        * controllers
          * homeController.js
          * loginController.js
          * signupController.js
        * form-validators
          * accountValidator.js
          * emailValidator.js
          * loginValidator.js
          * resetValidator.js
        * views
          * home.js
          * login.js
          * reset.js
          * signup.js
      * voice(音频文件)
    * server(服务器端)
      * modules
        * account-manager.js(将用户的数据库操作抽象成一个对象)
        * country-list.js(国家列表)
        * email-dispatcher.js(用户找回密码，发送email的模块)
      * **routes.js**(路由文件)
      * views(pug模板)
  * app.js(程序入口)
  * docs(文档目录)
  * index.html(根目录index.html)
  * node_modules(依赖)
  * package-lock.json
  * package.json
  * README.md(README)

## Features&Advantages

* 易管理性
  * 服务器防火墙开放27017端口，远程连接数据库
  * 日志切割，周期每天切割一次，便于纠错
  * 服务器端利用nodejs插件forever，保证服务器不轻易down
* 可拓展性(TODO)
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
  * 持久化统计，用户关掉页面或者服务器宕机也不会导致数据丢失
* 合理性
  * 网站分为登录模式和非登录模式，功能有所差异但不影响基本功能
  * 密码加密保存在数据库里,保护用户隐私
  * 目标群众：non-native Chinese learner. 全站英文
  * 中文转pinyin的同时，还提供查询中文意思的功能
  * 提供的学习内容丰富，提供功能丰富