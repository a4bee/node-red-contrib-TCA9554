# node-red-contrib-tca9554

Node-Red node for Raspberry Pi with TCA9554 GPIO expander connected via I2C.<br>
Works with Raspberry Pi OS and Advantech Industrial Raspberry Pi 4 HAT Gateway Kit: [UNO-220](https://www.advantech.eu/products/9a0cc561-8fc2-4e22-969c-9df90a3952b5/uno-220/mod_94566667-42f2-4da7-847c-a8f88e0d7e8f).<br>
Warning: currently this nodes didn't work properly with system image on SD included in the Advantech Kit.<br>

## Node Features
- Each gpio pin (0-7) can be set as input or output
- Input can read actual state
- Output can activate high or low state

## Install

Install with Node-Red Palette Manager or run npm command:
```
cd ~/.node-red
npm install node-red-contrib-tca9554
```
## Usage

run raspi-config to enable I2C<br>
in nodes configuration choose correct pin number, I2C address and Bus<br>
for input inject msg.payload = true/1 for high state and false/0 for low state<br>
for output inject any value to trigger reading<br>
