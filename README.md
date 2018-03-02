# DiscordRSSBot

# Description
指定したWebサイトのRSSを取得し、新規記事があればDiscordにpostするbot。
サイトも投稿先Discordも複数指定可能。

cronで動かすことを想定しています。

Node.js Ver9.4.0以降推奨(9.4.0でのみ動作確認)

# usage

	$ git clone https://github.com/ryoctrl/DiscordRSSBot.git

	$ cd DiscordRSSBot
	$ cp config.defaults config.json
	
	$ vi config.json
	# discordsにAPIのURL
	# feedsに各サイトのRSSURLを追加
	# 以下のように
	discords: [
		"https://discordapp.com/api/webhooks/xxxxxx/xxxxx",
		"https://discordapp.com/api/webhooks/yyyyyy/yyyyy"		
	],
	feeds: [
		"https://siteA/feed",
		"https://siteB/RSS"
	]
	
	$ crontab -e

	# 以下を追記
	* * * * * node /path/to/DiscordRSSBot/app.js








