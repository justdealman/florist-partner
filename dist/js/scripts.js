function showAlert(string, statement, duration) {
	removeAlert();
	$('body').append('<span class="alert-popup alert-popup_' + statement + '">' + string + '</span>');
	var alert = $('body').find('.alert-popup');
	setTimeout(function () {
		alert.addClass('is-visible');
	}, 50);
	var timer = setTimeout(function() {
		alert.removeClass('is-visible');
	}, duration);
	alert.on('click', function () {
		clearTimeout(timer);
		alert.removeClass('is-visible');
	})
}

function removeAlert() {
	$('.alert-popup').remove();
}

$(function() {
	function openUser() {
		$('.user').addClass('is-opened');
		$('.header__login').addClass('is-active');
	}
	function closeUser() {
		$('.user').removeClass('is-opened');
		$('.header__login').removeClass('is-active');
	}
	
	$('.header__login').on('click', function() {
		if ( !$(this).hasClass('is-active') ) {
			openUser();
		} else {
			closeUser();
		}
	});
	
	function openOrder(e) {
		var t = $('[data-order-id="'+e+'"]');
		t.addClass('is-opened');
		setScroll(t);
		$('body').addClass('is-locked');
	}
	
	function closeOrders() {
		$('[data-order-id]').removeClass('is-opened');
		$('body').removeClass('is-locked');
	}
	
	$('[data-order-open]').on('click', function() {
		var t = $(this).attr('data-order-open');
		if ( !$('[data-order-id="'+t+'"].is-opened').length ) {
			closeOrders();
		}
		openOrder(t);
	});
	
	$('.info__close').on('click', function() {
		closeOrders();
	});
	
	$(document).on('click', function(e) {
		if ( $(e.target).closest('.header__login').length === 0 && $(e.target).closest('.user').length === 0 ) {
			closeUser();
		}
		if ( $(e.target).closest('[data-order-open]').length === 0 && $(e.target).closest('[data-order-id]').length === 0 ) {
			closeOrders();
		}
	});
	
	$('.js-label').on('focus', function() {
		$(this).addClass('is-active');
	});
	
	$('.js-label').on('blur', function() {
		$(this).removeClass('is-active');
		if ( $(this).val() !== '' ) {
			$(this).addClass('is-filled');
		} else {
			$(this).removeClass('is-filled');
		}
	});
	
	$('.js-label').each(function() {
		var t = $(this);
		if ( t.val() !== '' ) {
			t.addClass('is-filled');
		}
		setTimeout(function() {
			t.addClass('has-animation');
		}, 10);
	});

	svg4everybody();
	
	$('.select-custom').selectric();
	
	var scrollApi = null;
	
	function setScroll(e) {
		var scrollable = e.find('[data-custom-scroll]').jScrollPane();
		scrollApi = scrollable.data('jsp');
	}
	
	function destroyScrolls() {
		if ( scrollApi !== null ) {
			scrollApi.destroy();
			console.log(scrollApi);
		}
	}

	$('.select-select2').select2({
		placeholder: 'Куда',
		allowClear: true
	});
	
	function lazyLoad() {
		$('.lazyload2').each(function() {
			var t = $(this);
			/*if ( $(document).scrollTop() > t.offset().top-$(window).height() ) {*/
				t.attr('src', t.attr('data-src'));
				t.on('load', function() {
					setTimeout(function() {
						t.addClass('is-loaded');
					}, 0);
				});
			/*}*/
		});
	}
	
	lazyLoad();
	
	/*$(document).on('scroll', function() {
		lazyLoad();
	});*/
	
	function closeAll() {
		if ( $('.header__login').hasClass('is-active') ) {
			closeUser();
		}
		if ( $('[data-target].is-opened').length ) {
			modalsClose();
		}
		if ( $('[data-order-id].is-opened').length ) {
			ordersClose();
		}
	}
		
	function modalOpen(t) {
		closeAll();
		var modal = $('[data-target="'+t+'"]');
		centerModal(modal);
		modal.addClass('is-opened');
		$('.fade-bg').addClass('is-opened');
	}
	
	function centerModal(t) {
		var h = $(window).scrollTop()+($(window).height()-t.outerHeight())/2;
		var diff = 30;
		if ( h < $(window).scrollTop()+(diff*2) ) {
			h = $(window).scrollTop()+diff;
		}
		t.css({
			'top': h+'px'
		});
	}
	
	function modalsClose() {
		$('[data-target], .fade-bg').removeClass('is-opened');
	}
	
	$('[data-open]').on('click', function(e) {
		e.preventDefault();
		var id = $(this).attr('data-open');
		modalOpen(id);
		$(this).addClass('is-active');
	});
	
	$('.fade-bg, [data-modal-close]').on('click', function(e) {
		e.preventDefault();
		modalsClose();
	});
	
	$('.js-datepicker').datepicker({
		minDate: new Date(),
		firstDay: 1,
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
	});
	
	function setAreaHeight(e) {
		var container = e.parents('.js-area-container');
		container.css({
			'min-height': container.outerHeight()
		});
		e.outerHeight(1);
		var h = e.get(0).scrollHeight;
		e.outerHeight(h);
		container.css({
			'min-height': 0
		});
	}
	
	if ( $('.info-footer_fixed').length && $('.wrapper_order').length ) {
		$('.wrapper_order').css({
			paddingBottom: $('.info-footer_fixed').outerHeight()+30
		});
	}
	
	if ( $('.order-full__info').length ) {
		var infoPane = $('.js-info-scroll');
		infoPane.jScrollPane();
		infoPaneApi = infoPane.data('jsp');
		$(window).on('resize', function() {
			infoPaneApi.reinitialise();
		});
	}
	
	if ( $('.order-full__chat').length ) {
		var chatPane = $('.js-info-chat');
		chatPane.jScrollPane();
		chatPaneApi = chatPane.data('jsp');
		$(window).on('resize', function() {
			chatPaneApi.reinitialise();
		});
	}
	
	if ( $('.js-chat-input').val() !== '' ) {
		setAreaHeight($('.js-chat-input'));
	}
	
	$('.js-chat-input').on('input keyup change', function() {
		setAreaHeight($(this));
		if ( chatPaneApi !== undefined ) {
			chatPaneApi.reinitialise();
		}
	});
});