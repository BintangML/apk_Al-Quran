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

  useEffect(() => {
    dispatch(fetchSurah());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSurah) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedSurah]);

  const handleClick = (s) => {
    setSelectedSurah(s);
    dispatch(fetchAyat(s.nomor));
  };

  const isMekah = (t) => t?.toLowerCase() === "mekah";

  // 🔍 FILTER + SEARCH
  const filtered = surah.filter((s) => {
    const matchSearch =
      s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
      s.arti.toLowerCase().includes(search.toLowerCase()) ||
      s.nomor.toString().includes(search);

    const matchFilter =
      filter === "all"
        ? true
        : filter === "mekah"
        ? isMekah(s.tempatTurun)
        : !isMekah(s.tempatTurun);

    return matchSearch && matchFilter;
  });

  const totalSurah = surah.length;
  const totalAyat = surah.reduce((acc, s) => acc + s.jumlahAyat, 0);

  return (
    <div className="container">
      <h1 className="title">Al-Qur'an Digital Bintang</h1>

      {!selectedSurah && (
        <>
          {/* STATS */}
          <div className="stats">
            <span>🟢 {totalSurah} Surat</span>
            <span>🔵 {totalAyat} Ayat</span>
            <span>🟡 30 Juz</span>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Cari surat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search"
          />

          {/* FILTER */}
          <div className="filter">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              Semua
            </button>

            <button
              className={filter === "mekah" ? "active" : ""}
              onClick={() => setFilter("mekah")}
            >
              🌴 Makkiyah
            </button>

            <button
              className={filter === "madinah" ? "active" : ""}
              onClick={() => setFilter("madinah")}
            >
              🕌 Madaniyah
            </button>
          </div>

          {/* 🔥 NO RESULT / GRID */}
          {filtered.length === 0 && search !== "" ? (
            <div className="no-result">
              <h3>Tidak ada hasil</h3>
              <p>
                Surat "<b>{search}</b>" tidak ditemukan. Coba kata kunci lain.
              </p>
            </div>
          ) : (
            <div className="grid">
              {filtered.map((s) => (
                <div
                  key={s.nomor}
                  onClick={() => handleClick(s)}
                  className="card"
                >
                  <div className="top">
                    <span className="nomor">{s.nomor}</span>
                    <span className="arab">{s.nama}</span>
                  </div>

                  <h3>{s.namaLatin}</h3>
                  <p>{s.arti}</p>

                  <div className="bottom">
                    <span
                      className={isMekah(s.tempatTurun) ? "mekah" : "madinah"}
                    >
                      {isMekah(s.tempatTurun) ? "Mekah" : "Madinah"}
                    </span>
                    <span>{s.jumlahAyat} Ayat</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* AYAT VIEW */}
      {selectedSurah && (
        <div>
          <button onClick={() => setSelectedSurah(null)} className="back">
            ⬅ Kembali
          </button>

          <h2 className="surah-title">
            {selectedSurah.namaLatin} ({selectedSurah.nama})
          </h2>

          {ayat.map((a) => (
            <div key={a.nomorAyat} className="ayat">
              <p className="arab">{a.teksArab}</p>
              <p>{a.teksIndonesia}</p>
            </div>
          ))}
        </div>
      )}

      {/* STYLE */}
      <style>{`
        body {
          margin: 0;
          background: radial-gradient(circle at top, #0f172a, #020617);
          font-family: Arial;
          color: white;
        }

        .container {
          padding: 20px;
          max-width: 1100px;
          margin: auto;
        }

        .title {
          text-align: center;
          color: #38bdf8;
          text-shadow: 0 0 10px #38bdf8;
        }

        .stats {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 10px 0;
        }

        .search {
          width: 300px;
          padding: 10px;
          border-radius: 10px;
          border: none;
          background: #1e293b;
          color: white;
          margin: 15px auto;
          display: block;
        }

        .search:focus {
          outline: none;
          box-shadow: 0 0 10px #38bdf8;
        }

        .filter {
          display: flex;
          justify-content: center;
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

        .filter .active {
          background: #38bdf8;
          color: black;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .card {
          background: rgba(30,41,59,0.7);
          padding: 15px;
          border-radius: 15px;
          cursor: pointer;
          transition: 0.3s;
        }

        .card:hover {
          box-shadow: 0 0 20px #38bdf8;
          transform: translateY(-5px);
        }

        .top {
          display: flex;
          justify-content: space-between;
        }

        .nomor {
          background: #f59e0b;
          border-radius: 50%;
          padding: 5px 10px;
        }

        .arab {
          color: #22c55e;
          font-size: 20px;
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 12px;
        }

        .mekah {
          color: #22c55e;
        }

        .madinah {
          color: #f59e0b;
        }

        .no-result {
          text-align: center;
          margin-top: 40px;
          color: #94a3b8;
        }

        .no-result h3 {
          color: #38bdf8;
        }

        .back {
          margin-bottom: 15px;
          padding: 8px;
          background: #38bdf8;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .ayat {
          margin: 20px 0;
          padding: 15px;
          background: #0f172a;
          border-radius: 10px;
        }

        .ayat .arab {
          text-align: right;
          font-size: 24px;
        }

        @media (max-width: 768px) {
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