$(function () {
	$(".owl-carousel").owlCarousel({
		loop: true,
		items: 1,
		nav: true,
		navText: ["<div class='arrow-l'></div>","<div class='arrow-r'></div>"]
	});

	$('a[href^="#"]').on('click',function (e) {
		e.preventDefault();
	});

	var request = new XMLHttpRequest();

	function getJson(query) {
		request.open('GET', query);
		request.onreadystatechange = function() {
			if (request.status === 200 && request.readyState === 4) {
				var resText = JSON.parse(request.responseText);
				if ( resText.hits.length > 0 ) {
					var isoElems = $(".grid-item");
					$grid.isotope( 'remove', isoElems );
					$(".grid-item").remove();
					for ( var i = 0; i < resText.hits.length; i++ ) {
						var imgSrc = resText.hits[i].webformatURL;
						var imgText = resText.hits[i].tags;
						if ( i === 4 || i === 5 ) {
							var classItem = 'grid-item grid-item--width2';
						} else {
							var classItem = 'grid-item';
						}
						$grid.append('<a class="'+classItem+'" href="#"><span class="discover-name">'+imgText+'</span></a>');
						var linkBlock = $('.grid-item').eq(i);
						linkBlock.css({'background' : 'url("'+imgSrc+'") center no-repeat', 'background-size' : 'cover'});
						$grid.isotope().append( linkBlock ).isotope('appended', linkBlock );
					}
				}
			} else if (request.status !== 200) {
				console.log('false');
			}
		}
		request.send();
	};

	$('.discover-searchButton').on('keypress click', function(e){
		e.preventDefault();
		if (e.which === 13 || e.type === 'click') {
			var searchQuery = $('.discover-searchInput').val();
			if ( searchQuery.length > 0 ) {
				var query = 'https://pixabay.com/api/?key=3564530-46d8bd0b9b32eadc4d00c5e61&q=' + searchQuery + '&image_type=photo&per_page=7';
				getJson(query);
			}
		}
	});

	function getRandomNumber(min, max) {
		return Math.random() * (max - min) + min;
	}
	var randomNumber = Math.round(getRandomNumber(0, 50));
	getJson('https://pixabay.com/api/?key=3564530-46d8bd0b9b32eadc4d00c5e61&image_type=photo&per_page=7&page=' + randomNumber + '');

	var $grid = $('.discover-grid').isotope({
		itemSelector : '.grid-item',
		masonry: {
		columnWidth: '.grid-item'
		}
	});

	$('.arrow-l').on('mouseenter', function() {
		$( this ).addClass('animated rubberBand').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
			function() {
				$( this ).removeClass('animated rubberBand');
		});
	});

	$('.arrow-r').on('mouseenter', function() {
		$( this ).addClass('animated rubberBand').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
			function() {
				$( this ).removeClass('animated rubberBand');
		});
	});

	$('.partners-block').on('mouseenter', function() {
		$( this ).addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
			function() {
				$( this ).removeClass('animated pulse');
		});
	});

});