const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 日志类型 0: login  1:operate
    type: {
        type: String,
        default: '0'
    },
    // 用户
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    // 记录
    done: {
        type: String,
        default: ''
    }
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})

module.exports = mongoose.model('Record', schema)