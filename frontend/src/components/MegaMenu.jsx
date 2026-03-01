import { Link } from 'react-router-dom';
import {
    Megaphone,
    Code,
    Palette,
    Music,
    PenTool,
    Sparkles
} from 'lucide-react';

const MegaMenu = () => {
    return (
        <div className="absolute left-full top-full mt-6 w-[920px] -translate-x-1/2 rounded-2xl bg-white p-8 shadow-2xl">

            {/* Projects */}
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Explore projects by categories
                    </h3>
                    <Link className="rounded-full bg-gray-100 px-4 py-1.5 text-sm">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <Category
                        icon={<Megaphone size={34} className="text-primary bg-primary/20 p-2 rounded-lg flex-shrink-0" />}
                        title="Digital Marketing"
                        items={['Ads Campaign', 'Analytics & Strategy', 'Channel']}
                    />
                    <Category
                        icon={<Code size={34} className="text-primary bg-primary/20 p-2 rounded-lg flex-shrink-0" />}
                        title="Programming & Tech"
                        items={['App Development', 'Blockchain', 'Game Development']}
                    />
                    <Category
                        icon={<Palette size={34} className="text-primary bg-primary/20 p-2 rounded-lg flex-shrink-0" />}
                        title="Graphics & Design"
                        items={['3D Design', 'Art & Illustration', 'Logo & Identity']}
                    />
                </div>
            </div>

            <hr className="my-8" />

            {/* Services */}
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Explore services by categories
                    </h3>
                    <Link className="rounded-full bg-gray-100 px-4 py-1.5 text-sm">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <Category
                        icon={<Music size={34} className="text-primary bg-primary/20 p-2 rounded-lg flex-shrink-0" />}
                        title="Music & Audio"
                        items={['Audio Engineering', 'Music Production', 'Sound Design']}
                    />
                    <Category
                        icon={<PenTool size={34} className="text-primary bg-primary/20 p-2 rounded-lg flex-shrink-0" />}
                        title="Writing & Translation"
                        items={['Career Writing', 'Content Writing', 'eBook Publishing']}
                    />
                    <Category
                        icon={<Sparkles size={34} className="text-primary bg-primary/20 p-2 rounded-lg flex-shrink-0" />}
                        title="Smart AI Services"
                        items={['AI Artists', 'AI Content', 'AI Data']}
                    />
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;

/* Small reusable block */
const Category = ({ icon, title, items }) => (
    <div>
        <div className="mb-3 flex items-center gap-3 font-medium text-gray-900">
            {icon}
            {title}
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
            {items.map(item => (
                <li key={item} className="hover:text-black cursor-pointer">
                    {item}
                </li>
            ))}
        </ul>
    </div>
);