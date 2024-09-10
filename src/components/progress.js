import * as Plot from "npm:@observablehq/plot";
import {format} from "npm:d3";

export function progress(data, {width, building} = {}) {
  return Plot.plot({
    title: `Будинок №${building}`,
    width,
    color: {
      type: "linear",
      domain: [0, 7309, 50000],
      range: ["#000000", "#fcd703", "#fc2403"],
      tickFormat: (d) => {
        if (d >= 1000) return `${(d / 1000).toFixed(0)}k`;
        return d;
      },
      legend: true,
      clamp: true,
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
      Plot.text(
        data,
        {
          filter: d => d.building === building,
          text: "flat",
          x: d => (d.enterence + d.floorPosition * d.floorStep + d.enterence + (d.floorPosition + 1 ) * d.floorStep) / 2,
          y: "floor",
          fontSize: 8,
          fill: "white",
          title: d => `Квартира: ${d.flat}, Внесок: ${d.payment} грн.`,
          fontStyle: "normal",
          textAnchor: "middle"
        },
      ),
    ]
  });
}
