function HeadingDescription({content, className='', ...props}) {
    return (
        <p className={`text-gray-500 font-normal text-lg text- max-w-4xl ${className}`} {...props}>
            {content}
        </p>
    );
}

export default HeadingDescription;