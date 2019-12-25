"use strict";

(function () {
    var mixinForSorting = {
        data: {
            sorting: {
                list: [],
                fieldName: "",
                fieldType: "",
                fieldFunction: null,
                isAscending: true,
            }
        },
        computed: {
            sortedList: function () {
                if (this.sorting.fieldType === "string") {
                    if (this.sorting.isAscending) {
                        return this.sorting.list.sort((e1, e2) => ("" + this.getField(e1)).localeCompare(this.getField(e2)));
                    } else {
                        return this.sorting.list.sort((e1, e2) => ("" + this.getField(e2)).localeCompare(this.getField(e1)));
                    }
                }

                if (this.sorting.fieldType === "date") {
                    if (this.sorting.isAscending) {
                        return this.sorting.list.sort((e1, e2) => (new Date(this.getField(e1))).valueOf() - (new Date(this.getField(e2))).valueOf());
                    } else {
                        return this.sorting.list.sort((e1, e2) => (new Date(this.getField(e2))).valueOf() - (new Date(this.getField(e1))).valueOf());
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
    }

    var app = new Vue({
        el: "#App",
        data: {
            enrollments: []
        },
        mixins: [mixinForSorting],
        computed: {

        },
        methods: {
            getFullName: function (contact) {
                return contact.surname + " " + contact.name;
            },
            onTest: function () {
                this.changeSorting("contact.test", "number", null);
            },
            onAge: function () {
                this.changeSorting("contact.age", "number", null);
            },
            onLanguage: function () {
                this.changeSorting("group.language", "string", null);
            },
            onDate: function () {
                this.changeSorting("contact.date", "date", null);
            },
            onFullName: function () {
                this.changeSorting("contact", "string", this.getFullName);
            }
        },
        mounted: function () {
            this.enrollments = [
                {
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
        },
        created: function () {

        }
    });
})();