module.exports = app => {
    // 图片上传
    const multer = require('multer')
    const dayjs = require('dayjs')
    const auth = require('../../middleWares/auth')

    //设置保存规则
    const storage = multer.diskStorage({
        //destination：字段设置上传路径，可以为函数
        destination: __dirname + '../../../uploads/avatar',

        //filename：设置文件保存的文件名
        filename: function(req, file, cb) {
            cb(null, dayjs(new Date()).format('YYYYMMDD_HHmmss') + '-' + file.originalname);
        }
    })

    /**
     * @description 上传头像
     * */
    const avatar = multer({ storage })
    app.post('/upload/avatar', auth('*:*:*'), avatar.single('file'), async (req, res) => {
        const file = req.file;
        file.url = `/uploads/avatar/${file.filename}`
        res.send({
            code: '200',
            message: '上传成功',
            file
        })
    })
}
