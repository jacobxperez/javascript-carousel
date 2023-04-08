/* JavaScript Carousel
 * <https://github.com/jacobxperez/javascript-carousel>
 * Copyright (C) 2023 Jacob Perez <jacobxperez@gmx.com>
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
------------------------------------------------------------------------------*/
class Carousel {
    constructor(sliderSelector, slideSelector) {
        this.slider = document.querySelector(sliderSelector);
        this.slides = this.slider.querySelectorAll(slideSelector);
        this.totalSlides = this.slides.length;
        this.totalImages = this.slider.querySelectorAll('img');
        this.controlsContainer = this.slider.querySelector('[data-controls]');
        this.imgCache = [];
        this.currIndex = 0;
        this.sliderInterval;
        this.intervalTime = 5000;
        this.initialize();
    }
    
    initialize() {
        this.preloadImages().then(() => {
            this.cycleItems();
            if (this.controlsContainer) {
                this.controlsContainer.addEventListener(
                    'click',
                    this.controls.bind(this)
                );
            }
        });
    }

    controls(e) {
        const target = e.target;
        if (target.matches('[data-button="next-slide"]')) {
            this.changeSlide('next');
            clearInterval(this.sliderInterval);
        } else if (target.matches('[data-button="prev-slide"]')) {
            this.changeSlide('prev');
            clearInterval(this.sliderInterval);
        }
    }

    cycleItems() {
        const currSlide = this.slides[this.currIndex];
        this.slides[this.currIndex].setAttribute('data-state', 'current');
        requestAnimationFrame(() => {
            for (const slide of this.slides) {
                if (slide !== currSlide) {
                    slide.removeAttribute('data-state');
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
            const imgPromise = new Promise((resolve) => {
                const img = new Image();
                img.src = `${image.src}`;
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
const fullScreenCarousel = new Carousel(
    '[data-carousel="fullscreen"]',
    '[data-slide]'
).autoStart();
