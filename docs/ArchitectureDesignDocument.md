Mimari Tasarım Dokümanı: Online Mangala PWA (MVP)

1. Genel Bakış

Bu doküman, "Online Mangala PWA" projesinin teknik mimarisini, kullanılan bileşenleri, veri akışını ve mantıksal yapısını tanımlar. Amaç, 1v1 oynanabilen, hızlı, PWA destekli ve sunucu taraflı oyun mantığına sahip bir MVP (Minimum Uygulanabilir Ürün) için net bir teknik plan oluşturmaktır.

2. Mimari Hedefler ve Kısıtlamalar

    Hızlı Piyasaya Sürme: Mimari, minimum geliştirme süresi ve sunucu yönetimi gerektirmelidir.

    Gerçek Zamanlı (Real-time): Oyuncu hamleleri, rakibin ekranına anında yansımalıdır.

    Sunucu Taraflı Otorite: Hile yapılmasını önlemek için tüm oyun mantığı ve hamle geçerliliği sunucuda işlenmelidir.

    PWA (Progressive Web App): Uygulama, mobil cihazlara "yüklenebilir" (ana ekrana eklenebilir) ve modern tarayıcılarda çalışabilir olmalıdır.

    Düşük Maliyet ve Ölçeklenebilirlik: MVP aşamasında maliyetleri düşük tutmalı, ancak kullanıcı sayısı arttığında kolayca ölçeklenebilmelidir.

3. Mimari Yaklaşım: Sunucusuz (Serverless) BaaS

Seçilen mimari, BaaS (Backend as a Service) modeline dayalı Sunucusuz (Serverless) bir yaklaşımdır.

Bu modelde, geleneksel bir monolitik sunucu (örn: Node.js/Express sunucusu) yazmak ve yönetmek yerine, tüm arka uç ihtiyaçlarımız (veritabanı, kimlik doğrulama, sunucu mantığı) Google Firebase platformu tarafından yönetilen servislere dağıtılacaktır.

4. Bileşen Mimarisi (Component Breakdown)

Proje 3 ana bileşenden oluşur:

4.1. İstemci (Client): React PWA

    Teknoloji: React (Vite ile oluşturulmuş Single Page Application - SPA).

    Sorumlulukları:

        Kullanıcı Arayüzünü (UI) render etmek (Oyun tahtası, kuyular, skorlar).

        Kullanıcı girdilerini almak (örn: bir kuyuya tıklama).

        Firebase Authentication ile anonim (misafir) kullanıcı oturumu açmak.

        Firestore veritabanındaki ilgili oyun odasını anlık olarak dinlemek (onSnapshot).

        Bir hamle yapıldığında, bu hamle niyetini (intent) Firestore'a yazmak.

        PWA özellikleri için manifest.json ve Service Worker dosyalarını barındırmak.

4.2. Arka Uç Veri Katmanı: Cloud Firestore

    Teknoloji: Cloud Firestore (NoSQL, Doküman Veritabanı).

    Sorumlulukları:

        Uygulamanın "Tek Doğruluk Kaynağı" (Single Source of Truth) olmaktır.

        Tüm oyun odalarını (rooms koleksiyonu) ve bu odaların anlık durumlarını (tahta dizilimi, sıra kimde, oyuncular kim vb.) saklamak.

        İstemcilere (React) gerçek zamanlı veri güncellemelerini anında (push) iletmek.

4.3. Arka Uç Mantık Katmanı: Firebase Cloud Functions

    Teknoloji: Cloud Functions (FaaS - Function as a Service).

    Sorumlulukları:

        Oyunun "beyni" olarak çalışmak.

        Tetikleyici (Trigger): Firestore'daki bir rooms dokümanı güncellendiğinde (örn: bir oyuncu hamle niyeti yazdığında) otomatik olarak tetiklenmek.

        Oyun Mantığı: Gelen hamle niyetini doğrulamak (Sıra doğru oyuncuda mı? Kuyu geçerli mi?).

        Kuralları İşletme: Mangala oyun kurallarını (taş dağıtma, rakibin taşını alma, hazineye koyma, boş kuyu kuralı vb.) sunucu tarafında hesaplamak.

        Kazanma Durumu: Oyunun bitip bitmediğini kontrol etmek.

        Veritabanını Güncelleme: Hesaplamalar sonucunda oluşan yeni oyun durumunu (yeni tahta dizilimi, değişen sıra) Firestore'a geri yazmak.

5. Mantıksal Akış ve Veri Akışı

Bu mimarinin nasıl çalıştığını gösteren en kritik senaryolar:

Akış 1: Oda Kurma (Player 1)

    İstemci (React): Kullanıcı "Oda Kur" butonuna tıklar.

    İstemci (React): Firebase Authentication'dan signInAnonymously ile anonim bir uid alır.

    İstemci (React): Benzersiz bir "Oda Kodu" (örn: ABCDE) oluşturur.

    İstemci (React): Firestore'a rooms koleksiyonu altında ABCDE ID'li yeni bir doküman oluşturur. Bu dokümana şunları yazar:

        status: "waiting"

        players: { player1: { uid: "..._uid_1" } }

        board: { ...varsayılan_dizilim... }

    İstemci (React): Firestore'daki bu ABCDE dokümanını dinlemeye (onSnapshot) başlar.

    İstemci (React): Ekranda "Rakip bekleniyor... Kod: ABCDE" yazar.

Akış 2: Odaya Katılma (Player 2)

    İstemci (React): Kullanıcı "Odaya Katıl" ekranına ABCDE kodunu yazar.

    İstemci (React): Firebase Authentication'dan anonim bir uid alır.

    İstemci (React): Firestore'da rooms/ABCDE dokümanını çeker (read).

    İstemci (React): Doküman varsa ve status == "waiting" ise, bu dokümanı günceller (update):

        status: "playing"

        players: { ..., player2: { uid: "..._uid_2" } }

    Firestore: Bu değişikliği her iki oyuncuya da (Player 1 ve Player 2) anlık olarak iletir.

    İstemci (P1 & P2): Her iki istemci de status: "playing" olduğunu görür ve React, UI'ı "Oyun Başladı" ekranına (oyun tahtası) geçirir.

Akış 3: Oyun Hamlesi (En Kritik Akış)

Bu akış, sunucu taraflı mantığın nasıl çalıştığını gösterir:

    İstemci (P1): Sıra Player 1'dedir. p1_kuyu_3'e tıklar.

    İstemci (P1): Hamlenin hesaplamasını yapmaz. Sadece niyetini Firestore'a yazar. rooms/ABCDE dokümanını günceller:

        lastMove: { player: "player1", pit: "p1_kuyu_3" }

    Cloud Function (Tetikleme): Firestore, rooms/ABCDE dokümanındaki bu güncellemeyi algılar ve ilgili Cloud Function'ı (onUpdate) tetikler.

    Cloud Function (Mantık): a. Dokümanın mevcut durumunu (board, turn) okur. b. Hamleyi doğrular (Sıra player1'de mi? p1_kuyu_3 boş mu?). c. Tüm Mangala kurallarını sunucuda işletir (taşları dağıtır, hazineleri günceller, rakibin taşlarını alır vb.). d. Bir sonraki sıranın kimde olduğuna (turn: "player2") ve oyunun bitip bitmediğine (winner: ...) karar verir.

    Cloud Function (Yazma): Hesaplanan yeni oyun durumunu rooms/ABCDE dokümanına yazar:

        board: { ...yeni_dizilim... }

        turn: "player2"

        lastMove: null (Tetikleyicinin tekrar çalışmaması için temizler)

    Firestore: Bu yeni durumu alır almaz, ABCDE odasını dinleyen her iki oyuncuya da (P1 ve P2) anlık olarak iletir.

    İstemci (P1 & P2): React, Firestore'dan gelen yeni veriyi (props) algılar ve UI'ı (tahtayı) otomatik olarak günceller. Ekran P2'ye "Sıra sende" olarak değişir.

6. Veri Modeli (Firestore)

Ana veri yapısı, önceki adımda kararlaştırdığımız rooms koleksiyonudur.

Koleksiyon: rooms Doküman ID: [Oda Kodu] (Örn: "ABCDE")
JSON

{
  "roomId": "ABCDE",
  "status": "playing", // "waiting", "playing", "finished"
  "createdAt": Timestamp,
  
  "players": {
    "player1": { "uid": "uid_1", "displayName": "Misafir 1" },
    "player2": { "uid": "uid_2", "displayName": "Misafir 2" }
  },

  "turn": "player1", // "player1" veya "player2"
  
  "board": {
    "p1_1": 4, "p1_2": 4, ..., "p1_6": 4,
    "p1_treasure": 0,
    "p2_1": 4, "p2_2": 4, ..., "p2_6": 4,
    "p2_treasure": 0
  },

  "lastMove": null, // Cloud Function'ı tetiklemek için kullanılır
  "winner": null // "player1", "player2" veya "draw"
}

7. PWA ve Dağıtım (Deployment)

    PWA Stratejisi: Vite tabanlı React projesi, vite-plugin-pwa gibi bir eklenti kullanarak manifest.json ve bir Service Worker dosyası üretecektir. Service Worker, uygulamanın temel varlıklarını (JS, CSS, HTML, görseller) önbelleğe (cache) alarak "ana ekrana ekleme" ve çevrimdışı temel erişim (uygulamanın açılması) sağlar.

    Dağıtım (Hosting):

        React projesi npm run build komutu ile derlenir ve statik dosyaların (HTML, CSS, JS) bulunduğu bir dist klasörü oluşturulur.

        firebase deploy komutu çalıştırılır.

        Firebase Hosting, bu dist klasöründeki statik dosyaları alır ve küresel bir CDN (İçerik Dağıtım Ağı) üzerinden kullanıcılara sunar.

Bu mimari, MVP hedefimiz için geliştirme hızını, ölçeklenebilirliği ve güvenliği (sunucu taraflı mantık) birleştirir.