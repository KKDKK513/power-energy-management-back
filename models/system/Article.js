const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 标题
    title: {
        type: String,
        default: ''
    },
    // 作者
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    // 状态
    status: {
        type: String,
        default: '1'
    },
    // 内容
    content: {
        type: String,
        default: ''
    },
    // 摘要
    abstract: {
        type: String,
        default: ''
    },
    // 信息类型
    type: {
        type: String,
        default: '1'
    },
    // 赞
    support: {
        type: Number,
        default: 0
    },
    // 阅读量
    watch: {
        type: Number,
        default: 0
    },
    // 流程状态，0：草稿，1：审核中，2：通过，3：退回
    flow: {
        type: String,
        default: '1'
    },
    // 审核人
    auditor: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    // 审核意见
    advice: {
        type: String,
        default: '1'
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})

module.exports = mongoose.model('Article', schema)
