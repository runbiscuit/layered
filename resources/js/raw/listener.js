var Listener = {
	statisticsInterval: '',
	lastRefresh: 1000,

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
			$('body').css('overflow', 'hidden');

			$('section.settingsSidebar').animate({
				right: '0%'
			}, 300);

			setTimeout(function() { $('section.clickToClose').css('padding', (($(window).height() - $('section.clickToClose').height()) / 4) + 'px 0px ' + (($(window).height() - $('section.clickToClose').height()) / 4 * 3) + 'px 0px'); }, 100);

			$('section.sidebarOverflow').removeClass('hidden');

			$('section.sidebarOverflow').unbind();
			$('section.sidebarOverflow').click(function() {
				$('body').css('overflow', 'initial');

				$('section.settingsSidebar').animate({
					right: '-100%'
				}, 300);

				$('section.sidebarOverflow').addClass('hidden');
			});
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
				$('section.settingsSidebar table').html('');

				response = response.arguments;

				$.each(response, function(index, value) {
					if (doNotDisplay.indexOf(index) != -1) {
						// okay, let's do nothing :)
					}

					else if (doNotEdit.indexOf(index) != -1) {
						$('section.settingsSidebar table').append('<tr><td>' + index + '</td><td><input disabled value="' + value + '"></td></tr>');
					}

					else {
						if (typeof value == 'boolean') {
							$('section.settingsSidebar table').append('<tr><td>' + index + '</td><td><div class="switch"><label>Off<input type="checkbox" name="' + index + '"><span class="lever"></span>On</label></div></td></tr>');
							$('section.settingsSidebar table input[type="checkbox"][name="' + index + '"]').prop('checked', value);
							$('section.settingsSidebar table input[type="checkbox"][name="' + index + '"]').val(value);
						}

						else {
							if (index == 'download-dir') {
								$('section.settingsSidebar table').append('<tr data-spec="download-dir"><td>' + index + '</td><td><input name="' + index + '" value="' + value + '"></td></tr>');
							}

							else {
								$('section.settingsSidebar table').append('<tr><td>' + index + '</td><td><input name="' + index + '" value="' + value + '"></td></tr>');
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

								$('<tr><td>download-dir-free-space</td><td><input disabled value="' + Formatter.size(response['size-bytes']) + '"></td></tr>').insertAfter($('section.settingsSidebar table tr[data-spec="download-dir"]'));
							});
						}
					}
				});

				$('section.settingsSidebar table input[type="checkbox"]').unbind();
				$('section.settingsSidebar table input[type="checkbox"]').click(function(){
					$(this).val($(this).prop('checked'));
				});

				Listener.updateSettingsButton();
			});
		}

		updateSettings();
	},

	updateSettingsButton: function() {
		$('section.settingsSidebar a.updateSettingsButton').unbind();
		$('section.settingsSidebar a.updateSettingsButton').click(function() {
			var args = $('section.settingsSidebar table tr td input:not(disabled)').serialize().split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];

			$.each(args, function(index, val) {
				while (val.indexOf('%2F') != -1) {
					val = val.replace('%3A', ':').replace('%2F', '/');
				}

				args[index] = val;
			});

			TransmissionServer.sendServerRequest({
				method: 'session-set',
				arguments: args
			}, function(response) {
				toast('Success!', 500);
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
			$('body').css('overflow', 'hidden');

			$('section.statisticsSidebar').animate({
				right: '0%'
			}, 300);

			setTimeout(function() { $('section.clickToClose').css('padding', (($(window).height() - $('section.clickToClose').height()) / 4) + 'px 0px ' + (($(window).height() - $('section.clickToClose').height()) / 4 * 3) + 'px 0px'); }, 100);

			$('section.sidebarOverflow').removeClass('hidden');

			$('section.sidebarOverflow').unbind();
			$('section.sidebarOverflow').click(function() {
				$('body').css('overflow', 'initial');

				$('section.statisticsSidebar').animate({
					right: '-100%'
				}, 300);

				$('section.sidebarOverflow').addClass('hidden');

				clearInterval(Listener.statisticsInterval);
			});
		});

		function updateStatistics() {
			TransmissionServer.sendServerRequest({
				method: 'session-stats', 
				arguments: [ "activeTorrentCount", "downloadSpeed", "pausedTorrentCount", "torrentCount", "uploadSpeed", "current-stats" ]
			}, function(response) {
				response = response.arguments;

				$('section.topBar p.additionalData span.bandwidth').text('D: ' + Formatter.speed(response.downloadSpeed) + ' | U: ' + Formatter.speed(response.uploadSpeed));

				$('section.statisticsSidebar table tr td.activeTorrents').text(response.activeTorrentCount);
				$('section.statisticsSidebar table tr td.pausedTorrents').text(response.pausedTorrentCount);
				$('section.statisticsSidebar table tr td.totalDownloaded').text(Formatter.size(response['cumulative-stats'].downloadedBytes) + ' (' + Formatter.size(response['current-stats'].downloadedBytes) + ' this session)');
				$('section.statisticsSidebar table tr td.totalUploaded').text(Formatter.size(response['cumulative-stats'].uploadedBytes) + ' (' + Formatter.size(response['current-stats'].uploadedBytes) + ' this session)');
				$('section.statisticsSidebar table tr td.ratio').text(Formatter.ratio(response['cumulative-stats'].downloadedBytes, response['cumulative-stats'].uploadedBytes) + ' (' + Formatter.ratio(response['current-stats'].downloadedBytes, response['current-stats'].uploadedBytes) + ' this session)');
				$('section.statisticsSidebar table tr td.uptime').text(Formatter.duration(response['cumulative-stats'].secondsActive) + ' (' + Formatter.duration(response['current-stats'].secondsActive) + ' this session)');
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
				toast('Success!', 500);
				TransmissionServer.getSettings();
			});
		});
	},

	addTorrent: function() {
		$('section.floatingOptions a.addTorrent').unbind();
		$('section.floatingOptions a.addTorrent').click(function() {
			$('body').css('overflow', 'hidden');

			$('section.addTorrentFunctionality').animate({
				right: '0%'
			}, 300);

			setTimeout(function() { $('section.clickToClose').css('padding', (($(window).height() - $('section.clickToClose').height()) / 4) + 'px 0px ' + (($(window).height() - $('section.clickToClose').height()) / 4 * 3) + 'px 0px'); }, 100);

			$('section.sidebarOverflow').removeClass('hidden');

			$('input#startAutomatically').prop('checked', true);

			$('section.sidebarOverflow').unbind();
			$('section.sidebarOverflow').click(function() {
				$('body').css('overflow', 'initial');

				$('section.addTorrentFunctionality').animate({
					right: '-100%'
				}, 300);

				$('section.sidebarOverflow').addClass('hidden');
			});

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
							toast('Error adding torrent: ' + response.result, 2000);
						}

						else {
							toast('Torrent added!', 2000);
						}

						$('input.torrentLink').val('');
						$('input.torrentFile').prop('files', []);
					});
				}
			}

			$('section.addTorrentFunctionality a.addTorrent').unbind();
			$('section.addTorrentFunctionality a.addTorrent').click(function() {
				var files = $('section.addTorrentFunctionality input.torrentFile')[0].files;

				addTorrentLink();

				if ($('section.addTorrentFunctionality input.torrentFilePathDisplay') != '') {
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
										toast('Error adding torrent: ' + response.result, 2000);
									}

									else {
										toast('Torrent added!', 2000);
									}
								});
							}
						};

						filereader.readAsDataURL(torrentFile);
					});
				}

				$('section.addTorrentFunctionality input.torrentFilePathDisplay').val('');
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
		};

		$('.floatingActions ul a').unbind();
		$('.floatingActions ul a').click(function() {
			var id = [];
			var action = actions[$(this).data('tooltip')];

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
					toast('Success!', 500);
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
					toast('Success!', 500);
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
					toast('Success!', 500);
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
				$('#toast-container').css('z-index', 100001);
				toast('Success!', 500);
				setTimeout(function() { $('#toast-container').css('z-index', 10000); }, 550);
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
		if (statusCode == 0) {
			// torrent has been stopped or paused

			if (torrent.error != 0) {
				element.addClass('errored');
				messageElement.text('Error: ' + torrent.errorString + ' [' + torrent.error + ']');
			}

			else {
				element.removeClass('errored');
				messageElement.text('Paused');
			}

			element.removeClass('default queued downloading seeding');
			setTimeout(function() { element.addClass('paused'); }, 10);
		}

		else if (statusCode == 3) {
			// 3: torrent has been queued

			messageElement.text('Queued');

			element.removeClass('default paused downloading seeding');
			setTimeout(function() { element.addClass('queued'); }, 10);
		}

		else if (statusCode == 4) {
			// 4: torrent is downloading

			messageElement.text('Downloading: ' + Formatter.speed(torrent.rateDownload) + ', Seeding: ' + Formatter.speed(torrent.rateUpload));

			element.removeClass('default paused queued seeding');
			setTimeout(function() { element.addClass('downloading'); }, 10);
		}

		else if (statusCode == 6 || statusCode == 8) {
			// 6 & 8: torrent is seeding (see https://forum.transmissionbt.com/viewtopic.php?t=13357#p60235)

			messageElement.text('Seeding: ' + Formatter.speed(torrent.rateUpload) + '');

			element.removeClass('default paused queued downloading');
			setTimeout(function() { element.addClass('seeding'); }, 10);
		}
	},

	getMoreTorrentDetails: function() {
		$('section.torrents section.torrent a.getMoreDetails').unbind();

		$('section.torrents section.torrent:not(.hidden) a.getMoreDetails, section.torrents.searchQuery section.torrent.result a.getMoreDetails').click(function() {
			TransmissionServer._waitLock = true;

			$('body').css('overflow', 'hidden');

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

				Sidebar.initialize(id, element);				
			});
		});
	},

	getTorrents: function() {
		var o = { method: 'torrent-get', "arguments": { "fields": [ "id", "name", "status", "totalSize", "sizeWhenDone", "haveValid", "leftUntilDone", "haveUnchecked", "eta", "downloadedEver", "uploadedEver", "uploadRatio", "rateDownload", "rateUpload", "metadataPercentComplete", "addedDate", "trackerStats", "error", "errorString", "recheckProgress", "bandwidthPriority", "seedRatioMode", "seedRatioLimit" ] } };
		var errored = false;
		Listener.lastRefresh = Date.now();

		TransmissionServer.sendServerRequest(o, function(response) {
			torrents = response.arguments.torrents;

			if ($('section.torrentPagination a.pageInfo span.currentPage').text() == '') {
				$('section.torrentPagination a.pageInfo span.currentPage').text('1');
			}

			var totalPages = Math.floor(torrents.length / 20);
			(torrents.length % 20 > 0) ? totalPages++ : false;
			$('section.torrentPagination a.pageInfo span.totalPages').text(totalPages);

			$.each(torrents, function(index, torrent) {
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
					$('section.torrents section.torrent[data-id="' + torrent.id + '"] span.uploadRatio').text(torrent.uploadRatio);

					if ($('section.torrents section.torrent[data-id="' + torrent.id + '"] .determinate').css('width') != torrent.percentageDone) {
						$('section.torrents section.torrent[data-id="' + torrent.id + '"] .determinate').css({ width: torrent.percentageDone });
					}

					$('section.torrents section.torrent[data-id="' + torrent.id + '"]').data('href', Listener.lastRefresh);
				}

				else {
					$('section.torrents').append('<section class="card mobile-grid-90 mobile-prefix-5 mobile-suffix-5 tablet-grid-44 tablet-prefix-3 tablet-prefix-3 grid-44 prefix-3 suffix-3 default torrent" data-id="' + torrent.id + '" data-href="' + Listener.lastRefresh + '"><section class="card-content white-text"><h3 class="torrentName truncate"><span class="name">' + torrent.name + '</span><i class="closeSidebar hidden">close</i><i class="material-icons toggle">play_arrow</i></h3><p>Downloaded <span class="downloaded">' + torrent.downloadedEver + '</span>, uploaded <span class="uploaded">' + torrent.uploadedEver + '</span> (ratio: <span class="uploadRatio">' + torrent.uploadRatio + '</span>)</p><section class="progress"><section class="determinate" style="width: ' + torrent.percentageDone + '"></section></section><p class="message"></p></section><section class="card-action"><a class="getMoreDetails">More Details...</a><a class="selectTorrent">Select...</a></section></section>');
					Listener.changeTorrentColors(torrent.id, torrent.status, torrent, $('section.torrents section.torrent[data-id="' + torrent.id + '"]'), $('section.torrents section.torrent[data-id="' + torrent.id + '"] p.message'));
				}

				if (torrent.error != 0) { errored = true; }
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

		setTimeout(function() { Listener.getTorrents(); }, 1000);
	},

	removeTorrent: function(ids) {
		$('section.removeTorrentFunctionality').animate({
			right: '0%'
		}, 300);

		setTimeout(function() { $('section.clickToClose').css('padding', (($(window).height() - $('section.clickToClose').height()) / 4) + 'px 0px ' + (($(window).height() - $('section.clickToClose').height()) / 4 * 3) + 'px 0px'); }, 100);

		$('section.sidebarOverflow').removeClass('hidden');

		$('section.removeTorrentFunctionality span.torrentString').text(ids.length);

		if (ids.length != 1) { $('section.removeTorrentFunctionality span.plural').removeClass('hidden'); }
		else { $('section.removeTorrentFunctionality span.plural').addClass('hidden'); }

		if (ids.length == 0) ids = [];

		$('section.removeTorrentFunctionality a.removeTorrent').unbind();
		$('section.removeTorrentFunctionality a.removeTorrent').click(function() {
			TransmissionServer.sendServerRequest({
				method: 'torrent-remove',
				arguments: {
					'ids': ids,
					'delete-local-data': $('section.removeTorrentFunctionality input#deleteAllData').prop('checked')
				}
			}, function(response) {
				toast('Success!', 500);
			});
		})

		$('section.sidebarOverflow').unbind();
		$('section.sidebarOverflow').click(function() {
			$('section.removeTorrentFunctionality').animate({
				right: '-100%'
			}, 300);

			$('section.sidebarOverflow').addClass('hidden');
		});
	},

	searchTorrent: function() {
		$('section.search input.search').unbind();

		$('section.search input.search').keyup(function() {
			var value = $(this).val().toLowerCase();

			if (value.length == 0) {
				$('section.torrents').removeClass('searchQuery').addClass(activeTab);
			}

			else {
				$('section.torrents section.torrent').each(function(index, torrent) {
					var torrentName = $(this).find('section.card-content h3.torrentName span.name').text().toLowerCase();

					if (value.length == 0) {
						$('section.search').animate({
							'padding': '0 40px 15px'
						}, 75);

						$('section.torrentPagination').slideDown(75);
					}

					else {
						$('section.search').animate({
							'padding': '15px 40px'
						}, 75);

						$('section.torrentPagination').slideUp(75);
					}

					if (torrentName.indexOf(value) != -1 || torrentName == '') {
						$('section.torrents').removeClass('all downloading seeding idling paused errored').addClass('searchQuery');
						$(this).addClass('result');
					}

					else {
						$(this).removeClass('result');
					}			
				});
			}

			Listener.getMoreTorrentDetails();
		});
	},

	searchTracker: function() {
		$('section#trackers input.search').unbind();

		$('section#trackers input.search').keyup(function() {
			var value = $(this).val().toLowerCase();

			if (value.length == 0) {
				$('section#trackers').removeClass('searchQuery');
			}

			else {
				$('section#trackers section.tracker').each(function(index, tracker) {
					var trackerName = $(this).find('h4').text().toLowerCase();

					$('section#trackers').addClass('searchQuery');

					console.log($(this));

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

		$('section.torrents section.torrent a.selectTorrent').click(function() {
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
						toast('Torrent started.', 1000);
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
						toast('Torrent stopped.', 1000);
					});
				});
			}
		}
	},

	torrentPagination: function() {
		$('section.torrentPagination a.previousPage, section.torrentPagination a.nextPage').unbind();

		function changeTorrentDisplay(pageID) {
			if ($('section.search input.search').val().length == 0) {
				$('section.torrents section.torrent').addClass('hidden');

				var torrents = $('section.torrents section.torrent').length;
				var torrentStart = (pageID - 1) * 20;
				var torrentEnd = (pageID * 20) - 1;

				$('section.torrents section.torrent').each(function(index, torrent) {
					if (index >= torrentStart && index <= torrentEnd) {
						$(this).removeClass('hidden');
					}

					else {
						$(this).addClass('hidden');
					}
				});
			}
		}

		changeTorrentDisplay($('section.torrentPagination a.pageInfo span.currentPage').text());

		var currentPage = parseInt($('section.torrentPagination a.pageInfo span.currentPage').text());
		var totalPages = parseInt($('section.torrentPagination a.pageInfo span.totalPages').text());

		if (currentPage > totalPages) {	
			changeTorrentDisplay(totalPages);
			$('section.torrentPagination a.pageInfo span.currentPage').text(totalPages);
		}

		$('section.torrentPagination a.previousPage').click(function() {
			var newPage = parseInt($('section.torrentPagination a.pageInfo span.currentPage').text()) - 1;

			if (newPage > 0) {
				changeTorrentDisplay(newPage);
				$('section.torrentPagination a.pageInfo span.currentPage').text(newPage);
			}
		});

		$('section.torrentPagination a.nextPage').click(function() {
			var newPage = parseInt($('section.torrentPagination a.pageInfo span.currentPage').text()) + 1;

			if (newPage < parseInt($('section.torrentPagination a.pageInfo span.totalPages').text()) + 1) {
				changeTorrentDisplay(newPage);
				$('section.torrentPagination a.pageInfo span.currentPage').text(newPage);
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
			$('section.credits').animate({
				right: '0%'
			}, 300);

			setTimeout(function() { $('section.clickToClose').css('padding', (($(window).height() - $('section.clickToClose').height()) / 4) + 'px 0px ' + (($(window).height() - $('section.clickToClose').height()) / 4 * 3) + 'px 0px'); }, 100);

			$('section.sidebarOverflow').removeClass('hidden');

			$('section.sidebarOverflow').unbind();
			$('section.sidebarOverflow').click(function() {
				$('section.credits').animate({
					right: '-100%'
				}, 300);

				$('section.sidebarOverflow').addClass('hidden');
			});

		})
	},
}