const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 部门名称
    deptName: {
        type: String,
        default: ''
    },
    // 部门编码
    deptCode: {
        type: String,
        default: ''
    },
    // 上级编码
    parentCode: {
        type: String,
        default: ''
    },
    // 部门主管
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // 联系方式
    phone: {
        type: String,
        default: ''
    },
    // 状态
    status: {
        type: String,
        default: '1'
    },
    // 排序
    order: {
        type: Number,
        default: 0
    },
    // 邮箱
    email: {
        type: String,
        default: ''
    },
    // 下属部门
    children: {
        type: Array,
        default: []
    },
    // 备注
    remark: {
        type: String,
        default: ''
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})

module.exports = mongoose.model('Department', schema)