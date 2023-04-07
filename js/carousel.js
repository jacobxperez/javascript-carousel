/* JavaScript Carousel
 * <https://github.com/jacobxperez/javascript-carousel>
 * Copyright (C) 2023 Jacob Perez <jacobxperez@gmx.com>
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
------------------------------------------------------------------------------*/
class Carousel {
    constructor(selector, children, intervalTime = 5000) {
        this.slider = document.querySelector(selector);
        this.slides = this.slider.querySelectorAll(children);
        this.totalImages = this.slider.querySelectorAll('img');
        this.slideBtnContainer = this.slider.querySelector('.slider-nav');
        this.totalSlides = this.slides.length;
        this.imgCache = [];
        this.currIndex = 0;
        this.intervalTime = parseInt(intervalTime);
        this.sliderInterval;
        this.cycleItems = this.cycleItems.bind(this);
        this.changeSlide = this.changeSlide.bind(this);
        this.autoStart = this.autoStart.bind(this);
        this.preloadImages = this.preloadImages.bind(this);
        this.initialize();
    }

    initialize() {
        this.preloadImages().then(() => {
            this.cycleItems();
            this.slideBtnContainer.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('next-slide')) {
                    this.changeSlide('next');
                    this.autoStart(8000);
                } else if (target.classList.contains('prev-slide')) {
                    this.changeSlide('prev');
                    this.autoStart(8000);
                }
            });
        });
    }

    cycleItems() {
        const currSlide = this.slides[this.currIndex];
        this.slides[this.currIndex].classList.add('slide-current');
        requestAnimationFrame(() => {
            for (const slide of this.slides) {
                if (slide !== currSlide) {
                    slide.classList.remove('slide-current');
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
            clearInterval(this.sliderInterval);
            this.sliderInterval = setInterval(() => {
                this.changeSlide('next');
            }, time || this.intervalTime);
        });

        return this;
    }
}

// Example usage
const fullScreenCarousel = new Carousel('[data-carousel]', '[data-slide]').autoStart();
