import React from 'react';
import about_img from "../assets/about_img.png";

const About = () => {
  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize text-center">About Page</h2>
        <p className="section__subheader text-center">
          Forever was born out of a passion for innovation and a desire to revolution.
        </p>
      </section>

      {/* About Section - Stable Layout */}
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 my-10 flex-wrap">
          <img
            className="w-full md:max-w-[430px] object-cover"
            src={about_img}
            alt="About Us"
          />
          <div className="flex flex-col gap-6 text-gray-600 md:w-1/2 min-w-0">
            <p>
              Our journey begins with a simple idea: to provide a platform where customers can
              easily discover, explore, and purchase a wide range of products from the comfort of
              their homes.
            </p>
            <p>
              Since our inception, we've worked tirelessly to curate a diverse selection of
              high-quality products that cater to every taste and preference. From fashion and beauty
              to electronics and home essentials, we offer an extensive collection sourced from
              trusted brands and suppliers.
            </p>
            <b className="text-gray-800">Our Mission</b>
            <p>
              Our mission is to empower customers with choice, convenience, and confidence. We're
              dedicated to providing a seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold">Why Choose Us?</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-5 text-sm mb-20 flex-wrap">
          <div className="border px-10 py-8 flex flex-col gap-5 w-full md:w-1/3">
            <b>Quality Assurance:</b>
            <p className="text-gray-600">
              We meticulously select and vet each product to ensure it meets our stringent quality
              standards.
            </p>
          </div>

          <div className="border px-10 py-8 flex flex-col gap-5 w-full md:w-1/3">
            <b>Convenience:</b>
            <p className="text-gray-600">
              With our user-friendly and hassle-free ordering process, shopping has never been
              easier.
            </p>
          </div>

          <div className="border px-10 py-8 flex flex-col gap-5 w-full md:w-1/3">
            <b>Exceptional Customer Service:</b>
            <p className="text-gray-600">
              Our team of dedicated professionals is here to assist you every step of the way,
              ensuring your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
