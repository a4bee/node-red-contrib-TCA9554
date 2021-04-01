module.exports = function (RED) {
    const i2c = require('i2c-bus');

    const INPUT_PORT_REG = 0x0;
    const OUTPUT_PORT_REG = 0x1;
    //const POLARITY_INVERSION_REG = 0x2;
    const CONFIG_REG = 0x3;

    
    function setTrue(node) {
        node.status({ fill: "green", shape: "dot", text: "true" })
    }

    function setFalse(node) {
        node.status({ fill: "green", shape: "dot", text: "false" });
    }

    function setWrongProperties(node) {
        node.status({ fill: "red", shape: "ring", text: "Wrong properties" });
    }

    function setOk(node) {
        node.status({ fill: "yellow", shape: "dot", text: "OK" });
    }

    function setWrongPayload(node) {
        node.status({ fill: "red", shape: "ring", text: "Wrong payload" });
    }
    function checkStatus(state) {
        return state.pin >= 0 && state.pin <= 7 && state.bus >= 0 && state.bus <= 7
    }

    function setStatus(node) {
        if (checkStatus(node)) setOk(node)
        else setWrongProperties(node)
    }

    function setNode(config, node) {
        RED.nodes.createNode(node, config);
        node.pin = parseInt(config.pin)
        node.bus = parseInt(config.bus)
        node.address = parseInt(config.address, 16)
    }

    function GPIORead(config) {

        setNode(config, this)

        setStatus(this)

        this.on('input', function (msg) {
            if (checkStatus(this)) {
                const i2cX = i2c.openSync(this.bus);

                //read actual config
                config = i2cX.readByteSync(this.address, CONFIG_REG);
                config |= (1 << this.pin);
                i2cX.writeByteSync(this.address, CONFIG_REG, config);

                //read actual input
                let input = i2cX.readByteSync(this.address, INPUT_PORT_REG);
                if ((input & (1 << this.pin)) > 0) {
                    msg.payload = true;
                    setTrue(this)
                } else {
                    msg.payload = false;
                    setFalse(this)
                }
                this.send(msg);
            } else {
                setWrongProperties(this)
            }

        });
    }
    RED.nodes.registerType("GPIO Read", GPIORead);

    function GPIOWrite(config) {

        setNode(config, this)

        setStatus(this)

        this.on('input', function (msg) {

            if (checkStatus(this)) {

                if (msg.payload === "true") msg.payload = true;
                if (msg.payload === "false") msg.payload = false;

                const i2cX = i2c.openSync(this.bus);

                // read actual config
                config = i2cX.readByteSync(this.address, CONFIG_REG);
                config &= ~(1 << this.pin);
                i2cX.writeByteSync(this.address, CONFIG_REG, config);

                //read actual output
                let output = i2cX.readByteSync(this.address, OUTPUT_PORT_REG);

                if (msg.payload === true || msg.payload === 1) {
                    output |= (1 << this.pin);
                    setTrue(this)
                } else if (msg.payload === false || msg.payload === 0) {
                    output &= ~(1 << this.pin);
                    setFalse(this)
                } else {
                    setWrongPayload(this)
                }
                //write new output
                i2cX.writeByteSync(this.address, OUTPUT_PORT_REG, output);
            } else {
                setWrongProperties(this)
            }
        });
    }
    RED.nodes.registerType("GPIO Write", GPIOWrite);
}
