const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  // 字典名称
  dictName: {
    type: String,
    default: ''
  },
  // 字典类型
  dictType: {
    type: String,
    default: ''
  },
  // 备注
  remark: {
    type: String,
    default: ''
  },
  // 字典状态 1正常，0停用
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

module.exports = mongoose.model('Dictionary', schema)
