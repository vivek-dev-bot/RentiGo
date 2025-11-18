import React from 'react'
import Title from './Title';
import { assets } from '../assets/assets';

const Testimonial = () => {

    const testimonials = [
        {
            name: "Emma Rodriguez",
            location: "Barcelona, Spain",
            image: assets.testimonial_image_1,
            testimonials: "Amazing car rental service! The car was very clean, pickup was on time, and the driving experience was smooth. Will definitely book again."
        },
        {
            name: "Liam Johnson",
            location: "New York, USA",
            image: assets.testimonial_image_2,
            testimonials: "Excellent service and affordable price. Booking process was very easy and customer support was very helpful. Highly recommended for car rentals."
        },
        {
            name: "Sophia Lee",
            location: "Seoul, South Korea",
            image: assets.testimonial_image_1,
            testimonials: "Excellent car rental service! The vehicle was clean, well-maintained, and delivered on time. Booking process was very smooth. Highly recommended."
        }
    ];
    return (
        <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
            <Title title="What Our Customers Say" subTitle="Discover why discrening travelers choose StayVenture for their accomodation around the world" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1  transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt="" />

                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonials}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Testimonial
