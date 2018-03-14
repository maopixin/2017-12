var bookmarkscroll = {
	setting: {
		duration: 1000,
		yoffset: 0
	},
	topkeyword: '#top',

	scrollTo: function(dest, options, hash) {
		var $ = jQuery,
			options = options || {}
		var $dest = (typeof dest == "string" && dest.length > 0) ? (dest == this.topkeyword ? 0 : $('#' + dest)) : (dest) ? $(dest) : [] //get element based on id, topkeyword, or dom ref
		if($dest === 0 || $dest.length == 1 && (!options.autorun || options.autorun && Math.abs($dest.offset().top + (options.yoffset || this.setting.yoffset) - $(window).scrollTop()) > 5)) {
			this.$body.animate({
				scrollTop: ($dest === 0) ? 0 : $dest.offset().top + (options.yoffset || this.setting.yoffset)
			}, (options.duration || this.setting.duration), function() {
				if($dest !== 0 && hash)
					location.hash = hash
			})
		}
	},

	urlparamselect: function() {
		var param = window.location.search.match(/scrollto=[\w\-_,]+/i) //search for scrollto=divid
		return(param) ? param[0].split('=')[1] : null
	},

	init: function() {
		jQuery(document).ready(function($) {
			var mainobj = bookmarkscroll
			mainobj.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body')
			var urlselectid = mainobj.urlparamselect()
			if(urlselectid)
				setTimeout(function() {
					mainobj.scrollTo(document.getElementById(urlselectid) || $('a[name=' + urlselectid + ']:eq(0)').get(0), {
						autorun: true
					})
				}, 100)
			$('a[href^="#"]').each(function() {
				var hashvalue = this.getAttribute('href').match(/#\w+$/i)
				hashvalue = (hashvalue) ? hashvalue[0].substring(1) : null
				if(this.hash.length > 1) {
					var $bookmark = $('a[name=' + this.hash.substr(1) + ']:eq(0)')
					if($bookmark.length == 1 || this.hash == mainobj.topkeyword) {
						if($bookmark.length == 1 && !document.all)
							$bookmark.html('.').css({
								position: 'absolute',
								fontSize: 1,
								visibility: 'hidden'
							})
						$(this).click(function(e) {
							mainobj.scrollTo((this.hash == mainobj.topkeyword) ? mainobj.topkeyword : $bookmark.get(0), {}, this.hash)
							e.preventDefault()
						})
					}
				}
			})
		})
	}
}

bookmarkscroll.init()