var activeTab = 'all';

var filterBar = {
	init: function() {
		$('section.header ul li').click(function() {
			$('section.header ul li[data-href="' + activeTab + '"]').removeClass('active');
			$(this).addClass('active');

			$('section.torrents').removeClass('all downloading seeding idling paused errored');
			$('section.torrents').addClass($(this).data('href'));

			activeTab = $(this).data('href');
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

$(document).ready(function() {
	Waves.attach('.btn');
	Waves.init();

	floatingButtonHelper.init(); // stop tooltips and buttons from being clicked when not shown

	Listener.addTorrent(); // initializes the addTorrent button
	Listener.getTorrents(); // gets torrents
	Listener.updateDate(); // updates the date
	Listener.updateSettings(); // updates settings
	Listener.updateStatistics(); // updates bandwidth
	Listener.searchTorrent(); // initializes the search torrent feature
	Listener.searchTracker(); // initializes the search tracker feature
	Listener.toggleSpeedLimitButton(); // initializes the speed ;imit button
	filterBar.init(); // initializes the filterBar
	Listener.showCredits(); // initializes the credits

	TransmissionServer.getSettings();
});