/*global m, DatePicker, window*/
(function (m, DatePicker) {
    var module = {};


    module.controller = function () {
        module.vm.init();
        var ctrl = this;
        this.datepicker = new DatePicker();
        this.datepicker2 = new DatePicker({
            time: false,
            i18n: {
                dayNames: [
                    "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab",
                    "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"
                ],
                monthNames: [
                    "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec",
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ]
            }
        });
        /*this.datepicker2.i18n = {
            dayNames: [
                "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab",
                "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"
            ],
            monthNames: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ]
        };*/
        this.datepicker3 = new DatePicker({
            placeholder: 'Start Date',
            onchange: function (date) {
                ctrl.datepicker4.setMinDate(date);
            }
        });
        this.datepicker4 = new DatePicker({
            placeholder: 'End Date',
            onchange: function (date) {
                ctrl.datepicker3.setMaxDate(date);
            }
        });
    };

    module.vm = {};
    module.vm.init = function () {
        this.dates = m.prop({
            start: m.prop(),
            end: m.prop()
        });
    };


    module.view = function (ctrl) {
        return m('', [
            m('.ui.grid.page', [
                m('br'),
                m('h1.ui.dividing.header', 'Datepicker Widget')
            ]),
            m('.ui.grid.page.stackable', [
                m('h2', 'Basic Datepicker'),
                m('.row', [
                    m('.column.four.wide', [
                        ctrl.datepicker.view()
                    ]),
                    m('.column.two.wide', [
                        m('button.ui.button.primary', {
                            onclick: function() {
                                console.log(ctrl.datepicker.getValue());
                            }
                        }, 'get')
                    ])
                ])
            ]),
            m('.ui.grid.page.form.stackable', [
                m('h2', 'Form datepicker & no time'),
                m('.row', [
                    m('.ui.column.five.wide', [
                        ctrl.datepicker2.view()
                    ]),
                    m('.column.two.wide', [
                        m('button.ui.button.primary', {
                            onclick: function() {
                                console.log(ctrl.datepicker2.getValue());
                            }
                        }, 'get')
                    ])
                ])
            ]),
            m('.ui.grid.page', [
                m('h2', 'Max/Min Date, property'),
                m('.column.sixteen.wide', [
                    m('.ui.form.fluid', [
                        m(".two.fields", [
                            m(".field.required", [
                                m("label[for='']", "Start Date"),
                                ctrl.datepicker3.view({
                                    property: module.vm.dates().start
                                })
                            ]),
                            m(".field.required", [
                                m("label[for='']", "End Time"),
                                ctrl.datepicker4.view({
                                    property: module.vm.dates().end
                                })
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    };

    m.module(window.document.body, module);
}(m, DatePicker));
