var fs = require('fs'); //文件操作模块
var request = require("request"); //网络请求模块
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');

//目标网址
var initUrl = 'http://www.zcool.com.cn/tosearch.do?page=0&world=%E9%A3%8E%E6%99%AF&cateType=0&subcateType=0&channel=0&other=0&sort=0&uid=0&time=0&limit=10&recommend=0&p=';
var page = 1;

//本地存储目录
var dir = './images';

//创建目录
mkdirp(dir, function(err) {
	if (err) {
		console.log(err);
	}
});

//下载方法
var download = function(url, dir, filename) {
	request.head(url, function(err, res, body) {
		request(url).pipe(fs.createWriteStream(dir + "/" + filename));
	});
};

//发送请求
var req = function(url, callback) {
	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			page++;
			var $ = cheerio.load(body);
			// fs.writeFile("index.html", body, "utf-8", function(err) {
			// 	console.log('success');
			// });
			$('.image-link img').each(function() {
				var src = $(this).attr('src');
				download(src, dir, Math.floor(Math.random() * 100000) + src.substr(-4, 4));
			});
			console.log("当前正在执行第" + (page - 1) + "次,url地址为" + url);
			callback();
		}
	});
}

var repect = function() {
	req(initUrl + page, function() {
		if (page > 10) {
			console.log("执行完毕");
		} else {
			repect();
		}
	});
}

repect();
