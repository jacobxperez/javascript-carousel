/* JavaScript Carousel
 * <https://github.com/jacobxperez/javascript-carousel>
 * Copyright (C) 2023 Jacob Perez <jacobxperez@gmx.com>
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
------------------------------------------------------------------------------*/
class Carousel {
    constructor(selector, children, intervalTime = 5000) {
        this.carousel = document.querySelector(selector);
        this.slides = this.carousel.querySelectorAll(children);
        this.totalSlides = this.slides.length;
        this.totalImages = this.carousel.querySelectorAll('img');
        this.controlsContainer = this.carousel.querySelector('[data-controls]');
        this.imgCache = [];
        this.currIndex = 0;
        this.carouselInterval;
        this.intervalTime = parseInt(intervalTime);
        this.initialize();
    }

    initialize() {
        this.preloadImages().then(() => {
            this.cycleItems();
            this.controlsContainer.addEventListener('click', (e) => {
                const target = e.target;
                if (target.matches('[data-button="next-slide"]')) {
                    this.changeSlide('next');
                    this.autoStart(8000);
                } else if (target.matches('[data-button="prev-slide"]')) {
                    this.changeSlide('prev');
                    this.autoStart(8000);
                }
            });
        });
    }

    cycleItems() {
        const currSlide = this.slides[this.currIndex];
        this.slides[this.currIndex].setAttribute('data-slide', 'current');
        requestAnimationFrame(() => {
            for (const slide of this.slides) {
                if (slide !== currSlide) {
                    slide.removeAttribute('data-slide');
                    slide.setAttribute('data-slide', '');
                }
            }
        });
    }

    changeSlide(direction) {
        if (direction === 'next') {
            this.currIndex += 1;
            if (this.currIndex > this.totalSlides - 1) {
                this.currIndex = 0;
            }
        } else if (direction === 'prev') {
            this.currIndex -= 1;
            if (this.currIndex < 0) {
                this.currIndex = this.totalSlides - 1;
            }
        }
        this.cycleItems();
    }

    preloadImages() {
        for (const image of this.totalImages) {
            const imgSrc = image.src;
            const imgPromise = new Promise((resolve) => {
                const img = new Image();
                img.src = imgSrc;
                img.onload = resolve;
            });
            this.imgCache.push(imgPromise);
        }
        return Promise.all(this.imgCache);
    }

    autoStart(time) {
        this.preloadImages().then(() => {
            clearInterval(this.carouselInterval);
            this.carouselInterval = setInterval(() => {
                this.changeSlide('next');
            }, time || this.intervalTime);
        });

        return this;
    }
}

// Example usage
const fullScreenCarousel = new Carousel(
    '[data-carousel="fullscreen"]',
    '[data-slide]'
).autoStart();
