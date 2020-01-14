"use strict";

(function () {
    var sortingMixin = {
        data: {
            sorting: {
                list: [],
                fieldName: "",
                fieldType: "",
                fieldFunction: null,
                isAscending: true
            }
        },
        computed: {
            sortedList: function () {
                if (this.sorting.fieldType === "string") {
                    if (this.sorting.isAscending) {
                        return this.sorting.list.sort(
                            (e1, e2) => this.$_sortingMixin_getColumnElement(e1).localeCompare(this.$_sortingMixin_getColumnElement(e2)));
                    } else {
                        return this.sorting.list.sort(
                            (e1, e2) => this.$_sortingMixin_getColumnElement(e2).localeCompare(this.$_sortingMixin_getColumnElement(e1)));
                    }
                }

                if (this.sorting.fieldType === "date") {
                    if (this.sorting.isAscending) {
                        return this.sorting.list.sort((e1, e2) =>
                            (new Date(this.$_sortingMixin_getColumnElement(e1))).valueOf() - (new Date(this.$_sortingMixin_getColumnElement(e2))).valueOf());
                    } else {
                        return this.sorting.list.sort((e1, e2) =>
                            (new Date(this.$_sortingMixin_getColumnElement(e2))).valueOf() - (new Date(this.$_sortingMixin_getColumnElement(e1))).valueOf());
                    }
                }

                if (this.sorting.fieldType === "number") {
                    if (this.sorting.isAscending) {
                        return this.sorting.list.sort((e1, e2) => this.$_sortingMixin_getColumnElement(e1) - this.$_sortingMixin_getColumnElement(e2));
                    } else {
                        return this.sorting.list.sort((e1, e2) => this.$_sortingMixin_getColumnElement(e2) - this.$_sortingMixin_getColumnElement(e1));
                    }
                }

                return this.sorting.list;
            }
        },
        methods: {
            $_sortingMixin_getListElementField(listElement) {
                var result = listElement;

                if (this.sorting.fieldName === "" || this.sorting.fieldName === null) {
                    return result;
                }

                if (this.sorting.fieldName.indexOf(".") < 0) {
                    return result[this.sorting.fieldName];
                }

                var fields = this.sorting.fieldName.split(".");

                for (var i = 0; i < fields.length; i++) {
                    result = result[fields[i]];
                }

                return result;
            },
            $_sortingMixin_getColumnElement: function (listElement) {
                if (this.sorting.fieldFunction === null) {
                    return this.$_sortingMixin_getListElementField(listElement);
                }

                return this.sorting.fieldFunction(this.$_sortingMixin_getListElementField(listElement));
            },
            changeSorting: function (fieldName, fieldType, fieldFunction) {
                if (this.sorting.fieldName === fieldName) {
                    this.sorting.isAscending = !this.sorting.isAscending;
                } else {
                    this.sorting.fieldName = fieldName;
                    this.sorting.fieldType = fieldType;
                    this.sorting.fieldFunction = fieldFunction;
                    this.sorting.isAscending = true;
                }
            }
        }
    };

    Vue.directive("sort-by-column", {
        bind(el, binding, vNode) {
            if (binding.value.initialSorting !== undefined) {
                if (vNode.context.sorting.fieldName !== "") {
                    throw new Error("sort-by-column[" + binding.value.fieldName + "]: Нельзя устанавливать начальную сортировку сразу по нескольким полям!");
                }

                var sorting = ("" + binding.value.initialSorting).toLowerCase();

                if (sorting === "asc" || sorting === "ascending") {
                    vNode.context.changeSorting(binding.value.fieldName,
                        binding.value.fieldType,
                        binding.value.fieldFunction);
                } else if (sorting === "desc" || sorting === "descending") {
                    vNode.context.changeSorting(binding.value.fieldName,
                        binding.value.fieldType,
                        binding.value.fieldFunction);
                    vNode.context.changeSorting(binding.value.fieldName,
                        binding.value.fieldType,
                        binding.value.fieldFunction);
                }
            }

            var sortingIcon = document.createElement("i");
            $(sortingIcon).attr("aria-hidden", "true");
            $(sortingIcon).addClass("sort-by-column");
            $(sortingIcon).addClass("fa");

            if (vNode.context.sorting.fieldName === binding.value.fieldName) {
                $(sortingIcon).addClass("text-primary");

                if (vNode.context.sorting.isAscending) {
                    $(sortingIcon).addClass("fa-sort-asc col-sort-asc");
                } else {
                    $(sortingIcon).addClass("fa-sort-desc col-sort-desc");
                }
            } else {
                $(sortingIcon).addClass("fa-sort");
            }

            el.innerHTML += " ";
            el.appendChild(sortingIcon);

            $(el).addClass("pointer");

            $(el).click(event => vNode.context.changeSorting(binding.value.fieldName,
                binding.value.fieldType,
                binding.value.fieldFunction));
        },
        update(el, binding, vNode) {
            var sortingIcon = $(el).children(".sort-by-column").eq(0);

            if (vNode.context.sorting.fieldName === binding.value.fieldName) {
                if (vNode.context.sorting.isAscending) {
                    sortingIcon.removeClass("fa-sort fa-sort-desc col-sort-desc");
                    sortingIcon.addClass("fa-sort-asc col-sort-asc text-primary");
                } else {
                    sortingIcon.removeClass("fa-sort fa-sort-asc col-sort-asc");
                    sortingIcon.addClass("fa-sort-desc col-sort-desc text-primary");
                }
            } else {
                sortingIcon.removeClass("fa-sort-asc col-sort-asc text-primary fa-sort-desc col-sort-desc");
                sortingIcon.addClass("fa-sort");
            }
        }
    });

    var app = new Vue({
        el: "#App",
        data: {
            enrollments: []
        },
        mixins: [sortingMixin],
        methods: {
            getFullName: function (contact) {
                return contact.surname + " " + contact.name;
            }
        },
        mounted: function () {
            this.enrollments = [
                {
                    id: 0,
                    contact: {
                        name: "Вол",
                        surname: "Волов",
                        age: "29",
                        test: "9.9",
                        date: "2019-10-11"
                    },
                    group: {
                        language: "Java"
                    }
                },
                {
                    id: 1,
                    contact: {
                        name: "Тур",
                        surname: "Туров",
                        age: "21",
                        test: "6.6",
                        date: "2019-10-15"
                    },
                    group: {
                        language: "C#"
                    }
                },
                {
                    id: 2,
                    contact: {
                        name: "Баран",
                        surname: "Баранов",
                        age: "28",
                        test: "9.9",
                        date: "2019-10-21"
                    },
                    group: {
                        language: "Java"
                    }
                },
                {
                    id: 3,
                    contact: {
                        name: "Лиса",
                        surname: "Лисочкина",
                        age: "22",
                        test: "8.8",
                        date: "2019-11-11"
                    },
                    group: {
                        language: "C#"
                    }
                },
                {
                    id: 4,
                    contact: {
                        name: "Киса",
                        surname: "Кисочкина",
                        age: "27",
                        test: "7.7",
                        date: "2019-11-21"
                    },
                    group: {
                        language: "Java"
                    }
                },
                {
                    id: 5,
                    contact: {
                        name: "Алиса",
                        surname: "Кисочкина",
                        age: "25",
                        test: "7.9",
                        date: "2019-11-20"
                    },
                    group: {
                        language: "Java"
                    }
                },
                {
                    id: 6,
                    contact: {
                        name: "Тимур",
                        surname: "Баранов",
                        age: "38",
                        test: "9.7",
                        date: "2019-10-20"
                    },
                    group: {
                        language: "Java"
                    }
                },
                {
                    id: 7,
                    contact: {
                        name: "тимур",
                        surname: "баранов",
                        age: "38",
                        test: "9.7",
                        date: "2018-10-20"
                    },
                    group: {
                        language: "Java"
                    }
                },
                {
                    id: 8,
                    contact: {
                        name: "Тимур",
                        surname: "баранов",
                        age: "38",
                        test: "9.7",
                        date: "2017-10-20"
                    },
                    group: {
                        language: "Java"
                    }
                }
            ];

            this.sorting.list = this.enrollments;
        }
    });
})();