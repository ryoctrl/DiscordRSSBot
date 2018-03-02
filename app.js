const fs = require('fs');
const FeedParser = require('feedparser');
const request = require('request');
const Discord = require('./discord');
const formatDate = require('./formatDate');

//configure
const config = require('./config.json');
const lastrunStr = require('./result.json').lastrun;

let lastrun;
if(lastrunStr == null) {
	lastrun = new Date();
}else{
	lastrun = new Date(lastrunStr);
}

const feeds = config.feeds;
feeds.forEach(function(feedURL) {
	siteProcess(feedURL);
});

resultUpdate();

//RSSを取得して必要な処理を行う
function siteProcess(feedURL){
	const req = request(feedURL);  
	const feedparser = new FeedParser({});
	let articles = [];
	
	//Feed get
	req.on('response', function (res) {  
	  this.pipe(feedparser);
	});
	
	feedparser.on('readable', function() {  
	  while(item = this.read()) {
	    articles.push(item);
	  }
	});

	feedparser.on('end', function() {  
		articles.forEach(function(article) {
			if(isNewArticle(article)) {
				postMessageToDiscords(buildMessage(article));
			}
		});
	});
}

//Discordに投稿するメッセージを作成
function buildMessage(article){
	const postAt = article.pubDate;
	let postAtString = formatDate(postAt, 'YYYY/MM/DD hh:mm:ss');
	postAtString += "posted";
	const title = article.title;
	const link = article.link;

	return postAtString + "\n" +  title + "\n" + link;
}

//記事の投稿日時と最終実行日時を比較して新しければtrue
function isNewArticle(article){
	const postAt = new Date(article.pubDate);
	return postAt > lastrun;
}

//discordのURLへ新しい記事情報をpost
function postMessageToDiscords(message) {
	const discords = config.discords;
	discords.forEach(function(discordURL) {
		new Discord(discordURL).post(message);
	});
}

//result.jsonの最終実行日時を更新
function resultUpdate(){
	const data = {
		"lastrun": new Date()
	};
	fs.writeFileSync(config.result, JSON.stringify(data, '', '	'));
}
