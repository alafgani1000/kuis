<!-- <p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p> -->

<!-- <p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p> -->

## About Quiz App

Quiz App is a modular platform for end-to-end quiz management, enabling administrators to create, configure, and deploy quizzes seamlessly for user access and tracking.

Berikut versi yang disesuaikan untuk dokumentasi teknis:

---

### 📘 Overview: Quiz App

**Quiz App** is a modular application designed to streamline the end-to-end management of quizzes. It enables administrators to create, configure, and publish quizzes efficiently, supporting both internal workflows and public-facing delivery.

---

### 🔧 Core Features

-   **Question Builder**: Create and organize multiple-choice, multiple-response and short-answer questions.
-   **Quiz Configuration**: Define quiz metadata, time limits, scoring.
<!-- - **Publishing Workflow**: Seamlessly publish quizzes to designated audiences with scheduling and visibility controls. -->
-   **User Access**: Supports authenticated and anonymous participation, with tracking for completion and performance.
<!-- -   **Analytics Module** _(optional)_: Monitor engagement, score distribution, and question-level insights. -->

## Installation

### Requirements

    - PHP ^8.1
    - Composer 2
    - Node.js 20+
    - NPM 10+
    - Mysql
    - Redis Server
    - Web Server (Apache, Nginx, etc.)

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/kuis-tech/quiz-app.git
```

2. Install dependencies:

```bash
cd quiz-app
composer install
```

3. Create a database and configure the database connection in the `.env` file.

4. Create a new user and set the password in the `.env` file. for more details see the env.example file

5. Run the migrations:

```bash
php artisan migrate
```

6. Seed the database with sample data:

```bash
php artisan db:seed
```

7. Start the application server:

```bash
php artisan serve
```

8. Open your web browser and navigate to `http://localhost:8000`.

9. You can now access the Quiz App dashboard and start creating quizzes.
10. Enjoy your quiz-building experience!

## Contributing

We welcome contributions from the community to help improve and expand the functionality of Quiz App.
