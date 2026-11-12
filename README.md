# Fizyoterapi YL Hazırlık – site dosyaları

Bu dal, https://fizyoterapi-hazirlik.vercel.app sitesinin statik dosyalarını (kod ve 3D atlas modelleri) barındırır. Dosyalar jsDelivr üzerinden sunulur.

## Atıf ve lisans (3D atlas verisi)

- `site/models/extra*` dosyaları ve `site/nerves.js` içindeki sinir yolları **Z-Anatomy** modellerinden uyarlanmıştır (Gauthier Kervyn ve ark., https://github.com/Z-Anatomy/Models-of-human-anatomy), **CC BY-SA 4.0**. Z-Anatomy, BodyParts3D (© The Database Center for Life Science, CC BY-SA 2.1 JP) verisinden türetilmiştir.
- Değişiklikler: yapılar seçildi, sadeleştirildi, atlasın referans iskeletine doğrusal olmayan bir dönüşümle hizalandı ve ikili parçalara paketlendi. Bu türev veri de **CC BY-SA 4.0** ile paylaşılır: https://creativecommons.org/licenses/by-sa/4.0/
- Temel vücut modeli bu depoda değildir; `ashemag/human-atlas` deposundan yüklenir.
