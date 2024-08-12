input.onButtonPressed(Button.A, function () {
    serial.redirect(
    SerialPin.P12,
    SerialPin.P8,
    BaudRate.BaudRate9600
    )
    serial.setWriteLinePadding(0)
    serial.setRxBufferSize(128)
    CMHK.mqtt_check_info()
    CMHK.mqtt_wifi_conn(5)
    CMHK.mqtt_onenet_conn(1)
})
input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.House)
    serial.redirect(
    SerialPin.P12,
    SerialPin.P8,
    BaudRate.BaudRate9600
    )
    serial.setWriteLinePadding(0)
    serial.setRxBufferSize(128)
    CMHK.mqtt_master_setup(
    "joy",
    "joyzou123",
    16001084,
    161215289,
    "CM",
    true
    )
})
// Just for visualization on the serial data, have no actual impact to the programing
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    basic.showIcon(IconNames.Sword)
    data = serial.readString()
    serial.redirectToUSB()
    serial.writeLine(data)
    basic.showIcon(IconNames.Heart)
})
let Hall = 0
let gas = 0
let Light = 0
let humid = 0
let temperture = 0
let data = ""
basic.showIcon(IconNames.Asleep)
basic.pause(100)
basic.showIcon(IconNames.Happy)
loops.everyInterval(10000, function () {
    temperture = Environment.dht11value(Environment.DHT11Type.DHT11_temperature_C, DigitalPin.P14)
    humid = Environment.dht11value(Environment.DHT11Type.DHT11_humidity, DigitalPin.P14)
    serial.redirectToUSB()
    serial.writeValue("Temp", temperture)
    serial.writeValue("Humid", humid)
    Light = Math.map(pins.analogReadPin(AnalogPin.P1), 0, 1024, 1024, 0)
    gas = pins.analogReadPin(AnalogPin.P2)
    Hall = pins.analogReadPin(AnalogPin.P4)
    serial.writeValue("Light", Light)
    serial.writeValue("Gas", gas)
    serial.writeValue("Hall", Hall)
    if (500 > Light) {
        pins.digitalWritePin(DigitalPin.P0, 0)
    } else {
        pins.digitalWritePin(DigitalPin.P0, 1)
    }
    basic.pause(2000)
    serial.redirect(
    SerialPin.P12,
    SerialPin.P8,
    BaudRate.BaudRate9600
    )
    CMHK.mqtt_send_data("Temp", temperture)
    CMHK.mqtt_send_data("Humid", humid)
    CMHK.mqtt_send_data("Gas", gas)
    CMHK.mqtt_send_data("Light", Light)
    CMHK.mqtt_send_data("Hall", Hall)
    basic.showIcon(IconNames.Yes)
})
