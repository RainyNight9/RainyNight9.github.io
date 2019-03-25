# minirefresh-vue-examples

## git仓库地址： https://github.com/minirefresh/minirefresh

## 安装
```
# npm install minirefresh
```
## 引入(但不建议这么用，尽量都组件化去开发，npm安装)
```
<link rel="stylesheet" href="xxx/minirefresh.css" />
<script type="text/javascript" src="xxx/minirefresh.js"></script>
```

## require引入
```
// 同时支持NPM与文件形式引入
var MiniRefreshTools = require('xxx/minirefresh.js');
require('xxx/minirefresh.css');
```

## import引入
```
// debug下是.js dist下是.min.js
import MiniRefreshTools from 'minirefresh';
import 'minirefresh/dist/debug/minirefresh.css'
```

## 页面布局
```
<!-- minirefresh开头的class请勿修改 -->
<div id="minirefresh" class="minirefresh-wrap">
    <div class="minirefresh-scroll">

    </div>
</div>
```

## 初始化
```
// 引入任何一个主题后，都会有一个 MiniRefresh 全局变量
var miniRefresh = new MiniRefresh({
    container: '#minirefresh',
    down: {
        callback: function() {
            // 下拉事件

            miniRefresh.endDownLoading();
        }
    },
    up: {

        callback: function() {
            // 上拉事件

            // 注意，由于默认情况是开启满屏自动加载的，所以请求失败时，请务必endUpLoading(true)，防止无限请求
            miniRefresh.endUpLoading(true);
        }
    }
})
```

## 结束刷新
```
// 结束下拉刷新
miniRefresh.endDownLoading();

// 结束上拉加载
// 参数为true代表没有更多数据，否则接下来可以继续加载
miniRefresh.endUpLoading(true);

```

## 在 components 目下创建 loadList.vue 文件，把下边代码粘贴过去
```
<template>
    <div class="minirefresh-wrap">
        <div class="minirefresh-scroll">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
    import 'minirefresh/dist/debug/minirefresh.css'
    import MiniRefreshTools from 'minirefresh'

    const COMPONENT_NAME = 'minirefrsh'

    export default {
        name: COMPONENT_NAME,
        props: {
            title: {
                type: String,
                default: ''
            },
            options: {
                type: Object,
                default: function () {
                    return {
                        container: '#minirefresh',
                        up: {
                            isAuto: true,
                            loadFull: {
                                isEnable: true
                            }
                        },
                        down: {
                            isLock: false,
                            isAuto: false,
                            isAways: false
                        }
                    }
                }
            }
        },
        data() {
            return {
                minirefresh: null
            }
        },
        mounted() {
            setTimeout(() => {
                // 延时生成
                this.initMiniRefresh()
            }, 20)
        },
        methods: {
            initMiniRefresh() {
                // 暂时处理深复制
                this.miniRefresh = new MiniRefreshTools.theme.defaults(Object.assign(this.options, {
                    down: Object.assign(this.options.down || {}, {
                        callback: () => {
                            this.$emit('pullingDown')
                        }
                    }),
                    up: Object.assign(this.options.up || {}, {
                        callback: () => {
                            this.$emit('pullingUp')
                        }
                    })
                }))
            },
            triggerDownLoading(isShowLoading) {
                this.miniRefresh.triggerDownLoading(isShowLoading)
            },
            triggerUpLoading(isShowLoading) {
                this.miniRefresh.triggerUpLoading(isShowLoading)
            },
            endDownLoading(isSuccess, successTips) {
                this.miniRefresh.endDownLoading(isSuccess, successTips)
            },
            endUpLoading(isFinishUp) {
                this.miniRefresh.endUpLoading(isFinishUp)
            },
            resetUpLoading() {
                this.miniRefresh.resetUpLoading()
            },
            scrollTo(y, duration) {
                this.miniRefresh.scrollTo(y, duration)
            },
            refreshOptions(options) {
                this.miniRefresh.refreshOptions(options)
            }
        }
    }
</script>

<style>
    .minirefresh-scroll {
        background: #FFFFFF;
    }
</style>

```

## 页面里边引用使用
```
// 按照这种方式引入
import MiniRefresh from '../../components/loadList.vue'

// 组建注入
components: {
    minirefresh: MiniRefresh
},

// 模版套用
// 外层需要壳子容器，在接着引用组件，组件里边 slot 自己的 ul，li
// 注意点： id ref option pullingDown pullingUp slot="content"
// 剩下 ul li 样式和数据就用自己的，这里没有特殊要求
<template>
    <div class="index-list-wrapper">
        <minirefresh id="minirefresh"
                     ref="minirefresh"
                     :options="options"
                     @pullingDown="onPullingDown"
                     @pullingUp="onPullingUp">

            <ul slot="content" class="data-list" id="listdata">
                <li v-for="item in listData" class="list-item">
                    
                </li>
            </ul>
        </minirefresh>
    </div>
</template>
```

### option重要配置

| 参数  | 参数类型	| 默认值	| 说明 |
|:----:|:------:|:-----:|:---|
|down | Object	|默认配置	|下拉的默认配置|
|up	  |Object	|默认配置	|上拉的默认配置|
|container|	String|	'#minirefresh'	|minirefresh容器的selector|
|isLockX	|Boolean	|true	|是否锁定横向滑动，如果锁定则原生滚动条无法滑动(注意，是原生HTML的横向滑动而不是一些类似于swipe之类的第三方滑动插件)，如果想要嵌套横向滑动，可以设为false|
|isUseBodyScroll	|Boolean	|false	|是否使用body对象的scroll而不是minirefresh-scroll对象的scroll，如果使用body的scroll，可以通过window.onscroll监听，但是这时候请确保一个页面只有一个下拉刷新，否则会有冲突|
|isScrollBar	|Boolean	|true	|是否显示滚动条，为false时会将滚动条宽度设为0|

#### up上拉加载 (最长用的一个参数配置)
|参数	|参数类型	 |默认值	 |说明 |
|:----:|:------:|:-----:|:---|
|isLock	|Boolean	|false	|是否锁定上，如果锁定了，则无法上拉|
|isAuto	|Boolean	|true	|是否初始化时自动执行一次上拉加载（会同时有动画和回调），当下拉的down的isAuto生效时，这个不会生效|
|isShowUpLoading	|Boolean	|true	|上拉加载的过程中是否显示动画，如果为false，代表静默加载，没有动画|
|offset	|Number	|75	|触发上拉的阈值，当滑动到距离底部距离小于这个阈值时，会触发上拉加载|
|loadFull	|Object	|默认配置	 |自动加载满屏相关配置|
|loadFull.isEnable	|Boolean	|true	|是否开启自动加载满屏，开启后，如果当前页面数据没有满屏，并且可以加载更多，就会自动触发上拉加载|
|loadFull.delay	|Number	|300	|延迟加载的时间，自动加载满屏时，会延迟一定时间才加载|
|onScroll	|Function	|空函数	|滚动时的持续回调，回调参数（scrollTop）|
|callback	|Function	|空函数	|触发上拉加载后的回调|

#### down下拉刷新(咱们公司的大部分需求是不需要这个下拉刷新，不使用直接关闭)
|参数	|参数类型	|默认值	|说明|
|:----:|:------:|:-----:|:---|
|isLock	|Boolean	|false	|是否锁定下拉刷新，如果锁定了，则无法下拉|
|isAuto	|Boolean	|false	|是否初始化时自动执行一次下拉刷新，优先级要高于上拉加载的auto，并且两个auto只会执行一次|
|isAways |Boolean	|false	|是否运行在上拉时也可以下拉，如果为false，上拉时无法触发下拉刷新|
|isAllowAutoLoading	|Boolean	|true	|设置isAuto=true时生效，是否在初始化的下拉刷新触发事件中显示动画，如果是false，初始化的加载只会触发回调，不会触发动画|
|isAutoResetUpLoading	|Boolean	|true	|是否每次下拉完毕后默认重置上拉，为false时下拉刷新后不会自动重置上拉状态|
|isScrollCssTranslate	|Boolean	|true	|请只在定制主题时使用，是否在下拉时scroll（内容区域）跟随css translate动画，如果为false，下拉时只会回调下拉距离，scroll不会跟随动画，常用来定制自定义下拉刷新|
|offset	|Number	|75	|触发下拉的阈值，当下拉距离大于这个阈值后，在松开时会触发下拉刷新|
|dampRateBegin	|Number	|1	|阻尼系数，下拉小于offset时的阻尼系数，值越接近0,高度变化越小,表现为越往下越难拉|
|dampRate	|Number	|0.3	|下拉超过阈值后的阻尼系数，越接近0，下拉高度变化越小，例如0.1时表现是超过阈值后基本就拉不动了|
|bounceTime	|Number	|300	|回弹动画时间，下拉取消后或结束后到关闭时，会有一个回弹时间过渡|
|successAnim	|Object	|默认配置	 |成功动画配置相关，请只在实现了成功动画的主题中使用，比如default主题,目前成功动画只是保留功能，因为以后可能有主题需要它|
|successAnim.isEnable	|Boolean	|false	|是否开启成功动画，开启后，下拉结束之前会先出现成功动画|
|successAnim.duration	|Number	|300	|成功动画的过度时间|
|onPull	|Function	|空函数	|下拉过程中的持续回调，回调参数（downHight, downOffset）|
|onCalcel	|Function	|空函数	|取消下拉后的回调,当下拉超过阈值，并松开就会触发|
|callback	|Function	|空函数	|触发下拉刷新后的回调|

### minirefresh对象可以调用

* 声明注册 minirefresh，接着就可以调用 method
```
var minirefresh = new MiniRefresh({...})
minirefresh.method()
```
* 触发上拉加载
```
minirefresh.triggerUpLoading()
```

* 触发下拉刷新
```
minirefresh.triggerDownLoading()
```

* 结束上拉加载
```
// isFinishUp 默认为false，是否没有更多数据，如果为true，会变为没有更多数据，不能继续加载更多，直到下拉刷新后更新状态或者主动resetUp状态才能继续加载
minirefresh.endUpLoading(isFinishUp)

```

* 结束下拉刷新
```
// isSuccess 只有主题实现了success动画并开启时才有效，是否下拉并处理成功，默认为true，为true时会走入成功动画，否则走入失败动画
// successTips 只有主题实现了success动画并开启时才有效，更新新的成功提示，只有传入参数时才会生效
minirefresh.endDownLoading(isSuccess, successTips)
```

* 重置上拉加载状态,如果是没有更多数据后重置，会变为可以继续上拉加载
```
minirefresh.resetUpLoading();
```

* 在特定的时间内，滚动到指定的y位置
```
// y 需要滚动到位置的top高度
// duration 过渡时间，默认为0
minirefresh.scrollTo(y, duration)

```

* 获取当前的滚动位置
```
// num Number类型  当前的滚动位置
var num = minirefresh.getPosition()
```

* 刷新minirefresh的配置，刷新后会马上生效
```
// options 新的配置参数，有一些属性无法更改
minirefresh.refreshOptions(options)

**注意:以下配置无法被刷新**
container
down.callback
down.onPull
down.onCalcel
up.callback
up.onScroll
```



