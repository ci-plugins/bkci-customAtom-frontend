<template>
    <section class="bk-form bk-form-vertical">
        <template>
            <!-- 如果使用配置放task.json的方式，用动态组件渲染的方式，可以把task.json配置的属性都渲染出来 -->
            <template v-for="(obj, key) in atomModel">
                <form-field v-if="!isHidden(obj, atomValue) && rely(obj, atomValue)" :key="key" :desc="obj.desc" :label="obj.label">
                    <!-- 如果使用的是蓝盾业务组件库（即task.json配置页面可看到的组件库），则:handle-change为参数值变化捕捉事件 -->
                    <component 
                        :is="obj.type" 
                        :atom-value="atomValue" 
                        :name="key" 
                        :value="atomValue[key]" 
                        v-bind="obj"
                        :handle-change="handleUpdate"
                        v-validate.initial="Object.assign({}, obj.rule, { required: !!obj.required })" 
                    >
                    </component>
                </form-field>
            </template>
        </template>
    </section>
</template>

<script>
    // 需引用atomMixin
    import { atomMixin }from 'bkci-atom-components'

    export default {
        name: 'atom',
        mixins: [atomMixin],    // 需引用atomMixin
        props: {
            atomPropsContainerInfo: {
                type: Object,
                default: () => ({})
            },
            atomPropsDisabled: {
                type: Boolean,
                default: false
            },
            currentUserInfo: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            // 当用户输入相关参数后，把字段写入到this.atomValue
            handleUpdate (name, value) {
                this.atomValue[name] = value
            }
        }
    }
</script>

<style lang="css">
    ul {
        margin: 0px;
        padding: 0px;
    }
</style>
