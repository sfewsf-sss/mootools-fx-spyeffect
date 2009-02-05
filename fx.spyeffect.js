/*
	Class:    	Fx.spyEffect
	Author:   	Jan Komzak
	Website:    http://blog.comz.cz/
	Version:  	1.0.0
	Date:     	24/01/2009
	Built For:  MooTools 1.2
	Licence: 		MIT
*/

Fx.spyEffect = new Class({
	// accepts parameters in hash:
	//   element: ul element used to cycle the li items
	//   limit: how many li will be shown
	//   inteval: how often change the content
	initialize : function( options ) {
		// initialize the variables
		$container = options.element;
		$container.addEvent( 'mouseleave', function( cl ) {
			this.startEffect();
			this.hideMe( false );
		}.bind( this ));
		
		$list = $container.getChildren("li")[0];
		limit = options.limit || 4;
		interval = options.interval || 5000;
		
		liHeight = $list[0].getStyle('height').toInt();
		items = [];
		currentItem = limit;
		totalCount = 0;
	  
		// max height should be set
    $list[0].getParent().set( 'styles', { 'height': ( liHeight * limit ) } );
		// fill the items array with lis
		$list.each(function( li, index ) {
			li.addEvent( 'mouseenter', function() {
				this.stopEffect();
				this.hideMe( true, li );
			}.bind( this ) );
			items.push( li );
			if( index > limit - 1 ) { li.dispose(); }
		}.bind( this ) );
		totalCount = items.length;
		
		this.startEffect();
	},
	
	effect : function() {
		// gets the last element from ul element
    var $remove = $container.getElements("li")[0].getLast();
		// gets new element from items array
		var $insert = items[currentItem].set('styles', {
		    'opacity' : 0,
				'height'	: 0
		});
		$container.grab( $insert, 'top' );
    
		// fadeOut the last item
		$remove.set( 'morph', { duration: 1000, onComplete: function() {
			// and remove it
			$remove.dispose();
		} } ).morph( { height : 0, opacity: 0 } );
		// and at the same time, fadeIn the first item
		$insert.set( 'morph', { duration: 1000 } ).morph( { height: liHeight, opacity: 1 } );

		currentItem++;
		// reset counter if it's on the end
		if (currentItem >= totalCount) {
		    currentItem = 0;
		}
	},
	
	startEffect : function() {
		// periodical call effect, based on the setted inteval
		this.delayTimer = this.effect.periodical(interval, this);
	},
	
	stopEffect : function() {
		$clear( this.delayTimer );
	},
	
	hideMe : function( showMe, li ) {
		opacityValue = ( showMe ? '0.3' : '1' );
		$container.getChildren( 'li' ).each( function( hidden ) {
			hidden.set( 'styles', { 'opacity' : opacityValue } );
		});
		
		if( $defined( li ) ) { li.set( 'styles', { 'opacity': 1 } ); }
	}
});
