const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 表格名称
    tableName: {
        type: String,
        default: ''
    },
    // 表格类型
    tableType: {
        type: String,
        required: true,
        unique: true
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
    },
    // 列配置
    config: [
        {
            label: {
                type: String,
                default: ''
            },
            prop: {
                type: String,
                default: ''
            },
            align: {
                type: String,
                default: 'left'
            },
            width: {
                type: Number
            }
        }
    ]
}, {
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})

module.exports = mongoose.model('Table', schema)
