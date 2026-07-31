interface BannerProps{
    className: string,
    src: string,
    alt?: string
};

const BannerHeader = (props:BannerProps) => {
    const {className, src, alt}=props;

    if(src.length < 0 || null){
        return <div className="placeholder-banner"><p>no Banner in linkss</p></div> // ---> placeholder empty url link
    }

    return(
      <div id='image-banner.jpeg' className="banner-container">
        <img
          className={className}
          src={src|| "placeholder.com"} //--> isi nanti
          alt= {alt ||"Dirgahayu RI ke-81 - jalan sehat rt 03 Teras"}
        />
      </div>
    );
};

export default BannerHeader;