var simple = false;

var using = 16;
var search = /vid.*hls.*(\/hls.*.ts)/;

var countries = {
	"none": "Default/None",
	"GL": "Global Server",
	"US": "United States",
	"SE": "Sweden",
	"UK": "United Kingdom",
	"NL": "Netherlands",
	"FR": "France",
	"DE": "Germany",
	"CZ": "Czech Republic",
	"AU": "Australia"
};

var replacements = [
	["none", "Local server", "none"],
	["GL", "Level3 cdn", "twitch2-live.hls.adaptive.level3.net"],

	["US-1", "San Francisco", "video-edge-2ca3e4.sfo01.hls.ttvnw.net"],
	["US-2", "Seattle", "video-edge-7ea618.sea01.hls.ttvnw.net"],
	["US-3", "San Jose", "video-edge-7e96ac.sjc01.hls.ttvnw.net"],
	["US-4", "Chicago", "video-edge-835140.ord02.hls.ttvnw.net"],
	["US-5", "Washington", "video20.iad02.hls.ttvnw.net"],
	["US-6", "New York", "video20.jfk01.hls.ttvnw.net"],
	["US-7", "Los Angeles", "video20.lax01.hls.ttvnw.net"],
	["US-8", "Dallas", "video20.dfw01.hls.ttvnw.net"],

	["SE", "Stockholm", "video20.arn01.hls.ttvnw.net"],

	["UK", "London", "video20.lhr02.hls.ttvnw.net"],

	["NL", "Amsterdam", "video20.ams01.hls.ttvnw.net"],

	["FR", "Paris", "video16.cdg01.hls.ttvnw.net"],

	["DE", "Frankfurt", "video20.fra01.hls.ttvnw.net"],

	["CZ", "Prague", "video20.prg01.hls.ttvnw.net"],

	["AU", "Sydney", "video-edge-8c6ee0.syd01.hls.ttvnw.net"]
];

var per_country = {};
for (var i = 0; i < replacements.length; i++) {
	var country = replacements[i][0].replace(/^([a-zA-Z]+).*$/,"$1");
	if (typeof per_country[country] == 'undefined') {
		per_country[country] = [];
	}
	per_country[country].push(i);
}

function updateButton() {
	var cluster = replacements[using][0];
	chrome.browserAction.setBadgeText({
		text: cluster.toString()
	});
}

function changeServer(id) {
	using = parseInt(id);
	updateButton();
}

function click() {
	if (using > replacements.length -2)
		using = 0
	else
		using += 1;
	updateButton();
}

function save_options() {
  chrome.storage.sync.set({
    "defaultserver": using
  }, function() {
  });
}

function restore_options() {
  chrome.storage.sync.get({
    defaultserver: 16
  }, function(items) {
    changeServer(items.defaultserver);
  });
}

function init() {
	//Load default server
	restore_options();
	chrome.webRequest.onBeforeRequest.addListener(
		function(info) {
			if (info.url.indexOf(".ts") > -1) {
				var conf;
				var subject = info.url;

				if (using == 0) {
					return {};
				}

				conf = replacements[using][2];
				subject = subject.replace(search, conf + "$1");

				if (subject !== info.url) {
					return {
						redirectUrl: subject
					};
				}
			} else
				return {};
		}, {
			urls: [
				"*://*/*"
			]
		}, ["blocking"]
	);

	updateButton();
}

function resimple() {
	if(simple) {
		chrome.contextMenus.update("toggle", {"title":"Simple Mode"});
		chrome.browserAction.setPopup({popup: "popup.html"});
		simple = false;
	}
	else {
		chrome.contextMenus.update("toggle", {"title":"List Mode"});
		chrome.browserAction.setPopup({popup: ""});
		simple = true;
	}
}

chrome.contextMenus.create({
	"id": "toggle",
	"title": "Simple Mode",
	"contexts": ["all"],
	"onclick": resimple
});

chrome.browserAction.onClicked.addListener(click);

init();