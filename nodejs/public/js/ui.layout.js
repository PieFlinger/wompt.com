UI.once('init', function(){
	var c = $('#chat'),
	hide_userlist_at = 700,
	layout_delay = 200,
	small_at = 700,
	hul = 'hide_userlist',
	resizeTimer;
	
	setTimeout(function(){
		doLayout()
		$('.'+hul).removeClass(hul);
		toggleUserlist(c.width() >= hide_userlist_at)
	}, 1000);
	
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(onResize, layout_delay);
	});
	
	function doLayout(){
		var w = c.width();
		c.toggleClass('small', w < small_at);
		var taller = $('body').height() >= $(window).height();
		$('.main').toggleClass('taller', taller);
	}

	function testShowUserlist(){
	}
	
	function toggleUserlist(show){
		if(arguments.length < 1) show = c.hasClass(hul);
		c.toggleClass(hul,!show)
		.toggleClass('show_userlist',show);
	}
	
	function onResize(){
		doLayout();
		UI.emit('resize');
	}
	
	//stick the footer at the bottom of the page if we're on an iPad/iPhone due to viewport/page bugs in mobile webkit
	if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod'){
		$("#footer_container").css("position", "static");
	};
	
	$('.userlist_toggle').click(function(e){
		toggleUserlist();
		e.preventDefault();
	})
});
