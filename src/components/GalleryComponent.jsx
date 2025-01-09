import React from 'react';
import { Carousel } from 'react-bootstrap';
import Placeholder from '/images/placeholder.jpg'; // Adjust the import pathimport Placeholder from "/images/placeholder.jpg";
const ResponsiveGalleryCarousel = ({ galleryArray }) => {
    // Determine number of images per slide based on screen size
    const getImagesPerSlide = () => {
        return window.innerWidth >= 768 ? 3 : 1;
    };

    // Generate carousel items dynamically
    const generateCarouselItems = () => {
        const imagesPerSlide = getImagesPerSlide();
        const gallery = galleryArray || [];
        const items = [];

        // Calculate total number of slides needed
        const totalSlides = Math.ceil(gallery.length / imagesPerSlide);

        for (let i = 0; i < totalSlides; i++) {
            const startIndex = i * imagesPerSlide;
            const endIndex = startIndex + imagesPerSlide;
            const slideImages = gallery.slice(startIndex, endIndex);

            items.push(
                <Carousel.Item key={i} interval={3000}>
                    <div className="row d-flex justify-content-around ">
                        {slideImages.map((image, subIndex) => (
                            <div
                                key={subIndex}
                                className={`col-${9 / imagesPerSlide}`}
                            >
                                <img
                                    src={image && image.length > 0 ? image : Placeholder}
                                    alt={`Gallery image ${startIndex + subIndex + 1}`}
                                    className="w-100"
                                />
                            </div>
                        ))}
                    </div>
                </Carousel.Item>
            );
        }

        return items;
    };

    return (
        <Carousel
            controls={false}
            touch={true}
            indicators={false}
            responsive={true}
        >
            {generateCarouselItems()}
        </Carousel>
    );
};

export default ResponsiveGalleryCarousel;