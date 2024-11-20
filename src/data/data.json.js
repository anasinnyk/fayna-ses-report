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
    if (!buildFlat) continue;
    const [building, flat] = buildFlat.split("-").map(x => x.trim());
    if (building === undefined || flat === undefined) continue;
    const payment = parseFloat(paymentRow.replace(",", ".").replaceAll(" ", ""));
    if (!payments[building]) payments[building] = {};
    payments[building][flat] = payment;
  }
  i++;
}

totals = [3_254_177.75, 2_409_106.00, 3_485_370.75, 1_362_441.57, 1_223_464.00, 1_635_687.00, 1_175_036.00, 100_000.00];

let flat_coverage = {
  total: 3101,
  min_payment: 7309,
  goal: 17_672_541,
  min_payment_threshold: 10000,
  non_payers: 0,
  payers: 0,
  overpayer: 0,
  overpayer_money: 0,
  covered_by_sponsors: 0,
  sponsors_money: totals[totals.length - 1],
  underpayer: 0,
  underpayer_money: 0,
  uncovered: 0,
  covered_by_underpayers: 0,
  covered_by_overpayers: 0,
  covered_by_non_flat_payers: 0,
  non_flat_payers: 0,
  non_flat_payers_money: 0,
  total_flat_on_schema: 0,
  expected_total_money: 0,
  covered_by_project_optimizations: 0,
};

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
        const payment = payments[building] && payments[building][i] ? payments[building][i] : 0;
        schema.push({
          building,
          enterence,
          floorPosition: i - lastFlat - 1 - missingFlats.filter(x => x < i).length,
          floorStep: 1 / (lastFlatOnFloor - lastFlat - missingFlats.length),
          last: (i === lastFlatOnFloor) ? true : false,
          floor,
          flat: i,
          payment,
        });
        flat_coverage.total_flat_on_schema++;
        if (payment === 0) {
          flat_coverage.non_payers++;
        } else if (payment < flat_coverage.min_payment){
          flat_coverage.underpayer_money += flat_coverage.min_payment - payment;
          flat_coverage.underpayer++;
        } else if (payment >= flat_coverage.min_payment && payment < flat_coverage.min_payment_threshold) {
          flat_coverage.overpayer_money += payment - flat_coverage.min_payment;
          flat_coverage.payers++;
        } else if (payment >= flat_coverage.min_payment_threshold) {
          flat_coverage.overpayer_money += payment - flat_coverage.min_payment;
          flat_coverage.overpayer++;
        }

        if (payments[building] && payments[building][i]) {
          delete payments[building][i];
        }
      }
    }
    lastFlat = lastFlatOnFloor;
    previousBuilding = building;
  }
}

flat_coverage.non_payers = flat_coverage.non_payers - (flat_coverage.total_flat_on_schema - flat_coverage.total); // remove flats that are not on schema

flat_coverage.non_flat_payers = Object.values(payments).reduce((a, x) => a + Object.keys(x).length, 0);
flat_coverage.non_flat_payers_money = Object.values(payments).reduce((a, x) => a + Object.values(x).reduce((a, x) => a + x, 0), 0);

flat_coverage.covered_by_sponsors = Math.floor(flat_coverage.sponsors_money / flat_coverage.min_payment);
flat_coverage.covered_by_overpayers = Math.floor(flat_coverage.overpayer_money / flat_coverage.min_payment)
flat_coverage.covered_by_non_flat_payers = Math.floor(flat_coverage.non_flat_payers_money / flat_coverage.min_payment);
flat_coverage.covered_by_underpayers = Math.floor(flat_coverage.underpayer_money / flat_coverage.min_payment);
flat_coverage.expected_total_money = flat_coverage.min_payment * flat_coverage.total;
flat_coverage.covered_by_project_optimizations = Math.floor((flat_coverage.expected_total_money - flat_coverage.goal)/flat_coverage.min_payment);
flat_coverage.uncovered = flat_coverage.total - flat_coverage.payers - flat_coverage.overpayer - flat_coverage.covered_by_overpayers - flat_coverage.covered_by_non_flat_payers - flat_coverage.covered_by_underpayers - flat_coverage.covered_by_project_optimizations;


flat_coverage.payers_percentage = (flat_coverage.payers / flat_coverage.total) * 100;
flat_coverage.overpayer_percentage = (flat_coverage.overpayer / flat_coverage.total) * 100;
flat_coverage.underpayer_percentage = (flat_coverage.underpayer / flat_coverage.total) * 100;
flat_coverage.non_flat_payers_percentage = (flat_coverage.non_flat_payers / flat_coverage.total) * 100;
flat_coverage.covered_by_overpayers_percentage = (flat_coverage.covered_by_overpayers / flat_coverage.total) * 100;
flat_coverage.covered_by_underpayers_percentage = (flat_coverage.covered_by_underpayers / flat_coverage.total) * 100;
flat_coverage.covered_by_non_flat_payers_percentage = (flat_coverage.covered_by_non_flat_payers / flat_coverage.total) * 100;
flat_coverage.covered_by_project_optimizations_percentage = (flat_coverage.covered_by_project_optimizations / flat_coverage.total) * 100;
flat_coverage.uncovered_percentage = (flat_coverage.uncovered / flat_coverage.total) * 100;


process.stdout.write(JSON.stringify({
  schema,
  totals,
  flat_coverage,
  total: totals.reduce((a, x) => a + x, 0)
}));
