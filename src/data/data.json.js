import {tsvParse, autoType} from "d3-dsv";

const schemaUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vREnb62GE_vvTZVzuyuclqdmqHPRifr_lo340qhupOdTQVvpr3d_zWGgmMvIlrFqTarvwBHDPG-ibuJ/pub?gid=0&single=true&output=tsv";
const osbbs = [
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQqMuul33H3TFzUNt1kDLehM_0O0h_Nzg8cm2HqyDmIktEVU_96yI0zPKvItP7BvBLkpG0xLso7qdnu/pub?gid=0&single=true&output=tsv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXJcr9em86Qow1v8SyGfkhXWbC0slFfg14DdJJTwkBVn8Vr7dZFs4yxyha2Hj2tVSyfRXdO1ze6gWa/pub?gid=0&single=true&output=tsv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoc-VRzCwiYb09-ea7aobXmfGmX_J3MV3dAPz6nW6leg5UdrHvaHMrFIGpIE7lDe3LcVNv6Jj2qKL5/pub?gid=0&single=true&output=tsv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQr4-sIvQR1Dh1ZYgzHx2-c8u9jzSyTXrNziC_QtUQKdDIt6d3md3VxslL6TAVUJj_bo-uUOb6mrzRO/pub?gid=0&single=true&output=tsv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT5P9kpxeb23xadL7SorutZ5icVrSP_vkBriswQNznKUqqlUuhu_V2V7NnSmmkmHNIg5Kd64JdqwqEf/pub?gid=0&single=true&output=tsv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQVW_Kr1ihCRCgKsT4rHMMjYNuL22957M4NPZI7fTsADc1BTXlGhic0zDjg-y-gv3SLJACgahf6xlv/pub?gid=0&single=true&output=tsv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQhysSj3OkJ3R_KzaqxpPcFXC1pkxJkyw6Dg4boYwZDz088GBGGpkdY2nlU2eQ5uUyhiJh-soBdS0q/pub?gid=0&single=true&output=tsv",
];

let totals = [];
const payments = {};
let i = 0;
for (const url of osbbs) {
  for (const row of tsvParse(await (await fetch(url)).text(), autoType)) {
    const [buildFlat, paymentRow] = Object.values(row);
    const [building, flat] = buildFlat.split("-");
    const payment = parseFloat(paymentRow.replace(",", ".").replaceAll(" ", ""));
    if (building === "Всього") {
      totals.push(payment);
    } else {
      if (!payments[building]) payments[building] = {};

      payments[building][flat] = payment;
    }
  }
  i++;
}

totals = [2014758.5, 1613205, 2410954.75, 913401.5, 828375, 1076885, 728577.22];

const schema = [];

let lastFlat = 0;
let previousBuilding = 0;
for (const row of tsvParse(await (await fetch(schemaUrl)).text(), autoType)) {
  const [building, enterence, floor, lastFlatOnFloor, missingFlatsRaw] = Object.values(row);
  if (building !== previousBuilding) {
    lastFlat = 0;
  }
  
  if (lastFlatOnFloor === 0) {
    schema.push({
      building,
      enterence,
      floorPosition: 0,
      flootStep: 1,
      last: true,
      floor,
      flat: 0,
      payment: 0,
    });
  } else {
    let missingFlats = []
    if (missingFlatsRaw && typeof missingFlatsRaw === "number") missingFlats = [missingFlatsRaw];
    if (missingFlatsRaw && typeof missingFlatsRaw === "string") missingFlats = missingFlatsRaw.split(",").map(x => parseInt(x));
    for (let i = lastFlat + 1; i <= lastFlatOnFloor; i++) {
      if (!missingFlats.includes(i)) {
        schema.push({
          building,
          enterence,
          floorPosition: i - lastFlat - 1 - missingFlats.filter(x => x < i).length,
          floorStep: 1 / (lastFlatOnFloor - lastFlat - missingFlats.length),
          last: (i === lastFlatOnFloor) ? true : false,
          floor,
          flat: i,
          payment: payments[building] && payments[building][i] ? payments[building][i] : 0
        });
      }
    }
    lastFlat = lastFlatOnFloor;
    previousBuilding = building;
  }
}

const text = [];

process.stdout.write(JSON.stringify({
  schema,
  totals,
  total: totals.reduce((a, x) => a + x, 0)
}));
