import * as Plot from "npm:@observablehq/plot";

export function total(data, {width} = {}) {
  const totalGoal = 22000000;
  console.log("OSBB DATA:", data);
  const totalRaised = data.reduce((sum, d) => sum + d, 0);
  console.log("TOTAL RAISED:", totalRaised);
  const remaining = totalGoal - totalRaised;
  const colors = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"];

  return Plot.plot({
    x: { domain: [0, totalGoal], label: "Contribution (UAH)" },
    y: { label: null },
    marks: [
      Plot.rectX([{ name: "Remaining", contribution: remaining }], {
        x: "contribution",
        y: 0,
        fill: "lightgray",
        title: d => `Remaining: ${remaining.toLocaleString()} UAH (${((remaining / totalGoal) * 100).toFixed(2)}%)`
      }),
      Plot.barX(data, {
        x: d => d,
        y: 0,
        fill: (d, i) => colors[i],
        title: (d, i) => `ОСББ «Файна Таун ${i+1}»: ${d.toLocaleString()} UAH`
      }),
      Plot.text([{}], {
        x: totalRaised + 50000,
        y: 0,
        text: `Total Raised: ${totalRaised.toLocaleString()} UAH (${((totalRaised / totalGoal) * 100).toFixed(2)}%)`,
        fill: "black",
        textAnchor: "start"
      })
    ],
    width
  });
}
