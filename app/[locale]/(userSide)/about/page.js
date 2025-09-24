import Image from "next/image";

export default function Page() {
  return (
      <>
        <section className="about_us">
            <div className="about_banner">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="title">
                                <h2>About Rivaro Roaming</h2>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="about_content">
                                <p>Rivaro Roaming is your go-to site for finding the best eSIM deals for international travel. By comparing plans from a wide range of global eSIM providers, we help you get the best value on your mobile data. With our comprehensive comparison service, you can save both time and money, so you can stay connected and focus on enjoying your journey.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10 col-lg-12 col-md-12 col-12">
                            <div className="row justify-content-between">
                                <div className="col-lg-5 col-md-5 col-12">
                                    <div className="left-box">
                                        <h2>Our Mission</h2>
                                        <Image src={"/images/ourmission.png"} alt={"Our Mission"} width={300} height={300} />
                                    </div>
                                </div>
                                <div className="col-lg-7 col-md-7 col-12">
                                    <div className="right-box">
                                        <h3>Mission Statement</h3>
                                        <strong>Rivaro Roaming mission is to provide global data connectivity for all travelers. We’re here to liberate you from the roaming limits and fix what’s been broken for years.</strong>
                                        <strong>We value diversity, inclusion, and equity. Our team is spread across 44+ countries and six continents, and what glues us all together is our commitment to changing the way you connect.</strong>
                                        <p>We achieve this by offering:</p>
                                        <ul>
                                            <li><p>Make global mobile connectivity simple and accessible through eSIM technology.</p></li>
                                            <li><p> Ensure seamless activation and use of eSIMs across devices.</p></li>
                                            <li><p>Provide transparent comparisons to help users choose the best data plans.</p></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="about about_with_bg">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10 col-lg-12 col-md-12 col-12">
                            <div className="row justify-content-between flex-lg-row flex-md-row flex-column-reverse">
                                <div className="col-lg-7 col-md-7 col-12">
                                    <div className="right-box">
                                        <h3>Simplicity First</h3>
                                        <strong>We believe staying connected while traveling should be stress-free. That’s why we’ve designed our eSIM services to be intuitive and quick to activate—no physical SIMs, no complicated steps. With Rivaro Roaming, you’re just a few taps away from seamless global data access.</strong>
                                        <h3>Transparent Experience</h3>
                                        <strong>We’re committed to clarity and honesty. Our pricing is upfront, with no hidden fees or surprise charges. You know exactly what you’re paying for, and we work hard to deliver dependable service that meets your expectations every time.</strong>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-5 col-12">
                                    <div className="left-box text-end">
                                        <h2>Our Value</h2>
                                        <Image src={"/images/our value.png"} alt={"Our value"} width={300} height={300} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="about">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10 col-lg-12 col-md-12 col-12">
                            <div className="row justify-content-between">
                                <div className="col-lg-5 col-md-5 col-12">
                                    <div className="left-box">
                                        <h2>Our Team</h2>
                                        <Image src={"/images/our_team.png"} alt={"Our Team"} width={300} height={300} />
                                    </div>
                                </div>
                                <div className="col-lg-7 col-md-7 col-12">
                                    <div className="right-box">
                                        <h3>Team</h3>
                                        <strong>Come meet the Rivaro Roaming team! Our team constantly grows across our main hubs in Singapore, Istanbul, and Toronto. We have teammates all around the world who continue to make Rivaro Roaming an amazing organization.</strong>
                                        <h3>Globally-Minded Experts</h3>
                                        <strong>Our team brings together professionals from across the globe, united by a shared passion for smart travel and digital innovation. With deep knowledge of connectivity technologies and international roaming trends, we’re committed to building a platform that meets the real needs of modern travelers.</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </section>
      </>
  )
}