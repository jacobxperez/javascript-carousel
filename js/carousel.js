/* JavaScript Carousel
 * <https://github.com/jacobxperez/javascript-carousel>
 * Copyright (C) 2023 Jacob Perez <jacobxperez@gmx.com>
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
------------------------------------------------------------------------------*/
class Carousel {
    constructor(options = {}) {
        this.carousel = document.querySelector(
            options.carouselSelector || '[data-carousel]'
        );
        this.slides = this.carousel.querySelectorAll(
            options.slideSelector || '[data-slide]'
        );
        if (!this.controls) {
            const controls = document.createElement('nav');
            controls.setAttribute('data-controls', '');
            this.carousel.appendChild(controls);
        }
        this.controls = this.carousel.querySelector(
            options.controlsSelector || '[data-controls]'
        );
        this.tabs = this.controls.querySelectorAll(
            options.tabSelector || '[data-tab]'
        );
        this.intervalTime = options.intervalTime || 5000;
        this.lazyLoadThreshold = options.lazyLoadThreshold || 2;
        this.currentIndex = 0;
        this.paused = true;
        this.button = document.createElement('button');
        this.initialize();
    }

    initialize() {
        this.preloadImages().then(() => {
            this.cycleSlides();
            if (this.controls) {
                this.controls.addEventListener(
                    'click',
                    this.handleControls.bind(this)
                );
            }
            if (this.tabs) {
                this.tabs.forEach((tab, index) =>
                    tab.setAttribute('data-index', index)
                );
            }
        });
    }

    preloadImages() {
        const promises = [];
        for (
            let i = 0;
            i < this.lazyLoadThreshold && i < this.slides.length;
            i++
        ) {
            const image = this.slides[i].querySelector('img');
            if (image) {
                const imgPromise = new Promise((resolve) => {
                    const img = new Image();
                    img.src = image.src;
                    img.onload = resolve;
                });
                promises.push(imgPromise);
            }
        }
        return Promise.all(promises);
    }

    cycleSlides() {
        const currentSlide = this.slides[this.currentIndex];
        currentSlide.setAttribute('data-state', 'current');
        requestAnimationFrame(() => {
            this.slides.forEach((slide) => {
                if (slide !== currentSlide) {
                    slide.removeAttribute('data-state');
                }
            });
        });
    }

    changeSlide(direction) {
        if (direction === 'next') {
            this.currentIndex++;
            if (this.currentIndex > this.slides.length - 1) {
                this.currentIndex = 0;
            }
        } else if (direction === 'prev') {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.slides.length - 1;
            }
        }
        this.cycleSlides();
    }

    handleControls(e) {
        const target = e.target;
        if (target.matches('[data-button="next-slide"]')) {
            this.changeSlide('next');
            this.resume();
        } else if (target.matches('[data-button="prev-slide"]')) {
            this.changeSlide('prev');
            this.resume();
        } else if (target.matches('[data-tab]')) {
            this.pause();
            this.currentIndex = Number(target.getAttribute('data-index'));
            this.cycleSlides();
        }
    }

    addControls() {
        const prev = this.button.cloneNode(true);
        const next = this.button.cloneNode(true);
        prev.setAttribute('data-button', 'prev-slide');
        next.setAttribute('data-button', 'next-slide');
        this.controls.appendChild(prev);
        this.controls.appendChild(next);

        return this;
    }

    addIndicators() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.setAttribute('data-tabs', 'indicator');

        for (let i = 0; i < this.slides.length; i++) {
            const indicatorButton = this.button.cloneNode(true);
            indicatorButton.setAttribute('data-tab', i);
            indicatorDiv.appendChild(indicatorButton);
        }

        this.controls.appendChild(indicatorDiv);

        return this;
    }

    addTouchControls() {
        this.carousel.addEventListener(
            'touchstart',
            this.handleTouchStart.bind(this)
        );
        this.carousel.addEventListener(
            'touchmove',
            this.handleTouchMove.bind(this)
        );
        this.carousel.addEventListener(
            'touchend',
            this.handleTouchEnd.bind(this)
        );

        return this;
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchEndX = this.touchStartX;
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        const touchDistance = this.touchEndX - this.touchStartX;

        if (touchDistance > 0) {
            this.changeSlide('prev');
        } else if (touchDistance < 0) {
            this.changeSlide('next');
        }
    }

    start(intervalTime = this.intervalTime) {
        this.interval = setInterval(() => {
            this.changeSlide('next');
        }, intervalTime);
        this.paused = false;

        return this;
    }

    pause() {
        clearInterval(this.interval);
        this.paused = true;

        return this;
    }

    resume() {
        this.pause().start();
        this.paused = false;

        return this;
    }

    stop() {
        this.pause();
        this.currentIndex = 0;
        this.cycleSlides();

        return this;
    }
}

// Example usage
const carousel = new Carousel({
    // all options for the carousel
    // carouselSelector: '[data-carousel]',
    // slideSelector: '[data-slide]',
    // controlsSelector: '[data-controls]',
    // tabSelector: '[data-tab]',
    // intervalTime: 5000,
    // lazyLoadThreshold: 2,
})
    .start()
    .addTouchControls()
    .addIndicators()
    .addControls();
