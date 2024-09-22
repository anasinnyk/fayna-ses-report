import * as Plot from "npm:@observablehq/plot";
import {format} from "npm:d3";

export function totalProgress(data, {width} = {}) {
  const totalGoal = 18047769;
  const totalRaised = data.reduce((sum, d) => sum + d, 0);
  const remaining = totalGoal - totalRaised;
  const colors = ["#fcd703", "lightgray"];
  return Plot.plot({
    width,
    marginLeft: 30,
    x: { label: null, tickFormat: d => `${(d / 1000000).toFixed(0)}M` },
    y: {
      tickSize: 0,
      tickPadding: 0,
      tickFormat: d => null,
    },
    marks: [
      Plot.barX([totalRaised, remaining], {
        y: 0,
        x: d => d,
        stroke: "#000",
        fill: (d, i) => colors[i],
        title: d => `${d.toLocaleString()} UAH (${((d / totalGoal) * 100).toFixed(2)}%)`
      })
    ],
    width
  });
}

export function total(data, {width} = {}) {
  const totalGoal = 22700000;
  const totalRaised = data.reduce((sum, d) => sum + d, 0);
  const remaining = totalGoal - totalRaised;
  const colors = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"];

  return Plot.plot({
    marginLeft: 30,
    x: { label: null, type: "band", tickFormat: (d, i) => `ОСББ "Файна Таун ${i+1}\n${data[i].toLocaleString()} UAH (${(format(".2f"))(data[i]/totalRaised*100)}%)` },
    y: { label: null, tickFormat: d => `${format(".1f")(d / 1000000)}M` },
    marks: [
      Plot.barY(data, {
        y: d => d,
        x: (d, i) => i+1,
        fill: (d, i) => colors[i],
        title: (d, i) => `ОСББ «Файна Таун ${i+1}»: ${d.toLocaleString()} UAH`
      }),
    ],
    width
  });
}
