module.exports = app => {
    const auth = require('../../middleWares/auth')
    const fs = require('fs');
    const path = require('path');
    // const { startExecution, changePlan } = require('../getData/task1')
    // const { readAllCanMessagesAtInterval, processAllCanSendsAtInterval } = require('../getData/bcu')
    const canIds = [
        0x1C000010, 0x1C001010, 0x1C002010, 0x1C003010,
        0x1C405010, 0x1C406010, 0x1C40D010, 0x1C415010, 0x1C401010, 0x1C400010,
        0x1C300010, 0x1C301010, 0x1C302010, 0x1C303010, 0x1C304010, 0x1C305010, 0x1C306010, 0x1C307010, 0x1C308010, 0x1C309010, 0x1C30A010, 0x1C30B010, 0x1C30C010, 0x1C30D010, 0x1C30E010, 0x1C30F010, 0x1C310010, 0x1C311010, 0x1C312010, 0x1C313010, 0x1C314010, 0x1C315010, 0x1C316010, 0x1C317010, 0x1C318010, 0x1C319010, 0x1C31A010, 0x1C31B010, 0x1C31C010, 0x1C31D010, 0x1C31E010, 0x1C31F010, 0x1C320010, 0x1C321010, 0x1C322010, 0x1C323010, 0x1C324010, 0x1C325010, 0x1C326010, 0x1C327010, 0x1C328010, 0x1C329010, 0x1C32A010, 0x1C32B010, 0x1C32C010, 0x1C32D010, 0x1C32E010, 0x1C32F010, 0x1C330010, 0x1C331010, 0x1C332010, 0x1C333010, 0x1C334010, 0x1C335010, 0x1C336010, 0x1C337010, 0x1C338010, 0x1C339010, 0x1C33A010, 0x1C33B010,
        0x1C402010, 0x1C403010, 0x1C404010, 0x1C407010, 0x1C408010, 0x1C409010, 0x1C40A010, 0x1C40B010,
        0x1C40E010, 0x1C40F010, 0x1C412010, 0x1C413010, 0x1C414010, 0x1C417010, 0x1C418010, 0x1C419010,
        0x1C100010, 0x1C101010, 0x1C102010, 0x1C103010, 0x1C104010, 0x1C105010, 0x1C106010, 0x1C107010, 0x1C108010, 0x1C109010, 0x1C10A010, 0x1C10B010, 0x1C10C010, 0x1C10D010, 0x1C10E010, 0x1C10F010, 0x1C110010, 0x1C111010, 0x1C112010, 0x1C113010, 0x1C114010, 0x1C115010, // 可读
        0x1C116010, 0x1C117010, 0x1C118010, 0x1C119010, 0x1C11A010, 0x1C11B010, 0x1C11C010, 0x1C11D010, 0x1C11E010, 0x1C11F010, 0x1C120010, 0x1C121010, 0x1C122010, 0x1C123010, 0x1C124010, 0x1C125010, 0x1C126010, 0x1C127010, 0x1C128010, 0x1C129010, 0x1C12A010, 0x1C12B010, // 可读
        0x1C12C010, 0x1C12D010, 0x1C12E010, 0x1C12F010, 0x1C130010, 0x1C131010, 0x1C132010, 0x1C133010, 0x1C134010, 0x1C135010, 0x1C136010, 0x1C137010, 0x1C138010, 0x1C139010, 0x1C13A010, 0x1C13B010, 0x1C200010, 0x1C201010, 0x1C202010, 0x1C203010, 0x1C204010, 0x1C205010, // 可读
        0x1C206010, 0x1C207010, 0x1C208010, 0x1C209010, 0x1C20A010, 0x1C20B010, 0x1C20C010, 0x1C20D010, 0x1C20E010, 0x1C20F010, 0x1C210010, 0x1C211010, 0x1C212010, 0x1C213010, 0x1C214010, 0x1C215010, // 可读
        0x1C216010, 0x1C217010, 0x1C218010, 0x1C219010, 0x1C21A010, 0x1C21B010, 0x1C21C010, 0x1C21D010, 0x1C21E010, 0x1C21F010, 0x1C220010, 0x1C221010, 0x1C222010, 0x1C223010, 0x1C224010, 0x1C225010, 0x1C226010, 0x1C227010, 0x1C228010, 0x1C229010, 0x1C22A010, 0x1C22B010, // 可读
        0x1C22C010, 0x1C22D010, 0x1C22E010, 0x1C22F010, 0x1C230010, 0x1C231010, 0x1C232010, 0x1C233010, 0x1C234010, 0x1C235010, 0x1C236010, 0x1C237010, 0x1C238010, 0x1C239010, 0x1C23A010, 0x1C23B010, // 可读
        0x1C800010, 0x1C804010, 0x1C808010, 0x1C809010, 0x1C82D010, 0x1C830010, 0x1C837010, 0x1C838010, 0x1C839010
    ];
    /**
     *    * @description 查询信息
     *       * */
    app.get('/monitor/getBMSData', auth('*:*:*'), async (req, res) => {
        try {
            // const bcu1 = await readAllCanMessagesAtInterval(canIds)
            const bcu1 = [
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "00a80cd100a80cd1",
                "00a80cd100200cbe",
                "028a03e800000253",
                "0003000000000000",
                "1e7000661e0a0000",
                "0000753000f00000",
                "4164410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "4100410041004100",
                "0000000000000000",
                "0000000000000000",
                "0000000000130000",
                "00200cbe00200cbe",
                "0000000000140000",
                "005002c5005002c5",
                "005002c5000b02b1",
                "000b02b1000b02b1",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0cc70cc70cc80cca",
                "0cc80cc90cca0cca",
                "0cca0cca0cca0cc8",
                "0cc80cca0cca0cc1",
                "0cc80cc80cc90cc8",
                "0cc80cc80cc90cc9",
                "0cc90cc80cc90cc9",
                "0cc80cc90cca0cbe",
                "0cc80cc90cc90cc9",
                "0cca0cc90cc90cca",
                "0cc90cc80cca0cc9",
                "0cc90cc90cc80cbf",
                "0cc90cc90cc90cca",
                "0cca0cca0cca0cca",
                "0cca0cca0cca0cca",
                "0cca0cc90cca0cc1",
                "0cc80cc80ccb0ccb",
                "0cc90cc90cc90cc9",
                "0cc90ccb0cc90cc8",
                "0cc90ccb0cca0cc2",
                "0cc60cc90cc90cc9",
                "0cca0cc90cc80cc9",
                "0ccb0cc90cc90cc9",
                "0cc90cc90cca0cbe",
                "0cc70cc70cc80cc9",
                "0cc70cc70cc70cc8",
                "0cc80cc80cc80cc7",
                "0cc90cc80cc70cc0",
                "0cc80cc90cc80cc9",
                "0cc80cc80cc70cc8",
                "0cc90cc90cc90cc8",
                "0cc90cc80cc80cbf",
                "0cc50cc80cc80cc7",
                "0cc80cc70cc70cc7",
                "0cc70cc70cc70cc6",
                "0cc50cc60cc80cbe",
                "0cc80cc80cc90ccb",
                "0cca0cca0cca0cc8",
                "0cc90ccb0cc80ccb",
                "0cc80cc90cc90cc2",
                "0cd00cce0cce0cd0",
                "0cd00cd00cce0cd1",
                "0cd00cc00cd10ccf",
                "0cd00cce0cce0cc8",
                "0cc80cc80cc90cc9",
                "0cc80cc90cca0cc8",
                "0cc90cca0cc90cc9",
                "0cca0cc90cca0cbf",
                "0cc80cc90cca0cc8",
                "0cc80ccb0cca0cc9",
                "0ccb0cca0cc90cc9",
                "0cc80cc80cca0cbf",
                "0cc90cca0cc90ccb",
                "0cca0ccb0cca0cca",
                "0cc80cc90cc90cca",
                "0cca0cca0cca0cbf",
                "0cca0cc90cca0cca",
                "0cca0cca0ccb0cca",
                "0cc90cc90ccb0cc9",
                "0cc90cca0ccb0cc1",
                "02b702b302b902b7",
                "02ba02bc02bb02b9",
                "02b402b602b102b6",
                "02b702b402b402b7",
                "02b902b702bb02ba",
                "02b702b502b602b8",
                "02b802b402b702b4",
                "02b902b702b802b8",
                "02b702b702b402ba",
                "02b802b802b902b8",
                "02b902b902b602b9",
                "02b902b602b802b9",
                "02bc02ba02b802b9",
                "02ba02ba02bc02bb",
                "02bc02bb02bc02bd",
                "02be02be02bf02bd",
                "02bf02bd02bd02bd",
                "02ba02bc02bc02be",
                "02c002be02bf02bf",
                "02bf02c002c202c5",
                "02c002c002bd02c2",
                "02bf02bb02bc02bd",
                "02be02bf02bd02be",
                "02bc02bb02bc02bc",
                "02bc02bb02bd02bb",
                "02bd02be02bc02bd",
                "02ba02bb02b902bd",
                "02bb02b802ba02bd",
                "02bd02be02c002c0",
                "02bd02bc02bc02bc",
                "02ba02ba02bc02bc",
                "02bf02be02be02bd",
                "02bc02bd02b902b9",
                "02b902b702ba02ba",
                "02bf02bf02be02bd",
                "02ba02ba02b602b8",
                "02b802b502b702b8",
                "02ba02bc02ba02bc",
                "02b702b702b602b6",
                "02b402b302b502b3",
                "02b802b902bb02b9",
                "02b602b302b502b5",
                "02b502b402b502b4",
                "02b802b802b702b8",
                "02b902b602b602b9",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0001000000f00af0",
                "000f000000b40000",
                "0000015e00140014",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000"
              ]
            res.send({
                code: 200,
                message: '操作成功',
                data: bcu1
            })
        } catch (e) {
            res.send({
                code: 201,
                message: e.message
            })
        }
    });
    /**
     *    * @description 查询信息
     *       * */
    app.get('/monitor/getNavBMSData', auth('*:*:*'), async (req, res) => {
        try {
            // const bcu = await readAllCanMessagesAtInterval([0x1C400010])
            const bcu = ['0000000000000000']
            const relativePath = '../../plugins/time.txt';
            const filePath = path.join(__dirname, relativePath);
            let _targetTime = fs.readFileSync(filePath);
            _targetTime = JSON.parse(_targetTime)
            res.send({
                code: 200,
                message: '操作成功',
                data: {
                    bcu: bcu[0],
                    status: _targetTime.shouldContinuePlan
                }
            })
        } catch (e) {
            res.send({
                code: 201,
                message: e.message
            })
        }
    });

    app.post('/monitor/bmsParamsSetting', auth('*:*:*'), async (req, res) => {
        try {
            console.log('@@', req.body);
            // await processAllCanSendsAtInterval(req.body)
            console.log('@@hyc@@');
            res.send({
                code: 200,
                message: '操作成功'
            });
        } catch (e) {
            res.send({
                code: 201,
                message: e.message
            });
        }
    });


    app.post('/monitor/controlDeviceStatus', auth('*:*:*'), async (req, res) => {
        try {
            changePlan(req.body.type)
            // setTimeout(startExecution, 0)
            const relativePath = '../../plugins/time.txt';
            const filePath = path.join(__dirname, relativePath);
            let _targetTime = fs.readFileSync(filePath);
            _targetTime = JSON.parse(_targetTime)
            _targetTime.shouldContinuePlan = req.body.type
            console.log(_targetTime);
            fs.writeFileSync(filePath,JSON.stringify(_targetTime)); //写入
            res.send({
                code: 200,
                message: '操作成功'
            });
        } catch (e) {
            res.send({
                code: 201,
                message: e.message
            });
        }
    });

}
