var i18n;

var Internationalizations = {
	setSupportedLanguages: function() {
		// figure out what languages are supported
		$('section.modal#viewOptions select.language').html('');

		$.each(LanguageCodes, function(index, key) {
			if (eval("typeof " + index) !== 'undefined') {
				if (Configuration.language == index) {
					$('section.elements option.language.unset').clone().val(index).text(key + ' ' + i18n.htmlStrings.viewOptions.current).attr('selected', 'selected').appendTo('section.modal#viewOptions select.language');
				}

				else {
					$('section.elements option.language.unset').clone().val(index).text(key).appendTo('section.modal#viewOptions select.language');
				}
			}
		});

		$('section.modal#viewOptions select.language').material_select();
	},

	changeLanguage: function(language, callback, shutup) {
		if (typeof shutup === 'undefined') shutup = false;

		if (eval("typeof " + language) !== 'undefined') {
			i18n = eval(language);
			if (!shutup) Materialize.toast(i18n.internationalization.changingLanguagePack + LanguageCodes[language] + i18n.internationalization.changingLanguagePackAfter, 1000, 'rounded');

			$('*[i18n-text]').each(function(index, target) {
				text = eval($(this).attr('i18n-text'));
				textBefore = ($(this).attr('i18n-text-before')) ? $(this).attr('i18n-text-before') : '';
				textAfter = ($(this).attr('i18n-text-after')) ? $(this).attr('i18n-text-after') : '';

				$(target).text(textBefore + text + textAfter);
			});

			$('*[i18n-tooltip]').each(function(index, target) {
				text = eval($(this).attr('i18n-tooltip'));
				textBefore = ($(this).attr('i18n-tooltip-before')) ? $(this).attr('i18n-tooltip-before') : '';
				textAfter = ($(this).attr('i18n-tooltip-after')) ? $(this).attr('i18n-tooltip-after') : '';

				$(target).attr('data-tooltip', textBefore + text + textAfter);
			});

			if (!shutup) Materialize.toast(i18n.internationalization.changedLanguagePack, 1000, 'rounded');
		}

		else {
			if (!shutup) Materialize.toast(i18n.internationalization.languagePackNotAvailable, 1000, 'rounded');
			
			setTimeout(function() {
				Materialize.toast(i18n.internationalization.attemptingLanguagePack + LanguageCodes[Configuration.language], 1000, 'rounded');
				Internationalization.changeLanguage(Configuration.language);
			}, 500);
		}

		if (typeof callback == 'function') callback();
	},
}