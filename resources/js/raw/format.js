var Formatter = {
	units: '',

	speed_K: 1000,
	size_K: 1000,
	mem_K: 1024,

	duration: function(seconds) {
		return new Date(seconds * 1000).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	},

	date: function(timestamp) {
		return new Date(timestamp * 1000);
	},

	filePriority: function(number) {
		if (number == -1) { return i18n.units.low; }
		if (number == 0) { return i18n.units.normal; }
		if (number == 1) { return i18n.units.high; }
	},

	percentageDone: function(leftUntilDone, totalSize) {
		return Math.round(((totalSize - leftUntilDone) / totalSize) * 10000) / 100 + '%';
	},

	mem: function(bytes) {
		if (bytes < Formatter.mem_K)
			return [ bytes, i18n.units.mem_B_str ].join(' ');

		var convertedSize;
		var unit;

		if (bytes < Math.pow(Formatter.mem_K, 2)) {
			convertedSize = bytes / Formatter.mem_K;
			unit = Formatter.mem_K_str;
		}

		else if (bytes < Math.pow(Formatter.mem_K, 3)) {
			convertedSize = bytes / Math.pow(Formatter.mem_K, 2);
			unit = i18n.units.mem_M_str;
		}

		else if (bytes < Math.pow(mem_K, 4)) {
			convertedSize = bytes / Math.pow(Formatter.mem_K, 3);
			unit = i18n.units.mem_G_str;
		}

		else {
			convertedSize = bytes / Math.pow(Formatter.mem_K, 4);
			unit = i18n.units.mem_T_str;
		}

		convertedSize = Math.round(convertedSize * 100) / 100;

		return convertedSize + unit;
	},

	ratio: function(downloadedBytes, uploadedBytes) {
		if (downloadedBytes == 0) return 0;
		return Math.floor((uploadedBytes / downloadedBytes) * 1000) / 1000;
	},

	size: function(bytes) {
		if (bytes < Formatter.size_K)
			return [ bytes, i18n.units.size_B_str ].join(' ');

		var convertedSize;
		var unit;

		if (bytes < Math.pow(Formatter.size_K, 2)) {
			convertedSize = bytes / Formatter.size_K;
			unit = Formatter.size_K_str;
		}

		else if (bytes < Math.pow(Formatter.size_K, 3)) {
			convertedSize = bytes / Math.pow(Formatter.size_K, 2);
			unit = i18n.units.size_M_str;
		}

		else if (bytes < Math.pow(Formatter.size_K, 4)) {
			convertedSize = bytes / Math.pow(Formatter.size_K, 3);
			unit = i18n.units.size_G_str;
		}

		else {
			convertedSize = bytes / Math.pow(Formatter.size_K, 4);
			unit = i18n.units.size_T_str;
		}

		convertedSize = Math.round(convertedSize * 100) / 100;

		return convertedSize + unit;
	},

	speed: function(bytes) {
		if (bytes < Formatter.speed_K)
			return [ bytes, i18n.units.speed_B_str ].join(' ');

		var convertedSize;
		var unit;

		if (bytes < Math.pow(Formatter.speed_K, 2)) {
			convertedSize = bytes / Formatter.speed_K;
			unit = Formatter.speed_K_str;
		}

		else if (bytes < Math.pow(Formatter.speed_K, 3)) {
			convertedSize = bytes / Math.pow(Formatter.speed_K, 2);
			unit = i18n.units.speed_M_str;
		}

		else if (bytes < Math.pow(speed_K, 4)) {
			convertedSize = bytes / Math.pow(Formatter.speed_K, 3);
			unit = i18n.units.speed_G_str;
		}

		else {
			convertedSize = bytes / Math.pow(Formatter.speed_K, 4);
			unit = i18n.units.speed_T_str;
		}

		convertedSize = Math.round(convertedSize * 100) / 100;

		return convertedSize + unit;
	},

	event: function(statusCode) {
		switch (statusCode) {
			case 0:
				return i18n.event.paused;
				break;

			case 1:
				return i18n.event.queuedForVerification;
				break;

			case 2:
				return i18n.event.verifyingLocalData;
				break;

			case 3:
				return i18n.event.queued;
				break;

			case 4:
				return i18n.event.downloaded;
				break;

			case 5:
				return i18n.event.downloadedQueuedForSeeding;
				break;

			case 6:
				return i18n.event.seeding;
				break;

			case 8:
				return i18n.event.seeding;
				break;

			default:
				return i18n.event.unknown;
				break;
		}
	},
}