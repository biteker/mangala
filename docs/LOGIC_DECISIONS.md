# Mangala Logic Decisions

Bu dosya, repository içinde kabul edilen Mangala kural yorumlarını ve alınan tasarım kararlarını açıklar. Amaç: ileride farklı yorum varyantları ortaya çıktığında referans sağlamak.

## Seçilen Dağıtım Davranışı (Distribution Semantics)

- Karar: Çok taş alındığında (yani `stonesInHand > 1`) dağıtıma **seçilen (başlangıç) kuyuda** ilk taş tekrar konur. Tek taş alındığında ise başlangıç kuyusu atlanarak dağıtıma bir sonraki kuyudan başlanır.
- Neden: Bu varyant, proje testleri ve mevcut implementasyon ile uyumlu olacak şekilde seçildi. Ayrıca bazı Mangala varyantlarında bu davranış beklenir; testler bu davranışı doğrulamak üzere düzenlendi.
- Etki:
  - Birden fazla taş dağıtırken başlangıç kuyusuna 1 taş geri konur.
  - Bu davranış son pit hesaplarını, hazinaya denk gelme durumlarını ve Kural 2/Kural 3 yakalama mantığını etkiler; bu yüzden unit testler bu davranışı baz alacak şekilde güncellendi.

## Kural Kaynağı
- Temel kural seti: `.github/instructions/Mangalarules.instructions.md` (Türkçe)
- Bu dokümanda referans alınan kural metni, PR 0.2 sırasında testlerle uyumlu olacak şekilde yorumlanmıştır.

## İleriki Notlar
- Eğer turnuva veya izleyici modu için farklı Mangala varyantları desteklenecekse, bu dosyaya "variant" anahtarları ve hangi komponentin hangi varyanta göre davranacağı (örn. UI seçeneği) eklenmelidir.
- Değişiklik yapıldığında ilgili testlerin de güncellenmesi gerekir (`tests/mangalaLogic.test.js`).

---

Oluşturan: otomatik güncelleme (agent). Tarih: `2025-11-23`.
