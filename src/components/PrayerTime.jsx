import { useEffect, useState } from "react";

export default function PrayerTime() {
  const [jadwal, setJadwal] = useState(null);
  const [kota, setKota] = useState("Mendeteksi lokasi...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Browser tidak support GPS ❌");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          // 🔥 Ambil nama kota
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const geoData = await geoRes.json();

          const city =
            geoData.address.city ||
            geoData.address.town ||
            geoData.address.village ||
            geoData.address.county ||
            "Lokasi Kamu";

          setKota(city);

          // 🔥 Ambil jadwal sholat
          const res = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
          );
          const data = await res.json();

          setJadwal(data.data.timings);
        } catch (err) {
          console.error(err);
          setError("Gagal ambil data ❌");
        }
      },
      () => {
        setError("Izin lokasi ditolak ❌");
        setKota("Tidak diketahui");
      }
    );
  }, []);

  return (
    <div className="prayer">
      <h2>🕌 Jadwal Sholat</h2>
      <p className="kota">📍 {kota}</p>

      {error && <p className="error">{error}</p>}

      {!jadwal ? (
        <p className="loading">Loading jadwal...</p>
      ) : (
        <div className="list">
          <div>Subuh: {jadwal.Fajr}</div>
          <div>Dzuhur: {jadwal.Dhuhr}</div>
          <div>Ashar: {jadwal.Asr}</div>
          <div>Maghrib: {jadwal.Maghrib}</div>
          <div>Isya: {jadwal.Isha}</div>
        </div>
      )}

      <style>{`
        .prayer {
          background: rgba(30,41,59,0.7);
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
          text-align: center;
          box-shadow: 0 0 15px rgba(56,189,248,0.3);
        }

        .kota {
          color: #94a3b8;
          margin-bottom: 10px;
        }

        .list div {
          margin: 6px 0;
          color: #38bdf8;
          font-weight: bold;
        }

        .loading {
          color: #94a3b8;
        }

        .error {
          color: #f87171;
        }
      `}</style>
    </div>
  );
}