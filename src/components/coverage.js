import * as Plot from "npm:@observablehq/plot";
import {format} from "npm:d3";

export function textCoverage(data) {
  const payers_percentage = (data.payers / data.total) * 100;
  const overpayer_percentage = (data.overpayer / data.total) * 100;
  const underpayer_percentage = (data.underpayer / data.total) * 100;
  const non_flat_payers_percentage = (data.non_flat_payers / data.total) * 100;
  const covered_by_overpayers_percentage = (data.covered_by_overpayers / data.total) * 100;
  const covered_by_underpayers_percentage = (data.covered_by_underpayers / data.total) * 100;
  const covered_by_non_flat_payers_percentage = (data.covered_by_non_flat_payers / data.total) * 100;
  const covered_by_project_optimizations_percentage = (data.covered_by_project_optimizations / data.total) * 100;
  const uncovered_percentage = (data.uncovered / data.total) * 100;

  return `
      Це достатньо складна візуалізація яка вимагає пояснення на основі яких саме даних вона зроблена.

      У нашому комплексі є <b>${data.total}</b> квартир. Тоді як на нашій візуалізації ми бачимо ${data.total_flat_on_schema} квартир, тобто ${data.total_flat_on_schema - data.total} квартир насправді не існує
      (повідомте мене якщо знаєте якісь з таких квартир).

      Ми повинні були зробити одноразовий платіж в розмірі ${data.min_payment.toLocaleString()} грн.
      Такий платіж зробили ${data.payers}(${(format(".2f"))(payers_percentage)}%) квартир(и) (тут я рахую кількість квартир що зробила мінімум ${data.min_payment.toLocaleString()} грн. але не більше ${data.min_payment_threshold.toLocaleString()} грн.)
      Деякі з наших сусідів здали більше (${data.overpayer} квартир(и)(${(format(".2f"))(overpayer_percentage)}%)) на суму ${data.overpayer_money.toLocaleString()} грн. що дозволило перекрити ${data.covered_by_overpayers}(${(format(".2f"))(covered_by_overpayers_percentage)}%) платежа
      Деякі здали поки тільки частину (${data.underpayer} квартир(и)(${(format(".2f"))(underpayer_percentage)})%) і їм в сумі ще потрібно доздати ${data.underpayer_money.toLocaleString()} грн. що повинно перекрити ще ${data.covered_by_underpayers}(${(format(".2f"))(covered_by_underpayers_percentage)}%) платежа.
      Також нам допомагає комерція (${data.non_flat_payers} платники(ів)(${(format(".2f"))(non_flat_payers_percentage)})%) яка здала ${data.non_flat_payers_money.toLocaleString()} грн. що дозоляє перекрити ще ${data.covered_by_non_flat_payers}(${(format(".2f"))(covered_by_non_flat_payers_percentage)}%) платежа.

      Одже нашою ціллю було зіблати ${data.min_payment.toLocaleString()} грн. з ${data.total} квартири. І ми очікували зібрати ${data.expected_total_money.toLocaleString()} грн.
      Але проект було оптимізовано до ${data.goal.toLocaleString()} грн. і ми зеконмили ${(data.expected_total_money - data.goal).toLocaleString()} грн. що дозволило перекрити ${data.covered_by_project_optimizations}(${(format(".2f"))(covered_by_project_optimizations_percentage)}%) платежа.

      Таким чином нам з вами залишилось перекрити ще ${data.uncovered}(${(format(".2f"))(uncovered_percentage)}%) платежа.
  `;

}

export function coverage(data) {
  const payers_percentage = (data.payers / data.total) * 100;
  const overpayer_percentage = (data.overpayer / data.total) * 100;
  const underpayer_percentage = (data.underpayer / data.total) * 100;
  const non_flat_payers_percentage = (data.non_flat_payers / data.total) * 100;
  const covered_by_overpayers_percentage = (data.covered_by_overpayers / data.total) * 100;
  const covered_by_underpayers_percentage = (data.covered_by_underpayers / data.total) * 100;
  const covered_by_non_flat_payers_percentage = (data.covered_by_non_flat_payers / data.total) * 100;
  const covered_by_project_optimizations_percentage = (data.covered_by_project_optimizations / data.total) * 100;
  const covered_by_sponsors_percentage = (data.covered_by_sponsors / data.total) * 100;
  const uncovered_percentage = (data.uncovered / data.total) * 100;

  const rectColors = [
    {count: data.overpayer, color: "#fc2403"},
    {count: data.payers, color: "#fcd703"},
    {count: data.covered_by_underpayers, color: "lightyellow"},
    {count: data.covered_by_overpayers, color: "green"},
    {count: data.covered_by_non_flat_payers, color: "lightgreen"},
    {count: data.covered_by_sponsors, color: "#a17f1a"},
    {count: data.covered_by_project_optimizations, color: "blue"},
    {count: data.uncovered, color: "white"},
  ];
  let rects = [];
  let index = 0;
  rectColors.forEach(({ count, color }) => {
    for (let i = 0; i < count; i++) {
      rects.push({ index: index++, color });
    }
  });

  rects = rects.map((d, i) => ({
    ...d,
    x: i % 100,
    y: Math.floor(i / 100)
  }));

  return Plot.plot({
    width: 1000,
    height: 310,
    color: {
      legend: true,
      domain: [
        `Квартири що переплатили (${data.overpayer}/${(format(".2f"))(overpayer_percentage)}%)`,
        `Квартири що зробили мінімальний платіж (${data.payers}/${(format(".2f"))(payers_percentage)}%)`,
        `Квартири перекриті учасниками що зробили менше ніж мінімальний платіж (${data.underpayer}/${(format(".2f"))(underpayer_percentage)}%)`,
        `Квартири перекриті за рахунок переплат (${data.covered_by_overpayers}/${(format(".2f"))(covered_by_overpayers_percentage)}%)`,
        `Квартири перекриті за рахунок комерції (${data.covered_by_non_flat_payers}/${(format(".2f"))(covered_by_non_flat_payers_percentage)}%)`,
        `Квартири перекриті за рахунок спонсорської програми (${data.covered_by_sponsors}/${(format(".2f"))(covered_by_sponsors_percentage)}%)`,
        `Квартири перекриті за рахунок здешевлення проекту (${data.covered_by_project_optimizations}/${(format(".2f"))(covered_by_project_optimizations_percentage)}%)`,
        `Не перекриті квартири (${data.uncovered}/${(format(".2f"))(uncovered_percentage)}%)`,
      ],
      range: ["#fc2403", "#fcd703", "lightyellow", "green", "lightgreen", "#a17f1a", "blue", "#dedede"],
    },
    x: { axis: null },
    y: { axis: null },
    marks: [
      Plot.rect(rects, {
        x: d => d.x,
        y: d => d.y,
        fill: d => d.color,
        width: 10,
        height: 10,
      }),
    ],
  });
}
