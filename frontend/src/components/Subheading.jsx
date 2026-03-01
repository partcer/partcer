function Subheading({content, className='', ...props}) {
    return (
        <p className={`text-primary font-medium text-lg text-left max-w-full mx-auto ${className}`} {...props}>
            {content}
        </p>
    );
}

export default Subheading;