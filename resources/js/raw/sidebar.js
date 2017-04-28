var TorrentSidebar = {
	interval: '',
	torrentElement: '',
	settingsInitalized: false,

	initialize: function(id, torrentElement) {
		TorrentSidebar.torrentElement = torrentElement;

		setTimeout(function() {
			$('ul.tabs.tabs-fixed-width li.tab a[href="#information"]').trigger('click');
		}, 300);

		$('section.sidebar section.torrentInformation').animate({
			right: '0%'
		}, 300);
		
		$('section.torrent i.closeSidebar').removeClass('hidden');

		$('section.torrent i.closeSidebar, section.sidebar section.torrentInformation h3 span.showOnMobile i.closeSidebar').unbind();
		$('section.torrent i.closeSidebar, section.sidebar section.torrentInformation h3 span.showOnMobile i.closeSidebar').click(function() {
			$('section.sidebar section.torrentInformation').animate({
				right: '-100%'
			}, 300);

			$('body').css('overflow', 'initial');

			torrentElement.animate({
				'top': $('body').scrollTop() + $('body').height(),
			}, 300, function() {
				$(this).css('top', 'initial');
			});

			setTimeout(function() {
				TransmissionServer._waitLock = true;

				torrentElement.children('section.card-action').fadeIn();
				torrentElement.removeClass('stacked');
				torrentElement.removeClass('hidden');
				torrentElement.css('top', 'initial');

				$('section.parachute').fadeOut(300);

				$('section.torrent i.closeSidebar').addClass('hidden');

				$('section.torrent i.closeSidebar, section.sidebar section.torrentInformation h3 span.showOnMobile i.closeSidebar').unbind();
				clearInterval(TorrentSidebar.interval);

				TransmissionServer._waitLock = false;
			}, 300);

			Sidebar.close();
		});

		$('section.sidebar section.torrentInformation section#trackers section.tracker').remove();
		$('section.sidebar section.torrentInformation section#peers tr.peer').remove();
		$('section.sidebar section.torrentInformation section#files section.file').remove();

		TorrentSidebar.refresh(id);
		TorrentSidebar.interval = setInterval(function() { TorrentSidebar.refresh(id); }, 1000);

		TransmissionServer._waitLock = false;
	},

	refresh: function(id) {
		TransmissionServer.sendServerRequest({
			method: 'torrent-get', 
			arguments: { ids: id, fields: [ "id", "name", "status", "totalSize", "sizeWhenDone", "haveValid", "leftUntilDone", "haveUnchecked", "eta", "uploadedEver", "uploadRatio", "rateDownload", "rateUpload", "metadataPercentComplete", "addedDate", "trackerStats", "error", "errorString", "recheckProgress", "bandwidthPriority", "seedRatioMode", "seedRatioLimit", "downloadDir", "creator", "hashString", "comment", "isPrivate", "downloadedEver", "peersGettingFromUs", "peersSendingToUs", "files", "pieceCount", "pieceSize", "peers", "fileStats", "peer-limit", "downloadLimited", "uploadLimit", "uploadLimited", "downloadLimit", "corruptEver", "maxConnectedPeers" ] }
		},
		function(response) {
			torrent = response.arguments.torrents[0];

			$('section.sidebar section.torrentInformation h3 span.torrentName').text(torrent.name);
			$('section.sidebar section.torrentInformation section#information table td.size').text(Formatter.size(torrent.sizeWhenDone));
			$('section.sidebar section.torrentInformation section#information table td.pieces').text(torrent.pieceCount + ' * ' + Formatter.size(torrent.pieceSize));
			$('section.sidebar section.torrentInformation section#information table td.hash').text(torrent.hashString);
			$('section.sidebar section.torrentInformation section#information table td.type').text((torrent.isPrivate) ? i18n.htmlStrings.sidebarView.tabs.information.type.privateTorrent : i18n.htmlStrings.sidebarView.tabs.information.type.publictorrent);
			$('section.sidebar section.torrentInformation section#information table td.comment').text(torrent.comment);
			$('section.sidebar section.torrentInformation section#information table td.createdWith').text(torrent.creator);

			$('section.sidebar section.torrentInformation section#activity table td.status').text(Formatter.event(torrent.status));
			$('section.sidebar section.torrentInformation section#activity table td.torrentProgress').text(Formatter.percentageDone(torrent.leftUntilDone, torrent.totalSize));
			$('section.sidebar section.torrentInformation section#activity table td.downloaded').text(Formatter.size(torrent.downloadedEver));
			$('section.sidebar section.torrentInformation section#activity table td.uploaded').text(Formatter.size(torrent.uploadedEver));
			$('section.sidebar section.torrentInformation section#activity table td.ratio').text(torrent.uploadRatio);
			$('section.sidebar section.torrentInformation section#activity table span.downloadSpeed').text(Formatter.speed(torrent.rateDownload));
			$('section.sidebar section.torrentInformation section#activity table span.downloadPeers').text(torrent.peersSendingToUs);
			$('section.sidebar section.torrentInformation section#activity table span.uploadSpeed').text(Formatter.speed(torrent.rateUpload));
			$('section.sidebar section.torrentInformation section#activity table span.uploadPeers').text(torrent.peersGettingFromUs);

			$.each(torrent.trackerStats, function(index, tracker) {
				var trackerElement = 'section.sidebar section.torrentInformation section#trackers section.trackers section.tracker[data-host="' + tracker.host + '"]';

				if (!$(trackerElement).length) {
					$('section.elements section.tracker.unset').clone().appendTo('section.sidebar section.torrentInformation section#trackers section.trackers');
					$('section.sidebar section.torrentInformation section#trackers section.trackers section.tracker.unset').attr('data-host', tracker.host).removeClass('unset');
				}

				$(trackerElement + ' h4.host').text(tracker.host);
				$(trackerElement + ' td.lastAnnounced').text(Formatter.date(tracker.lastAnnounceTime));
				$(trackerElement + ' td.nextAnnounced').text(Formatter.date(tracker.nextAnnounceTime));
				$(trackerElement + ' td.lastScrape').text(Formatter.date(tracker.lastScrapeTime));
				$(trackerElement + ' td.seeders').text(tracker.seederCount);
				$(trackerElement + ' td.leechers').text(tracker.leecherCount);
			});

			$('section.sidebar section.torrentInformation section#peers tr.peer').remove();

			$.each(torrent.peers, function(index, peer) {
				var peerElement = 'section.sidebar section.torrentInformation section#peers table tr[data-host="' + peer.address + ':' + peer.port + '"]';

				if (!$(peerElement).length) {
					$('section.elements tr.peer.unset').clone().appendTo('section.sidebar section.torrentInformation section#peers table');
					$('section.sidebar section.torrentInformation section#peers table tr.unset').attr('data-host', peer.address + ':' + peer.port).removeClass('unset');
				}

				$(peerElement + ' td:nth-child(1)').text(peer.address + ':' + peer.port);
				$(peerElement + ' td:nth-child(2)').text(peer.clientName);
				$(peerElement + ' td:nth-child(3)').text(peer.progress * 100);
				$(peerElement + ' td:nth-child(4)').text(Formatter.speed(peer.rateToClient));
				$(peerElement + ' td:nth-child(5)').text(Formatter.speed(peer.rateToPeer));
			});

			$.each(torrent.files, function(index, file) {
				var fileElement = 'section.sidebar section.torrentInformation section#files section.file[data-id="' + file + '"]';

				if (!$(fileElement).length) {
					$('section.elements section.file.unset').clone().appendTo('section.sidebar section.torrentInformation section#files');
					$('section.sidebar section.torrentInformation section#files section.file.unset').attr('data-id', file);

					$(fileElement + ' span.download input[type="checkbox"]').attr('id', 'downloadfile' + index).attr('data-torrentid', torrent.id).attr('data-fileid', index);
					$(fileElement + ' span.download label').attr('for', 'downloadfile' + index);

					$(fileElement + ' h4 span:nth-child(1)').text(file.name);

					if (torrent.fileStats[index].wanted) {
						$(fileElement + ' span.download input[type="checkbox"]').attr('checked', 'checked');
					}

					$(fileElement).removeClass('unset');
				}

				// to be updated
				$(fileElement + ' td.completed').text(Formatter.percentageDone(file.length - file.bytesCompleted, file.length) + i18n.htmlStrings.sidebarView.tabs.files.of + Formatter.size(file.length));
			});

			Listener.changeDownloadedFiles();

			if (TorrentSidebar.settingsInitalized == false) {
				$('section#options table .downloadSpeedToggle input').prop('checked', torrent.downloadLimited);
				$('section#options table .uploadSpeedToggle input').prop('checked', torrent.uploadLimited);

				(torrent.bandwidthPriority == -1) ? $('input.priority#low').prop('checked', true) : (torrent.bandwidthPriority == 0) ? $('input.priority#normal').prop('checked', true) : $('input.priority#high').prop('checked', true);
				$('section#options table input.downloadDirectory').val(torrent.downloadDir);
				$('section#options table input.priority').val(torrent.bandwidthPriority);
				$('section#options table input.stopSeedingAt').val(torrent.seedRatioLimit);
				$('section#options table input.downloadSpeed').val(torrent.downloadLimit);
				$('section#options table input.uploadSpeed').val(torrent.uploadLimit);
				$('section#options table input.maxConnections').val(torrent.maxConnectedPeers);

				TorrentSidebar.settingsInitalized = true;
			}

			Listener.changeSettingsTorrent(torrent.id);
		});
	}
};