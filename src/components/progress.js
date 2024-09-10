import * as Plot from "npm:@observablehq/plot";
import {format} from "npm:d3";

export function progress(data, {width, building} = {}) {
  console.log("DATA:", data);
  console.log("BUILDING:", building);

  return Plot.plot({
    title: `Будинок №${building}`,
    width,
    color: {
      // scheme: "Inferno",
      // type: "symlog",
      type: "linear",
      domain: [0, 7309, 50000],
      range: ["#000000", "#fcd703", "#fc2403"],
      legend: true,
      clamp: true
    },
    y: {
      reverse: true,
      label: "Поверх",
    },
    x: {
      label: "Під'їзд",
      tickFormat: d => d % 1 === 0 ? d : "",
      grid: true,
    },
    marks: [
      Plot.rect(
        data,
        {
          filter: d => d.building === building,
          fill: "payment",
          title: d => `Квартира: ${d.flat}, Внесок: ${d.payment} грн.`,
          x1: d => d.enterence + d.floorPosition * d.floorStep,
          x2: d => d.last ? d.enterence + 1 : d.enterence + (d.floorPosition + 1 ) * d.floorStep,
          stroke: "white",
          y: "floor",
        }
      ),
    ]
  });
}
