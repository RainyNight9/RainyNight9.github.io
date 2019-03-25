# 单个MiniRefresh 容器实现多个列表效果

##### 继续套用 该组建 loadList.vue，该组建不做更改
##### 这个缺点就是 每次切换页面都是数据 重新清空请求，不保留上次浏览记录
##### 其实是可以改造成保留上次浏览记录，该需求留给大家，哈哈

## 参考代码如下：里边注释不需要的自己酌情处理掉
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
        <minirefresh id="minirefresh"
                     ref="minirefresh"
                     :options="options"
                     @pullingDown="onPullingDown"
                     @pullingUp="onPullingUp">

            <ul slot="content" class="data-list" id="listdata">
                <li v-for="(item,index) in listData" :key="index" class="list-item">
                   
                </li>
            </ul>
        </minirefresh>
    </div>
</template>

<script>
    import MiniRefresh from '../components/minirefresh/loadList.vue'

    export default {
        components: {
            minirefresh: MiniRefresh
        },
        data() {
            return {
                types: [0, 1, 2],
                currentType: 0,
                page: 1,
                ajaxURL: [
                    'aaaaaa',
                    'bbbbbb',
                    'cccccc'
                ],
                maxDataSize: 30,
                listData: [],
                options: {
                    container: '#minirefresh',
                    up: {
                        isAuto: true,
                        loadFull: {
                            isEnable: true
                        }
                    }
                }
            }
        },
        methods: {
            doAjax(downOrUp, isReset) {
                const self = this
                if (isReset) { // 换了type 清空数据
                    self.listData = []
                }
                if (downOrUp === 'down') {
                    self.page = 1 // 下拉刷新页码设置 可以全部替换成自己的参数page
                } else {
                    self.page++ // 上拉加载递增页码 可以全部替换成自己的参数page
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
                        var arrLen = response.data.length
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
                    this.listData = data
                    this.$refs.minirefresh.endDownLoading(true)
                } else {
                    // 把新数据合并到之前数据上，触发数据双向绑定，渲染页面
                    this.listData = this.listData.concat(data)
                    // this.listData.length >= this.maxDataSize
                    // 这个是判断有没有更多数据，是否还可以上拉
                    // 这个参数可以根据自己实际情况判断
                    // maxDataSize 表示最多数据量，如果接口没有返回这个字段，下边这行代码可以省略
                    // 因为 在数据为 0 是结束加载的 dealError 有做处理
                    this.$refs.minirefresh.endUpLoading(this.listData.length >= this.maxDataSize)
                }
            },
            dealError(downOrUp) {
                if (downOrUp === 'down') {
                    this.listData = []
                    this.$refs.minirefresh.endDownLoading(true)
                } else {
                    this.$refs.minirefresh.endUpLoading(true)
                }
            },
            typeClick(type) {
                console.log(typeof type)
                if (type !== this.currentType) {
                    this.currentType = type
                    this.resetScroll()
                }
            },
            resetScroll() {
                this.doAjax('up', true)
                this.$refs.minirefresh.triggerUpLoading()
            },
            onPullingDown() {
                this.doAjax('down', true)
            },
            onPullingUp() {
                this.doAjax('up', false)
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


