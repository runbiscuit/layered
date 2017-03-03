var Listener = {
	statisticsInterval: '',
	lastRefresh: 1000,
	showPerPage: 20,

	/*
					 _       _              _   _                _       _       
	 _   _ _ __   __| | __ _| |_ ___  ___  | |_| |__   ___    __| | __ _| |_ ___ 
	| | | | '_ \ / _` |/ _` | __/ _ \/ __| | __| '_ \ / _ \  / _` |/ _` | __/ _ \
	| |_| | |_) | (_| | (_| | ||  __/\__ \ | |_| | | |  __/ | (_| | (_| | ||  __/
	 \__,_| .__/ \__,_|\__,_|\__\___||___/  \__|_| |_|\___|  \__,_|\__,_|\__\___|
		  |_|                                                     (on the topbar)
	*/

	updateDate: function() {
		function updateDate() {
			var objToday = new Date(),
				weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
				dayOfWeek = weekday[objToday.getDay()],
				domEnder = new Array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' ),
				dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
				months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
				curMonth = months[objToday.getMonth()],
				curYear = objToday.getFullYear();
			var today = dayOfWeek + ", " + dayOfMonth + " of " + curMonth + " " + curYear;

			$('section.topBar p.additionalData span.timeNow').text(today);
		}

		updateDate();

		setInterval(function() {
			updateDate();
		}, 10000);
	},

	/*
					 _       _                       _   _   _                 
	 _   _ _ __   __| | __ _| |_ ___  ___   ___  ___| |_| |_(_)_ __   __ _ ___ 
	| | | | '_ \ / _` |/ _` | __/ _ \/ __| / __|/ _ \ __| __| | '_ \ / _` / __|
	| |_| | |_) | (_| | (_| | ||  __/\__ \ \__ \  __/ |_| |_| | | | | (_| \__ \
	 \__,_| .__/ \__,_|\__,_|\__\___||___/ |___/\___|\__|\__|_|_| |_|\__, |___/
		  |_|                               (for the client torrent) |___/     
	*/

	updateSettings: function() {
		$('section.floatingOptions a.settings').unbind();
		$('section.floatingOptions a.settings').click(function() {
			Sidebar.open('settings');
		});

		var doNotEdit = [
			'blocklist-size', 'config-dir', 'rpc-version', 'rpc-version-minimum', 'version'
		];

		var doNotDisplay = [
			'units', 'download-dir-free-space'
		];

		function updateSettings() {
			TransmissionServer.sendServerRequest({
				method: 'session-get'
			}, function(response) {
				$('section.sidebar section.settings table').html('');

				response = response.arguments;

				$.each(response, function(index, value) {
					if (doNotDisplay.indexOf(index) != -1) {
						// okay, let's do nothing :)
					}

					else if (doNotEdit.indexOf(index) != -1) {
						$('section.sidebar section.settings table').append('<tr><td>' + index + '</td><td><input disabled value="' + value + '"></td></tr>');
					}

					else {
						if (typeof value == 'boolean') {
							$('section.sidebar section.settings table').append('<tr><td>' + index + '</td><td><div class="switch"><label>Off<input type="checkbox" name="' + index + '"><span class="lever"></span>On</label></div></td></tr>');
							$('section.sidebar section.settings table input[type="checkbox"][name="' + index + '"]').prop('checked', value);
							$('section.sidebar section.settings table input[type="checkbox"][name="' + index + '"]').val(value);
						}

						else {
							if (index == 'download-dir') {
								$('section.sidebar section.settings table').append('<tr data-spec="download-dir"><td>' + index + '</td><td><input name="' + index + '" value="' + value + '"></td></tr>');
							}

							else {
								$('section.sidebar section.settings table').append('<tr><td>' + index + '</td><td><input name="' + index + '" value="' + value + '"></td></tr>');
							}
						}

						if (index == 'download-dir') {
							TransmissionServer.sendServerRequest({
								method: 'free-space',
								arguments: {
									'path': value
								}
							}, function(response) {
								response = response.arguments;

								$('<tr><td>download-dir-free-space</td><td><input disabled value="' + Formatter.size(response['size-bytes']) + '"></td></tr>').insertAfter($('section.sidebar section.settings table tr[data-spec="download-dir"]'));
							});
						}
					}
				});

				$('section.sidebar section.settings table input[type="checkbox"]').unbind();
				$('section.sidebar section.settings table input[type="checkbox"]').click(function(){
					$(this).val($(this).prop('checked'));
				});

				Listener.updateSettingsButton();
			});
		}

		updateSettings();
	},

	updateSettingsButton: function() {
		$('section.sidebar section.settings a.updateSettingsButton').unbind();
		$('section.sidebar section.settings a.updateSettingsButton').click(function() {
			var args = $('section.sidebar section.settings table tr td input:not(disabled)').serializeArray();

			TransmissionServer.sendServerRequest({
				method: 'session-set',
				arguments: args
			}, function(response) {
				Materialize.toast('Success!', 500, 'rounded');
			});
		});
	},

	/*
					 _       _                  _        _   _     _   _          
	 _   _ _ __   __| | __ _| |_ ___  ___   ___| |_ __ _| |_(_)___| |_(_) ___ ___ 
	| | | | '_ \ / _` |/ _` | __/ _ \/ __| / __| __/ _` | __| / __| __| |/ __/ __|
	| |_| | |_) | (_| | (_| | ||  __/\__ \ \__ \ || (_| | |_| \__ \ |_| | (__\__ \
	 \__,_| .__/ \__,_|\__,_|\__\___||___/ |___/\__\__,_|\__|_|___/\__|_|\___|___/
		  |_|                                   (on the topbar and statistics tab)
	*/

	updateStatistics: function() {
		$('section.topBar p.additionalData span.statistics').unbind();
		$('section.topBar p.additionalData span.statistics').click(function() {
			Sidebar.open('statistics');

			$('section.sidebarOverflow').click(function() {
				clearInterval(Listener.statisticsInterval);
				$('section.sidebarOverflow').unbind();
			});
		});

		function updateStatistics() {
			TransmissionServer.sendServerRequest({
				method: 'session-stats', 
				arguments: [ "activeTorrentCount", "downloadSpeed", "pausedTorrentCount", "torrentCount", "uploadSpeed", "current-stats" ]
			}, function(response) {
				response = response.arguments;

				$('section.topBar p.additionalData span.bandwidth').text('D: ' + Formatter.speed(response.downloadSpeed) + ' | U: ' + Formatter.speed(response.uploadSpeed));

				$('section.sidebar section.statistics table tr td.activeTorrents').text(response.activeTorrentCount);
				$('section.sidebar section.statistics table tr td.pausedTorrents').text(response.pausedTorrentCount);
				$('section.sidebar section.statistics table tr td.totalDownloaded').text(Formatter.size(response['cumulative-stats'].downloadedBytes) + ' (' + Formatter.size(response['current-stats'].downloadedBytes) + ' this session)');
				$('section.sidebar section.statistics table tr td.totalUploaded').text(Formatter.size(response['cumulative-stats'].uploadedBytes) + ' (' + Formatter.size(response['current-stats'].uploadedBytes) + ' this session)');
				$('section.sidebar section.statistics table tr td.ratio').text(Formatter.ratio(response['cumulative-stats'].downloadedBytes, response['cumulative-stats'].uploadedBytes) + ' (' + Formatter.ratio(response['current-stats'].downloadedBytes, response['current-stats'].uploadedBytes) + ' this session)');
				$('section.sidebar section.statistics table tr td.uptime').text(Formatter.duration(response['cumulative-stats'].secondsActive) + ' (' + Formatter.duration(response['current-stats'].secondsActive) + ' this session)');
			});
		}

		updateStatistics();

		Listener.statisticsInterval = setInterval(function() { 
			updateStatistics();
		}, 1000);
	},

	/*
							 _   _ _           _ _     _           _   _              
	 ___ _ __   ___  ___  __| | | (_)_ __ ___ (_) |_  | |__  _   _| |_| |_ ___  _ __  
	/ __| '_ \ / _ \/ _ \/ _` | | | | '_ ` _ \| | __| | '_ \| | | | __| __/ _ \| '_ \ 
	\__ \ |_) |  __/  __/ (_| | | | | | | | | | | |_  | |_) | |_| | |_| || (_) | | | |
	|___/ .__/ \___|\___|\__,_| |_|_|_| |_| |_|_|\__| |_.__/ \__,_|\__|\__\___/|_| |_|
		|_|                                                                 (global)  
	*/

	toggleSpeedLimitButton: function() {
		$('section.floatingOptions a.speedLimitMode').unbind();

		$('section.floatingOptions a.speedLimitMode').click(function() {
			TransmissionServer.sendServerRequest({
				method: 'session-set', 
				arguments: {
					'alt-speed-enabled': ($('a.speedLimitMode').hasClass('green')) ? true : false
					// green means that alt-speed is not enabled
				}
			}, function(response) {
				Materialize.toast('Success!', 500, 'rounded');
				TransmissionServer.getSettings();
			});
		});
	},

	addTorrent: function() {
		$('section.floatingOptions a.addTorrent').unbind();
		$('section.floatingOptions a.addTorrent').click(function() {
			Sidebar.open('addTorrent');

			$('input#startAutomatically').prop('checked', true);

			function addTorrentLink() {
				if ($('input.torrentLink').val() !== '') {
					TransmissionServer.sendServerRequest({
						method: 'torrent-add',
						arguments: {
							'filename': $('input.torrentLink').val(),
							'paused': !$('input#startAutomatically').prop('checked')
						}
					}, function(response) {
						if (response.result != 'success') {
							Materialize.toast('Error adding torrent: ' + response.result, 2000, 'rounded');
						}

						else {
							Materialize.toast('Torrent added!', 2000, 'rounded');
						}

						$('input.torrentLink').val('');
						$('input.torrentFile').prop('files', []);
					});
				}
			}

			$('section.sidebar section.addTorrent a.addTorrent').unbind();
			$('section.sidebar section.addTorrent a.addTorrent').click(function() {
				var files = $('section.sidebar section.addTorrent input.torrentFile')[0].files;

				addTorrentLink();

				if ($('section.sidebar section.addTorrent input.torrentFilePathDisplay') != '') {
					// if user cleared the text field in an attempt to make things work, don't run

					$.each(files, function(index, file) {
						var torrentFile = file;
						var filereader = new FileReader();
						
						filereader.onload = function() { 
							file = filereader.result; 
							file = (file.indexOf('base64,') > -1) ? file.substring(file.indexOf('base64,') + 7) : false;

							if (file != false) {
								TransmissionServer.sendServerRequest({
									method: 'torrent-add',
									arguments: {
										'metainfo': file,
										'paused': !$('input#startAutomatically').prop('checked')
									}
								}, function(response) {
									if (response.result != 'success') {
										console.log(file);
										Materialize.toast('Error adding torrent: ' + response.result, 2000, 'rounded');
									}

									else {
										Materialize.toast('Torrent added!', 2000, 'rounded');
									}
								});
							}
						};

						filereader.readAsDataURL(torrentFile);
					});
				}

				$('section.sidebar section.addTorrent input.torrentFilePathDisplay').val('');
			});
		});
	},

	/*
	 _                            _                            _  __ _      
	| |_ ___  _ __ _ __ ___ _ __ | |_      ___ _ __   ___  ___(_)/ _(_) ___ 
	| __/ _ \| '__| '__/ _ \ '_ \| __|____/ __| '_ \ / _ \/ __| | |_| |/ __|
	| || (_) | |  | | |  __/ | | | ||_____\__ \ |_) |  __/ (__| |  _| | (__ 
	 \__\___/|_|  |_|  \___|_| |_|\__|    |___/ .__/ \___|\___|_|_| |_|\___|
											  |_|                           
	*/

	batchOperations: function() {
		var actions = {
			"Start": 'torrent-start',
			"Pause": 'torrent-stop',
			"Verify": 'torrent-verify',
			"Ask tracker for more peers": 'torrent-reannounce',
			"Remove": 'torrent-remove',
			"Close": 'close'
		};

		$('section.floatingActions ul a').unbind();
		$('section.floatingActions ul a').click(function() {
			var id = [];
			var action = actions[$(this).data('action')];

			if ($('section.torrents section.torrent.selected').length == 1) {
				id = $('section.torrents section.torrent.selected').data('id');
			}

			else {
				id = $('section.torrents section.torrent.selected').map(function(){
					return $(this).data('id');
				}).get();
			}

			if (action != 'torrent-remove') {
				TransmissionServer.sendServerRequest({
					method: action,
					arguments: {
						ids: id
					}
				}, function(response) {
					Materialize.toast('Success!', 500, 'rounded');
				});
			}

			else {
				Listener.removeTorrent(id);
			}
		});
	},

	changeDownloadedFiles: function() {
		$('section.sidebar section#files span.download input[type="checkbox"]').unbind();

		$('section.sidebar section#files span.download input[type="checkbox"]').click(function() {
			var torrentId = $(this).data('torrentid');
			var fileId = $(this).data('fileid');
			var value = $(this).prop('checked');

			if (value) {
				TransmissionServer.sendServerRequest({
					method: 'torrent-set', 
					arguments: {
						'ids': torrentId,
						'files-wanted': [ fileId ]
					}
				}, function(response) {
					Materialize.toast('Success!', 500, 'rounded');
				});
			}

			else {
				TransmissionServer.sendServerRequest({
					method: 'torrent-set', 
					arguments: {
						'ids': torrentId,
						'files-unwanted': [ fileId ]
					}
				}, function(response) {
					Materialize.toast('Success!', 500, 'rounded');
				});
			}
		});
	},

	changeSettingsTorrent: function(id) {
		$('section.sidebar section#options a.saveChanges').unbind();

		$('section.sidebar section#options a.saveChanges').data('id');

		$('section.sidebar section#options a.saveChanges').click(function() {
			var bandwidthPriority = ($('input.priority#low').prop('checked') == true) ? -1 : (($('input.priority#normal').prop('checked') == true) ? 0 : 1);

			TransmissionServer.sendServerRequest({
				method: 'torrent-set', 
				arguments: {
					'ids': $(this).data('id'),
					
					'bandwidthPriority': bandwidthPriority,
					'downloadDir': $('section#options table input.downloadDirectory').val(),
					'downloadLimited': $('section#options table .downloadSpeedToggle input').prop('checked'),
					'downloadLimit': $('section#options table input.downloadSpeed').val(),
					'uploadLimited': $('section#options table .uploadSpeedToggle input').prop('checked'),
					'uploadLimit': $('section#options table input.uploadSpeed').val(),
					'seedRatioLimit': $('section#options table input.stopSeedingAt').val(),
					'maxConnectedPeers': $('section#options table input.maxConnections').val()
				}
			}, function(response) {
				$('#Materialize.toast-container').css('z-index', 100001);
				Materialize.toast('Success!', 500, 'rounded');
				setTimeout(function() { $('#Materialize.toast-container').css('z-index', 10000); }, 550);
			});

			$('section#options table .downloadSpeedToggle input').prop('checked');
			$('section#options table .uploadSpeedToggle input').prop('checked');
			$('section#options table input.downloadDirectory').val();
			$('section#options table input.priority').val();
			$('section#options table input.stopSeedingAt').val();
			$('section#options table input.downloadSpeed').val();
			$('section#options table input.uploadSpeed').val();
			$('section#options table input.maxConnections').val();
		});
	},

	changeTorrentColors: function(id, statusCode, torrent, element, messageElement) {
		// adapted code from:
		// https://github.com/transmission/transmission/blob/4c00df9463ea4fd70b73c620e439f5c3ee5efa60/web/javascript/torrent.js#L375
		// (transmission web interface, torrent.js)

		if (statusCode === 0) {
			// torrent has been paused

			messageElement.text('Paused');
			element.removeClass('default paused queued downloading seeding idling errored').addClass('paused');
		}

		else if (statusCode == 1 || statusCode == 2 || statusCode == 3) {
			// 1: torrent has been queued for verification

			if (statusCode == 1) {
				messageElement.text('Queued for verification');
			}

			// 2: torrent data is verifying

			if (statusCode == 2) {
				messageElement.text('Verifying local data');
			}

			// 3: torrent has been queued

			if (statusCode == 3) {
				messageElement.text('Queued');
			}

			element.removeClass('default paused queued downloading seeding idling errored').addClass('queued');
		}

		else if (statusCode == 4) {
			// 4: torrent is downloading

			messageElement.text('Downloading: ' + Formatter.speed(torrent.rateDownload) + ', Seeding: ' + Formatter.speed(torrent.rateUpload));
			element.removeClass('default paused queued downloading seeding idling errored').addClass('downloading');
		}

		else if (statusCode == 5) {
			// 5: torrent is queued for seeding

			messageElement.text('Downloaded, queued for seeding');
			element.removeClass('default paused queued downloading seeding idling errored').addClass('queued');
		}

		else if (statusCode == 6 || statusCode == 8) {
			// 6 & 8: torrent is seeding (see https://forum.transmissionbt.com/viewtopic.php?t=13357#p60235)

			messageElement.text('Seeding: ' + Formatter.speed(torrent.rateUpload) + '');
			element.removeClass('default paused queued downloading seeding idling errored').addClass('seeding');
		}

		else {
			// assume status to be unknown if no known value is returned

			messageElement.text('Unknown');
			element.removeClass('default paused queued downloading seeding idling errored').addClass('errored');
		}

		if (torrent.error !== 0) {
			// regardless of status, if error > 0, regard it as an error
			
			if (torrent.error == 1) {
				messageElement.text('Tracker Warning: ');
			}

			else if (torrent.error == 2) {
				messageElement.text('Tracker Error: ');
			}


			else {
				messageElement.text('Error: ');
			}

			messageElement.text(messageElement.text() + torrent.errorString + ' [#' + torrent.error + ']');
			element.removeClass('default paused queued downloading seeding idling errored').addClass('errored');
		}
	},

	getMoreTorrentDetails: function() {
		$('section.torrents section.torrent a.getMoreDetails').unbind();

		$('section.torrents section.torrent:not(.hidden) a.getMoreDetails, section.torrents.searchQuery section.torrent.result a.getMoreDetails').click(function() {
			TransmissionServer._waitLock = true;

			var id = $(this).parent().parent().data('id');
			var element = $(this).parent().parent();

			$('section.parachute').css('top', $('body').scrollTop());

			$('section.parachute').fadeIn(300, function() {
				element.addClass('hidden');

				element.children('section.card-action').fadeOut();
				element.addClass('stacked');

				element.removeClass('hidden');

				element.css('top', $('body').scrollTop() + $('body').height());

				element.animate({
					'top': $('body').scrollTop(),
				}, 300);

				TorrentSidebar.initialize(id, element);
				Sidebar.open('torrentInformation');
			});
		});
	},

	getTorrents: function() {
		var o = { method: 'torrent-get', "arguments": { "fields": [ "id", "name", "status", "totalSize", "sizeWhenDone", "haveValid", "leftUntilDone", "haveUnchecked", "eta", "downloadedEver", "uploadedEver", "uploadRatio", "rateDownload", "rateUpload", "metadataPercentComplete", "addedDate", "trackerStats", "error", "errorString", "recheckProgress", "bandwidthPriority", "seedRatioMode", "seedRatioLimit" ] } };
		var errored = false;
		Listener.lastRefresh = Date.now();

		TransmissionServer.sendServerRequest(o, function(response) {
			torrents = response.arguments.torrents;

			if ($('section.torrentPagination button.pageInfo span.currentPage').text() == '') {
				$('section.torrentPagination button.pageInfo span.currentPage').text('1');
			}

			var totalPages = Math.floor(torrents.length / Listener.showPerPage);
			(torrents.length % Listener.showPerPage > 0) ? totalPages++ : false;
			$('section.torrentPagination button.pageInfo span.totalPages').text(totalPages);

			$.each(torrents, function(index, torrent) {
				torrent.totalEver = Formatter.size(torrent.downloadedEver + torrent.uploadedEver);
				torrent.downloadedEver = Formatter.size(torrent.downloadedEver);
				torrent.uploadedEver = Formatter.size(torrent.uploadedEver);
				torrent.percentageDone = Formatter.percentageDone(torrent.leftUntilDone, torrent.totalSize);
				torrent.uploadRatio = Math.round((torrent.uploadRatio) * 100) / 100;

				Listener.changeTorrentColors(torrent.id, torrent.status, torrent, $('section.torrents section.torrent[data-id="' + torrent.id + '"]'), $('section.torrents section.torrent[data-id="' + torrent.id + '"] p.message'));
				Listener.toggleTorrentStatus(torrent.id, torrent.status, torrent, $('section.torrents section.torrent[data-id="' + torrent.id + '"] i.material-icons.toggle'));

				if ($('section.torrents section.torrent[data-id="' + torrent.id + '"]').length) {
					$('section.torrents section.torrent[data-id="' + torrent.id + '"] h3.torentName span.name').text(torrent.torrentName);
					$('section.torrents section.torrent[data-id="' + torrent.id + '"] span.downloaded').text(torrent.downloadedEver);
					$('section.torrents section.torrent[data-id="' + torrent.id + '"] span.uploaded').text(torrent.uploadedEver);
					$('section.torrents section.torrent[data-id="' + torrent.id + '"] span.total').text(torrent.totalEver);
					$('section.torrents section.torrent[data-id="' + torrent.id + '"] span.uploadRatio').text(torrent.uploadRatio);

					if ($('section.torrents section.torrent[data-id="' + torrent.id + '"] .determinate').css('width') != torrent.percentageDone) {
						$('section.torrents section.torrent[data-id="' + torrent.id + '"] .determinate').css({ width: torrent.percentageDone });
					}

					$('section.torrents section.torrent[data-id="' + torrent.id + '"]').data('href', Listener.lastRefresh);
				}

				else {
					$('section.elements section.torrent.unset').clone().appendTo('section.torrents');

					$('section.torrents section.torrent.unset').attr('data-id', torrent.id);
					$('section.torrents section.torrent.unset').attr('data-href', Listener.lastRefresh);

					$('section.torrents section.torrent.unset span.name').text(torrent.name);
					$('section.torrents section.torrent.unset span.downloaded').text(torrent.downloadedEver);
					$('section.torrents section.torrent.unset span.uploaded').text(torrent.uploadedEver);
					$('section.torrents section.torrent.unset span.total').text(torrent.totalEver);
					$('section.torrents section.torrent.unset span.uploadRatio').text(torrent.uploadRatio);
					$('section.torrents section.torrent.unset section.progress section.intermediate').css('width', torrent.percentageDone);

					$('section.torrents section.torrent.unset').removeClass('unset');

					Listener.changeTorrentColors(torrent.id, torrent.status, torrent, $('section.torrents section.torrent[data-id="' + torrent.id + '"]'), $('section.torrents section.torrent[data-id="' + torrent.id + '"] p.message'));
				}

				if (torrent.error !== 0) { errored = true; }
			});

			$('section.torrents section.torrent').each(function(index, torrent) {
				if ($(this).data('href') != Listener.lastRefresh) {
					$(this).fadeOut();
				}
			});

			if (errored) { $('section.header ul li[data-href="errored"]').fadeIn(); }
			else { $('section.header ul li[data-href="errored"]').fadeOut(); }

			Listener.batchOperations();
			Listener.getMoreTorrentDetails();
			Listener.selectTorrent();
			Listener.torrentPagination();
		});

		setTimeout(function() { Listener.getTorrents(); }, 1250);
	},

	removeTorrent: function(ids) {
		$('section.sidebar section.removeTorrent span.torrentString').text(ids.length);

		if (ids.length != 1) { $('section.sidebar section.removeTorrent span.plural').removeClass('hidden'); }
		else { $('section.sidebar section.removeTorrent span.plural').addClass('hidden'); }

		if (ids.length == 0) ids = [];

		$('section.sidebar section.removeTorrent a.removeTorrent').unbind();
		$('section.sidebar section.removeTorrent a.removeTorrent').click(function() {
			TransmissionServer.sendServerRequest({
				method: 'torrent-remove',
				arguments: {
					'ids': ids,
					'delete-local-data': $('section.sidebar section.removeTorrent input#deleteAllData').prop('checked')
				}
			}, function(response) {
				Materialize.toast('Success!', 500, 'rounded');
			});
		})

		Sidebar.open('removeTorrent');
	},

	searchTorrent: function() {
		$('section.torrentSearch input.search').unbind();

		$('section.torrentSearch input.search').keyup(function() {
			var value = $(this).val().toLowerCase();
			var odd = true;

			if (value.length == 0) {
				$('section.torrents').removeClass('searchQuery').addClass(activeTab);
				$('section.torrentPagination').slideDown(75);

				$('section.torrents section.torrent').removeClass('result suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5');

				$('section.torrentSearch').animate({
					'padding': '0 40px 15px'
				}, 75);

				$('section.torrentPagination').slideDown(75);
			}

			else {
				$('section.torrentSearch').animate({
					'padding': '15px 40px'
				}, 75);

				$('section.torrentPagination').slideUp(75);

				$('section.torrents section.torrent').each(function(index, torrent) {
					var torrentName = $(this).find('section.card-content h3.torrentName span.name').text().toLowerCase();

					if (torrentName.indexOf(value) != -1 || torrentName == '') {
						$('section.torrents').removeClass('all downloading seeding idling paused errored').addClass('searchQuery');
						$(this).removeClass('result suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5').addClass('result ' + ((odd) ? 'suffix-2 tablet-suffix-5' : 'prefix-2 tablet-prefix-5'));
						odd = !odd;
					}

					else {
						$(this).removeClass('suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5').removeClass('result');
					}		
				});
			}

			Listener.getMoreTorrentDetails();
		});
	},

	searchTracker: function() {
		$('section#trackers section.trackerSearch input.search').unbind();

		$('section#trackers section.trackerSearch input.search').keyup(function() {
			var value = $(this).val().toLowerCase();

			if (value.length == 0) {
				$('section.trackers').removeClass('searchQuery');
			}

			else {
				$('section#trackers section.tracker').each(function(index, tracker) {
					var trackerName = $(this).data('host').toLowerCase();

					$('section.trackers').addClass('searchQuery');

					if (trackerName.indexOf(value) != -1 || trackerName == '') {
						$(this).addClass('result');
					}

					else {
						$(this).removeClass('result');
					}
				});
			}
		});
	},

	selectTorrent: function() {
		$('section.torrents section.torrent a.selectTorrent').unbind();

		$('section.torrents section.torrent:not(.hidden) a.selectTorrent, section.torrents.searchQuery section.torrent.result a.selectTorrent').click(function() {
			var element = $(this).parent().parent();
			element.toggleClass('selected');
		});
	},

	toggleTorrentStatus: function(id, statusCode, torrent, element) {
		// unbind this element from any .click() events
		element.unbind();

		if (element.data('statusCode') != element) {
			element.data('statusCode', element);

			if (statusCode == 0) {
				// torrent has been stopped or paused

				if (torrent.error == 0) {
					element.text('play_arrow');
				}

				else {
					element.text('');
				}

				element.click(function() {
					TransmissionServer.sendServerRequest({
						method: 'torrent-start',
						arguments: {
							'ids': id
						}
					},
					function(response) {
						Materialize.toast('Torrent started.', 1000, 'rounded');
					});
				});
			}

			else if (statusCode == 3 || statusCode == 4 || statusCode == 6 || statusCode == 8) {
				// 3: torrent has been queued
				// 4: torrent is downloading
				// 6 & 8: torrent is seeding (see https://forum.transmissionbt.com/viewtopic.php?t=13357#p60235)

				element.text('stop');

				element.click(function() {
					TransmissionServer.sendServerRequest({
						method: 'torrent-stop',
						arguments: {
							'ids': id
						}
					},
					function(response) {
						Materialize.toast('Torrent stopped.', 1000, 'rounded');
					});
				});
			}
		}
	},

	toggleTorrentPage: function(pageID) {
		if ($('section.torrentSearch input.search').val().length == 0) {
			$('section.torrents section.torrent').addClass('hidden');

			var torrents = $('section.torrents section.torrent').length;
			var torrentStart = (pageID - 1) * Listener.showPerPage;
			var torrentEnd = (pageID * Listener.showPerPage) - 1;

			$('section.torrents section.torrent').each(function(index, torrent) {
				if (index >= torrentStart && index <= torrentEnd) {
					$(this).removeClass('hidden');
				}

				else {
					$(this).addClass('hidden');
				}
			});
		}
	},

	torrentPagination: function() {
		$('section.torrentPagination button.previousPage, section.torrentPagination button.nextPage').unbind();

		Listener.toggleTorrentPage($('section.torrentPagination button.pageInfo span.currentPage').text());

		var currentPage = parseInt($('section.torrentPagination button.pageInfo span.currentPage').text());
		var totalPages = parseInt($('section.torrentPagination button.pageInfo span.totalPages').text());

		if (currentPage > totalPages) {	
			Listener.toggleTorrentPage(totalPages);
			$('section.torrentPagination button.pageInfo span.currentPage').text(totalPages);
		}

		$('section.torrentPagination button.previousPage').click(function() {
			var newPage = parseInt($('section.torrentPagination button.pageInfo span.currentPage').text()) - 1;

			if (newPage > 0) {
				Listener.toggleTorrentPage(newPage);
				$('section.torrentPagination button.pageInfo span.currentPage').text(newPage);
			}
		});

		$('section.torrentPagination button.nextPage').click(function() {
			var newPage = parseInt($('section.torrentPagination button.pageInfo span.currentPage').text()) + 1;

			if (newPage < parseInt($('section.torrentPagination button.pageInfo span.totalPages').text()) + 1) {
				Listener.toggleTorrentPage(newPage);
				$('section.torrentPagination button.pageInfo span.currentPage').text(newPage);
			}
		});
	},

	/*
	                   _ _ _       
	  ___ _ __ ___  __| (_) |_ ___ 
	 / __| '__/ _ \/ _` | | __/ __|
	| (__| | |  __/ (_| | | |_\__ \
	 \___|_|  \___|\__,_|_|\__|___/

	*/

	showCredits: function() {
		$('section.floatingOptions ul li a.credits').unbind();
		$('section.floatingOptions ul li a.credits').click(function() {
			Sidebar.open('credits');
		})
	},
}