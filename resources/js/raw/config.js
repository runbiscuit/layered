var Configuration = {
	// torrent refresh interval (default: 1250)
	torrentRefreshInterval: 1250,

	// session information (default: 10000)
	sessionRefreshInterval: 10000,

	// torrents to show on every page (default: 20)
	torrentsPerPage: 20,

	// torrent view
	torrentView: 'grid',

	// language (i18n/_localisation.js - default: en)
	language: 'en'
};

var Configurator = {
	set: function() {
		Configuration.torrentRefreshInterval = (!session.isEmpty('torrentRefreshInterval')) ? session.get('torrentRefreshInterval') : Configuration.torrentRefreshInterval;
		Configuration.sessionRefreshInterval = (!session.isEmpty('sessionRefreshInterval')) ? session.get('sessionRefreshInterval') : Configuration.sessionRefreshInterval;
		Configuration.torrentsPerPage = (!session.isEmpty('torrentsPerPage')) ? session.get('torrentsPerPage') : Configuration.torrentsPerPage;
		Configuration.torrentView = (!session.isEmpty('torrentView')) ? session.get('torrentView') : Configuration.torrentView;
		Configuration.language = (!session.isEmpty('language')) ? session.get('language') : Configuration.language;
	}
};