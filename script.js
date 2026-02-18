// Mapping Splitter
const splitterMap = {
  "1:2": -4,
  "1:4": -8,
  "1:8": -10,
  "1:16": -14
};

// State Global
let currentPower = 0;
let historyLog = [];
let stepCounter = 1;


function hitungPower(power, ratio) {
  let loss = splitterMap[ratio];
  return power + loss;
}

function cekStatus(power) {
  if (power > -13) {
    return "TERLALU_KUAT";
  } else if (power >= -23) {
    return "IDEAL";
  } else {
    return "TERLALU_LEMAH";
  }
}

function simpanLog(before, ratio, result) {
  historyLog.push({
    step: stepCounter,
    before: before,
    ratio: ratio,
    loss: splitterMap[ratio],
    result: result
  });
  stepCounter++;
}

function prosesAwal(inputPower, ratio) {

  if (isNaN(inputPower)) {
    return "Input tidak valid";
  }

  if (inputPower > 9) {
    return "WARNING_INPUT";
  }

  currentPower = inputPower;

  let hasil = hitungPower(currentPower, ratio);

  simpanLog(currentPower, ratio, hasil);

  currentPower = hasil;

  return {
    hasil: hasil,
    status: cekStatus(hasil)
  };
}

function lanjutSplit(ratio) {

  let before = currentPower;

  let hasil = hitungPower(before, ratio);

  simpanLog(before, ratio, hasil);

  currentPower = hasil;

  return {
    hasil: hasil,
    status: cekStatus(hasil)
  };
}

function selesai() {

  let status = cekStatus(currentPower);

  return {
    hasilAkhir: currentPower,
    statusAkhir: status,
    log: historyLog
  };
}

function resetSimulator() {
  currentPower = 0;
  historyLog = [];
  stepCounter = 1;
}

function handleProses() {
  const input = parseFloat(document.getElementById("powerInput").value);
  const ratio = document.getElementById("ratioSelect").value;

  if (!ratio) {
    alert("Pilih split ratio terlebih dahulu!");
    return;
  }

  const result = prosesAwal(input, ratio);

  if (result === "Input tidak valid") {
    alert("Input tidak valid!");
    return;
  }

  if (result === "WARNING_INPUT") {
    if (!confirm("Input lebih dari 9. Yakin ingin lanjut?")) {
      return;
    }
    const lanjut = prosesAwal(input, ratio);
    tampilkanStep2(lanjut);
    return;
  }

  tampilkanStep2(result);
}

function handleLanjut() {
const ratio = document.getElementById("ratioSelectStep2").value;

  if (!ratio) {
    alert("Pilih split ratio untuk split berikutnya!");
    return;
  }

  const result = lanjutSplit(ratio);
  tampilkanStep2(result);
}

function handleSelesai() {
  const result = selesai();

  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "block";

  document.getElementById("hasilAkhir").innerText =
    "Hasil Akhir: " + result.hasilAkhir + " dBm";

  document.getElementById("statusAkhir").innerText =
    "Status: " + result.statusAkhir;

  const logContainer = document.getElementById("logContainer");
  logContainer.innerHTML = "";

  result.log.forEach(item => {
    const p = document.createElement("p");
    p.innerText =
      item.step + ". " +
      item.before + " + (" + item.loss + ") = " +
      item.result + " dBm";
    logContainer.appendChild(p);
  });
}

function handleReset() {
  resetSimulator();

  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "none";

  document.getElementById("powerInput").value = "";
  document.getElementById("ratioSelect").value = "";
}

function tampilkanStep2(result) {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";

  document.getElementById("hasilText").innerText =
    "Hasil: " + result.hasil + " dBm";

  document.getElementById("statusText").innerText =
    "Status: " + result.status;
}