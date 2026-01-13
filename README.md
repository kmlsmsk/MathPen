# 🖊️ MathPen - Chrome Screen Annotation Tool

<div align="center">

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Chrome%20Extension-orange.svg)

**Mühendisler, Öğretmenler ve Öğrenciler için Geliştirilmiş Web Üzerinde Çizim Aracı**

</div>

---

## 🚀 Proje Hakkında

**MathPen**, herhangi bir web sayfasının üzerine katman açarak çizim yapmanızı, not almanızı ve geometrik şekiller oluşturmanızı sağlayan hafif ve güçlü bir Chrome eklentisidir. 

Özellikle online eğitim, mühendislik sunumları ve teknik incelemeler için tasarlanmıştır. **Vanilla JavaScript** ile geliştirilmiş olup, harici bir kütüphane bağımlılığı yoktur. Modern "Glassmorphism" UI tasarımı ve canlı renk paleti ile dikkat çeker.

## ✨ Özellikler

### ✏️ Akıllı Çizim Araçları
*   **Akıllı Kalem (Smart Smoothing):** Titrek el hareketlerini algoritmik olarak düzeltir (Quadratic Bezier Curves).
*   **Hat Kalemi (Calligraphy):** 45° açılı uç simülasyonu ile estetik yazı.
*   **Fosforlu Kalem (Highlighter):** %5 opaklık ve `multiply` katman modu ile altındaki yazıyı kapatmadan vurgular.
*   **Silgi & Temizleme:** Bölgesel silme veya tam ekran temizleme.

### 📐 Gelişmiş Geometri & Şekiller
*   Her biri için özel ikon seti.
*   **Temel:** Kare, Dikdörtgen, Daire, Çizgi.
*   **İleri Düzey:** Eşkenar Üçgen, Dik Üçgen, Altıgen, Baklava Dilimi (Rhombus), Yıldız, Ok.

### 🎓 Öğretmen & Sunum Modu
*   **Lazer (🔥):** Ekranda iz bırakmayan, kuyruklu işaretleyici.
*   **Odaklama (Spotlight/Fener 🔦):** Ekranı karartıp sadece imlecin olduğu alanı aydınlatır.
*   **Mouse Modu:** Çizimi durdurup web sayfasında gezinmeyi sağlar.

### 🖼️ Arka Plan Katmanları
*   **Kareli Defter:** Mühendislik ve matematik çizimleri için milimetrik ızgara.
*   **Çizgili Kağıt:** Not almak için ideal satır yapısı.
*   **Kara Tahta:** Göz yormayan koyu yeşil/füme öğretmen modu.

### 🎨 UI ve Tasarım
*   **Vibrant Neon Tema:** Canlı renkler ve modern arayüz.
*   **Sürükle & Bırak:** Kontrol paneli ekranın istenilen yerine taşınabilir.
*   **Geniş Renk Paleti:** 16+ farklı canlı renk seçeneği.

## 📦 Kurulum (Geliştirici Modu)

Bu proje henüz Chrome Web Store'da yayınlanmamıştır. Tarayıcınıza yüklemek için aşağıdaki adımları izleyin:

1.  Bu projeyi bilgisayarınıza indirin veya klonlayın:
    ```bash
    git clone https://github.com/kullaniciadi/MathPen.git
    ```
2.  Google Chrome tarayıcısını açın ve adres çubuğuna şunu yazın:
    `chrome://extensions/`
3.  Sağ üst köşedeki **"Geliştirici modu" (Developer mode)** anahtarını açın.
4.  Sol üstte beliren **"Paketlenmemiş öğe yükle" (Load unpacked)** butonuna tıklayın.
5.  İndirdiğiniz `MathPen` klasörünü seçin.
6.  Tebrikler! 🎉 MathPen tarayıcınızın uzantılar menüsüne eklendi.

## 🛠️ Teknolojiler

*   **Core:** HTML5 Canvas API (2D Context)
*   **Logic:** Pure JavaScript (ES6+)
*   **Styling:** CSS3 (Injected Styles, Glassmorphism)
*   **Extension API:** Chrome Scripting API (Manifest V3)

## 📂 Proje Yapısı

```text
MathPen/
├── manifest.json   # Chrome eklenti yapılandırması
├── background.js   # Arka plan servisleri (Content script injection)
├── content.js      # Ana uygulama mantığı, UI ve Çizim motoru
├── icon.png        # Uygulama ikonu
└── README.md       # Dokümantasyon
