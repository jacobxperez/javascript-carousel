/* JavaScript Carousel
 * <https://github.com/jacobxperez/javascript-carousel>
 * Copyright (C) 2023 Jacob Perez <jacobxperez@gmx.com>
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
------------------------------------------------------------------------------*/
class Carousel {
    constructor(
        sliderSelector,
        slideSelector,
        controlsSelector = '[data-controls]'
    ) {
        this.slider = document.querySelector(sliderSelector);
        this.slides = this.slider.querySelectorAll(slideSelector);
        this.controls = this.slider.querySelector(controlsSelector);
        this.tabs = this.controls.querySelectorAll('[data-tab]');
        this.currentIndex = 0;
        this.intervalTime = 5000;
        this.lazyLoadThreshold = 2;
        this.initialize();
    }

    initialize() {
        this.preloadInitialImages().then(() => {
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

    preloadInitialImages() {
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

    start(intervalTime = this.intervalTime) {
        this.interval = setInterval(() => {
            this.changeSlide('next');
        }, intervalTime);
        return this;
    }

    pause() {
        clearInterval(this.interval);
        return this;
    }

    resume() {
        this.pause().start();
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
const carousel = new Carousel('[data-carousel]', '[data-slide]').start();
