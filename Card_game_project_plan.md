# 🃏 Projekt: Ablakos Score Tracker

**Verzió:** 1.0.0 (MVP Complete)
**Státusz:** MVP Kész
**Dátum:** 2026. február 16.

## 🎯 Projekt Célja

Egy webalkalmazás az **"Ablakos"** kártyajáték pontszámainak vezetésére és statisztikázására.

**Játékszabályok:**

- **Játékosok:** Minimum 3 fő.
- **Menet:** Körökre osztott játék, minden kör végén pontokat kapnak a játékosok (lehet negatív is).
- **Vége:** A játék addig tart, amíg valaki el nem éri a **100 pontot**.
- **Győztes:** Az a játékos nyer, akinek a játék végén a **legkevesebb** pontja van.

## 🏗 Technológiai Stack

- **Frontend:** React (Vite) + Tailwind CSS (a gyors és szép UI érdekében).
- **Backend / BaaS:** Firebase (Authentication, Firestore Database, Hosting).
- **Nyelv:** JavaScript.

## 📦 MVP Funkciók (Phase 1)

A cél a lehető leggyorsabban eljutni egy használható verzióig.

1.  **Játékos Kezelés:**
    - Új játékos hozzáadása (csak név).
    - Játékosok listázása.
2.  **Játék Menet (Game Session):**
    - Új játék indítása: Résztvevők kiválasztása (min. 3).
    - Kör rögzítése: Pontszámok beírása minden játékoshoz.
    - Eredményjelző (Scoreboard): Aktuális összesített pontok mutatása.
    - Játék vége logika: Ha `pont >= 100`, a játék lezárul, a legkisebb pontszámú nyer.
3.  **Statisztika:**
    - Korábbi játékok listája.
    - Összesített győzelmek száma játékosonként.

## 🗂 Adatmodell Tervezet (Firestore)

### `players` collection

```json
{
  "id": "auto-generated-uuid",
  "name": "Matyi",
  "createdAt": "timestamp",
  "stats": {
    "wins": 0,
    "matchesPlayed": 0
  }
}
```

### `matches` collection

```json
{
  "id": "auto-generated-uuid",
  "date": "timestamp",
  "gameType": "generic", // Később bővíthető (pl. Poker, Uno)
  "participants": ["player_id_1", "player_id_2"],
  "winnerId": "player_id_1"
}
```

## 🗓 Roadmap

1.  **Setup:** Projekt inicializálás (Vite + Tailwind), Firebase konfiguráció.
2.  **Core:** Adatbázis kapcsolat és Játékos menedzsment UI. ✅
3.  **Game Engine - New Game UI:** Játékosok kiválasztása a játékhoz. ✅
4.  **Game Engine - State & Creation:** Játékmenet állapotkezelése és létrehozása az adatbázisban. ✅
5.  **Game Engine - Score Tracking:** Körök és pontszámok rögzítése egy aktív játékban.
6.  **History:** Korábbi játékok és statisztikák.
