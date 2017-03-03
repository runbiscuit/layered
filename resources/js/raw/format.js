var Formatter = {
	units: '',

	speed_K: 1000,
	speed_B_str: 'B/s',
	speed_K_str: 'kB/s',
	speed_M_str: 'MB/s',
	speed_G_str: 'GB/s',
	speed_T_str: 'TB/s',

	size_K: 1000,
	size_B_str: 'B',
	size_K_str: 'KB',
	size_M_str: 'MB',
	size_G_str: 'GB',
	size_T_str: 'TB',

	mem_K: 1024,
	mem_B_str: 'B',
	mem_K_str: 'KiB',
	mem_M_str: 'MiB',
	mem_G_str: 'GiB',
	mem_T_str: 'TiB',

	duration: function(seconds) {
		return new Date(seconds * 1000).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	},

	date: function(timestamp) {
		return new Date(timestamp * 1000);
	},

	filePriority: function(number) {
		if (number == -1) { return 'Low'; }
		if (number == 0) { return 'Normal'; }
		if (number == 1) { return 'High'; }
	},

	percentageDone: function(leftUntilDone, totalSize) {
		return Math.round(((totalSize - leftUntilDone) / totalSize) * 10000) / 100 + '%';
	},

	mem: function(bytes) {
		if (bytes < Formatter.mem_K)
			return [ bytes, Formatter.mem_B_str ].join(' ');

		var convertedSize;
		var unit;

		if (bytes < Math.pow(Formatter.mem_K, 2)) {
			convertedSize = bytes / Formatter.mem_K;
			unit = Formatter.mem_K_str;
		}

		else if (bytes < Math.pow(Formatter.mem_K, 3)) {
			convertedSize = bytes / Math.pow(Formatter.mem_K, 2);
			unit = Formatter.mem_M_str;
		}

		else if (bytes < Math.pow(mem_K, 4)) {
			convertedSize = bytes / Math.pow(Formatter.mem_K, 3);
			unit = Formatter.mem_G_str;
		}

		else {
			convertedSize = bytes / Math.pow(Formatter.mem_K, 4);
			unit = Formatter.mem_T_str;
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
			return [ bytes, Formatter.size_B_str ].join(' ');

		var convertedSize;
		var unit;

		if (bytes < Math.pow(Formatter.size_K, 2)) {
			convertedSize = bytes / Formatter.size_K;
			unit = Formatter.size_K_str;
		}

		else if (bytes < Math.pow(Formatter.size_K, 3)) {
			convertedSize = bytes / Math.pow(Formatter.size_K, 2);
			unit = Formatter.size_M_str;
		}

		else if (bytes < Math.pow(Formatter.size_K, 4)) {
			convertedSize = bytes / Math.pow(Formatter.size_K, 3);
			unit = Formatter.size_G_str;
		}

		else {
			convertedSize = bytes / Math.pow(Formatter.size_K, 4);
			unit = Formatter.size_T_str;
		}

		convertedSize = Math.round(convertedSize * 100) / 100;

		return convertedSize + unit;
	},

	speed: function(bytes) {
		if (bytes < Formatter.speed_K)
			return [ bytes, Formatter.speed_B_str ].join(' ');

		var convertedSize;
		var unit;

		if (bytes < Math.pow(Formatter.speed_K, 2)) {
			convertedSize = bytes / Formatter.speed_K;
			unit = Formatter.speed_K_str;
		}

		else if (bytes < Math.pow(Formatter.speed_K, 3)) {
			convertedSize = bytes / Math.pow(Formatter.speed_K, 2);
			unit = Formatter.speed_M_str;
		}

		else if (bytes < Math.pow(speed_K, 4)) {
			convertedSize = bytes / Math.pow(Formatter.speed_K, 3);
			unit = Formatter.speed_G_str;
		}

		else {
			convertedSize = bytes / Math.pow(Formatter.speed_K, 4);
			unit = Formatter.speed_T_str;
		}

		convertedSize = Math.round(convertedSize * 100) / 100;

		return convertedSize + unit;
	},

	event: function(statusCode) {
		switch (statusCode) {
			case 0:
				return 'Paused';
				break;

			case 1:
				return 'Queued for verification';
				break;

			case 2:
				return 'Verifying local data';
				break;

			case 3:
				return 'Queued';
				break;

			case 4:
				return 'Downloaded';
				break;

			case 5:
				return 'Downloaded, queued for seeding';
				break;

			case 6:
				return 'Seeding';
				break;

			case 8:
				return 'Seeding';
				break;

			default:
				return 'Unknown';
				break;
		}
	},
}