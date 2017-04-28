// ENGLISH LANGUAGE PACK FOR LAYERED
// DEFAULT LANGUAGE FOR A STOCK INSTALL OF LAYERED
var en = {
	// i18n (_localisation.js)
	localisation: {
		changingLanguagePack: 'Changing language pack to ',
		changingLanguagePackAfter: '...',

		changedLanguagePack: 'Changed language pack successfully.',
		languagePackNotAvailable: 'The selected language pack is not available!',
		attemptingLanguagePack: 'Attempting to change language pack to ', 
		attemptingLanguagePackAfter: ' (system default)'
	},

	// speed / size / memory units (formatter.js)
	units: {
		speed_B_str: 'B/s',
		speed_K_str: 'kB/s',
		speed_M_str: 'MB/s',
		speed_G_str: 'GB/s',
		speed_T_str: 'TB/s',

		size_B_str: 'B',
		size_K_str: 'KB',
		size_M_str: 'MB',
		size_G_str: 'GB',
		size_T_str: 'TB',

		mem_B_str: 'B',
		mem_K_str: 'KiB',
		mem_M_str: 'MiB',
		mem_G_str: 'GiB',
		mem_T_str: 'TiB'
	},

	// file priority (formatter.js)
	filePriority: {
		low: 'Low',
		normal: 'Normal',
		high: 'High'
	},

	// event (formatter.js)
	event: {
		paused: 'Paused',
		queuedForVerification: 'Queued for verification',
		verifyingLocalData: 'Verifying local data',
		queued: 'Queued',
		downloading: 'Downloading',
		downloadedQueuedForSeeding: 'Downloaded, queued for seeding',
		seeding: 'Seeding',
		error: 'Error',
		unknown: 'Unknown'
	},

	// server status (server.js)
	server: {
		notResponding: 'Server not responding, retrying in 2.5 seconds...'
	},

	// status (listener.js)
	status: {
		// switch
		on: 'On',
		off: 'Off',

		// returned status
		success: 'Success!',
		failure: 'Failure',

		// operation-specific status messages
		errorAddingTorrent: 'Error adding torrent: ',
		torrentAdded: 'Torrent added!',
		trackerWarning: 'Tracker warning: ',
		trackerError: 'Tracker error: ',
		error: 'Error: '
	},

	// miscellaneous strings
	misc: {
		thisSession: 'this session'
	},

	// strings in HTML page
	htmlStrings: {
		title: 'Transmission Web Interface',

		topBar: {
			statistics: 'STATISTICS',
			bandwidth: 'BANDWIDTH',
			date: 'DATE'
		},

		filterOptions: {
			text: 'Filter torrents by...',

			all: 'All',
			downloading: 'Downloading',
			seeding: 'Seeding',
			idling: 'Idling',
			queued: 'Queued',
			paused: 'Paused',
			errored: 'Errored'
		},

		tooltips: {
			// tooltips are what you see when you hover on the bottom right hand corner of the page.
			// they are useful usage tips to allow the user to perform actions to their existing torrents.

			start: 'Start',
			stop: 'Stop',
			verifyLocalData: 'Verify Local Data',
			askTrackerForMorePeers: 'Ask tracker for more peers',
			delete: 'Delete',
			addTorrent: 'Add Torrent',

			credits: 'Credits',
			toggleSpeedLimitMode: 'Toggle Speed Limit Mode',
			settings: 'Settings',
		},

		pagination: {
			page: 'Page',
			of: 'of',

			previousPage: 'Prev Page',
			nextPage: 'Next Page'
		},

		searchTorrent: 'Search Torrent...',

		torrent: {
			event: {
				started: 'Torrent started.',
				stopped: 'Torrent stopped.'
			}
		},

		sidebarView: {
			tabs: {
				information: {
					title: 'Information',

					torrentInformation: 'Torrent Information',

					size: 'Size',
					pieces: 'Pieces',
					hash: 'Hash',
					type: {
						title: 'Type',
						privateTorrent: 'Private Torrent',
						publicTorrent: 'Public Torrent',
					},
					comment: 'Comment',
					createdWith: 'Created with'
				},

				activity: {
					title: 'Activity',

					status: 'Status',
					progress: 'Progress',
					downloaded: 'Downloaded',
					uploaded: 'Uploaded',
					ratio: 'Ratio',
					downloadSpeed: 'Download Speed',
					uploadSpeed: 'Upload Speed',

					from: 'from',
					peers: 'peers',
				},

				trackers: {
					title: 'Trackers',

					searchTracker: 'Search tracker',

					tracker: {
						lastAnnounced: 'Last Announced',
						nextAnnounced: 'Next Announced',
						lastScrape: 'Last Scrape',
						seeders: 'Seeders',
						leechers: 'Leechers',
					},
				},

				peers: {
					title: 'Peers',

					ipAddress: 'IP Address',
					client: 'Client',
					percentageDone: '%',
					uploading: 'Uploading',
					downloading: 'Downloading',
				},

				files: {
					title: 'Files',

					of: ' of ', // (there should be a space beside "of")
				},

				options: {
					title: 'Options',

					downloadDirectory: 'Download Directory',
					priority: 'Priority',
					low: 'Low',
					normal: 'Normal',
					high: 'High',
					stopSeedingAt: 'Stop Seeding At',
					limitDownloadSpeed: 'Limit Download Speed',
					limitUploadSpeed: 'Limit Upload Speed',
					maximumConnections: 'Maximum Connections',
					saveChanges: 'Save Changes',
				}
			},

			settings: {
				title: 'Settings',

				saveSettings: 'Save Settings'
			},

			statistics: {
				title: 'Statistics',

				activeTorrents: 'Active Torrents',
				pausedTorrents: 'Paused Torrents',
				totalDownloaded: 'Total Downloaded',
				totalUploaded: 'Total Uploaded',
				ratio: 'Ratio',
				uptime: 'Uptime',
			},

			addTorrent: {
				title: 'Add Torrent',

				file: 'File',
				selectPlaceholder: 'Select one or more .torrent files',
				urlLabel: 'Torrent URL or magnet: Link',
				destinationDirectory: 'Destination Directory',
				startAutomatically: 'Start Automatically'
			},

			removeTorrent: {
				title: 'Remove Torrent',

				validationMessage: 'Are you sure that you would like to remove',
				torrent: 'torrent',
				torrentPlural: 's',

				deleteAllData: 'Delete All Data'
			},

			credits: {
				title: 'Credits',

				specialThanks: 'Special Thanks'
			}
		},

		sidebarOverflow: {
			clickToClose: 'Click to close'
		},

		viewOptions: {
			default: 'default',
			all: 'All',
			torrentsPerPage: 'Torrents Per Page',
			language: 'Language',
			current: '(current)',
		}
	},
};