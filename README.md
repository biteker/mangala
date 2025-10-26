# Online Mangala PWA (MVP)

Bu proje, klasik Türk zeka ve strateji oyunu Mangala'nın 1v1 çevrimiçi oynanabilen, hızlı ve modern bir PWA (Progressive Web App) sürümüdür. Temel amaç, kullanıcıların hızlıca oyuna dahil olabildiği ve uygulama mağazasına ihtiyaç duymadan mobil cihazlarına "yükleyebildiği" bir MVP (Minimum Uygulanabilir Ürün) sunmaktır.

## 🚀 Canlı Demo

(Projenizi yayınladığınızda buraya linki ekleyebilirsiniz)
[https://mangala-online.web.app](https://mangala-online.web.app) (Örnek Link)

## ✨ Temel Özellikler (MVP Sürüm 1)

* **PWA Desteği:** Tarayıcı üzerinden mobil cihaza yüklenebilir (Ana ekrana eklenebilir).
* **Gerçek Zamanlı 1v1 Oyun:** İki oyuncunun anlık olarak hamle yapabildiği oyun akışı.
* **Misafir Kullanıcı:** Kayıt veya giriş yapmaya gerek kalmadan, anonim bir "Misafir" kimliği ile oynayabilme.
* **Oda Sistemi:** Oyuncuların özel bir "Oda Kurup" oluşturulan linki veya kodu arkadaşlarıyla paylaşarak davet edebilmesi.
* **Sunucu Taraflı Mantık:** Hileleri önlemek ve oyun durumunu güvende tutmak için tüm oyun kuralları ve hamle doğrulamaları sunucu (Firebase) üzerinde çalışır.

## 🛠️ Kullanılan Teknolojiler

* **Ön Yüz (Frontend):** [React](https://reactjs.org/) (Proje [Vite](https://vitejs.dev/) kullanılarak oluşturulmuştur - Hızlı geliştirme ve derleme sağlar)
* **Arka Uç (Backend):** [Firebase](https://firebase.google.com/) (Backend as a Service)
* **Veritabanı ve Gerçek Zamanlı Veri:** [Cloud Firestore](https://firebase.google.com/products/firestore) - Oyun odalarını ve anlık oyun durumunu (tahtadaki taşlar, sıra kimde vb.) tutmak için.
* **Kimlik Doğrulama:** [Firebase Authentication](https://firebase.google.com/products/auth) - "Misafir (Anonymous) Giriş" özelliğini sağlamak için.
* **Sunucu Taraflı Mantık:** [Firebase Cloud Functions](https://firebase.google.com/products/functions) - Oyun kurallarını (hamle geçerliliği, kazanma durumu kontrolü) sunucuda çalıştırmak için.
* **Hosting (Yayınlama):** [Firebase Hosting](https://firebase.google.com/products/hosting) - PWA'yı hızlı ve güvenli (SSL) bir şekilde yayınlamak için.

## ⚙️ Yerel Geliştirme Ortamı Kurulumu

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

**1. Projeyi Klonlayın:**
```bash
git clone [PROJE_GIT_LINKI_BURAYA]
cd online-mangala
```

**2. Gerekli Paketleri Yükleyin: (Node.js'in son sürümünün yüklü olduğundan emin olun)**
```bash
npm install
```

**3. Firebase Yapılandırması (Çok Önemli)**: Bu projenin çalışması için bir Firebase projesine ihtiyacı vardır.

    Firebase Console adresine gidin ve yeni bir proje oluşturun.

    Proje ayarlarından bir "Web Uygulaması" (</>) ekleyin.

    Firebase'in size vereceği firebaseConfig nesnesini kopyalayın.

**4. .env.local Dosyası Oluşturun:** Projenin ana dizininde .env.local adında bir dosya oluşturun. (Vite, VITE_ önekini kullanır). Kopyaladığınız firebaseConfig bilgilerini bu dosyaya aşağıdaki formatta yapıştırın:

```
# Firebase Proje Ayarları
VITE_FIREBASE_API_KEY="BURAYA_API_ANAHTARINI_YAPIŞTIR"
VITE_FIREBASE_AUTH_DOMAIN="BURAYA_AUTH_DOMAINI_YAPIŞTIR"
VITE_FIREBASE_PROJECT_ID="BURAYA_PROJE_ID_YAPIŞTIR"
VITE_FIREBASE_STORAGE_BUCKET="BURAYA_STORAGE_BUCKET_YAPIŞTIR"
VITE_FIREBASE_MESSAGING_SENDER_ID="BURAYA_SENDER_ID_YAPIŞTIR"
VITE_FIREBASE_APP_ID="BURAYA_APP_ID_YAPIŞTIR"
```

(Not: .env.local dosyası .gitignore içinde olmalıdır ve asla herkese açık depolara (GitHub vb.) gönderilmemelidir!)

**5. Firebase Servislerini Etkinleştirin:** Firebase konsolunda:

- Authentication: "Sign-in method" sekmesinden "Misafir" (Anonymous) sağlayıcısını etkinleştirin.
- Firestore Database: "Firestore Database" bölümüne gidin, "Veritabanı oluştur" deyin ve Test Modunda başlayın (Güvenlik kurallarını daha sonra MVP sonrası sıkılaştıracağız).
- Cloud Functions: (Bu adım, oyun mantığını sunucuya taşımak için gereklidir. Başlangıçta mantığı istemcide (React) tutup, daha sonra taşıyabilirsiniz.)

**6. Projeyi Başlatın:**
```
npm run dev
```

Uygulama varsayılan olarak http://localhost:5173 (veya benzeri) adresinde çalışacaktır.

## 🚀 Dağıtım (Deployment)

Projemiz PWA olduğu için statik bir site olarak derlenebilir.

**1. Projeyi Derleyin (Build):**

```
npm run build
```
Bu komut, projenin optimize edilmiş statik dosyalarını dist klasörüne oluşturur.

**2. Firebase Hosting ile Dağıtım (Önerilen):** Firebase CLI (komut satırı aracı) yüklü değilse yükleyin:

```
npm install -g firebase-tools
```

Ardından projenizde oturum açın ve hosting'i başlatın:
```

firebase login
firebase init hosting
```
Size hangi projeyi kullanmak istediğinizi soracaktır.
Dağıtım klasörü olarak dist klasörünü seçin.
"Configure as a single-page app (rewrite all urls to /index.html)?" sorusuna Yes (Evet) deyin.

Kurulum tamamlandığında, projenizi canlıya almak için:
```

firebase deploy
```

Firebase size projenizin canlı linkini verecektir.

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.