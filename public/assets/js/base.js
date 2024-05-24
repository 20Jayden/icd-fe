$(function () {
	// header : 현재위치
	var region = $('.select-region')
	$('.header .location .current').on('click focusin', function () {
		region.focus().addClass('show')
	})
	$(document).mouseup(function (e) {
		if (region.has(e.target).length == 0) {
			region.removeClass('show')
		}
	})

	// side panel 스크롤
	$('.side-panel .body').slimScroll({
		height: 'calc(100% - 75px)',
		railVisible: true,
		wheelStep: 50,
		allowPageScroll: false,
		disableFadeOut: false,
	})

	// side panel fold button
	var panel = $('.side-panel .content')
	var panelfold = $('.side-panel .btn-fold')
	var statcon = $('.stat-condition .content')
	var statfold = $('.stat-condition .btn-fold')
	var legend = $('.legend')
	panelfold.click(function () {
		if (panel.hasClass('show') === false) {
			panel.addClass('show')
			panelfold.addClass('active')
			statcon.css('transform', 'translateX(0px)')
			statfold.css('transform', 'translateX(0px)')
			legend.css('transform', 'translateX(405px)')
		} else {
			panel.removeClass('show')
			panelfold.removeClass('active').attr('title', '펼치기')
			statcon.css('transform', 'translateX(-313px)')
			statfold.css('transform', 'translateX(-313px)')
			legend.css('transform', 'translateX(92px)')
		}
	})

	// modal
	$('.modal-open').click(function (e) {
		e.preventDefault()
		dataModal = $(this).attr('data-modal')
		$('#' + dataModal).css({ 'display': 'block' })
		$('body').css({ 'overflow-y': 'hidden' })
	})
	$('.modal .btn-close').click(function () {
		$('.modal').css({ 'display': 'none' })
		$('body').css({ 'overflow-y': 'auto' })
	})

	// tab
	var $tab_list = $('.tab')
	// $tab_list.find("li li.active").parents("li").addClass("active");
	$tab_list.find('li.active>.tab-pane').show()
	$tab_list.each(function () {
		var $this = $(this)
		$this.height($this.find('li.active>.tab-pane').height() + 80)
	})
	// tab window resize
	$(window).resize(function () {
		$tab_list.each(function () {
			var $this = $(this)
			$this.height($this.find('li.active>.tab-pane').height() + 80)
		})
	})
	function listTabMenuToggle(event) {
		var $this = $(this)
		$this
			.next('.tab-pane')
			.show()
			.parent('li')
			.addClass('active')
			.siblings('li')
			.removeClass('active')
			.find('>.tab-pane')
			.hide()
		$this.closest('.tab').height($this.next('.tab-pane').height() + 80)
		if ($this.attr('href') === '#') {
			return false
		}
	}
	$tab_list.find('>ul>li>a').click(listTabMenuToggle).focus(listTabMenuToggle)

	// 툴바
	$('.toolbar > ul > li > a').click(function () {
		$(this).toggleClass('active')
	})
	$(document).mouseup(function (e) {
		if ($('.toolbar > ul > li > ol').has(e.target).length == 0) {
			$('.toolbar > ul > li > ol').prev().removeClass('active')
		}
	})

	// 통계조건
	$('.stat-condition .btn-close').on('click', function () {
		$('.stat-condition .content').hide()
		$('.stat-condition .btn-fold').removeClass('active')
	})
	$('.stat-condition .btn-fold').on('click', function () {
		$('.stat-condition .content').show()
		$('.stat-condition .btn-fold').addClass('active')
	})

	// 통계보드
	var btnstat = $('.btn-statboard span')
	var board = $('.stat-board')
	$('.btn-statboard').click(function () {
		if (btnstat.hasClass('on') === true) {
			btnstat.removeClass('on').addClass('off').text('OFF')
			board.removeClass('show')
		} else {
			btnstat.removeClass('off').addClass('on').text('ON')
			board.addClass('show')
		}
	})
	$('.stat-board .btn-close').on('click', function () {
		$(this).parents().parents().removeClass('show')
		btnstat.removeClass('on').addClass('off').text('OFF')
	})
	$('.stat-board .btn-fold').on('click', function () {
		$(this).toggleClass('active')
		$('.stat-board .body').slideToggle(100)
	})

	// 주택동향 : 통계조건 접기/펼치기
	var abnowrap = $('.abno-transaction')
	var abnofold = $('.abno-transaction .btn-fold')
	abnofold.on('click', function () {
		if (abnowrap.hasClass('show') === true) {
			abnofold.removeClass('active')
			abnowrap.removeClass('show')
		} else {
			abnofold.addClass('active')
			abnowrap.addClass('show')
			$('.abno-transaction .tbody').slimScroll({ height: 'calc(230px - 82px)' })
		}
	})

	// 주택동향 : 시계열 (layer open)
	$('.open-timeseries').on('click', function () {
		$('.time-series').addClass('show')
	})

	// 실거래 알람 : tbody 스크롤
	$('.abno-transaction .tbody').slimScroll({
		height: '147px',
		railVisible: true,
		wheelStep: 50,
		allowPageScroll: false,
		disableFadeOut: false,
	})

	// 실거래 알람 : 창 크기 조절
	var abnobody = $('.abno-transaction .body')
	var winsm = $('.window-resize .small')
	var winhf = $('.window-resize .half')
	var winful = $('.window-resize .full')
	$('.window-resize .small').on('click', function () {
		$(this).addClass('active')
		$('.window-resize a').not($(this)).removeClass('active')
		abnobody.addClass('small').removeClass('half full')
		$('.abno-transaction .tbody').slimScroll({ height: 'calc(230px - 82px)' })
	})
	$('.window-resize .half').on('click', function () {
		$(this).addClass('active')
		$('.window-resize a').not($(this)).removeClass('active')
		abnobody.addClass('half').removeClass('small full')
		$('.abno-transaction .tbody').slimScroll({ height: 'calc(50vh - 82px)' })
	})
	$('.window-resize .full').on('click', function () {
		$(this).addClass('active')
		$('.window-resize a').not($(this)).removeClass('active')
		abnobody.addClass('full').removeClass('small half')
		$('.abno-transaction .tbody').slimScroll({ height: 'calc(93vh - 82px)' })
	})

	var btnmmk = $('.btn-mapmark span')
	$('.btn-mapmark').click(function () {
		if (btnmmk.hasClass('on') === true) {
			btnmmk.removeClass('on').addClass('off').text('OFF')
		} else {
			btnmmk.removeClass('off').addClass('on').text('ON')
		}
	})

	abnofold.on('click', function () {
		if (abnobody.hasClass('small') === true) {
			abnobody.removeClass('small')
			abnowrap.removeClass('show')
		} else if (abnobody.hasClass('half') === true) {
			abnobody.removeClass('half')
			abnowrap.removeClass('show')
		} else if (abnobody.hasClass('full') === true) {
			abnobody.removeClass('full')
			abnowrap.removeClass('show')
		}
	})

	// 주택 가격 동향 (accordion)
	var answer = $('.accordion ul')
	$('.accordion .tit').click(function () {
		$(this).next().slideToggle(200).prev().toggleClass('active')
		return false
	})

	// 동향분석 주제도 : 순서변경 접기/펼치기
	$('.change-order .btn-close').on('click', function () {
		$('.change-order .content').hide()
	})
	$('.open-order').on('click', function () {
		$('.change-order .content').show()
	})

	// 레이어팝업
	var laypop = $('.layer-popup')
	$('.layer-popup .btn-close').on('click', function () {
		$(this).parents().parents().removeClass('show')
	})

	// 허가구역 관리 (memu tree)
	$('.treemenu > ul > li > a').click(function () {
		$(this).next().slideToggle(200).parent().toggleClass('active')
		return false
	})

	// 도구 : 분석기능 > 임의영역 추출 (layer open)
	$('.open-randomextra').on('click', function () {
		$('.random-extra').addClass('show')
	})

	// 도구 : 분석기능 > 토지/건물 추출 (layer open)
	$('.open-buildingextra').on('click', function () {
		$('.building-extra').addClass('show')
	})

	// 도구 : 그리기 > 스타일 (layer open)
	$('.open-styleedit').on('click', function () {
		$('.style-edit').addClass('show')
	})

	// 도구 : 도구 > 지도선택
	$('.map-choice').on('click', function () {
		$('.map-choice-type').addClass('show')
	})
	$(document).mouseup(function (e) {
		if ($('.map-choice').has(e.target).length == 0) {
			$('.map-choice-type').removeClass('show')
		}
	})
	// GNB : 설정
	$('.open-setting').on('click', function () {
		$('.setting-panel').addClass('show')
	})
	$('.setting-panel .btn-close').on('click', function () {
		$('.setting-panel').removeClass('show')
	})

	let expanded = false
	const multiSelect = document.querySelector('.multi-select')

	multiSelect.addEventListener(
		'click',
		function (e) {
			const checkboxes = document.getElementById('checkboxes')
			if (!expanded) {
				checkboxes.style.display = 'block'
				expanded = true
			} else {
				checkboxes.style.display = 'none'
				expanded = false
			}
			e.stopPropagation()
		},
		true
	)

	document.addEventListener(
		'click',
		function (e) {
			if (expanded) {
				checkboxes.style.display = 'none'
				expanded = false
			}
		},
		false
	)
})
