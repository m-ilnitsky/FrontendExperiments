"use strict";

(function () {
    var mixinForSorting = {
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
                            (e1, e2) => ("" + this.getField(e1)).localeCompare(this.getField(e2)));
                    } else {
                        return this.sorting.list.sort(
                            (e1, e2) => ("" + this.getField(e2)).localeCompare(this.getField(e1)));
                    }
                }

                if (this.sorting.fieldType === "date") {
                    if (this.sorting.isAscending) {
                        return this.sorting.list.sort((e1, e2) => (new Date(this.getField(e1))).valueOf() -
                            (new Date(this.getField(e2))).valueOf());
                    } else {
                        return this.sorting.list.sort((e1, e2) => (new Date(this.getField(e2))).valueOf() -
                            (new Date(this.getField(e1))).valueOf());
                    }
                }

                if (this.sorting.fieldType === "number") {
                    if (this.sorting.isAscending) {
                        return this.sorting.list.sort((e1, e2) => this.getField(e1) - this.getField(e2));
                    } else {
                        return this.sorting.list.sort((e1, e2) => this.getField(e2) - this.getField(e1));
                    }
                }

                return this.sorting.list;
            }
        },
        methods: {
            getField: function (listElement) {
                if (this.sorting.fieldFunction === null) {
                    return eval("listElement." + this.sorting.fieldName);
                }

                return this.sorting.fieldFunction(eval("listElement." + this.sorting.fieldName));
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
        bind(el, binding) {
            var iconHtml = " <i class='fa fa-sort' aria-hidden='true'></i>";

            if (binding.arg.sorting.fieldName === binding.value.fieldName) {
                if (binding.arg.sorting.isAscending) {
                    iconHtml = " <i class='fa fa-sort-asc col-sort-asc text-primary' aria-hidden='true'></i>";
                } else {
                    iconHtml = " <i class='fa fa-sort-desc col-sort-desc text-primary' aria-hidden='true'></i>";
                }
            }

            el.innerHTML = binding.value.columnName + iconHtml;

            $(el).on("click",
                event => binding.arg.changeSorting(binding.value.fieldName,
                    binding.value.fieldType,
                    binding.value.fieldFunction));
        },
        update(el, binding) {
            var iconHtml = " <i class='fa fa-sort' aria-hidden='true'></i>";

            if (binding.arg.sorting.fieldName === binding.value.fieldName) {
                if (binding.arg.sorting.isAscending) {
                    iconHtml = " <i class='fa fa-sort-asc col-sort-asc text-primary' aria-hidden='true'></i>";
                } else {
                    iconHtml = " <i class='fa fa-sort-desc col-sort-desc text-primary' aria-hidden='true'></i>";
                }
            }

            el.innerHTML = binding.value.columnName + iconHtml;
        }
    });

    var app = new Vue({
        el: "#App",
        data: {
            enrollments: []
        },
        mixins: [mixinForSorting],
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
            ];

            this.sorting.list = this.enrollments;
        }
    });
})();