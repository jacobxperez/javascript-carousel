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
        controlsContainer = '[data-controls]'
    ) {
        this.slider = document.querySelector(sliderSelector);
        this.slides = this.slider.querySelectorAll(slideSelector);
        this.controlsContainer = this.slider.querySelector(controlsContainer);
        this.tabs = this.slider.querySelectorAll('[data-tab]');
        this.images = this.slider.querySelectorAll('img');
        this.imgCache = [];
        this.currIndex = 0;
        this.sliderInterval;
        this.intervalTime = 5000;
        this.lazyLoadThreshold = 2; // number of slides to preload initially
        this.initialize();
    }

    initialize() {
        this.preloadInitialImages().then(() => {
            this.cycleItems();
            if (this.controlsContainer) {
                this.controlsContainer.addEventListener(
                    'click',
                    this.controls.bind(this)
                );
            }
            if (this.tabs) {
                this.tabs.forEach((tab, index) => {
                    tab.setAttribute('data-tab', index);
                });
            }
        });
    }

    preloadInitialImages() {
        const promises = [];
        for (
            let i = 0;
            i < this.lazyLoadThreshold && i < this.images.length;
            i++
        ) {
            const image = this.images[i];
            const imgPromise = new Promise((resolve) => {
                const img = new Image();
                img.src = `${image.src}`;
                img.onload = resolve;
            });
            promises.push(imgPromise);
        }
        return Promise.all(promises);
    }

    preloadNextImage() {
        const nextIndex =
            (this.currIndex + this.lazyLoadThreshold) % this.slides.length;
        if (nextIndex < this.images.length) {
            const image = this.images[nextIndex];
            const imgPromise = new Promise((resolve) => {
                const img = new Image();
                img.src = `${image.src}`;
                img.onload = resolve;
            });
            this.imgCache.push(imgPromise);
        }
    }

    controls(e) {
        const target = e.target;
        if (target.matches('[data-button="next-slide"]')) {
            this.changeSlide('next');
            this.pause();
            this.preloadNextImage();
        } else if (target.matches('[data-button="prev-slide"]')) {
            this.changeSlide('prev');
            this.pause();
        } else if (target.matches('[data-tab]')) {
            this.pause();
            this.currIndex = target.getAttribute('data-tab');
            this.cycleItems();
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
            if (this.currIndex > this.slides.length - 1) {
                this.currIndex = 0;
            }
        } else if (direction === 'prev') {
            this.currIndex -= 1;
            if (this.currIndex < 0) {
                this.currIndex = this.slides.length - 1;
            }
        }
        this.cycleItems();
    }

    start(time) {
        this.autoStart(time || this.intervalTime);
        return this;
    }

    stop() {
        clearInterval(this.sliderInterval);
        return this;
    }

    pause() {
        clearInterval(this.sliderInterval);
        return this;
    }

    resume() {
        this.autoStart(this.intervalTime);
        return this;
    }

    autoStart(time) {
        this.sliderInterval = setInterval(() => {
            this.changeSlide('next');
            this.preloadNextImage();
        }, time || this.intervalTime);
    }
}

// Example usage
const fullScreenCarousel = new Carousel(
    '[data-carousel]',
    '[data-slide]'
).autoStart();
