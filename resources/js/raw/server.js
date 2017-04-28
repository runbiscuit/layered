var TransmissionServer = {
	_token: '',
	_latestTorrentRefresh: 0,
	_currentPage: 1,
	_waitLock: false, // this will lock all update operations.
	_downloadFolder: '',

	sendServerRequest: function(data, callback) {
		if (typeof async != 'boolean')
			async = true;

		var ajaxSettings = {
			url: '../rpc',
			type: 'POST',
			contentType: 'json',
			dataType: 'json',
			cache: false,
			data: JSON.stringify(data),
			beforeSend: function(XHR){ if (TransmissionServer._token) { XHR.setRequestHeader('X-Transmission-Session-Id', TransmissionServer._token); } },
			error: function(request, error_string, exception){ TransmissionServer.ajaxErrorHandler(request, error_string, exception, ajaxSettings); },
			success: callback,
			async: true
		};

		if (TransmissionServer._waitLock) {
			setTimeout(function() {
				TransmissionServer.sendServerRequest(data, callback);
			}, 250);
		}

		else {
			$.ajax(ajaxSettings);
		}
	},

	ajaxErrorHandler: function(request, error_string, exception, ajaxObject) {
		var token;

		// set the Transmission-Session-Id on a 409
		if (request.status === 409 || (token = request.getResponseHeader('X-Transmission-Session-Id'))){
			TransmissionServer._token = request.getResponseHeader('X-Transmission-Session-Id');
			$.ajax(ajaxObject);
			return;
		}

		TransmissionServer._error = request.responseText ? request.responseText.trim().replace(/(<([^>]+)>)/ig,"") : "";

		if (!TransmissionServer._error.length)
			TransmissionServer._error = i18n.server.notResponding;

		Materialize.toast(TransmissionServer._error, 2500, 'rounded');
	},

	getSettings: function() {
		var o = { method: 'session-get' };

		TransmissionServer.sendServerRequest(o, function(response) {
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
};