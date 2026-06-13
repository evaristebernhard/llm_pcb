import { Circuit } from "@tscircuit/core"
import { writeFileSync } from "node:fs"

/**
 * Digital auto-ranging resistance tester PCB.
 *
 * Measurement method:
 * 1. The MCU enables exactly one current-range switch.
 * 2. A precision reference resistor creates a known test current from 3V3.
 * 3. The unknown resistor is connected between the TEST_HI and TEST_LO terminals.
 * 4. The MCU ADC measures TEST_HI through a protected low-pass node.
 * 5. Firmware computes R_unknown = V_adc / I_range and changes range digitally.
 */
const circuit = new Circuit()

circuit.add(
  <board width="82mm" height="54mm" autorouter="sequential-trace">
    <chip
      name="U1"
      footprint="qfn32"
      manufacturerPartNumber="RP2040-QFN56"
      pcbX={0}
      pcbY={0}
      pinLabels={{
        pin1: "3V3",
        pin2: "GND",
        pin3: "ADC0_TEST",
        pin4: "RANGE_100R",
        pin5: "RANGE_10K",
        pin6: "RANGE_1M",
        pin7: "I2C_SDA",
        pin8: "I2C_SCL",
        pin9: "USB_DP",
        pin10: "USB_DM",
      }}
    />

    <chip
      name="U2"
      footprint="sot23-5"
      manufacturerPartNumber="MCP1700T-3302E/TT"
      pcbX={-29}
      pcbY={18}
      pinLabels={{ pin1: "GND", pin2: "VIN", pin3: "VOUT", pin4: "NC", pin5: "NC" }}
    />

    <chip
      name="J1"
      footprint="usb_c_receptacle_smd"
      manufacturerPartNumber="USB4105-GF-A"
      pcbX={-38}
      pcbY={0}
      pinLabels={{ pin1: "VBUS", pin2: "GND", pin3: "D+", pin4: "D-", pin5: "CC1", pin6: "CC2" }}
    />

    <chip
      name="J2"
      footprint="pinrow2_p2.54mm"
      pcbX={36}
      pcbY={0}
      pinLabels={{ pin1: "TEST_HI", pin2: "TEST_LO" }}
    />

    <chip
      name="OLED1"
      footprint="pinrow4_p2.54mm"
      manufacturerPartNumber="SSD1306-I2C-0.96IN"
      pcbX={4}
      pcbY={21}
      pinLabels={{ pin1: "GND", pin2: "VCC", pin3: "SCL", pin4: "SDA" }}
    />

    <resistor name="RCC1" resistance="5.1k" footprint="0603" pcbX={-32} pcbY={-8} />
    <resistor name="RCC2" resistance="5.1k" footprint="0603" pcbX={-32} pcbY={-12} />
    <capacitor name="CIN" capacitance="10uF" footprint="0805" pcbX={-23} pcbY={18} />
    <capacitor name="COUT" capacitance="10uF" footprint="0805" pcbX={-16} pcbY={18} />
    <capacitor name="C1" capacitance="100nF" footprint="0603" pcbX={-6} pcbY={8} />
    <capacitor name="C2" capacitance="100nF" footprint="0603" pcbX={3} pcbY={8} />

    <resistor name="RREF_LOW" resistance="100" footprint="0805" pcbX={13} pcbY={-15} />
    <resistor name="RREF_MID" resistance="10k" footprint="0603" pcbX={13} pcbY={-8} />
    <resistor name="RREF_HIGH" resistance="1M" footprint="0603" pcbX={13} pcbY={-1} />
    <chip name="QLOW" footprint="sot23" manufacturerPartNumber="2N7002" pcbX={23} pcbY={-15} pinLabels={{ pin1: "G", pin2: "S", pin3: "D" }} />
    <chip name="QMID" footprint="sot23" manufacturerPartNumber="2N7002" pcbX={23} pcbY={-8} pinLabels={{ pin1: "G", pin2: "S", pin3: "D" }} />
    <chip name="QHIGH" footprint="sot23" manufacturerPartNumber="2N7002" pcbX={23} pcbY={-1} pinLabels={{ pin1: "G", pin2: "S", pin3: "D" }} />

    <resistor name="RADC" resistance="1k" footprint="0603" pcbX={20} pcbY={10} />
    <capacitor name="CADC" capacitance="10nF" footprint="0603" pcbX={14} pcbY={10} />
    <diode name="D1" footprint="sod123" pcbX={27} pcbY={9} />
    <diode name="D2" footprint="sod123" pcbX={27} pcbY={14} />

    <trace from="J1.VBUS" to="U2.VIN" />
    <trace from="J1.GND" to="net.GND" />
    <trace from="U2.GND" to="net.GND" />
    <trace from="U2.VOUT" to="net.3V3" />
    <trace from="CIN.pin1" to="U2.VIN" />
    <trace from="CIN.pin2" to="net.GND" />
    <trace from="COUT.pin1" to="net.3V3" />
    <trace from="COUT.pin2" to="net.GND" />
    <trace from="RCC1.pin1" to="J1.CC1" />
    <trace from="RCC1.pin2" to="net.GND" />
    <trace from="RCC2.pin1" to="J1.CC2" />
    <trace from="RCC2.pin2" to="net.GND" />
    <trace from="J1.D+" to="U1.USB_DP" />
    <trace from="J1.D-" to="U1.USB_DM" />

    <trace from="U1.3V3" to="net.3V3" />
    <trace from="U1.GND" to="net.GND" />
    <trace from="C1.pin1" to="net.3V3" />
    <trace from="C1.pin2" to="net.GND" />
    <trace from="C2.pin1" to="net.3V3" />
    <trace from="C2.pin2" to="net.GND" />

    <trace from="RREF_LOW.pin1" to="net.3V3" />
    <trace from="RREF_LOW.pin2" to="QLOW.D" />
    <trace from="QLOW.S" to="J2.TEST_HI" />
    <trace from="U1.RANGE_100R" to="QLOW.G" />
    <trace from="RREF_MID.pin1" to="net.3V3" />
    <trace from="RREF_MID.pin2" to="QMID.D" />
    <trace from="QMID.S" to="J2.TEST_HI" />
    <trace from="U1.RANGE_10K" to="QMID.G" />
    <trace from="RREF_HIGH.pin1" to="net.3V3" />
    <trace from="RREF_HIGH.pin2" to="QHIGH.D" />
    <trace from="QHIGH.S" to="J2.TEST_HI" />
    <trace from="U1.RANGE_1M" to="QHIGH.G" />
    <trace from="J2.TEST_LO" to="net.GND" />

    <trace from="J2.TEST_HI" to="RADC.pin1" />
    <trace from="RADC.pin2" to="U1.ADC0_TEST" />
    <trace from="CADC.pin1" to="U1.ADC0_TEST" />
    <trace from="CADC.pin2" to="net.GND" />
    <trace from="D1.anode" to="U1.ADC0_TEST" />
    <trace from="D1.cathode" to="net.3V3" />
    <trace from="D2.anode" to="net.GND" />
    <trace from="D2.cathode" to="U1.ADC0_TEST" />

    <trace from="OLED1.VCC" to="net.3V3" />
    <trace from="OLED1.GND" to="net.GND" />
    <trace from="OLED1.SDA" to="U1.I2C_SDA" />
    <trace from="OLED1.SCL" to="U1.I2C_SCL" />
  </board>,
)

writeFileSync("circuit.json", JSON.stringify(circuit.getCircuitJson(), null, 2))
