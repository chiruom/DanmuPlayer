/* ==========================================================
 * sco.tooltip71452.js
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

	var pluginName = 'scojs_tooltip71452';

	function Tooltip($trigger, options) {
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.$trigger = this.$target = $trigger;
		this.leaveTimeout = null;

		this.$tooltip71452 = $('<div class="tooltip71452"><span></span><div class="pointer"></div></div>').appendTo(this.options.appendTo).hide();
		if (this.options.contentElem !== undefined && this.options.contentElem !== null) {
			this.options.content = $(this.options.contentElem).html();
		} else if (this.options.contentAttr !== undefined && this.options.contentAttr !== null) {
			this.options.content = this.$trigger.attr(this.options.contentAttr);
		}
		if (this.$trigger && this.$trigger.attr('title')) {
			this.$trigger.data('originalTitle', this.$trigger.attr('title'));
		}
		this.$tooltip71452.find('span').html(this.options.content);
		if (this.options.cssclass != '') {
			this.$tooltip71452.addClass(this.options.cssclass);
		}
		if (this.options.target !== undefined) {
			this.$target = $(this.options.target);
		}
		if (this.options.hoverable) {
			var self = this;
			this.$tooltip71452.on('mouseenter.' + pluginName, $.proxy(this.do_mouseenter, self))
						 .on('mouseleave.' + pluginName, $.proxy(this.do_mouseleave, self))
						 .on('close.' + pluginName, $.proxy(this.hide, self));
		}
	}


	$.extend(Tooltip.prototype, {
		show: function(allowMirror) {
			if (allowMirror === undefined) {
				allowMirror = false;
			}
			this.$tooltip71452.removeClass('pos_w pos_e pos_n pos_s pos_nw pos_ne pos_se pos_sw pos_center').addClass('pos_' + this.options.position);
			var  targetBox = this.$target.offset()
				,tooltip71452Box = {left: 0, top: 0, width: Math.floor(this.$tooltip71452.outerWidth()), height: Math.floor(this.$tooltip71452.outerHeight())}
				,pointerBox = {left: 0, top: 0, width: Math.floor(this.$tooltip71452.find('.pointer').outerWidth()), height: Math.floor(this.$tooltip71452.find('.pointer').outerHeight())}
				,docBox = {left: $(document).scrollLeft(), top: $(document).scrollTop(), width: $(window).width(), height: $(window).height()}
				;
			targetBox.left = Math.floor(targetBox.left);
			targetBox.top = Math.floor(targetBox.top);
			targetBox.width = Math.floor(this.$target.outerWidth());
			targetBox.height = Math.floor(this.$target.outerHeight());

			if (this.options.position === 'w') {
				tooltip71452Box.left = targetBox.left - tooltip71452Box.width - pointerBox.width;
				tooltip71452Box.top = targetBox.top + Math.floor((targetBox.height - tooltip71452Box.height) / 2);
				pointerBox.left = tooltip71452Box.width;
				pointerBox.top = Math.floor(targetBox.height / 2);
			} else if (this.options.position === 'n') {
				tooltip71452Box.left = targetBox.left - Math.floor((tooltip71452Box.width - targetBox.width) / 2)-$("#danmu71452").offset().left;
				tooltip71452Box.top = targetBox.top-tooltip71452Box.height-pointerBox.height-$("#danmu71452").offset().top;
				pointerBox.left = Math.floor(tooltip71452Box.width / 2);
				pointerBox.top = tooltip71452Box.height;
			} 



			this.$tooltip71452.css({left: tooltip71452Box.left, top: tooltip71452Box.top})

			this.$trigger.removeAttr('title');
			this.$tooltip71452.show();
			return this;
		}

		,hide: function() {
			if (this.$trigger.data('originalTitle')) {
				this.$trigger.attr('title', this.$trigger.data('originalTitle'));
			}
			if (typeof this.options.on_close == 'function') {
				this.options.on_close.call(this);
			}
			this.$tooltip71452.hide();
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
		,hoverable: true		// should mouse over tooltip71452 hold the tooltip71452 or not?
		,delay: 200
		,cssclass: ''
		,position: 'n'			// n,s,e,w,ne,nw,se,sw,center
		,autoclose: true
		,appendTo: 'body'	// where should the tooltip71452s be appended to (default to document.body). Added for unit tests, not really needed in real life.
	};

	$(document).on('mouseenter.' + pluginName, '[data-trigger="tooltip71452"]', function() {
		$(this)[pluginName]('do_mouseenter');
	}).on('mouseleave.' + pluginName, '[data-trigger="tooltip71452"]', function() {
		$(this)[pluginName]('do_mouseleave');
	});
	$(document).off('click.' + pluginName, '[data-dismiss="tooltip71452"]').on('click.' + pluginName, '[data-dismiss="tooltip71452"]', function(e) {
		$(this).closest('.tooltip71452').trigger('close');
	});
})(jQuery);
