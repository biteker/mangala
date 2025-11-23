# Turnuva ve İzleyici Modu - Taslak

Bu doküman, turnuva (`Tournament`) ve izleyici (`Spectator`) modlarının temel gereksinimlerini ve planını açıklar.

## Hedefler
- Minimal bir "turnuva modu" sağlayarak oyuncu kaydı, eşleştirme (Swiss tarzı) ve puanlama sunulacak.
- "İzleyici modu" ile canlı oyunların listelenmesi ve seçilen oyunun izlenmesi mümkün olacak.

## İlk Aşamada Yapılacaklar
- Backend: Firestore koleksiyonları
  - `tournaments/{id}/players` — oyuncu kayıtları
  - `tournaments/{id}/rounds` — her turun eşleşmeleri ve sonuçları
  - `liveGames/{gameId}` — canlı oyun durumları (izleyiciler için)
- Frontend scaffold:
  - `src/components/Tournament.jsx` — turnuva arayüzü (liste, başlat, eşleştir)
  - `src/components/Spectator.jsx` — canlı oyun listesi / seçici
  - `src/utils/tournament.js` — eşleştirme, puanlama yardımcıları
  - `src/utils/spectator.js` — canlı oyunlar için yardımcı fonksiyonlar

## Geliştirme Notları
- İlk sürüm: sadece lokal bir mock veri ile çalışacak; Firestore entegrasyonu sonraki sprint'te eklenecek.
- Testler: `src/utils/tournament.js` için birim testler eklenecek (eşleştirme, puan güncelleme).

---

Oluşturan: agent. Tarih: 2025-11-23
