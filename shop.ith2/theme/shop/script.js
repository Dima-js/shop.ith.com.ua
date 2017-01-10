/* Author: Terion

*/

$(document).ready(function(){

	$('#top_menu ul>li.drop').hover(
		function(e){
			var clicked = $(this);
			var submenu = clicked.find('ul');
			//if (submenu.is(':animated')) return false;
			$('#top_menu ul>li.drop>ul:visible').slideUp(function(){$(this).parent().removeClass('focus');});
			clicked.addClass('focus');
			submenu.stop(true,true).slideDown(250);
			submenu.css('margin-left', '-'+((submenu.outerWidth() - clicked.outerWidth())/2+2)+'px');
		},
		function (e) {
			var clicked = $(this);
			var submenu = clicked.find('ul');
			clicked.removeClass('focus');
			submenu.stop().slideUp(250);
		}
	);
	
	$('#top_menu li.search>a').click(function(){
		var clicked = $(this).parent();
		var submenu = clicked.find('div:first');
		if ( submenu.is(':visible') ) {
			submenu.slideUp(function(){clicked.removeClass('focus');});
		}
		else {
			clicked.addClass('focus');
			submenu.slideDown();
		}
		//return false;
	});
	
	$('#topsearch').keyup(function(){
		var word = $(this).val();
		if (word.length > 1) {
			$.get('/search/s/?w='+word, function(data){
				$('#topsearchresult').html(data);
			});
		}
		else $('#topsearchresult').empty();
	});
	
	$('.menu ul').each(function(){
		var menu = $(this);
		menu.find('.section').not('.open').each(function(){
			var section = $(this);
			section.css('cursor','pointer');
			section.addClass('expandable');
			var group = section.nextUntil('.section');
			
			section.click(function(){
				if ( group.is(':visible') ) group.slideUp();
				else group.slideDown();
			});
			// нужно спрятать все, кроме текущей. + прийдется костылить для страницы товара
			var bread = $('.breadcrumps a');
			if (group.find('.active, .trail').length == 0) {
				var hide = true;
				bread.each(function(){
					var href = $(this).attr('href');
					if ( group.find('a[href="'+href+'"]').length > 0 ) hide = false;
				})
				if (hide) group.hide();
			}
		});
	});
		
	$('#main_slider').each(function(){
		var slider = 	$(this);
		var slides = slider.find('.slide');
		var right = slider.find('.arrow.right');
		var left = slider.find('.arrow.left');
		var container = slider.find('.slider_container');
		var href = slider.find('.main_href');
		
		slider_int = setInterval(function(){ right.click(); }, 4000);
		
		right.click(function(){
			var active_slide = slider.find('.slide.active');
			var next_slide = active_slide.next();
			if (next_slide.length == 0) {
				next_slide = slider.find('.slide:first');
				//container.animate({'scrollLeft': '0'});
			}
			else {
				//container.animate({'scrollLeft': '+=960'});
			}
			active_slide.css('z-index',45);
			next_slide.css('z-index',44);
			active_slide.fadeOut(function(){
				active_slide.css('z-index',40).removeClass('active').show();
				next_slide.css('z-index',41).addClass('active');
			});
			href.attr('href', next_slide.find('a:first').attr('href'));
			clearInterval(slider_int);
			slider_int = setInterval(function(){ right.click(); }, 4000);
		});
		
		left.click(function(){
			var active_slide = slider.find('.slide.active');
			var next_slide = active_slide.prev();
			if (next_slide.length == 0) {
				next_slide = slider.find('.slide:last');
				//container.animate({'scrollLeft': '0'});
			}
			else {
				//container.animate({'scrollLeft': '+=960'});
			}
			active_slide.css('z-index',45);
			next_slide.css('z-index',44);
			active_slide.fadeOut(function(){
				active_slide.css('z-index',40).removeClass('active').show();
				next_slide.css('z-index',41).addClass('active');
			});
			href.attr('href', next_slide.find('a:first').attr('href'));
			clearInterval(slider_int);
			slider_int = setInterval(function(){ right.click(); }, 4000);
		});
		
		
		
	});
	
	$('#mp_main .cats').each(function(){
		var block = $(this);
		var list_container = block.find('>.wrap>ul');
		var list = list_container.find('>li');
		var inners = block.find('>.wrap>ul>li>.sub');
		list.hover(
			function(){
				var active = $(this);
				var sublist = active.find('>.sub');
				sublist.css({'top': block.position().top - active.position().top -10, 'height':$('#mp_main').innerHeight()});
				sublist.find('>*').not('.gotoall').css({'height':sublist.innerHeight()});
				sublist.stop(true,true).fadeIn();
			},
			function(){
				var sublist = $(this).find('>.sub');
				sublist.fadeOut();
			}
		);
	});
	
	$('.tabs').each(function(){
		var tails_parents = $(this).find('>ul>li');
		var tails = $(this).find('>ul>li>a');
		var container = $(this).find('.tabs_content');
		tails.click(function(e){
			e.preventDefault();
			tails_parents.removeClass('active');
			$(this).parent().addClass('active');
			var tab_id = $(this).attr('href').replace('#','');
			container.find('>div').removeClass('active').hide();
			container.find('#'+tab_id).addClass('active').show();
			return false;
		});
	});
	
	// селекторы вариантов на странице товара
	$('#color_selector span').click(function(){
		var $this = $(this);
		if ($this.hasClass('active')) return;
		$('#color_selector span').removeClass('active');
		$('#color_input').val($this.attr('rel')).change();
		$this.addClass('active');
	});

	
	$('.item_var_selector').change(function(){
		var changed_selector = $(this);
		var matched_variant = false;
		var matched_rows = new Array();
		var changet_attr = changed_selector.attr('name');
		var changet_attr_val = changed_selector.val();
		item_vars_selected = new Object();
		$('.item_var_selector').each(function(){
			item_vars_selected[$(this).attr('name')]=$(this).val();
		});
		
		for (row in item_variants) {
			props_exact = 0;
			
			if (item_variants[row][changet_attr] == changet_attr_val) { 
				//console.log(item_variants[row]);
				matched_rows.push(item_variants[row]); 
			}
			
			if ( ! matched_variant) {
				for (selected_colname in item_vars_selected) {
					if (item_variants[row][selected_colname] == item_vars_selected[selected_colname]) {
						props_exact++;
					}
				}
				if (props_exact == $('.item_var_selector').length) {
					matched_variant = item_variants[row];
					//break;
				}
			}
			
		}
		//console.log(matched_rows);
		
		changed_val_to_fit = false;
		$('select.item_var_selector').not(changed_selector).each(function(){
			var colname = $(this).attr('name');
			var accessible = new Object();
			var accessible_count = 0;
			var selector = $(this);
			selector.find('option').each(function(){
				var opt = $(this).val();
				for (row in matched_rows) {
					if (matched_rows[row][colname] == opt) {
						$(this).css('color', '#000');
						//$(this).css('text-decoration', 'none');
						$(this).text($(this).text().replace('- ',''));
						accessible[opt] = opt;
						accessible_count++;
						break;
					}
					else {
						$(this).css('color', '#ccc');
						//$(this).css('text-decoration', 'line-through');
						$(this).text('- '+$(this).text().replace('- ',''));
					}
				}
			});
			if (typeof accessible[selector.val()] == 'undefined' && accessible_count > 0) {
				for (var prop in accessible) {
					selector.val(accessible[prop]);
					changed_val_to_fit = selector;
					break;
				}
			}
		});
		
		if ( changed_val_to_fit ) {
			changed_val_to_fit.change();
		}
		else if (matched_variant) {
			
			$('.price').show();
			if (matched_variant['picture'] && !matched_variant['pictures']) {
				$('[data-attr="pictures"]').closest('li').remove();
			}
			if (matched_variant['balance']==1) {
				$('.item_big .info .price').removeClass('item_not_available').addClass('item_available');
			}
			else {
				$('.item_big .info .price').removeClass('item_available').addClass('item_not_available');
			}
			for (col in matched_variant) {
				if (matched_variant[col]) {
					var element = $('[data-attr="'+col+'"]');
					
					if (col == 'sku') {
						if (element.is('input')) element.val(matched_variant['sku']);
						else element.html(matched_variant['sku'].substr(0,6));
					}
					else if (col == 'picture') {
						$('.big_photo img[data-attr="picture"]').attr('src', matched_variant[col]['big']);
						$('.big_photo img[data-attr="picture"]').closest('a').attr('href', matched_variant[col]['orig']);
						$('div.previews .picture')
							.attr('src', matched_variant[col]['small'])
							.attr('rel', matched_variant[col]['big'])
							.attr('data-orig', matched_variant[col]['orig']);
					}
					else if (col == 'pictures') {
						var $th = $('div.previews');
						$th.html('');
						if (matched_variant[col].length > 0) $th.append('<a href="#"  class="thumbnail" style="width:50px; height:50px; text-align:center"><img data-attr="pictures" src="'+matched_variant['picture']['small']+'" rel="'+matched_variant['picture']['big']+'" alt=""></a>');
						for (pp in matched_variant[col]) {
							$th.append('<a href="#"  class="thumbnail" style="width:50px; height:50px; text-align:center"><img data-attr="pictures" src="'+matched_variant[col][pp]['small']+'" rel="'+matched_variant[col][pp]['big']+'" alt=""></a>')
						}
					}
					else {
						element.each(function(){
							if ($(this).attr('src')) {
								$(this).attr('src', matched_variant[col]);
							}
							else if ($(this).is(':input')) {
								$(this).val(matched_variant[col]);
							}
							else {
								$(this).html(matched_variant[col]);
							}
						});
					}
					
				}
			}
			$('#color_sample').attr('src', '/theme/color/'+matched_variant['sku'].substr(6,3)+'.jpg');
		}
		else {
			$('.price').hide();
			alert('Такая комбинация не  найдена');
		}
	});

	
	$('.photos').each(function(){
		var gal = $(this);
		gal.on('click', '.previews a', function(e){
			e.preventDefault();
			gal.find('.big_photo img').attr('src', $(this).find('img').attr('rel'));
			gal.find('.big_photo a').attr('href', $(this).find('img').attr('data-orig'));
		});
	});
	$(".photos .big_photo a").fancybox({
		openEffect	: 'elastic',
    	closeEffect	: 'elastic'
	});
	
	$('.full_cart input').change(function(){
		$(this).closest('form').submit();
	});
	
	$('input.numeric').numeric({ decimal: false, negative: false });
	
	$('.numeric-sub').click(function(){ $(this).parent().find('input').val( (tmp=parseInt($(this).parent().find('input').val())-1)>0?tmp:1 ).trigger( "change" ) });
	
	$('.numeric-incr').click(function(){ $(this).parent().find('input').val( parseInt($(this).parent().find('input').val()) + 1 ).trigger( "change" ) });
	
		$('.full_cart .numeric-sub, .full_cart .numeric-incr').click(function(){
		$(this).closest('form').submit();
	});
	
	$('#sorters select').change(function(){
		window.location.href = $(this).val();
	});
	
	
	
	
	
	
	
	$('#brands_line>.container').each(function(){
		var block = $(this);
		var blockWith = block.width();
		var blockLeft = block.offset().left;
		var contentWith = 0;
		block.find('li').each(function(index, element) {
            contentWith += parseInt($(this).outerWidth());
        });
		block.on('mousemove', function(e){
			var scrl = (e.pageX - blockLeft - 100) / (blockWith - 100) * (contentWith);
			block.scrollLeft(scrl);
		})
	});


});

