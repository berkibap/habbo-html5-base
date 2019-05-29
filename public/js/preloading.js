$(document).ready(function() {
	$(function() {
		var tl = [clientParams['externalVars'],'./img/alert_top.png','./img/cancel.png','./img/cancel_hover.png','./img/alert_center.png','./img/alert_bottom.png','./img/alert_button.png','./img/alert_button_hover.png','./img/alert_button_active.png', './img/navigation/navigator.png', './img/navigation/navigator_hover.png', './img/navigator_top.png', './img/navigator_header.png', './img/navigator/off_button.png', './img/navigator/off_button_hover.png', './img/navigator_center.png', './img/navigator_bottom.png', './img/navigation_box.png', './img/navigator/pop_button.png', './img/navigator/pop_button_hover.png', './img/navigator/ev_button.png', './img/navigator/ev_button_hover.png', './img/navigator/mine_button.png', './img/navigator/mine_button_hover.png', './img/navigator/search_button.png', './img/navigator/search_button_hover.png', './img/navigator/htlview_button.png', './img/navigator/htlview_button_hover.png', './img/navigator/search_box.png', './img/navigator/htlview_info.png', './img/navigator/search_text.png', './img/navigator/search_submit.png', './img/navigator/search_submit_hover.png', './img/navigator/search_submit_active.png', './img/infotools_links.png', './img/infotools_coins.png', './img/infotools_coins_hover.png', './img/infotools_vip.png', './img/infotools_pixels.png', './img/infotools_shells.png', './img/infotools_vip_hover.png', './img/infotools_shells_hover.png', './img/infotools_pixels_hover.png', './img/scrollbar_topbutton.png', './img/scrollbar_bottombutton.png', './img/scrollbar_topfill.png'], k = 0, tp = 100 / (tl.length + 1), p = function() {
			var my = tl[k];
			if (my.match(/json$/)) {
				$.getJSON(my, function(data) {
					$.each(data, function(akey, aval) {
						logging.logConsole('ADDED VARIABLE \'' + akey + '\' WITH VALUE \'' + aval + '\'');
						game.variables[akey] = aval;
						if (akey == 'htlview_img') {
							tl.push(game.variables['image_lib'] + aval);
						}
					});
					n(my);
				});
			} else {
				$("<img/>").load(function() {
					n(my);
				}).attr("src", my);
			}
		}, n = function(d) {
			logging.logConsole('LOADED FILE \'' + d + '\'');
			var perc = ((100 * parseFloat($('#barSprite').css('width')) / parseFloat($('#barSprite').parent().css('width'))) + tp);
			if (perc > 100) perc = 100;
			perc = perc + '%';
			$('#barSprite').animate({'width':perc}, 50, function() {
				$('#barSprite').css({'width':perc});
				if (++k < tl.length) p(); else {
					var perc = ((100 * parseFloat($('#barSprite').css('width')) / parseFloat($('#barSprite').parent().css('width'))) + tp);
					if (perc < 100) {
						$('#barSprite').animate({'width':'100%'}, 150, function() {
							$('#barSprite').css({'width':'100%'});
							l();
						});
					}
				}
			});
		}, l = function() {
			var perc = ((100 * parseFloat($('#barSprite').css('width')) / parseFloat($('#barSprite').parent().css('width'))) + tp);
			
			$('#loadingContent').fadeOut(500, function() {
				$('#loadingContent').remove();
				game.initialize();
			});
			setTimeout(function() {
				$('#game').css('background-image', 'url(' + game.variables['image_lib'] + game.variables['htlview_img'] + ')');
			}, 100);
		};
		p(tl, n);
	});
});