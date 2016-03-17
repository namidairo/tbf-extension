var bg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {
	document.body.onclick = function(e) {
		e = e.target;
		if (e.className && e.className.indexOf('server') != -1) {
			var id = e.getAttribute("data-id");
			bg.changeServer(id);
			bg.save_options();

			document.getElementsByClassName('server--selected')[0].classList.remove('server--selected');
			e.classList.add('server--selected');
		}
	}

	var html = '';
	for (var key in bg.per_country) {
		var servers = bg.per_country[key];
		for (var i = 0; i < servers.length; i++) {
			if (i == 0) {
				html += '<div class="country">' + bg.countries[key.replace(/^([a-zA-Z]+).*$/,"$1")] + '</div>';
			}

			html += '<div class="server ' + (bg.using == servers[i] ? 'server--selected' : '') + '" data-id="' + servers[i] + '">- ' + bg.replacements[servers[i]][1] + '</div>';
		}
	};
	document.getElementById('content').insertAdjacentHTML('afterbegin', html);
});