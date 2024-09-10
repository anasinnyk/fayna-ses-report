import * as Plot from "npm:@observablehq/plot";
import {format} from "npm:d3";

export function progress(rawData, {width, building} = {}) {
  const maxPayment = rawData.reduce((max, d) => Math.max(max, d.payment), 0);
  const data = rawData.filter(d => d.building === building);
  const minWidth = [...new Set(data.map(d => d.enterence))].length * 250;
  const minPayment = 7309;

  return Plot.plot({
    width: (width > minWidth) ? width : minWidth,
    color: {
      label: "Внесок (грн.)",
      type: "linear",
      domain: [0, minPayment, maxPayment],
      range: ["#ffffff", "#fcd703", "#fc2403"],
      tickFormat: (d) => {
        if (d >= 1000) return `${(d / 1000).toFixed(0)}k`;
        return d;
      },
      legend: true,
      clamp: true,
    },
    y: {
      label: `Будинок №${building}`,
      reverse: true,
    },
    x: {
      tickSize: 0,
      tickPadding: 0,
      tickFormat: d => Number.isInteger(d) ? null : `Підїзд: ${Math.floor(d)}
Здали: ${data.filter(x => x.enterence === Math.floor(d) && x.payment >= minPayment).length}/${data.filter(x => x.enterence === Math.floor(d) && x.flat !== 0).length}
Зібрали: ${format(",")(data.filter(x => x.enterence === Math.floor(d)).reduce((sum, x) => sum + x.payment, 0))} грн (${format(".2f")(100/(data.filter(x => x.enterence === Math.floor(d) && x.flat !== 0).length * minPayment)*data.filter(x => x.enterence === Math.floor(d)).reduce((sum, x) => sum + x.payment, 0))}%).
`,
      grid: true,
    },
    marks: [
      Plot.rect(
        data,
        {
          fill: "payment",
          title: d => `Квартира: ${d.flat}, Внесок: ${d.payment} грн.`,
          x1: d => d.enterence + d.floorPosition * d.floorStep,
          x2: d => d.last ? d.enterence + 1 : d.enterence + (d.floorPosition + 1 ) * d.floorStep,
          stroke: "#000000",
          y: "floor",
        }
      ),
      Plot.text(
        data,
        {
          text: "flat",
          x: d => (d.enterence + d.floorPosition * d.floorStep + d.enterence + (d.floorPosition + 1 ) * d.floorStep) / 2,
          y: "floor",
          fontSize: 12,
          fill: "#000000",
          title: d => `Квартира: ${d.flat}, Внесок: ${d.payment} грн.`,
          fontStyle: "normal",
          textAnchor: "middle"
        },
      ),
    ]
  });
}
