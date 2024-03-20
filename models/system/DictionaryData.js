const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  // 字典标签
  dictLabel: {
    type: String,
    default: ''
  },
  // 字典键值
  dictValue: {
    type: String,
    default: ''
  },
  // 备注
  remark: {
    type: String,
    default: ''
  },
  // 字典类型
  dictType: {
    type: String,
    default: ''
  },
  // 字典排序
  dictSort: {
    type: Number,
    default: 0,
  },
  // 是否默认
  isDefault: {
    type: String,
    default: '0'
  },
  // 状态 1 正常，0 停用（停用状态下不可见）, 2 锁定（锁定状态下不可选中）
  status: {
    type: String,
    default: '1'
  },
}, {
  timestamps: {
    createdAt: 'createTime',
    updatedAt: 'updateTime',
  }
})

module.exports = mongoose.model('DictionaryData', schema)
