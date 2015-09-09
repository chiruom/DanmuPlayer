/* ==========================================================
 * sco.tooltip.js
 * http://github.com/terebentina/sco.js
 * ==========================================================
 * Copyright 2013 Dan Caragea.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

/*jshint laxcomma:true, sub:true, browser:true, jquery:true, smarttabs:true, eqeqeq:false */

;(function($, undefined) {
	"use strict";

	var pluginName = 'scojs_tooltip';

	function Tooltip($trigger, options) {
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.$trigger = this.$target = $trigger;
		this.leaveTimeout = null;

		this.$tooltip714 = $('<div class="tooltip714"> <span></span><div class="pointer714"></div></div>').appendTo(this.options.appendTo).hide();
		if (this.options.contentElem !== undefined && this.options.contentElem !== null) {
			this.options.content = $(this.options.contentElem).html();
		} else if (this.options.contentAttr !== undefined && this.options.contentAttr !== null) {
			this.options.content = this.$trigger.attr(this.options.contentAttr);
		}
		if (this.$trigger && this.$trigger.attr('title')) {
			this.$trigger.data('originalTitle', this.$trigger.attr('title'));
		}
		this.$tooltip714.find('span').html(this.options.content);
		if (this.options.cssclass != '') {
			this.$tooltip714.addClass(this.options.cssclass);
		}
		if (this.options.target !== undefined) {
			this.$target = $(this.options.target);
		}
		if (this.options.hoverable) {
			var self = this;
			this.$tooltip714.on('mouseenter.' + pluginName, $.proxy(this.do_mouseenter, self))
						 .on('mouseleave.' + pluginName, $.proxy(this.do_mouseleave, self))
						 .on('close.' + pluginName, $.proxy(this.hide, self));
		}
	}


	$.extend(Tooltip.prototype, {
		show: function(allowMirror) {
			if (allowMirror === undefined) {
				allowMirror = false;
			}
			this.$tooltip714.removeClass('pos_w pos_e pos_n pos_s pos_nw pos_ne pos_se pos_sw pos_center').addClass('pos_' + this.options.position);
			var  targetBox = this.$target.offset()
				,tooltipBox = {left: 0, top: 0, width: Math.floor(this.$tooltip714.outerWidth()), height: Math.floor(this.$tooltip714.outerHeight())}
				,pointerBox = {left: 0, top: 0, width: Math.floor(this.$tooltip714.find('.pointer').outerWidth()), height: Math.floor(this.$tooltip714.find('.pointer').outerHeight())}
				,docBox = {left: $(document).scrollLeft(), top: $(document).scrollTop(), width: $(window).width(), height: $(window).height()}
				;
			targetBox.left = Math.floor(targetBox.left);
			targetBox.top = Math.floor(targetBox.top);
			targetBox.width = Math.floor(this.$target.outerWidth());
			targetBox.height = Math.floor(this.$target.outerHeight());


			if (this.options.position === 'w') {
				tooltipBox.left = targetBox.left - tooltipBox.width - pointerBox.width;
				tooltipBox.top = targetBox.top + Math.floor((targetBox.height - tooltipBox.height) / 2);
				pointerBox.left = tooltipBox.width;
				pointerBox.top = Math.floor(targetBox.height / 2);
			} else if (this.options.position === 'e') {
				tooltipBox.left = targetBox.left + targetBox.width + pointerBox.width;
				tooltipBox.top = targetBox.top + Math.floor((targetBox.height - tooltipBox.height) / 2);
				pointerBox.left = -pointerBox.width;
				pointerBox.top = Math.floor(tooltipBox.height / 2);
			} else if (this.options.position === 'n') {
//				console.log(targetBox.top );
//console.log(Math.floor($(this.options.appendTo).offset().top));
				//tooltipBox.left = targetBox.left - Math.floor((tooltipBox.width - targetBox.width) / 2)-Math.floor($(this.options.appendTo).offset().left);
				//tooltipBox.top = targetBox.top - tooltipBox.height - pointerBox.height-Math.floor($(this.options.appendTo).offset().top);
				tooltipBox.left = targetBox.left - Math.floor((tooltipBox.width - targetBox.width) / 2)-Math.floor($(this.options.appendTo).offset().left);
				tooltipBox.top = targetBox.top - tooltipBox.height -Math.floor($(this.options.appendTo).offset().top);
				pointerBox.left = Math.floor(tooltipBox.width / 2);
				pointerBox.top = tooltipBox.height;
			} else if (this.options.position === 's') {
				tooltipBox.left = targetBox.left - Math.floor((tooltipBox.width - targetBox.width) / 2);
				tooltipBox.top = targetBox.top + targetBox.height + pointerBox.height;
				pointerBox.left = Math.floor(tooltipBox.width / 2);
				pointerBox.top = -pointerBox.height;
			} else if (this.options.position === 'nw') {
				tooltipBox.left = targetBox.left - tooltipBox.width + pointerBox.width;	// +pointerBox.width because pointer is under
				tooltipBox.top = targetBox.top - tooltipBox.height - pointerBox.height;
				pointerBox.left = tooltipBox.width - pointerBox.width;
				pointerBox.top = tooltipBox.height;
			} else if (this.options.position === 'ne') {
				tooltipBox.left = targetBox.left + targetBox.width - pointerBox.width;
				tooltipBox.top = targetBox.top - tooltipBox.height - pointerBox.height;
				pointerBox.left = 1;
				pointerBox.top = tooltipBox.height;
			} else if (this.options.position === 'se') {
				tooltipBox.left = targetBox.left + targetBox.width - pointerBox.width;
				tooltipBox.top = targetBox.top + targetBox.height + pointerBox.height;
				pointerBox.left = 1;
				pointerBox.top = -pointerBox.height;
			} else if (this.options.position === 'sw') {
				tooltipBox.left = targetBox.left - tooltipBox.width + pointerBox.width;
				tooltipBox.top = targetBox.top + targetBox.height + pointerBox.height;
				pointerBox.left = tooltipBox.width - pointerBox.width;
				pointerBox.top = -pointerBox.height;
			} else if (this.options.position === 'center') {
				tooltipBox.left = targetBox.left + Math.floor((targetBox.width - tooltipBox.width) / 2);
				tooltipBox.top = targetBox.top + Math.floor((targetBox.height - tooltipBox.height) / 2);
				allowMirror = false;
				this.$tooltip714.find('.pointer').hide();
			}



			this.$tooltip714.css({left: tooltipBox.left, top: tooltipBox.top});


			this.$trigger.removeAttr('title');
			this.$tooltip714.show();
			return this;
		}

		,hide: function() {
			if (this.$trigger.data('originalTitle')) {
				this.$trigger.attr('title', this.$trigger.data('originalTitle'));
			}
			if (typeof this.options.on_close == 'function') {
				this.options.on_close.call(this);
			}
			this.$tooltip714.hide();
		}

		,do_mouseenter: function() {
			if (this.leaveTimeout !== null) {
				clearTimeout(this.leaveTimeout);
				this.leaveTimeout = null;
			}
			this.show();
		}

		,do_mouseleave: function() {
			var self = this;
			if (this.leaveTimeout !== null) {
				clearTimeout(this.leaveTimeout);
				this.leaveTimeout = null;
			}
			if (this.options.autoclose) {
				this.leaveTimeout = setTimeout(function() {
					clearTimeout(self.leaveTimeout);
					self.leaveTimeout = null;
					self.hide();
				}, this.options.delay);
			}
		}
	});

	$.fn[pluginName] = function(options) {
		var  method = null
			,first_run = false
			;
		if (typeof options == 'string') {
			method = options;
		}
		return this.each(function() {
			var obj;
			if (!(obj = $.data(this, pluginName))) {
				var  $this = $(this)
					,data = $this.data()
					,opts
					;
				first_run = true;
				if (typeof options === 'object') {
					opts = $.extend({}, options, data);
				} else {
					opts = data;
				}
				obj = new Tooltip($this, opts);
				$.data(this, pluginName, obj);
			}
			if (method) {
				obj[method]();
			} else if (first_run) {
				$(this).on('mouseenter.' + pluginName, function() {
					obj.do_mouseenter();
				}).on('mouseleave.' + pluginName, function() {
					obj.do_mouseleave();
				});
			} else {
				obj.show();
			}
		});
	};


	$[pluginName] = function(elem, options) {
		if (typeof elem === 'string') {
			elem = $(elem);
		}
		return new Tooltip(elem, options);
	};


	$.fn[pluginName].defaults = {
		 contentElem: null
		,contentAttr: null
		,content: ''
		,hoverable: true		// should mouse over tooltip hold the tooltip or not?
		,delay: 0
		,cssclass: ''
		,position: 'n'			// n,s,e,w,ne,nw,se,sw,center
		,autoclose: true
		,appendTo: 'body'	// where should the tooltips be appended to (default to document.body). Added for unit tests, not really needed in real life.
	};

	$(document).on('mouseenter.' + pluginName, '[data-trigger="tooltip"]', function() {
		$(this)[pluginName]('do_mouseenter');
	}).on('mouseleave.' + pluginName, '[data-trigger="tooltip"]', function() {
		$(this)[pluginName]('do_mouseleave');
	});
	$(document).off('click.' + pluginName, '[data-dismiss="tooltip"]').on('click.' + pluginName, '[data-dismiss="tooltip"]', function(e) {
		$(this).closest('.tooltip').trigger('close');
	});
})(jQuery);
