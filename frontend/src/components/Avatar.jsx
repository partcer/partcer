import { User } from 'lucide-react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg'
    };

    const getInitials = () => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (src) {
        return (
            <img
                src={src}
                alt={name || 'Avatar'}
                className={`${sizes[size]} rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <div className={`${sizes[size]} rounded-full bg-primary/10 flex items-center justify-center ${className}`}>
            {name ? (
                <span className="font-medium text-primary">
                    {getInitials()}
                </span>
            ) : (
                <User size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="text-primary" />
            )}
        </div>
    );
};

export default Avatar;