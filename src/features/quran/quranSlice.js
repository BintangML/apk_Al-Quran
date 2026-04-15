import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// GET SURAH
export const fetchSurah = createAsyncThunk(
  "quran/fetchSurah",
  async () => {
    const res = await fetch("https://equran.id/api/v2/surat");
    const json = await res.json();
    return json.data;
  }
);

// GET AYAT
export const fetchAyat = createAsyncThunk(
  "quran/fetchAyat",
  async (nomor) => {
    const res = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
    const json = await res.json();
    return json.data.ayat; // 🔥 penting
  }
);

const quranSlice = createSlice({
  name: "quran",
  initialState: {
    surah: [],
    ayat: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurah.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSurah.fulfilled, (state, action) => {
        state.loading = false;
        state.surah = action.payload;
      })
      .addCase(fetchAyat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAyat.fulfilled, (state, action) => {
        state.loading = false;
        state.ayat = action.payload;
      });
  },
});

export default quranSlice.reducer;