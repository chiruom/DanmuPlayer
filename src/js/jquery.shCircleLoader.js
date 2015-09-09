/*!
 * SunHater Circle Loader v0.2 (2013-12-28)
 * jQuery plugin
 * Copyright (c) 2014 Pavel Tzonkov <sunhater@sunhater.com>
 * Dual licensed under the MIT and GPL licenses.
 * http://opensource.org/licenses/MIT
 * http://www.gnu.org/licenses/gpl.html
 */

(function($) {

    $.fn.shCircleLoader = function(first, second) {

        var defaultNamespace = "shcl",
            id = 1,
            sel = $(this);

        // Destroy the loader
        if (first === "destroy") {
            sel.find("." + defaultNamespace).detach();
            return;

        // Show progress status into the center
        } else if ((first === "progress") && (typeof second !== "undefined")) {
            sel.each(function() {
                var el = $(this),
                    outer = el.find('.' + defaultNamespace);
                if (!outer.get(0))
                    return;
                if (!el.find('span').get(0))
                    outer.append("<span></span>");
                var span = outer.find('span').last();
                span.html(second).css({
                    position: "absolute",
                    display: "block",
                    left: Math.round((outer.width() - span.width()) / 2) + "px",
                    top: Math.round((outer.height() - span.height()) / 2) + "px"
                });
            });
            return;
        }

        // Default options
        var o = {
            namespace: defaultNamespace,
            radius: "auto", // "auto" - calculate from selector's width and height
            dotsRadius: "auto",
            color: "auto", // "auto" - get from selector's color CSS property; null - do not set
            dots: 12,
            duration: 1,
            clockwise: true,
            externalCss: false, // true - don't apply CSS from the script
            keyframes: '0%{{prefix}transform:scale(1)}80%{{prefix}transform:scale(.3)}100%{{prefix}transform:scale(1)}',
            uaPrefixes: ['o', 'ms', 'webkit', 'moz', '']
        };

        $.extend(o, first);

        // Usable options (for better YUI compression)
        var cl = o.color,
            ns = o.namespace,
            dots = o.dots,
            eCss = o.externalCss,
            ua = o.uaPrefixes,

        // Helper functions
        no_px = function(str) {
            return str.replace(/(.*)px$/i, "$1");
        },

        parseCss = function(text) {
            var i, prefix, ret = "";
            for (i = 0; i < ua.length; i++) {
                prefix = ua[i].length ? ("-" + ua[i] + "-") : "";
                ret += text.replace(/\{prefix\}/g, prefix);
            }
            return ret;
        },

        prefixedCss = function(property, value) {
            var ret = {};
            if (!property.substr) {
                $.each(property, function(p, v) {
                    $.extend(ret, prefixedCss(p, v));
                });
            } else {
                var i, prefix;
                for (i = 0; i < ua.length; i++) {
                    prefix = ua[i].length ? ("-" + ua[i] + "-") : "";
                    ret[prefix + property] = value;
                }
            }
            return ret;
        };

        // Get unexisting ID
        while ($('#' + ns + id).get(0)) {id++;}

        // Create animation CSS
        if (!eCss) {
            var kf = o.keyframes.replace(/\s+$/, "").replace(/^\s+/, "");

            // Test if the first keyframe (0% or "from") has visibility property. If not - add it.
            if (!/(\;|\{)\s*visibility\s*\:/gi.test(kf))
                kf = /^(0+\%|from)\s*\{/i.test(kf)
                    ? kf.replace(/^((0+\%|from)\s*\{)(.*)$/i, "$1visibility:visible;$3")
                    : (/\s+(0+\%|from)\s*\{/i.test(kf)
                        ? kf.replace(/(\s+(0+\%|from)\s*\{)/i, "$1visibility:visible;")
                        : ("0%{visibility:visible}" + kf));

            $($('head').get(0) ? 'head' : 'body').append('<style id="' + ns + id + '" type="text/css">' + parseCss('@{prefix}keyframes ' + ns + id + '_bounce{' + kf + '}') + '</style>');
        }

        // Create loader
        sel.each(function() {
            var r, dr, i, dot, rad, x, y, delay, offset, css, cssBase = {}, el = $(this), l = el.find('.' + defaultNamespace);

            // If loader exists, destroy it before creating new one
            if (l.get(0))
                l.shCircleLoader("destroy");

            el.html('<div class="' + ns + ((ns != defaultNamespace) ? (" " + defaultNamespace) : "") + '"></div>');

            if (eCss)
                el = el.find('div');

            x = el.innerWidth() - no_px(el.css('padding-left')) - no_px(el.css('padding-right'));
            y = el.innerHeight() - no_px(el.css('padding-top')) - no_px(el.css('padding-bottom'));

            r = (o.radius == "auto")
                ? ((x < y) ? (x / 2) : (y / 2))
                : o.radius;

            if (!eCss) {
                r--;
                if (o.dotsRadius == "auto") {
                    dr = Math.abs(Math.sin(Math.PI / (1 * dots))) * r;
                    dr = (dr * r) / (dr + r) - 1;
                } else
                    dr = o.dotsRadius;

                el = el.find('div');

                i = Math.ceil(r * 2);
                css = {
                    position: "relative",
                    width: i + "px",
                    height: i + "px"
                };

                if (i < x)
                    css.marginLeft = Math.round((x - i) / 2);
                if (i < y)
                    css.marginTop = Math.round((y - i) / 2);

                el.css(css);

                i = Math.ceil(dr * 2) + "px";
                cssBase = {
                    position: "absolute",
                    visibility: "hidden",
                    width: i,
                    height: i
                };

                if (cl !== null)
                    cssBase.background = (cl == "auto") ? el.css('color') : cl;

                $.extend(cssBase, prefixedCss({
                    'border-radius': Math.ceil(dr) + "px",
                    'animation-name': ns + id + "_bounce",
                    'animation-duration': o.duration  + "s",
                    'animation-iteration-count': "infinite",
                    'animation-direction': "normal"
                }));
            }

            for (i = 0; i < dots; i++) {
                el.append("<div></div>");
                if (eCss && (typeof dr === "undefined"))
                    dr = (no_px(el.find('div').css('width')) / 2);
                dot = el.find('div').last();
                delay = (o.duration / dots) * i;
                rad = (2 * Math.PI * i) / dots;
                offset = r - dr;
                x = offset * Math.sin(rad);
                y = offset * Math.cos(rad);

                if (o.clockwise) y = -y;

                css = {
                    left: Math.round(x + offset) + "px",
                    top: Math.round(y + offset) + "px"
                };

                if (delay)
                    $.extend(css, prefixedCss('animation-delay', delay + 's'));

                $.extend(css, cssBase);
                dot.css(css);
            };
        });
    }

})(jQuery);