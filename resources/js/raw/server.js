var TransmissionServer = {
	_token: '',
	_latestTorrentRefresh: 0,
	_currentPage: 1,
	_waitLock: false, // this will lock all update operations.
	_downloadFolder: '',

	sendServerRequest: function(data, callback) {
		var remote = TransmissionServer;

		if (typeof async != 'boolean')
			async = true;

		var ajaxSettings = {
			url: '../rpc',
			type: 'POST',
			contentType: 'json',
			dataType: 'json',
			cache: false,
			data: JSON.stringify(data),
			beforeSend: function(XHR){ if (remote._token) { XHR.setRequestHeader('X-Transmission-Session-Id', remote._token); } },
			error: function(request, error_string, exception){ TransmissionServer.ajaxErrorHandler(request, error_string, exception, ajaxSettings); },
			success: callback,
			async: true
		};

		if (TransmissionServer._waitLock) {
			setTimeout(function() {
				remote.sendServerRequest(data, callback);
			}, 100);
		}

		else {
			$.ajax(ajaxSettings);
		}
	},

	ajaxErrorHandler: function(request, error_string, exception, ajaxObject) {
		var token, remote = this;

		// set the Transmission-Session-Id on a 409
		if (request.status === 409 || (token = request.getResponseHeader('X-Transmission-Session-Id'))){
			remote._token = request.getResponseHeader('X-Transmission-Session-Id');
			$.ajax(ajaxObject);
			return;
		}

		remote._error = request.responseText
						? request.responseText.trim().replace(/(<([^>]+)>)/ig,"")
						: "";

		if (!remote._error.length)
			remote._error = 'Server not responding';

		toast('Connection Failed. Could not connect to the server. You may need to reload the page to reconnect.', 5000);
		toast(remote._error, 5000);
	},

	getSettings: function() {
		var o = { method: 'session-get' };

		TransmissionServer.sendServerRequest(o, function(response) {
			console.log(response);

			Formatter.units = response.arguments.units;

			if (response.arguments['alt-speed-enabled']) {
				$('a.speedLimitMode').removeClass('green');
				$('a.speedLimitMode').addClass('red');
			}

			else {
				$('a.speedLimitMode').removeClass('red');
				$('a.speedLimitMode').addClass('green');
			}
		});
	}
}