/*global require, module, window*/
'use strict';
var DatePicker = function (properties) {
    properties = properties || {};
    properties['class'] = properties['class'] || 'ui icon button';

    var datePicker = {},
        m = window.m || require("mithril"),
        Calendar = window.Calendar || require('sm-calendar'),
        addEvent,
        dateFormat;

    addEvent = function (element, eventName, fn, useCapture) {
        if (element.addEventListener) {
            element.addEventListener(eventName, fn, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent(eventName, function () {
                fn.apply(element, arguments);
            }, useCapture);
        }
    };
    /*
     * Date Format 1.2.3
     * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
     * MIT license
     *
     * Includes enhancements by Scott Trenda <scott.trenda.net>
     * and Kris Kowal <cixar.com/~kris.kowal/>
     *
     * Accepts a date, a mask, or a date and a mask.
     * Returns a formatted version of the given date.
     * The date defaults to the current date/time.
     * The mask defaults to datePicker.masks.default.
     */

    dateFormat = function () {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = "0" + val;
                }
                return val;
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) {
                //throw new SyntaxError("invalid date");
                datePicker.value('');
                datePicker.error('.error');
                return '';
            }
            datePicker.error('');

            mask = String(datePicker.masks[mask] || mask || datePicker.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d: d,
                    dd: pad(d),
                    ddd: datePicker.i18n.dayNames[D],
                    dddd: datePicker.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1),
                    mmm: datePicker.i18n.monthNames[m],
                    mmmm: datePicker.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12),
                    H: H,
                    HH: pad(H),
                    M: M,
                    MM: pad(M),
                    s: s,
                    ss: pad(s),
                    l: pad(L, 3),
                    L: pad(L > 99 ? Math.round(L / 10) : L),
                    t: H < 12 ? "a" : "p",
                    tt: H < 12 ? "am" : "pm",
                    T: H < 12 ? "A" : "P",
                    TT: H < 12 ? "AM" : "PM",
                    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            datePicker.value(date);

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    // Some common format strings
    datePicker.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    datePicker.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };

    datePicker.format = function (date, mask, utc) {
        return dateFormat(date, mask, utc);
    };

    datePicker.value = m.prop('');
    datePicker.displayValue = m.prop('');
    datePicker.display = m.prop('none');
    datePicker.time = properties.time === undefined ? true : properties.time;
    datePicker.dateformat = properties.dateformat || (datePicker.time ? "mm/dd/yy HH:MM" : "mm/dd/yy");
    datePicker.property = properties.property || m.prop('');
    datePicker.maxdate = properties.maxdate || null;
    datePicker.mindate = properties.mindate || null;
    datePicker.error = m.prop('');
    datePicker.onchange = properties.onchange || null;

    datePicker.change = function () {
        datePicker.display('none');
        datePicker.manual = false;
        if (datePicker.onchange) {
            datePicker.onchange.call(datePicker, datePicker.value());
        }
    };

    datePicker.setMaxDate = function (date) {
        datePicker.maxdate = date || null;
        datePicker.calendar.setMaxDate(date);
        if (datePicker.getValue()) {
            datePicker.setValue(datePicker.getValue());
        }
    };

    datePicker.setMinDate = function (date) {
        datePicker.mindate = date || null;
        datePicker.calendar.setMinDate(date);
        if (datePicker.getValue()) {
            datePicker.setValue(datePicker.getValue());
        }
    };

    datePicker.calendar = new Calendar({
        small: true,
        onclick: function (date) {
            datePicker.setValue(date);
            datePicker.change();
        },
        time: datePicker.time,
        maxdate: datePicker.maxdate,
        mindate: datePicker.mindate,
        pageclass: false
    });



    datePicker.view = function (props) {
        props = props || {};
        datePicker.property = props.property || datePicker.property || m.prop('');
        if (datePicker.property()) {
            datePicker.setValue(datePicker.property());
        }
        return m('.ui.action.input' + datePicker.error(), {
            config: function (el, init) {
                if (!init) {
                    addEvent(window.document, 'click', function (e) {
                        var node = e.target,
                            isInside;
                        isInside = el.contains(node);
                        if (node.className.indexOf('sm-calendar-arrow') > -1) {
                            isInside = true;
                        }
                        if (!isInside && datePicker.display() === 'block') {
                            m.startComputation();
                            if (!datePicker.manual) {
                                //datePicker.value(datePicker.calendar.getDate());
                                //datePicker.displayValue(datePicker.format(datePicker.calendar.getDate(), "mm/dd/yy HH:MM"));
                                datePicker.setValue(datePicker.calendar.getDate());
                            }
                            datePicker.change();
                            m.endComputation();
                        }
                    });
                    window.setTimeout(function () {
                        if (datePicker.value()) {
                            if (datePicker.onchange) {
                                datePicker.onchange.call(datePicker, datePicker.value());
                            }
                        }
                    }, 1);
                }
            }
        }, [
            m('input[type="text"][placeholder="' + (properties.placeholder || '') + '"]', {
                onfocus: function () {
                    if (this.value) {
                        datePicker.setValue(this.value);
                        datePicker.calendar.goToDate(datePicker.value() || new Date());
                    }
                    datePicker.display('block');
                },
                value: datePicker.displayValue(),
                onkeydown: function (evt) {
                    evt = evt || window.event;
                    if (evt.keyCode == 27) {
                        datePicker.change();
                    } else {
                        m.redraw.strategy("none");
                    }
                },
                onchange: function () {
                    datePicker.setValue(this.value);
                    datePicker.manual = true;
                },
                config: function (el) {
                    if (datePicker.display() === 'block') {
                        el.selectionStart = el.value.length;
                    }
                }
            }),
            m('.sm-calendar', {
                style: 'display:' + datePicker.display() + ';position:absolute;left:4px;top:35px;background-color:#fff;border:1px solid gray;z-index:100;border-radius:0 0 5px 5px;box-shadow:2px 2px 3px gray;min-width:321px;'
            }, datePicker.calendar.view()),
            m('button', {
                class: properties['class'],
                onclick: function (e) {
                    e.preventDefault();
                    this.previousSibling.previousSibling.focus();
                }
            }, [
                m('i.calendar.icon')
            ])
        ]);
    };

    datePicker.getValue = function () {
        return datePicker.value();
    };

    datePicker.setValue = function (date) {
        datePicker.displayValue(datePicker.format(date, datePicker.dateformat));
        var cdate = datePicker.value();
        if (cdate && (datePicker.mindate && +cdate < +datePicker.mindate) || (datePicker.maxdate && +cdate > +datePicker.maxdate)) {
            datePicker.setValue('a');
            datePicker.error('.error');
            return;
        }
        datePicker.property(datePicker.value());
    };

    datePicker.setProperty = function (prop) {
        datePicker.property = prop;
    };

    return datePicker;
};
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DatePicker;
}
