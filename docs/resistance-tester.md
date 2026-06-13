# Digital resistance tester PCB concept

This board is a tscircuit-based digital resistance tester. It uses a USB-C powered 3.3 V rail, an MCU ADC, and three digitally selected current ranges.

## Digital measurement strategy

- `RREF_LOW` = 100 ohm for low-value unknown resistors.
- `RREF_MID` = 10 kohm for common resistor values.
- `RREF_HIGH` = 1 Mohm for high-value unknown resistors.
- `QLOW`, `QMID`, and `QHIGH` are MCU-controlled 2N7002 switches. Firmware enables one range at a time.
- `RADC` and `CADC` form the ADC anti-alias/protection filter.
- `D1` and `D2` clamp ADC excursions to the 3.3 V and ground rails.
- `OLED1` is an I2C display header for showing range, measured voltage, and computed resistance.

## Firmware calculation

For the selected reference path, the approximate test current is:

```text
I_range = (3.3 V - V_test) / R_reference
R_unknown = V_test / I_range
```

The firmware should start on the highest resistance range, reject saturated ADC readings, and step toward lower-value ranges until the ADC voltage is in a stable mid-scale window.

## Usage

```bash
npm install
npm run build
```

The build script emits `dist/circuit.json`, which can be loaded into tscircuit-compatible viewers or analysis tools. Generated output is not committed to the repository.
