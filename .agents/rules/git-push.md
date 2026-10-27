# Avtomatik Git Push Qoidasi

Har qanday kod tahriri, xatolik tuzatish yoki yangi funksiya qo'shilgandan so'ng darhol:
1. Loyiha build/lint orqali tekshiriladi (`npm.cmd run build`).
2. O'zgarishlar Git'ga qo'shiladi va commit qilinadi (`git add .` va `git commit -m "..."`).
3. Darhol GitHub'ga push qilinadi: `git push origin main`.
