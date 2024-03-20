const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 评论的文章
    article: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Article'
    },
    // 内容
    content: {
        type: String,
        default: ''
    },
    // 评论者
    person: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    // 评论状态 1：正常，2：锁定
    status: {
        type: String,
        default: '1'
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})

module.exports = mongoose.model('Comment', schema)