import {
    user as UserApi
} from 'config/request.js';

module.exports = {
    name: 'user',
    components: {

    },
    data() {
        return {
            accesss: [],
            checkeds: [],

            user_id: [],
            user_list: [],

            defaultProps: {
                children: 'children',
                label: 'name'
            }
        };
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        checkChange(data, selfIsChecked, childHasChecked) {
            if (selfIsChecked === true && data.access.split('/').length == 4 && this.checkeds.indexOf(data.access) === -1) {
                this.checkeds.push(data.access);
            } else {
                var index = this.checkeds.indexOf(data.access);
                if (index !== -1) {
                    this.checkeds.splice(index, 1);
                }
            }
        },
        currentChange(data, node) {
            // console.log(data, node);
        },

        nodeClick(data, node, self) {
            // console.log(node);
        },

        setUserAccess() {
            var flag = false;
            for (var i = 0; i < this.checkeds.length; i++) {
                var arr = this.checkeds[i].split('/');

                if (arr.length === 4) {
                    flag = true;
                    var rootPath = '/' + arr[1],
                        twoPath = rootPath + '/' + arr[2];

                    if (this.checkeds.indexOf(rootPath) === -1) {
                        this.checkeds.push(rootPath);
                    }
                    if (this.checkeds.indexOf(twoPath) === -1) {
                        this.checkeds.push(twoPath);
                    }
                }
            }

            //当前所选中的节点
            if (flag === false) {
                this.checkeds = [];
            }

            // console.log(this.checkeds.join(','));
            // console.log(this.user_id.join(','));


            if (this.user_id.length) {
                UserApi.setAccessUser.call(this, {
                    user_id: this.user_id.join(','),
                    user_accesss: this.checkeds.join(',')
                }, data => {
                    this.$message.success('设置成功');
                });
            } else {
                this.$message.error('用户不能为空');
            }
        }
    },
    mounted() {
        UserApi.selectUser.call(this, {}, (data) => {
            this.user_list = data.list;
        });


        var routes = this.$router.options.routes;
        for (var i = 0; i < routes.length; i++) {
            if (routes[i].hidden !== true && routes[i].children && routes[i].children.length) {
                var tempObj = {},
                    module = routes[i],
                    menus = module.children;
                tempObj.name = module.name;
                tempObj.path = module.path;
                tempObj.access = module.path;
                tempObj.children = [];
                for (var j = 0; j < menus.length; j++) {
                    if (menus[j].hidden !== true && menus[j].children && menus[j].children.length) {
                        var tempChildObj = {},
                            menu = menus[j],
                            pages = menu.children;
                        tempChildObj.name = menu.name;
                        tempChildObj.path = '/' + menu.path;
                        tempChildObj.access = tempObj.path + '/' + menu.path;
                        tempChildObj.children = [];
                        for (var k = 0; k < pages.length; k++) {
                            if (pages[k].hidden !== true) {
                                var tempPageObj = {},
                                    page = pages[k];
                                tempPageObj.name = page.name;
                                tempPageObj.path = '/' + page.path;
                                tempPageObj.access = tempObj.path + '/' + menu.path + '/' + page.path;
                                tempChildObj.children.push(tempPageObj);
                            }
                        }
                        tempObj.children.push(tempChildObj);
                    }
                }
                this.accesss.push(tempObj);
            }
        }
        // console.log(this.accesss);
    },

    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    }
}