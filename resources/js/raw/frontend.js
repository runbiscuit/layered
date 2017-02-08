var activeTab = 'all';

var filterBar = {
	init: function() {
		$('section.header ul li').click(function() {
			var odd = true;

			$('section.header ul li[data-href="' + activeTab + '"]').removeClass('active');
			$(this).addClass('active');

			$('section.torrents').removeClass('all downloading seeding idling queued paused errored');
			$('section.torrents').addClass($(this).data('href'));

			$('section.torrents section.torrent').removeClass('suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5');

			activeTab = $(this).data('href');

			if (activeTab != 'all') {
				$('section.torrents').addClass('searchQuery');

				$('section.torrents section.torrent').each(function(index, torrent) {
					if ($(this).hasClass(activeTab)) {
						$(this).removeClass('suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5').addClass('result ' + ((odd) ? 'suffix-2 tablet-suffix-5' : 'prefix-2 tablet-prefix-5'));
						odd = !odd;
					}

					else {
						$(this).removeClass('suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5').removeClass('result');
					}
				});
			}

			else {
				$('section.torrents').removeClass('searchQuery');
				$('section.torrents section.torrent').removeClass('suffix-2 tablet-suffix-5 prefix-2 tablet-prefix-5').removeClass('result');
			}
		});
	}
};

var floatingButtonHelper = {
	init: function() {
		$('section.floatingActions ul, section.floatingOptions ul').addClass('hidden');

		$('section.fixed-action-btn.click-to-toggle > a').click(function() {
			var menu = $(this).parent().find('ul');

			if (menu.hasClass('hidden')) {
				menu.removeClass('hidden');
			}

			else {
				setTimeout(function() { menu.addClass('hidden'); }, 250);
			}
		});
	}
}

var Sidebar = {
	open: function(view) {
		$('body').css('overflow', 'hidden');

		if (view == 'torrentInformation') { $('section.sidebar').removeClass('box-shadow'); }
		else { $('section.sidebar').addClass('box-shadow'); }

		$('section.sidebar > section').removeClass('active');
		$('section.sidebar > section.' + view).addClass('active');

		$('section.sidebar').animate({
			right: '0%'
		}, 300);

		$('section.sidebarOverflow').removeClass('hidden');

		$('section.sidebarOverflow').unbind();
		$('section.sidebarOverflow').click(function() {
			$('body').css('overflow', 'initial');

			$('section.sidebar').animate({
				right: '-100%'
			}, 300);

			$('section.sidebarOverflow').addClass('hidden');
		});
	},

	close: function() {
		$('body').css('overflow', 'initial');

		$('section.sidebar').animate({
			right: '-100%'
		}, 300);

		$('section.sidebarOverflow').addClass('hidden');
	}
}

$(document).ready(function() {
	$('ul.tabs').tabs();

	floatingButtonHelper.init(); // stop tooltips and buttons from being clicked when not shown

	Listener.addTorrent(); // initializes the addTorrent button
	Listener.getTorrents(); // gets torrents
	Listener.updateSettings(); // updates settings
	Listener.updateStatistics(); // updates bandwidth
	Listener.searchTorrent(); // initializes the search torrent feature
	Listener.searchTracker(); // initializes the search tracker feature
	Listener.toggleSpeedLimitButton(); // initializes the speed limit button
	filterBar.init(); // initializes the filterBar
	Listener.showCredits(); // initializes the credits

	TransmissionServer.getSettings();
});