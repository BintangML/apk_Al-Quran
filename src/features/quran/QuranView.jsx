import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSurah, fetchAyat } from "./quranSlice";
import PrayerTime from "../../components/PrayerTime";

export default function QuranView() {
  const dispatch = useDispatch();
  const { surah, ayat } = useSelector((state) => state.quran);

  const [selectedSurah, setSelectedSurah] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(true); // 🌙 toggle

  useEffect(() => {
    dispatch(fetchSurah());
  }, [dispatch]);

  const handleClick = (s) => {
    setSelectedSurah(s);
    dispatch(fetchAyat(s.nomor));
    window.scrollTo({ top: 0 });
  };

  const isMekah = (t) => t?.toLowerCase() === "mekah";

  const filtered = surah.filter((s) => {
    const matchSearch = s.namaLatin
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : filter === "mekah"
        ? isMekah(s.tempatTurun)
        : !isMekah(s.tempatTurun);

    return matchSearch && matchFilter;
  });

  return (
    <div className={dark ? "app dark" : "app light"}>
      <h1 className="title">Al-Qur'an Digital Bintang</h1>

      {/* 🌗 TOGGLE */}
      <div className="toggle">
        <button onClick={() => setDark(!dark)}>
          {dark ? "☀ Mode Terang" : "🌙 Mode Gelap"}
        </button>
      </div>

      <div className="layout">
        {/* 🕌 SIDEBAR */}
        <div className="sidebar">
          <PrayerTime />
        </div>

        {/* 📖 MAIN */}
        <div className="main">
          {!selectedSurah && (
            <>
              <input
                type="text"
                placeholder="Cari surat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
              />

              <div className="filter">
                <button onClick={() => setFilter("all")}>Semua</button>
                <button onClick={() => setFilter("mekah")}>Makkiyah</button>
                <button onClick={() => setFilter("madinah")}>Madaniyah</button>
              </div>

              {filtered.length === 0 && search !== "" ? (
                <div className="no-result">
                  Tidak ada hasil "{search}"
                </div>
              ) : (
                <div className="grid">
                  {filtered.map((s) => (
                    <div
                      key={s.nomor}
                      onClick={() => handleClick(s)}
                      className="card"
                    >
                      <h3>{s.namaLatin}</h3>
                      <p>{s.arti}</p>
                      <span>
                        {isMekah(s.tempatTurun)
                          ? "Mekah"
                          : "Madinah"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {selectedSurah && (
            <div>
<button
  onClick={() => setSelectedSurah(null)}
  className="back-btn"
>
  ⬅ Kembali
</button>

              {ayat.map((a) => (
                <div key={a.nomorAyat} className="ayat">
                  <p className="arab">{a.teksArab}</p>
                  <p>{a.teksIndonesia}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🎨 STYLE */}
  <style>{`
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
  .back-btn {
  margin-bottom: 15px;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  background: #38bdf8;
  color: #020617;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.back-btn:hover {
  background: #0ea5e9;
  box-shadow: 0 0 10px #38bdf8;
  transform: translateY(-2px);
}

/* LIGHT MODE */
.light .back-btn {
  background: #0ea5e9;
  color: white;
}
  .app {
    min-height: 100vh;
    font-family: Arial;
    padding: 20px;
  }

  .dark {
    background: radial-gradient(circle at top, #0f172a, #020617);
    color: white;
  }

  .light {
    background: #f1f5f9;
    color: black;
  }

  .title {
    text-align: center;
    margin-bottom: 10px;
    color: #38bdf8;
    text-shadow: 0 0 10px #38bdf8;
  }

  .toggle {
    text-align: center;
    margin-bottom: 20px;
  }

  .toggle button {
    padding: 6px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }

  /* 🔥 LAYOUT */
  .layout {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  /* 🕌 SIDEBAR */
  .sidebar {
    width: 260px;
  }

  .sidebar .prayer {
    position: sticky;
    top: 20px;
  }

  /* 📖 MAIN */
  .main {
    flex: 1;
  }

  /* 🔍 SEARCH */
  .search {
    width: 300px;
    padding: 10px;
    border-radius: 10px;
    border: none;
    background: #1e293b;
    color: white;
    margin-bottom: 10px;
  }

  .light .search {
    background: white;
    color: black;
    border: 1px solid #ccc;
  }

  /* 🔘 FILTER */
  .filter {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }

  .filter button {
    padding: 6px 12px;
    border-radius: 8px;
    border: none;
    background: #1e293b;
    color: white;
    cursor: pointer;
  }

  .light .filter button {
    background: white;
    color: black;
    border: 1px solid #ccc;
  }

  /* 📦 GRID */
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }

  /* 🧱 CARD */
  .card {
    background: rgba(30, 41, 59, 0.7);
    padding: 15px;
    border-radius: 15px;
    cursor: pointer;
    transition: 0.3s;
    border: 1px solid rgba(56, 189, 248, 0.2);
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 15px #38bdf8;
  }

  .light .card {
    background: white;
    border: 1px solid #ddd;
  }

  /* 📖 AYAT */
  .ayat {
    background: #0f172a;
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
  }

  .light .ayat {
    background: white;
  }

  .arab {
    text-align: right;
    font-size: 22px;
    color: #22c55e;
  }

  /* ❌ NO RESULT */
  .no-result {
    margin-top: 30px;
    text-align: center;
    color: #94a3b8;
  }

  /* 📱 RESPONSIVE */
  @media (max-width: 900px) {
    .layout {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
    }

    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 500px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
`}</style>
    </div>
  );
}