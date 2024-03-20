const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 标题
    title: {
        type: String,
        default: ''
    },
    // 图标
    icon: {
        type: String,
        default: ''
    },
    // 菜单编码
    menuCode: {
        type: String,
        default: ''
    },
    menuType: {
        type: String,
        default: 'M'
    },
    // 上级编码
    parentCode: {
        type: String,
        default: ''
    },
    // 菜单路径
    path: {
        type: String,
        default: ''
    },
    // 组件路径
    component: {
        type: String,
        default: ''
    },
    // 组件name
    name: {
        type: String,
        default: ''
    },
    // 权限标识
    permission: {
        type: String,
        default: ''
    },
    // 显示状态
    visible: {
        type: String,
        default: '1'
    },
    // 使用状态
    status: {
        type: String,
        default: '1'
    },
    // 显示顺序
    order: {
        type: Number,
        default: 1
    },
    // 是否外链
    isFrame: {
        type: String,
        default: '0'
    },
    // 子菜单
    children: {
        type: Array,
        default: []
    },
    // 是否缓存
    isCache: {
        type: String,
        default: '0'
    }

}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})

module.exports = mongoose.model('Menu', schema)
