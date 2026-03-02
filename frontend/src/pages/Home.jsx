import { BuyerProjectCard, CallToAction, Container, FreelancerProfileCard, Heading, HeadingDescription, Hero, LoadingSpinner, ServiceCard, Subheading } from "../components";
import Marquee from "react-fast-marquee";
import { volkswagen, ford, bmw, hyundai, kia, mercedes, skoda, volvo, audi, renault, tesla, lamborghini } from "../assets";
import { lazy, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Check, ChevronRight, CloudLightningIcon, Code, Focus, ThumbsUp } from "lucide-react";
import { usePopUp } from "../contexts/PopUpContextProvider";
import { Suspense } from "react";

const trustedBrands = [
    {
        src: bmw,
        alt: 'BMW'
    },
    {
        src: hyundai,
        alt: 'Hyundai'
    },
    {
        src: volvo,
        alt: 'Volvo'
    },
    {
        src: audi,
        alt: 'Audi'
    },
    {
        src: volkswagen,
        alt: 'Volkswagen'
    },
    {
        src: ford,
        alt: 'Ford'
    },
    {
        src: kia,
        alt: 'Kia'
    },
    {
        src: mercedes,
        alt: 'Mercedes'
    },
    {
        src: skoda,
        alt: 'Skoda'
    },
    {
        src: renault,
        alt: 'Renault'
    },
    {
        src: tesla,
        alt: 'Tesla'
    },
    {
        src: lamborghini,
        alt: 'Lamborghini'
    },
];

const featuresData = [
    {
        icon: <BadgeCheck className="text-white size-8" />,
        title: "Real-World Expertise",
        description: "Learn from pros currently working in top tech companies.",
    },
    {
        icon: <Focus className="text-white size-8" />,
        title: "Focused 1:1 Attention",
        description: "Personalized guidance that group classes can't provide.",
    },
    {
        icon: <Code className="text-white size-8" />,
        title: "Practical Skill Building",
        description: "Hands-on experience with real projects and mocks.",
    },
];

// Mock services data
const mockServices = Array.from({ length: 12 }).map((_, index) => ({
    id: index + 1,
    title: [
        "Professional Logo Design for Your Business",
        "WordPress Website Development",
        "Social Media Marketing Campaign",
        "SEO Optimization Services",
        "Mobile App UI/UX Design",
        "Video Editing & Production",
        "Content Writing & Blog Posts",
        "E-commerce Website Development",
        "Brand Identity Package",
        "3D Animation & Motion Graphics",
        "Music Production & Sound Design",
        "Data Analysis & Visualization"
    ][index],
    freelancer: {
        name: ["Mike Shaw", "Sarah Johnson", "David Wilson", "Emma Brown", "James Lee", "Lisa Taylor"][index % 6],
        profileImage: [
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
            "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
            "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg",
            "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg",
            "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg"
        ][index % 6],
        isVerified: Math.random() > 0.3,
        isOnline: Math.random() > 0.5,
        slug: `freelancer-${index + 1}`
    },
    image: [
        "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg",
        "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg",
        "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg",
        "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg",
        "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg",
        "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg"
    ][index % 6],
    rating: {
        score: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Random 3-5 stars
        count: Math.floor(Math.random() * 100) + 1,
        maxScore: 5.0
    },
    location: ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany"][index % 6],
    price: parseFloat((Math.random() * 200 + 20).toFixed(2)), // $20-$220
    slug: `service-${index + 1}`,
    isSaved: Math.random() > 0.7,
    category: ["graphic-design", "web-development", "digital-marketing", "seo", "ui-ux", "video-animation"][index % 6],
    tags: [
        ["logo-design", "branding"],
        ["wordpress", "web-development"],
        ["social-media", "marketing"],
        ["seo", "content-writing"],
        ["ui-ux", "mobile-app"],
        ["video-editing", "animation"]
    ][index % 6],
    deliveryTime: Math.floor(Math.random() * 30) + 1,
    createdAt: new Date(Date.now() - (index * 86400000)).toISOString()
}));

// Mock freelancer data
const mockFreelancers = Array.from({ length: 9 }).map((_, index) => ({
    id: index + 1,
    name: ["Darrell Steward", "Martha Josef", "Jackson Graham"][index % 3],
    image: [
        "https://images.pexels.com/photos/27523254/pexels-photo-27523254.jpeg",
        "https://images.pexels.com/photos/7034450/pexels-photo-7034450.jpeg",
        "https://images.pexels.com/photos/30316397/pexels-photo-30316397.jpeg"][index % 3],
    location: ["Los Angeles, United States", "New York, USA", "London, UK"][index % 3],
    experience: ["2 Years", "5 Years", "1 Year"][index % 3],
    budget: ["3L", "5L", "2L"][index % 3],
    rejected: [12, 5, 8][index % 3],
    hired: [10, 25, 15][index % 3],
    bio: "Hi, I am Martha Josef. My professional experience is in UI UX & Product Design. I started my career as a Graphic Designer, but gradually developed my skills as a UI UX Designer.",
    skills: ["Angular", "JavaScript", "UI", "React", "TypeScript"].slice(0, 3 + (index % 3)),
}));

const CategoryCarousel = lazy(() => import("../components/CategoryCarousel"));
const FAQSection = lazy(() => import("../components/FAQSection"));
const FeaturedServices = lazy(() => import("../components/FeaturedServices"));
const FeaturedFreelancers = lazy(() => import("../components/FeaturedFreelancers"));

function Home() {
    const [loading, setLoading] = useState(false);
    const [allServices, setAllServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [allFreelancers, setAllFreelancers] = useState([]);
    const [filteredFreelancers, setFilteredFreelancers] = useState([]);
    const { closePopup } = usePopUp();

    // Load services
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);

            // Mock API call
            setTimeout(() => {
                setAllServices(mockServices);
                setFilteredServices(mockServices);
                setLoading(false);
            }, 1000);
        };

        fetchServices();
    }, []);

    // Effect to load freelancers (mock data or API)
    useEffect(() => {
        const fetchFreelancers = async () => {
            setLoading(true);

            // Mock API call - replace with actual API
            setTimeout(() => {
                const mockData = Array.from({ length: 12 }).map((_, index) => ({
                    id: index + 1,
                    name: ["Darrell Steward", "Martha Josef", "Jackson Graham", "Sarah Johnson"][index % 4],
                    location: ["Los Angeles, United States", "New York, USA", "London, UK", "Sydney, Australia"][index % 4],
                    experience: ["2 Years", "5 Years", "1 Year", "3 Years"][index % 4],
                    budget: ["3L", "5L", "2L", "4L"][index % 4],
                    hourlyRate: [3000, 5000, 2000, 4000][index % 4],
                    type: ["agency", "independent"][index % 2],
                    englishLevel: ["basic", "conversational", "fluent"][index % 3],
                    rating: [4.5, 4.8, 4.2, 4.9][index % 4],
                    rejected: [12, 5, 8, 3][index % 4],
                    hired: [10, 25, 15, 30][index % 4],
                    bio: "Hi, I am Martha Josef. My professional experience is in UI UX & Product Design.",
                    skills: [
                        ["Angular", "JavaScript", "UI", "React"],
                        ["JavaScript", "React", "Node.js", "TypeScript"],
                        ["UI/UX", "Figma", "Adobe XD", "Sketch"],
                        ["Python", "Django", "PostgreSQL", "AWS"]
                    ][index % 4],
                    languages: [
                        ["english", "spanish"],
                        ["english", "french"],
                        ["english", "german"],
                        ["english", "japanese"]
                    ][index % 4],
                    createdAt: new Date(Date.now() - (index * 86400000)).toISOString(), // Different dates
                    phone: "(405) 555-0128",
                    email: "jackson.graham@example.com"
                }));

                setAllFreelancers(mockFreelancers);
                setFilteredFreelancers(mockFreelancers);
                setLoading(false);
            }, 1000);
        };

        fetchFreelancers();
    }, []);

    return (
        <>
            <Hero closePopup={closePopup} />

            {/* Brands Marquee Section */}
            <Container>
                <Marquee speed={50} gradient={false}>
                    <div className="flex gap-8 w-full my-14 mr-8">
                        {
                            trustedBrands.map(brand => (
                                <div key={brand.alt} className="flex items-center justify-center border rounded-lg shadow hover:shadow-lg transition-all border-slate-200 p-4 md:p-5">
                                    <img src={brand.src} alt={brand.alt} className="h-7 sm:h-7 md:h-8 lg:h-9 xl:h-10" />
                                </div>
                            ))
                        }
                    </div>
                </Marquee>
            </Container>

            {/* Categories Carousel Section */}
            <Container>
                <Subheading content={'Tech-Focused Categories'} />
                <Heading content={'Unlock Your Career Potential'} />
                <HeadingDescription content={'Explore expert-led training and support services. From coding mentorship to interview prep, find the right freelance professional to guide you.'} />

                <CategoryCarousel />
            </Container>

            {/* Services Section */}
            <Suspense fallback={<LoadingSpinner height={`725px`} />}>
                <FeaturedServices />
            </Suspense>

            {/* Freelancers Section */}
            <Suspense fallback={<LoadingSpinner height={`725px`} />}>
                <FeaturedFreelancers />
            </Suspense>

            {/* Features Section */}
            <Container className="mt-8 mb-16">
                <div className="w-full flex flex-col items-center justify-center text-center">
                    <Subheading content={'More Than Just a Marketplace'} />
                    <Heading content={'Why Freelancers & Buyers Trust Us'} className="text-black" />
                    <HeadingDescription content={"India's most supportive freelance marketplace for job training. Here's what makes us different."} className="text-" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-6 md:gap-4 mt-10">
                    {featuresData.map((feature, index) => {
                        const [ref, setRef] = useState(null);
                        const [visible, setVisible] = useState(false);

                        useEffect(() => {
                            const observer = new IntersectionObserver(
                                ([entry]) => setVisible(entry.isIntersecting),
                                { threshold: 0.3 }
                            );

                            if (ref) observer.observe(ref);
                            return () => observer.disconnect();
                        }, [ref]);

                        return (
                            <div
                                key={index}
                                ref={setRef}
                                className={`transition-all duration-700 ${visible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-12"
                                    } ${index === 1 ? 'p-px rounded-[13px] bg-gradient-to-br from-primary to-primary-dark' : ''}`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className={`p-6 rounded-xl space-y-4 border bg-gradient-to-r from-gray-800 to-gray-950 backdrop-blur shadow-lg w-full h-full transition-transform duration-300 hover:scale-105 hover:-translate-y-1`}>
                                    <div className="relative inline-flex items-center justify-center mb-2">
                                        <div className="absolute w-16 h-16 bg-primary/20 rounded-2xl blur-xl opacity-60"></div>
                                        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-base font-medium text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 line-clamp-2 pb-4">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>

            {/* FAQs Section */}
            <FAQSection />

            {/* CTA Section */}
            <CallToAction />
        </>
    )
}

export default Home;