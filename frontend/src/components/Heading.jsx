function Heading({ content, className = "", ...props }) {
    return (
        <h2 
            className={`text-2xl md:text-3xl font-semibold leading-normal my-2 ${className}`}
            {...props}
        >
            {content}
        </h2>
    );
}

export default Heading;