const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 审批流名称
    name: {
        type: String,
        default: ''
    },
    // 审批流编码
    code: {
        type: String,
        default: ''
    },
    // 审批流状态，1：正常，2：停用
    status: {
        type: String,
        default: '1'
    },
    // 流程节点
    nodes: [
        {
            // 节点状态
            flow: {
                type: String,
                default: ''
            },
            // 节点名称
            label: {
                type: String,
                default: ''
            },
            // 审批人员ID
            examinerId: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
            // 审批模式，1：会签审批（所有审批人员审批后才能进去下一节点），2：或签审批（只要有一名审批人员通过后方可进入下一节点）
            mode: {
                type: String,
                default: '1'
            },
        }
    ],
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

module.exports = mongoose.model('Process', schema)
