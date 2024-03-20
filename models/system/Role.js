const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 角色名称
    roleName: {
        type: String,
        default: ''
    },
    // 角色标识
    roleType: {
        type: String,
        default: ''
    },
    // 所属部门
    dept: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
    // 拥有权限
    permissions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Menu'}],
    // 角色状态 1正常，0停用
    status: {
        type: String,
        default: '1'
    },
    // 顺序
    order: {
        type: Number,
        default: 1
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

module.exports = mongoose.model('Role', schema)
