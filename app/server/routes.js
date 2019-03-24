
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var fs = require('fs');
var pinyin = require("pinyin");
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var elements = ['a', 'a1', 'a2', 'a3', 'a4', 'ai', 'ai1', 'ai2', 'ai3', 'ai4', 'an', 'an1', 'an2', 'an3', 'an4', 'ang', 'ang1', 'ang2', 'ang3', 'ang4', 'ao', 'ao1', 'ao2', 'ao3', 'ao4', 'b', 'c', 'ch', 'd', 'e', 'e1', 'e2', 'e3', 'e4', 'ei', 'ei1', 'ei2', 'ei3', 'ei4', 'en', 'en1', 'en2', 'en3', 'en4', 'eng', 'eng1', 'eng2', 'eng3', 'eng4', 'er', 'er1', 'er2', 'er3', 'er4', 'f', 'g', 'h', 'i', 'i1', 'i2', 'i3', 'i4', 'ie', 'ie1', 'ie2', 'ie3', 'ie4', 'in', 'in1', 'in2', 'in3', 'in4', 'ing', 'ing1', 'ing2', 'ing3', 'ing4', 'iu', 'iu1', 'iu2', 'iu3', 'iu4', 'j', 'k', 'l', 'm', 'n', 'o', 'o1', 'o2', 'o3', 'o4', 'ong', 'ong1', 'ong2', 'ong3', 'ong4', 'ou', 'ou1', 'ou2', 'ou3', 'ou4', 'p', 'q', 'r', 's', 'sh', 't', 'u', 'u1', 'u2', 'u3', 'u4', 'ui', 'ui1', 'ui2', 'ui3', 'ui4', 'un', 'un1', 'un2', 'un3', 'un4', 'v', 'v1', 'v2', 'v3', 'v4', 've', 've1', 've2', 've3', 've4', 'vn', 'vn1', 'vn2', 'vn3', 'vn4', 'w', 'x', 'y', 'z', 'zh'];


// //静态资源
// router.use('/jquery-ui', express.static(path.join(__dirname,'/app/public/jquery-ui')));
// router.use('/voice', express.static(path.join(__dirname,'/app/public/voice')));
// router.use('/image', express.static(path.join(__dirname, '/app/public/image')));


module.exports = function(app) {

var router = app;
//主页
var index = function(req, res)
{
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile(path.join(__dirname,'../../index.html'), 'utf-8', (err, data) =>
    {
        if(err)console.log(err);
        res.end(data);
    });
};

router.use(function(req, res, next)
{
    if (req.cookies.login == undefined)
    {
        if(req.session.total==null)
        {
            req.session.total=0;
            req.session.correct=0;
        }
    }	
    else
    {
        AM.findData(req.cookies.login, (err, result)=>
        {
            if(err)console.log(err);
            if(result&&req.session)
            {
                req.session.total=result.total;
                req.session.correct=result.correct;
            }
        });
        // AM.validateLoginKey(req.cookies.login, req.ip, function(e, o)
        // {
        //     if (o)
        //     {
        //         AM.findData(req.cookies.login, (err, result)=>
        //         {
        //             req.session.total=result.total;
        //             req.session.correct=result.correct;
        //         });
        //     }
        // });
    }
    next();
});
router.get('/', index);
router.get('/index.html', index);
//查字典
router.get('/checkMore', (req, res) =>
{
    var ans;
    var files = new Array
    (path.join(__dirname,"../public/dictionary/ci.json"),
    path.join(__dirname,"../public/dictionary/word.json"),
    path.join(__dirname,"../public/dictionary/idiom.json"),
    path.join(__dirname,"../public/dictionary/xiehouyu.json"));
    for(var index in files)
    {   
        fs.readFile(files[index], 'utf-8', (err, data)=>
        {
            if(err)console.log(err);
            var info = data.toString();
            info = JSON.parse(info);
            for(var entry in info)
            {
                if(info[entry].ci == req.query.txt || info[entry].word == req.query.txt || info[entry].riddle == req.query.txt)
                {
                    // console.log(info[entry]);
                    ans = info[entry];
                    res.send(ans);
                }
            }
        });
    }
});
//查拼音
router.get('/lookUp', (req, res) =>
{
    var segments = [];
    var flag=false;
    var shengList = pinyin(req.query.txt,{
        style: pinyin.STYLE_INITIALS 
      });
    var list = pinyin(req.query.txt,{
        style: pinyin.STYLE_TONE2
      });
    for(var i in shengList)
    {
        segments.push([]);
        if(shengList[i][0].length!=0)segments[i].push(shengList[i][0]);
        var original = list[i][0].substring(shengList[i][0].length);
        yun = original;
        var found = false, mark = -1;
        do
        {
            mark++;
            yun = yun.substring(mark);
            for(var element in elements)
                if(elements[element] == yun)found = true;
        }while(!found&&mark<2);
        if(mark!=2)mark==0?segments[i].push(yun):segments[i].push(original.substring(0, mark), yun);
        else 
        {
            flag=true;
            break;
        }
    }
    console.log("{\"pinyin\":"+JSON.stringify(pinyin(req.query.txt))+",\"audio\":"+JSON.stringify(segments)+"}");
    // res.send(JSON.stringify(pinyin(req.query.txt)));
    // res.json("{'pinyin':[['ā']],'audio':[['a1']]}");
    if(flag)res.json("{\"pinyin\":"+JSON.stringify(pinyin(req.query.txt))+",\"audio\":"+"[[]]"+"}");
    else res.json("{\"pinyin\":"+JSON.stringify(pinyin(req.query.txt))+",\"audio\":"+JSON.stringify(segments)+"}");
});
//刷新
var database;
router.get("/shuffle", (req, res) =>
{
    database.collection("words").find({}).toArray((err, result) =>
    {
        if(err)console.log(err);
        // console.log(result);
        var questions =[],As=[],Bs=[],Cs=[],Ds=[];
        for(var index in result)
        {
            questions.push(result[index].question);
            As.push(result[index].A);
            Bs.push(result[index].B);
            Cs.push(result[index].C);
            Ds.push(result[index].D);
        }
        while(questions.length>10)
        {
            var random = Math.floor(Math.random()*questions.length);
            questions.splice(random, 1);
            As.splice(random, 1);
            Bs.splice(random, 1);
            Cs.splice(random, 1);
            Ds.splice(random, 1);
        }
        res.send({questions:questions, As:As, Bs:Bs, Cs:Cs, Ds:Ds});
    });
});

//查询正确数量
router.get("/getSession", (req, res)=>
{
    res.json({total:req.session.total, correct:req.session.correct, wrong:req.session.total-req.session.correct});
});

//查询前七道易错题
router.get("/moreData", (req, res) =>
{
    AM.dataSort(7,req.cookies.login, (result) =>
    {
        res.json(result);
    });
});

//查询Peter的成绩
router.get("/moreDataAboutPeter", (req,res)=>
{
    AM.scoreList(req.query.list, "pty", (result) =>
    {
        console.log(result);
        res.send(result);
    });
});

//提交答案
router.post("/submitAnswer", (req, res) =>
{
    // console.log(req.body);
    var correct = 0;
    var alreadyList = {};
    var answer = {};
    var count = 0;
    for(var j in req.body)
    {
        count++;
    }
    function judge(err, result, step)
    {
        var index,next;
        var flag = false;
        for(next in req.body)
        {
            // console.log(alreadyList[index]+":"+index);
            if(flag)break;
            if(!alreadyList[next])
            {
                flag = true;
                index = next;
            }
        }
        alreadyList[index]=req.body[index];
        if(req.body[index] == result[0].answer)
        {
            correct++;
            // console.log(index+"right!");
        }
        else
        {
            answer[result[0].question] = [result[0].answer];
            answer[result[0].question].push(result[0][result[0].answer]);
        }
        if(step == count)
        {
            if(req.session.total == null)
            {
                req.session.total = 10;
                req.session.correct = correct;
            }
            else
            {
                req.session.total += 10;
                req.session.correct += correct;
            }
            // AM.validateLoginKey(req.cookies.login, req.ip, function(e, o)
            // {
            //     if (o)
            //     {
            //         AM.generateData(req.cookies.login, req.session.total, req.session.correct);
            //     }
            // });
            AM.generateData(req.cookies.login, req.session.total, req.session.correct, answer);
            res.send({correct:correct, wrongList:answer});//answer={"题目":["选项","答案"]}
            return;
        }
        else database.collection("words").find({"question":next}).toArray((err, result) => judge(err, result, step+1));
    } 
    for(var index in req.body)
    {
        // console.log(index);
        // total++;
        database.collection("words").find({"question":index}).toArray((err, result) => judge(err, result, 1));
        break;
    }
    if(count==0)
    {
        if(req.session.total != null)
        {
            req.session.total += 10;
        }
        else 
        {
            req.session.total = 10;
            req.session.correct = 0;
        }
        AM.generateData(req.cookies.login, req.session.total, req.session.correct, answer);
        res.send({correct:0, wrongList:{}});
    }
});

//连接题库
var url = "mongodb://localhost:27017/testBank"; 
MongoClient.connect(url,{useNewUrlParser:true}, function(err, db) 
{
    if (err) console.log(err);
    console.log("database connected at mongodb://localhost:27017/testBank");
//   db.close();
    database = db.db('testBank');
});

/*
	login & logout
*/

	app.get('/login', function(req, res){
	// check if the user has an auto login key saved in a cookie //
		if (req.cookies.login == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.validateLoginKey(req.cookies.login, req.ip, function(e, o){
				if (o){
					AM.autoLogin(o.user, o.pass, function(o){
						req.session.user = o;
						res.redirect('/home');
					});
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/login', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'false'){
					res.status(200).send(o);
				}	else{
					AM.generateLoginKey(o.user, req.ip, function(key){
						res.cookie('login', key, { maxAge: 60*60*1000 });
						res.status(200).send(o);
					});
				}
			}
		});
	});

	app.post('/logout', function(req, res){
		res.clearCookie('login');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
    });
    app.get('/logout', function(req, res){
		res.clearCookie('login');
		req.session.destroy(function(e){ res.status(200).redirect('/'); });
	});
	
/*
	control panel
*/
	
    app.get('/home', function(req, res) 
    {
        if (req.session.user == null)
        {
            res.redirect('login');
            // AM.validateLoginKey(req.cookies.login, req.ip, function(e, o)
            // {
            //     if (o)
            //     {
			// 		AM.autoLogin(o.user, o.pass, function(o){
			// 			req.session.user = o;
			// 			res.redirect('/home');
			// 		});
            //     }	else
            //     {
            //     }
            // });
        }	
        else
        {
            res.render('home', 
            {
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});
		}
	});
	
	app.post('/home', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			AM.updateAccount({
				id		: req.session.user._id,
				name	: req.body['name'],
				email	: req.body['email'],
				pass	: req.body['pass'],
                country	: req.body['country']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o.value;
					res.status(200).send('ok');
				}
			});
		}
	});

/*
	new accounts
*/

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country'],
            total   : req.session.total,
            correct : req.session.correct
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

/*
	password reset
*/

	app.post('/lost-password', function(req, res){
		let email = req.body['email'];
		AM.generatePasswordKey(email, req.ip, function(e, account){
			if (e){
				res.status(400).send(e);
			}	else{
				EM.dispatchResetPasswordLink(account, function(e, m){
			// TODO this callback takes a moment to return, add a loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		AM.validatePasswordKey(req.query['key'], req.ip, function(e, o){
			if (e || o == null){
				res.redirect('/');
			} else{
				req.session.passKey = req.query['key'];
				res.render('reset', { title : 'Reset Password' });
			}
		});
	});
	
	app.post('/reset-password', function(req, res) {
		let newPass = req.body['pass'];
		let passKey = req.session.passKey;
	// destory the session immediately after retrieving the stored passkey //
		req.session.destroy();
		AM.updatePassword(passKey, newPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
/*
	view, delete & reset accounts
*/
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		});
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.session.user._id, function(e, obj){
			if (!e){
				res.clearCookie('login');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
		});
	});
	
	app.get('/reset', function(req, res) {
		AM.deleteAllAccounts(function(){
			res.redirect('/print');
		});
	});
	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};
