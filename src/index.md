---
toc: false
head: <link rel="icon" type="image/jpeg" href="./data/logo.jpg" size="32x32">
---

```js
import { progress } from "./components/progress.js";
import { total, totalProgress } from "./components/total.js";
import { coverage, textCoverage } from "./components/coverage.js";
import {format} from "npm:d3";
```

<div class="title">
  <img src="./data/logo.jpg" alt="ФайнаСЕС">
</div>

<div class="card">
  <h2><span class="yellow">&#x26A0;</span> Візуалізація згідно даних наданих керуючою компанією за <b>18.02.2025</b></h2>
</div>

---

## Ціль: 17 672 541 грн

<div class="grid grid-cols-1">
  <div class="card">${resize((width) => totalProgress(data["totals"], {width}))}</div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
${
  resize((width) => total(data["totals"], {width}))
}
  </div>
</div>

---

## Загальний прогрес по квартирах

```js
const coverData = data["flat_coverage"];
```

<div class="grid grid-cols-1">
  <div class="card">
  <p style="display: none">
      Це достатньо складна візуалізація яка вимагає пояснення на основі яких саме даних вона зроблена.<br/>
      У нашому комплексі є <b>${coverData.total}</b> квартир. Тоді як на нашій візуалізації ми бачимо <b>${coverData.total_flat_on_schema}</b> квартир, тобто <b>${coverData.total_flat_on_schema - coverData.total}</b> квартир насправді не існує.<br/>
      (<i>повідомте мене якщо знаєте якісь з таких квартир</i>).<br/>
      Ми повинні були зробити одноразовий платіж в розмірі <b>${coverData.min_payment.toLocaleString()} грн</b>.<br/>
      Такий платіж зробили <b>${coverData.payers}(${(format(".2f"))(coverData.payers_percentage)}%)</b> квартир(и) (тут я рахую кількість квартир що зробила мінімум <b>${coverData.min_payment.toLocaleString()} грн.</b> але не більше <b>${coverData.min_payment_threshold.toLocaleString()} грн.</b>).<br/>
      Деякі з наших сусідів здали більше (<b>${coverData.overpayer}</b> квартир(и)(<b>${(format(".2f"))(coverData.overpayer_percentage)}%</b>)) на суму <b>${coverData.overpayer_money.toLocaleString()} грн.</b> що дозволило перекрити <b>${coverData.covered_by_overpayers}</b>(<b>${(format(".2f"))(coverData.covered_by_overpayers_percentage)}%)</b> платежа.<br/>
      Деякі здали поки тільки частину (<b>${coverData.underpayer}</b> квартир(и)(<b>${(format(".2f"))(coverData.underpayer_percentage)})%</b>) і їм в сумі ще потрібно доздати <b>${coverData.underpayer_money.toLocaleString()} грн.</b> що повинно перекрити ще <b>${coverData.covered_by_underpayers}</b>(<b>${(format(".2f"))(coverData.covered_by_underpayers_percentage)}%</b>) платежа.<br/>
      Також нам допомагає комерція (<b>${coverData.non_flat_payers}</b> платники(ів)(<b>${(format(".2f"))(coverData.non_flat_payers_percentage)})%</b>) яка здала <b>${coverData.non_flat_payers_money.toLocaleString()} грн.</b> що дозоляє перекрити ще <b>${coverData.covered_by_non_flat_payers}</b>(<b>${(format(".2f"))(coverData.covered_by_non_flat_payers_percentage)}%</b>) платежа.<br/>
      Одже нашою ціллю було зіблати <b>${coverData.min_payment.toLocaleString()} грн.</b> з <b>${coverData.total}</b> квартири. І ми очікували зібрати <b>${coverData.expected_total_money.toLocaleString()} грн.</b><br/>
      Але проект було оптимізовано до <b>${coverData.goal.toLocaleString()} грн.</b> і ми зеконмили <b>${(coverData.expected_total_money - coverData.goal).toLocaleString()} грн.</b> що дозволило перекрити <b>${coverData.covered_by_project_optimizations}</b>(<b>${(format(".2f"))(coverData.covered_by_project_optimizations_percentage)}%</b>) платежа.
      Таким чином нам з вами залишилось перекрити ще <b>${coverData.uncovered}</b>(<b>${(format(".2f"))(coverData.uncovered_percentage)}%</b>) платежа.
  </p>
  ${coverage(data["flat_coverage"])}
  </div>
</div>

---

## Прогрес по квартирах


```js
const allBuildings = [1,2,3,4,5,6,7,8,9,10,16,17,18,19,20,21,22,23,24,25];
const buildings = view(Inputs.select(allBuildings, {value: allBuildings, multiple: true, label: "Будинки"}));
const fullscreen = view(Inputs.toggle({label: "Показати будинок повністю", value: false}));
const data = FileAttachment("data/data.json").json();
```

<div>
  ${buildings.map(building => html.fragment`<div class="card"><div class="container">
    <div class="scrollbar">
      ${progress(data["schema"], {fullscreen, building})}
    </div>
  </div></div>`)}
</div>


---

## Посилання

Корисні посилання щодо проекту

<div class="grid grid-cols-2">
  <div class="card">
    <a href="https://t.me/c/2219771592/1">Telegram Chat</a>
  </div>
  <div class="card">
    <a href="https://docs.google.com/document/d/1bZEXS3u3kGHiLygIG0eEB0hI2osS925WtJZBeQJl2iI/edit">Проєкт безперебійного живлення критичної інфраструктури та систем безпеки ЖК «Файна таун»</a>
  </div>
</div>

<style>

#observablehq-main {
  max-width: 100%;
}

.fullscreen {
  width: 100%;
}

.container {
  display: flex;
  align-items: flex-start;
  padding-bottom: 30px;
}
.container .scrollbar {
  overflow-x: scroll;
  flex: 1;
}
.container .scrollbar svg {
  max-width: none;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.title h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .title h1 {
    font-size: 90px;
  }
}

</style>
