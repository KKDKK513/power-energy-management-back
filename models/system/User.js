const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 姓名
    name: {
        type: String,
        required: true
    },
    // 曾用名
    usedName: {
        type: String,
        default: ''
    },
    // 编号
    userName: {
        type: String,
        required: true,
        unique: true
    },
    // 密码
    password: {
        type: String,
        select: false,
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
    // 角色
    roles: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Role'
    }],
    // 证件照
    avatar: {
        type: String,
        default: ''
    },
    // 所属部门
    dept: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Department'
    },
    // 入学日期
    enter: {
        type: String,
        default: ''
    },
    // 班级
    grade: {
        type: String,
        default: ''
    },
    // 成绩
    score: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Score'
    }],
    // 权限
    permissions: {
        type: Array,
        default: []
    },
    // 联系方式
    phone: {
        type: String,
        default: ''
    },
    // 用户状态
    status: {
        type: String,
        default: '1'
    },
    // 邮箱
    email: {
        type: String,
        default: ''
    },
    // 性别
    gender: {
        type: String,
        default: '1'
    },
    // 身份证号
    IDNumber: {
        type: String,
        default: ''
    },
    // 出生日期
    birthday: {
        type: String,
        default: ''
    },
    // 民族
    nation: {
        type: String,
        default: '汉族'
    },
    // 籍贯
    nativePlace: {
        type: String,
        default: ''
    },
    // 家庭地址
    address: {
        type: String,
        default: ''
    },
    // 政治面貌
    politics: [
        {
            // 组织类型
            party: {
                type: String,
                default: ''
            },
            // 加入日期
            date: {
                type: String,
                default: ''
            },
            // 结束日期
            end: {
                type: String,
                default: ''
            }
        }
    ],
    // 监护人信息
    guardian: [
        {
            // 与本人关系
            relation: {
                type: String,
                default: ''
            },
            // 姓名
            name: {
                type: String,
                default: ''
            },
            // 政治面貌
            politics: {
                type: String,
                default: ''
            },
            // 文化程度
            knowledge: {
                type: String,
                default: ''
            },
            // 联系方式
            contact: {
                type: String,
                default: ''
            },
        }
    ],
    // 受教育经历
    education: [
        {
            // 学校
            school: {
                type: String,
                default: ''
            },
            // 入学日期
            date: {
                type: Array,
                default: []
            },
            // 班主任姓名
            teacher: {
                type: String,
                default: ''
            }
        }
    ],
    // 处分记录
    punishment: [
        {
            // 日期
            date: {
                type: String,
                default: ''
            },
            // 原因
            reason: {
                type: String,
                default: ''
            },
            // 简介
            abstract: {
                type: String,
                default: ''
            },
            // 结果
            result: {
                type: String,
                default: ''
            }
        }
    ],
    // 工作经历
    work: [
        {
            // 日期
            date: {
                type: Array,
                default: []
            },
            // 单位
            unit: {
                type: String,
                default: ''
            },
            // 岗位
            post: {
                type: String,
                default: ''
            },
            // 职位
            position: {
                type: String,
                default: ''
            }
        }
    ],
    // 荣誉
    honor: [
        {
            // 竞赛名称
            match: {
                type: String,
                default: ''
            },
            // 日期
            date: {
                type: String,
                default: ''
            },
            // 获奖结果
            awards: {
                type: String,
                default: ''
            },
            // 简介
            abstract: {
                type: String,
                default: ''
            },
            // 附件
            accessory: [
                {
                    // 附件名称
                    filename: {
                        type: String,
                        default: ''
                    },
                    // 附件类型
                    type: {
                        type: String,
                        default: ''
                    }
                }
            ]
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

module.exports = mongoose.model('User', schema)
