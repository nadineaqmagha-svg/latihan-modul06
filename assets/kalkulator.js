// ===== Elemen HTML yang dipakai =====
const layarHasil = document.getElementById("hasil");
const layarEkspresi = document.getElementById("ekspresi");
const semuaTombol = document.querySelectorAll("button");

// ===== State kalkulator =====
let state = {
  tampil: "0",
  angkaSebelum: null,
  operator: null,
  menungguAngkaBaru: false,
  galat: false,
};

const SIMBOL = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

const BATAS_DIGIT = 12;

// ===== Fungsi bantu =====
const rapikan = (angka) => String(Number(angka.toPrecision(12)));

const hitung = (a, b, operator) => {
  switch (operator) {
    case "+":
      return a + b;

    case "-":
      return a - b;

    case "*":
      return a * b;

    case "/":
      return b === 0 ? null : a / b;

    default:
      return b;
  }
};

const tampilkanGalat = (pesan) => {
  state = {
    tampil: pesan,
    angkaSebelum: null,
    operator: null,
    menungguAngkaBaru: true,
    galat: true,
  };

  layarEkspresi.innerHTML = "";
};

const perbaruiLayar = () => {
  layarHasil.innerHTML = state.tampil;

  layarHasil.classList.toggle(
    "panjang",
    state.tampil.length > 9 && !state.galat
  );

  layarHasil.classList.toggle("galat", state.galat);

  for (let tombol of semuaTombol) {
    let sedangAktif =
      tombol.dataset.operator === state.operator &&
      state.menungguAngkaBaru;

    tombol.classList.toggle("aktif", sedangAktif);
  }
};

// ===== Memasukkan angka =====
const masukkanAngka = (digit) => {
  if (state.galat) {
    semuaBersih();
  }

  if (state.menungguAngkaBaru) {
    state.tampil = digit;
    state.menungguAngkaBaru = false;
  } else if (
    state.tampil.replace(/[-.]/g, "").length < BATAS_DIGIT
  ) {
    state.tampil =
      state.tampil === "0"
        ? digit
        : state.tampil + digit;
  }

  perbaruiLayar();
};

// ===== Memasukkan titik desimal =====
const masukkanTitik = () => {
  if (state.galat) {
    semuaBersih();
  }

  if (state.menungguAngkaBaru) {
    state.tampil = "0.";
    state.menungguAngkaBaru = false;
  } else if (!state.tampil.includes(".")) {
    state.tampil += ".";
  }

  perbaruiLayar();
};

// ===== Memilih operator =====
const pilihOperator = (op) => {
  if (state.galat) {
    return;
  }

  let nilaiLayar = parseFloat(state.tampil);

  if (
    state.operator !== null &&
    !state.menungguAngkaBaru
  ) {
    let hasil = hitung(
      state.angkaSebelum,
      nilaiLayar,
      state.operator
    );

    if (hasil === null) {
      tampilkanGalat("Tidak bisa dibagi 0");
      perbaruiLayar();
      return;
    }

    state.angkaSebelum = hasil;
    state.tampil = rapikan(hasil);
  } else {
    state.angkaSebelum = nilaiLayar;
  }

  state.operator = op;
  state.menungguAngkaBaru = true;

  layarEkspresi.innerHTML =
    `${rapikan(state.angkaSebelum)} ${SIMBOL[op]}`;

  perbaruiLayar();
};

// ===== Tombol sama dengan =====
const samaDengan = () => {
  if (
    state.galat ||
    state.operator === null ||
    state.menungguAngkaBaru
  ) {
    return;
  }

  let a = state.angkaSebelum;
  let b = parseFloat(state.tampil);

  let hasil = hitung(a, b, state.operator);

  if (hasil === null) {
    tampilkanGalat("Tidak bisa dibagi 0");
    perbaruiLayar();
    return;
  }

  layarEkspresi.innerHTML =
    `${rapikan(a)} ${SIMBOL[state.operator]} ${rapikan(b)} =`;

  state.tampil = rapikan(hasil);
  state.angkaSebelum = null;
  state.operator = null;
  state.menungguAngkaBaru = true;

  perbaruiLayar();
};

// ===== Fungsi persen =====
const persen = () => {
  if (state.galat) {
    return;
  }

  state.tampil = rapikan(
    parseFloat(state.tampil) / 100
  );

  perbaruiLayar();
};

// ===== Mengubah tanda positif/negatif =====
const ubahTanda = () => {
  if (
    state.galat ||
    state.tampil === "0"
  ) {
    return;
  }

  state.tampil = state.tampil.startsWith("-")
    ? state.tampil.slice(1)
    : "-" + state.tampil;

  perbaruiLayar();
};

// ===== Menghapus satu angka =====
const hapusSatu = () => {
  if (state.galat) {
    return semuaBersih();
  }

  if (state.menungguAngkaBaru) {
    return;
  }

  let sisa = state.tampil.slice(0, -1);

  state.tampil =
    sisa === "" || sisa === "-"
      ? "0"
      : sisa;

  perbaruiLayar();
};

// ===== Membersihkan semua =====
const semuaBersih = () => {
  state = {
    tampil: "0",
    angkaSebelum: null,
    operator: null,
    menungguAngkaBaru: false,
    galat: false,
  };

  layarEkspresi.innerHTML = "";

  perbaruiLayar();
};

// ===== Event klik tombol =====
for (let tombol of semuaTombol) {
  tombol.addEventListener("click", () => {
    let { angka, operator, aksi } = tombol.dataset;

    if (angka !== undefined) {
      masukkanAngka(angka);

    } else if (operator !== undefined) {
      pilihOperator(operator);

    } else {
      switch (aksi) {
        case "bersih":
          semuaBersih();
          break;

        case "hapus":
          hapusSatu();
          break;

        case "persen":
          persen();
          break;

        case "tanda":
          ubahTanda();
          break;

        case "titik":
          masukkanTitik();
          break;

        case "sama":
          samaDengan();
          break;
      }
    }
  });
};

// ===== Dukungan keyboard =====
document.addEventListener("keydown", (e) => {

  if (e.key >= "0" && e.key <= "9") {
    masukkanAngka(e.key);

  } else if (["+", "-", "*", "/"].includes(e.key)) {
    e.preventDefault();
    pilihOperator(e.key);

  } else if (e.key === "." || e.key === ",") {
    masukkanTitik();

  } else if (
    e.key === "Enter" ||
    e.key === "="
  ) {
    e.preventDefault();
    samaDengan();

  } else if (e.key === "Backspace") {
    hapusSatu();

  } else if (e.key === "Escape") {
    semuaBersih();

  } else if (e.key === "%") {
    persen();
  }
});

// ===== Menampilkan tampilan awal =====
perbaruiLayar();