# 多个MiniRefresh 容器实现多个列表效果

### demo如下
```
<template>
    <div class="content">
        <div class="nav-control">
            <p v-for="(item,index) in types"
               :key="index"
               :class="currentType===item?'active':''"
               @click="typeClick(item)">
                列表{{item}}
            </p>
        </div>
        <div v-for="(item,index) in types"
             :key="index"
             :id="'minirefresh' + item"
             :class="currentType===item?'':'minirefresh-hidden'"
             class="minirefresh-wrap">
            <div class="minirefresh-scroll">
                <ul class="data-list" :id="'listdata'+item">
                    <li v-for="(list, listIndex) in listDatas[currentType]" :key="listIndex">

                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import 'minirefresh/dist/debug/minirefresh.css'
    import MiniRefresh from 'minirefresh'

    export default {
        components: {},
        data() {
            return {
                types: [0, 1, 2],
                currentType: 0,
                ajaxPage: [1, 1, 1],
                ajaxURL: ['aaaaaa', 'bbbbbb', 'cccccc'],
                ajaxMaxDataSize: [30, 30, 30],
                listDatas: [[], [], []],
                miniRefreshArr: [null, null, null]
            }
        },
        mounted() {
            this.initMiniRefreshs()
        },
        methods: {
            initMiniRefreshs() {
                const self = this
                self.miniRefreshArr[self.currentType] = new MiniRefresh({
                    container: '#minirefresh' + self.currentType,
                    down: {
                        callback: function() {
                            self.doAjax('down')
                        }
                    },
                    up: {
                        isAuto: true,
                        callback: function() {
                            self.doAjax('up')
                        }
                    }
                })
            },
            doAjax(downOrUp) {
                const self = this
                if (downOrUp === 'down') {
                    self.ajaxPage[self.currentType] = 1 // 下拉刷新页码设置 可以全部替换成自己的参数page
                } else {
                    self.ajaxPage[self.currentType]++ // 上拉加载递增页码 可以全部替换成自己的参数page
                }
                // 此处的ajax用自己的ajax，这个只是一个模拟，例子
                $.ajax({
                    url: self.ajaxURL[self.currentType], // 请求网址 多个列表这个url链接
                    type: 'GET',
                    data: {// 请求参数，一般会带上页码 按照实际参数来，可以判断 currentType 来区别参数
                        'page': self.page,
                        't': new Date().getTime()// 防止GET请求缓存
                    },
                    success: function (response) {
                        // 下面这段请根据自己的数据结构来处理
                        const arrLen = response.data.length
                        // 判断请求回来数组长度，分别处理
                        if (arrLen > 0) {
                            self.loadList(downOrUp, response.data)
                        } else {
                            self.dealError(downOrUp)
                        }
                    },
                    error: function () {
                        self.dealError(downOrUp)
                    }
                })
            },
            loadList(downOrUp, data) {
                if (downOrUp === 'down') {
                    this.listDatas[this.currentType] = data
                    this.miniRefreshArr[this.currentType].endDownLoading(true)
                } else {
                    // 把新数据合并到之前数据上，触发数据双向绑定，渲染页面
                    this.listDatas[this.currentType] = this.listDatas[this.currentType].concat(data)
                    // this.listData.length >= this.maxDataSize
                    // 这个是判断有没有更多数据，是否还可以上拉
                    // 这个参数可以根据自己实际情况判断
                    // maxDataSize 表示最多数据量，如果接口没有返回这个字段，下边这行代码可以省略
                    // 因为 在数据为 0 是结束加载的 dealError 有做处理
                    this.miniRefreshArr[this.currentType].endUpLoading(this.listDatas[this.currentType].length >= this.maxDataSize)
                }
            },
            dealError(downOrUp) {
                if (downOrUp === 'down') {
                    this.listDatas[this.currentType] = []
                    this.miniRefreshArr[this.currentType].endDownLoading(true)
                } else {
                    this.miniRefreshArr[this.currentType].endUpLoading(true)
                }
            },
            typeClick(type) {
                console.log(typeof type)
                if (type !== this.currentType) {
                    this.currentType = type
                    if (!this.miniRefreshArr[this.currentType]) {
                        this.initMiniRefreshs()
                    }
                }
            }
        }
    }
</script>

<style scoped >
    .nav-control {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 44px;
        line-height: 17px;
        border-bottom: 1px solid #ddd;
        text-align: center;
    }
    .nav-control .active {
        border-bottom: 1px solid #FF6990;
        color: #FF6990;
    }
    .nav-control p {
        display: inline-block;
        width: 32%;
        padding: 5px 0;
    }
    .minirefresh-wrap {
        top: 45px;
    }
</style>

```
