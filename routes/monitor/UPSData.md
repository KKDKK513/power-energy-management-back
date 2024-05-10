### UPS Attribute
```
batteryCondition: 0=Good 1=Weak 2=Replace,  
batteryStatus: 0=OK 1=LOW 2=Depleted,  
batteryCharge: 0=(obsolete) 1=Charging 2=Resting 3=Discharging,  
secondsonBattery: 0-99999 Seconds,  
estimatedMinutesRemaining: 从备用到低电量关机的估计时间 0-9999 ,  
batteryVoltage: 0-9999,  
batteryCurrent: 0-9999 ,  
UPSInternalTemperature: 0-999,  
batteryLevel: 0-100%,  
externalBattPackNumber: 外部电池组数量 0-10 ,  
negativeBatteryVoltage: 0-9999,  
negativeBatteryCurrent: 0-9999,  
以下为暂未使用的保留数据
estimatedChargeRemaining: 估计电池剩余电量的百分比 0-999
NegativeBatteryLevel: 0-999%,
PositiveChargingCurrent: 0-9999,
NegativeChargingCurrent: 0-9999,
BatteryChargeMode: 0=None 1=BoostCharge 2=FloatCharge,
BatteryLowLimit: 0-100% ,

inputNumLines: 输入数字行（相位）,
inputFrequency1: 输入频率1,
inputVoltage1: 输入电压1,
inputCurrent1: 输入电流1,
inputPower1: 输入功率1,
inputFrequency2: 输入频率2,
inputVoltage2: 输入电压2,
inputCurrent2: 输入电流2,
inputPower2: 输入功率2,
inputFrequency3: 输入频率3,
inputVoltage3: 输入电压3,
inputCurrent3: 输入电流3,
inputPower3: 输入功率3,
inputVoltage12: 输入电压12,
inputVoltage23: 输入电压23,
inputVoltage31: 输入电压31,

outputSource: 输出源 0=Normal 1=Battery 2=Bypass  3=Reducing 4=Boosting 5=ManualBypass 6=Other 7=Nooutput 8=OnECO,
outputFrequency: 输出频率,
outputNumLines: 输出数字行（相位）,
outputVoltage1: 输出电压1,
outputCurrent1: 输出电流1,
outputPower1: 输出功率1,
outputLoad1: 输出负载1,
outputVoltage2: 输出电压2,
outputCurrent2: 输出电流2,
outputPower2: 输出功率2,
outputLoad2: 输出负载2,
outputVoltage3: 输出电压3,
outputCurrent3: 输出电流3,
outputPower3: 输出功率3,
outputLoad3: 输出负载3,
outputVoltage12: 输出电压12,
outputVoltage23: 输出电压23,
outputVoltage31: 输出电压31,
totalOutputPowerKW: 总输出功率KW,
totalOutputPowerKVA: 总输出功率KVA,
totalOutputPowerFactor: 总输出功率因数


alarmOverTemperature：温度过高
alarmInputOutOfRange：输入超出范围
alarmOutputBad：输出错误
alarmOverload：UPS过载
alarmBypassOutOfRang：支路超出范围
alarmOutputOff：AlarmQutputOff
alarmUPSShutdown：警报系统崩溃
alarmChargerFail：充电故障
alarmStandby：备用故障
alarmFanFail：风扇故障
alarmFuseFail：保险丝故障
alarmOtherWarning：-
alarmAwaitingPower：等待电源故障
alarmShutdownPending：报警关机暂停
alarmShutdownlmminent：AlarmShutdownlmminent
buzzerStatus：蜂鸣器告警
economicMode：经济模式关闭
alarmInverterFail：逆变器故障
emergencyPowerOf：紧急断电启动
buzzerState：蜂鸣器开启
batteryGroundFault：电池接地故障
alarmOutputVoltageOverLimit：输出电压过高
alarmOutputVoltageUnderLimit：输出电压过低
alarmPowerModule：AlarmPowerModule
alarmOutputBreakerOpen：输出断路器打开
alarmPhaseAsynchronous：相位异步
alarmRectifierAbnormal：整流器异常
bypassBreakerOpen：断路器打开
mainInputBreakerOpen: 主输入断路器打开
```